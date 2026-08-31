import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "mbebourasam@gmail.com";
const AUDIENCES = new Set(["selected", "all", "free", "beginner", "full"]);

type Profile = {
  id: string;
  tier: string | null;
};

type Recipient = {
  id: string;
  email: string;
  tier: string | null;
};

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

function chunkRecipients<T>(items: T[], chunkSize: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const audience = typeof body?.audience === "string" ? body.audience : "selected";
  const selectedUserIds = Array.isArray(body?.selectedUserIds) ? body.selectedUserIds.filter(Boolean) : [];
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const preheader = typeof body?.preheader === "string" ? body.preheader.trim() : "";
  const messageBody = typeof body?.body === "string" ? body.body.trim() : "";
  const ctaLabel = typeof body?.ctaLabel === "string" ? body.ctaLabel.trim() : "Voir la mise à jour";
  const ctaUrl = typeof body?.ctaUrl === "string" ? body.ctaUrl.trim() : "";
  const batchSize = [1, 10, 30].includes(Number(body?.batchSize)) ? Number(body.batchSize) : 10;

  if (!AUDIENCES.has(audience)) {
    return NextResponse.json({ ok: false, error: "Audience invalide." }, { status: 400 });
  }

  if (!subject || !messageBody) {
    return NextResponse.json({ ok: false, error: "Objet et message requis." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM;

  if (!resendApiKey || !from) {
    return NextResponse.json(
      { ok: false, error: "Configure RESEND_API_KEY et RESEND_FROM_EMAIL pour activer l'envoi." },
      { status: 500 }
    );
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: profiles }, { data: authData, error: authError }] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, tier"),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (authError) {
    return NextResponse.json({ ok: false, error: authError.message }, { status: 500 });
  }

  const profileMap = new Map<string, Profile>(
    ((profiles as Profile[] | null) ?? []).map((profile) => [profile.id, profile])
  );

  const recipients: Recipient[] = (authData?.users ?? [])
    .map((authUser) => ({
      id: authUser.id,
      email: authUser.email ?? "",
      tier: profileMap.get(authUser.id)?.tier ?? null,
    }))
    .filter((recipient) => recipient.email && recipient.email !== ADMIN_EMAIL)
    .filter((recipient) => {
      if (audience === "all") return true;
      if (audience === "selected") return selectedUserIds.includes(recipient.id);
      if (audience === "free") return !recipient.tier || recipient.tier === "free";
      return recipient.tier === audience;
    });

  if (recipients.length === 0) {
    return NextResponse.json({ ok: false, error: "Aucun destinataire trouvé." }, { status: 400 });
  }

  const html = buildEmailHtml({
    preheader,
    body: messageBody,
    ctaLabel,
    ctaUrl,
  });
  const text = `${messageBody}${ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : ""}`;
  const chunks = chunkRecipients(recipients, batchSize);

  for (const chunk of chunks) {
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        chunk.map((recipient) => ({
          from,
          to: [recipient.email],
          subject,
          html,
          text,
        }))
      ),
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      console.error("[admin/send-email] Resend failed:", errorPayload);
      return NextResponse.json(
        { ok: false, error: "Resend a refusé l'envoi. Vérifie la clé API, le domaine d'envoi et les logs." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true, sent: recipients.length, batches: chunks.length });
}
