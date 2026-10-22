import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";
import { createClient } from "@/lib/supabase/server";
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textToHtml(value: string) {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function buildEmailHtml({
  preheader,
  body,
  ctaLabel,
  ctaUrl,
}: {
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
}) {
  const safePreheader = escapeHtml(preheader);
  const safeCtaUrl = ctaUrl.trim();
  const safeCtaLabel = escapeHtml(ctaLabel || "Voir");
  const youtubeId = extractYoutubeId(safeCtaUrl);
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#0e0e0f;color:#f0ede8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreheader}</div>
    <main style="max-width:620px;margin:0 auto;padding:40px 20px;">
      <p style="margin:0 0 24px;color:#c9b48a;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">BUILD by Orsayn</p>
      <div style="color:#d8d1c6;font-size:16px;line-height:1.7;">${textToHtml(body)}</div>
      ${
        thumbnailUrl && safeCtaUrl
          ? `<p style="margin:32px 0 0;">
               <a href="${escapeHtml(safeCtaUrl)}" style="display:block;position:relative;text-decoration:none;border-radius:12px;overflow:hidden;line-height:0;">
                 <img src="${escapeHtml(thumbnailUrl)}" alt="Miniature vidéo" width="580" style="width:100%;max-width:580px;border-radius:12px;display:block;" />
                 <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;background:rgba(201,180,138,0.92);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                   <span style="display:block;width:0;height:0;border-style:solid;border-width:11px 0 11px 20px;border-color:transparent transparent transparent #0e0e0f;margin-left:4px;"></span>
                 </span>
               </a>
             </p>
             <p style="margin:16px 0 0;"><a href="${escapeHtml(safeCtaUrl)}" style="display:inline-block;background:#c9b48a;color:#0e0e0f;text-decoration:none;font-weight:700;border-radius:10px;padding:13px 18px;">${safeCtaLabel}</a></p>`
          : safeCtaUrl
          ? `<p style="margin:32px 0 0;"><a href="${escapeHtml(safeCtaUrl)}" style="display:inline-block;background:#c9b48a;color:#0e0e0f;text-decoration:none;font-weight:700;border-radius:10px;padding:13px 18px;">${safeCtaLabel}</a></p>`
          : ""
      }
      <p style="margin:40px 0 0;color:#7d7468;font-size:12px;line-height:1.6;">Tu reçois cet email car tu as un compte BUILD.</p>
    </main>
  </body>
</html>`;
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
  } = parsed.data;

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM;

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

  const html = buildEmailHtml({
    preheader,
    body: messageBody,
    ctaLabel,
    ctaUrl,
  });
  const text = `${messageBody}${ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : ""}`;
  const result = await sendAdminBroadcast({
    apiKey: resendApiKey,
    from,
    campaignId,
    recipients,
    subject,
    html,
    text,
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
