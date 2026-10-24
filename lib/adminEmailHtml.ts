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

/** Rendu HTML du mail d'administration, partagé par la route d'envoi et l'aperçu de l'admin. */
export function buildEmailHtml({
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
