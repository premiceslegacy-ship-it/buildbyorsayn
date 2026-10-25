import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";
import { createClient } from "@/lib/supabase/server";
import { getEmailContext } from "@/lib/email/context";
import { buildBroadcastEmail } from "@/lib/email/templates";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS,
  sendAdminBroadcast,
} from "@/lib/resendTransport";
import { recordAdminAction } from "@/lib/mux/adminServer";

const MAX_ADMIN_EMAIL_BODY_BYTES = 25 * 1024;
const MAX_DYNAMIC_AUDIENCE_USERS = 500;
const ADMIN_BROADCAST_ROUTE_TIMEOUT_MS = 15_000;
const INACTIVE_FREE_ACCOUNT_MS = 90 * 24 * 60 * 60 * 1000;
const NEW_ACCOUNT_GRACE_MS = 14 * 24 * 60 * 60 * 1000;
const ADMIN_EMAIL_SCHEMA = z.object({
  campaignId: z.string().uuid(),
  audience: z.enum(["selected", "all", "free", "beginner", "full"]),
  selectedUserIds: z.array(z.string().uuid())
    .max(MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS)
    .refine((ids) => new Set(ids).size === ids.length, "selectedUserIds must be unique")
    .default([]),
  subject: z.string().trim().min(1).max(160),
  preheader: z.string().trim().max(200).default(""),
  body: z.string().trim().min(1).max(20_000),
  ctaLabel: z.string().trim().max(80).default("Voir la mise à jour"),
  ctaUrl: z.string().trim().max(2_048).refine((value) => {
    if (!value) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "ctaUrl must be an HTTPS URL").default(""),
  thumbnailUrl: z.string().trim().max(2_048).refine((value) => {
    if (!value) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "thumbnailUrl must be an HTTPS URL").default(""),
  approved: z.literal(true),
  confirmation: z.literal("ENVOYER"),
}).strict();

type Profile = {
  id: string;
  tier: string | null;
};

type Recipient = {
  id: string;
  email: string;
  tier: string | null;
  createdAt: string;
  lastSignInAt: string | null;
};

function isInactiveFreeRecipient(recipient: Recipient, now = Date.now()) {
  if (recipient.tier !== null && recipient.tier !== "free") return false;
  const createdAt = new Date(recipient.createdAt).getTime();
  if (!Number.isFinite(createdAt) || now - createdAt < NEW_ACCOUNT_GRACE_MS) return false;
  if (!recipient.lastSignInAt) return true;
  const lastSignInAt = new Date(recipient.lastSignInAt).getTime();
  return Number.isFinite(lastSignInAt) && now - lastSignInAt >= INACTIVE_FREE_ACCOUNT_MS;
}

export async function POST(req: NextRequest) {
  const routeSignal = AbortSignal.any([
    req.signal,
    AbortSignal.timeout(ADMIN_BROADCAST_ROUTE_TIMEOUT_MS),
  ]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.app_metadata?.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
  }

  if (!isJsonMediaType(req.headers.get("content-type"))) {
    return NextResponse.json({ ok: false, error: "Corps JSON requis." }, { status: 415 });
  }
  const boundedBody = await readBoundedBody(req, MAX_ADMIN_EMAIL_BODY_BYTES);
  if (boundedBody.ok === false) {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: boundedBody.reason === "too_large" ? 413 : 400 }
    );
  }
  let decoded: unknown;
  try {
    decoded = JSON.parse(boundedBody.text);
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  const parsed = ADMIN_EMAIL_SCHEMA.safeParse(decoded);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  const {
    campaignId,
    audience,
    selectedUserIds,
    subject,
    preheader,
    body: messageBody,
    ctaLabel,
    ctaUrl,
    thumbnailUrl,
  } = parsed.data;

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !from) {
    return NextResponse.json(
      { ok: false, error: "Configure RESEND_API_KEY et RESEND_FROM_EMAIL pour activer l'envoi." },
      { status: 500 }
    );
  }

  const supabaseAdmin = createAdminSupabase({ signal: routeSignal });
  const authUsers: Array<{ id: string; email?: string; created_at: string; last_sign_in_at?: string }> = [];

  if (audience === "selected") {
    const selectedUsers = await Promise.all(selectedUserIds.map((id) =>
      supabaseAdmin.auth.admin.getUserById(id)
    ));
    if (selectedUsers.some(({ data, error }) => error || !data.user)) {
      console.error("[admin/send-email] Selected user lookup failed");
      return NextResponse.json({ ok: false, error: "Audience indisponible." }, { status: 503 });
    }
    authUsers.push(...selectedUsers.map(({ data }) => ({
      id: data.user!.id,
      email: data.user!.email,
      created_at: data.user!.created_at,
      last_sign_in_at: data.user!.last_sign_in_at,
    })));
  } else {
    const firstPage = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: MAX_DYNAMIC_AUDIENCE_USERS,
    });
    if (firstPage.error) {
      console.error("[admin/send-email] Auth user listing failed");
      return NextResponse.json({ ok: false, error: "Liste des destinataires indisponible." }, { status: 503 });
    }
    authUsers.push(...firstPage.data.users);

    if (firstPage.data.users.length === MAX_DYNAMIC_AUDIENCE_USERS) {
      const overflowPage = await supabaseAdmin.auth.admin.listUsers({
        page: 2,
        perPage: MAX_DYNAMIC_AUDIENCE_USERS,
      });
      if (overflowPage.error) {
        console.error("[admin/send-email] Auth user listing failed");
        return NextResponse.json({ ok: false, error: "Liste des destinataires indisponible." }, { status: 503 });
      }
      if (overflowPage.data.users.length > 0) {
        return NextResponse.json(
          {
            ok: false,
            error: "Audience trop grande pour la voie synchrone. Aucune outbox n'est configurée : aucun email n'a été envoyé.",
          },
          { status: 409 }
        );
      }
    }
  }

  const profiles: Profile[] = [];
  const audienceNeedsProfiles = authUsers.length > 0;
  if (audienceNeedsProfiles && authUsers.length > 0) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, tier")
      .in("id", authUsers.map((authUser) => authUser.id));
    if (error) {
      console.error("[admin/send-email] Profile audience lookup failed");
      return NextResponse.json({ ok: false, error: "Audience indisponible." }, { status: 503 });
    }
    profiles.push(...((data as Profile[] | null) ?? []));
  }

  const profileMap = new Map<string, Profile>(profiles.map((profile) => [profile.id, profile]));
  if (audienceNeedsProfiles && authUsers.some((authUser) => !profileMap.has(authUser.id))) {
    console.error("[admin/send-email] Profile audience is incomplete");
    return NextResponse.json({ ok: false, error: "Audience indisponible." }, { status: 503 });
  }

  const selectedUserSet = new Set(selectedUserIds);
  const recipients: Recipient[] = authUsers
    .map((authUser) => ({
      id: authUser.id,
      email: authUser.email ?? "",
      tier: profileMap.get(authUser.id)?.tier ?? null,
      createdAt: authUser.created_at,
      lastSignInAt: authUser.last_sign_in_at ?? null,
    }))
    .filter((recipient) => recipient.email && recipient.id !== user.id)
    .filter((recipient) => !isInactiveFreeRecipient(recipient))
    .filter((recipient) => {
      if (audience === "all") return true;
      if (audience === "selected") return selectedUserSet.has(recipient.id);
      if (audience === "free") return recipient.tier === null || recipient.tier === "free";
      return recipient.tier === audience;
    })
    .sort((left, right) => left.id.localeCompare(right.id));

  if (recipients.length === 0) {
    return NextResponse.json({ ok: false, error: "Aucun destinataire trouvé." }, { status: 400 });
  }
  if (recipients.length > MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS) {
    return NextResponse.json(
      {
        ok: false,
        error: `Cette audience compte ${recipients.length} destinataires. La voie synchrone est limitée à ${MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS} et aucune outbox n'est configurée : aucun email n'a été envoyé.`,
      },
      { status: 409 }
    );
  }

  try {
    await recordAdminAction({
      actorUserId: user.id,
      action: "email.broadcast",
      targetType: "campaign",
      targetId: campaignId,
      result: "pending",
      approved: true,
      details: { audience, recipientCount: recipients.length },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Le journal administrateur est indisponible. Aucun email n'a été envoyé." },
      { status: 503 }
    );
  }

  const emailContext = getEmailContext();
  const { html, text } = buildBroadcastEmail(emailContext, { subject, preheader, body: messageBody, ctaLabel, ctaUrl, thumbnailUrl });
  const result = await sendAdminBroadcast({
    apiKey: resendApiKey,
    from,
    campaignId,
    recipients,
    subject,
    html,
    text,
    unsubscribeEmail: emailContext.seller.contactEmail,
  }, { signal: routeSignal });

  if (result.ok === false) {
    try {
      await recordAdminAction({
        actorUserId: user.id,
        action: "email.broadcast",
        targetType: "campaign",
        targetId: campaignId,
        result: "failed",
        approved: true,
        details: { audience, recipientCount: recipients.length, acceptedCount: result.accepted },
      });
    } catch {
      console.error("admin.email.audit_failed");
    }
    if (result.reason === "too_large") {
      return NextResponse.json(
        {
          ok: false,
          error: `La voie synchrone est limitée à ${MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS} destinataires et aucune outbox n'est configurée : aucun email n'a été envoyé.`,
        },
        { status: 409 }
      );
    }
    const error = result.accepted > 0
      ? `${result.accepted} email(s) ont été acceptés sur ${result.total}. Relance la même campagne : chaque destinataire conserve sa clé d'idempotence.`
      : "Aucune acceptation n'a pu être confirmée. Relance la même campagne : chaque destinataire conserve sa clé d'idempotence.";
    return NextResponse.json(
      { ok: false, accepted: result.accepted, total: result.total, error },
      { status: 502 }
    );
  }

  try {
    await recordAdminAction({
      actorUserId: user.id,
      action: "email.broadcast",
      targetType: "campaign",
      targetId: campaignId,
      result: "completed",
      approved: true,
      details: { audience, recipientCount: recipients.length, acceptedCount: result.accepted },
    });
  } catch {
    console.error("admin.email.audit_failed");
  }

  return NextResponse.json({ ok: true, accepted: result.accepted, total: result.total });
}
