/**
 * Gabarit de base unique de tous les e-mails BUILD (achat, bienvenue, remboursement, diffusions, comptes).
 *
 * « Émeraude sur noir » : fond #050806, texte #f1f5f2, accent #22d96e, un seul bouton blanc par e-mail.
 * Pensé pour Gmail, Apple Mail et Outlook : tables, styles en ligne, largeur 600 px, polices système,
 * aucune image de fond, texte alternatif sur chaque image, version texte brut dérivée des mêmes blocs.
 * Le fond est posé en attribut bgcolor ET en style, et color-scheme annonce un e-mail déjà sombre :
 * les clients en mode sombre n'inversent donc rien, les clients en mode clair gardent le noir.
 *
 * Module pur (aucune variable d'environnement) : il tourne côté serveur, dans les tests et dans l'aperçu admin.
 */

export const EMAIL_COLORS = {
  page: "#050806",
  panel: "#0d120f",
  line: "#1f2622",
  text: "#f1f5f2",
  body: "#c8d0cb",
  muted: "#8d9791",
  accent: "#22d96e",
  accentSoft: "#7be8a6",
  button: "#ffffff",
  buttonText: "#050806",
} as const;

const FONT = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export type EmailBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "facts"; rows: ReadonlyArray<readonly [label: string, value: string]> }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; href: string; alt: string }
  | { type: "button"; label: string; url: string }
  | { type: "link"; label: string; url: string }
  | { type: "divider" }
  | { type: "code"; text: string }
  | { type: "note"; text: string };

export type EmailFooter = {
  /** Pourquoi le destinataire reçoit ce message. */
  reason: string;
  /** Vendeur ou éditeur sur une ligne (nom, statut, SIRET). */
  publisher: string;
  address: string;
  contactEmail: string;
  /** Diffusions : ligne de désinscription (réponse à l'adresse de contact). */
  unsubscribe?: boolean;
  /** Liens utiles du pied (conditions de vente, etc.). */
  links?: ReadonlyArray<readonly [label: string, url: string]>;
};

export type RenderedEmail = { subject: string; html: string; text: string };

export type EmailDocument = {
  subject: string;
  preheader: string;
  blocks: ReadonlyArray<EmailBlock>;
  footer: EmailFooter;
  /** Origine publique du site (logo, liens). Sans elle, le logo devient le mot BUILD en texte. */
  baseUrl: string | null;
};

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
export function escapeEmailHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/** Espace insécable avant ? ! : ; (typographie française). */
const french = (value: string) => value.replace(/ ([?!:;])/g, "\u00a0$1");

const multiline = (value: string) => escapeEmailHtml(french(value)).replace(/\r?\n/g, "<br />");

/** Un mot de contenu libre ne doit jamais fabriquer un lien : seules les URL https (ou le gabarit Supabase) passent. */
function safeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed) || /^\{\{\s*\.[A-Za-z]+\s*\}\}$/.test(trimmed)) return trimmed;
  return "";
}

function paragraphs(text: string, style: string): string {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<tr><td class="px" style="padding:0 40px 18px 40px;${style}">${multiline(part)}</td></tr>`)
    .join("");
}

const P_STYLE = `font-family:${FONT};font-size:16px;line-height:26px;color:${EMAIL_COLORS.body};`;

function renderBlock(block: EmailBlock): string {
  switch (block.type) {
    case "heading":
      return `<tr><td class="px h1" style="padding:0 40px 20px 40px;font-family:${FONT};font-size:30px;line-height:36px;font-weight:700;letter-spacing:-0.02em;color:${EMAIL_COLORS.text};">${multiline(block.text)}</td></tr>`;
    case "paragraph":
      return paragraphs(block.text, P_STYLE);
    case "note":
      return paragraphs(block.text, `font-family:${FONT};font-size:13px;line-height:21px;color:${EMAIL_COLORS.muted};`);
    case "facts": {
      // Liste typographique sobre : pas de carte, pas de cadre, seulement des filets fins entre les lignes.
      const rows = block.rows
        .map(
          ([label, value], index) =>
            `<tr><td style="padding:14px 0;${index ? `border-top:1px solid ${EMAIL_COLORS.line};` : ""}font-family:${FONT};"><div style="font-size:13px;line-height:20px;color:${EMAIL_COLORS.muted};">${escapeEmailHtml(label)}</div><div style="padding-top:2px;font-size:16px;line-height:24px;color:${EMAIL_COLORS.text};">${multiline(value)}</div></td></tr>`,
        )
        .join("");
      return `<tr><td class="px" style="padding:4px 40px 24px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table></td></tr>`;
    }
    case "quote":
      // Citation en texte secondaire, entre guillemets français : jamais de barre latérale ni de fond de carte.
      return `<tr><td class="px" style="padding:0 40px 24px 40px;font-family:${FONT};font-size:14px;line-height:23px;color:${EMAIL_COLORS.muted};">«\u00a0${multiline(block.text)}\u00a0»</td></tr>`;
    case "code":
      // Code à saisir : texte seul, grand et espacé, sans cadre ni fond.
      return `<tr><td class="px" style="padding:4px 40px 28px 40px;font-family:'SF Mono',ui-monospace,Menlo,Consolas,monospace;font-size:34px;line-height:40px;font-weight:600;letter-spacing:0.14em;color:${EMAIL_COLORS.text};">${escapeEmailHtml(block.text)}</td></tr>`;
    case "image": {
      const src = safeUrl(block.src);
      const href = safeUrl(block.href);
      if (!src) return "";
      const img = `<img src="${escapeEmailHtml(src)}" width="600" alt="${escapeEmailHtml(block.alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:14px;" />`;
      return `<tr><td style="padding:0 0 28px 0;">${href ? `<a href="${escapeEmailHtml(href)}" target="_blank" style="display:block;text-decoration:none;">${img}</a>` : img}</td></tr>`;
    }
    case "button": {
      const url = safeUrl(block.url);
      if (!url) return "";
      return `<tr><td class="px" style="padding:12px 40px 28px 40px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="${EMAIL_COLORS.button}" style="background-color:${EMAIL_COLORS.button};border-radius:12px;"><a href="${escapeEmailHtml(url)}" target="_blank" style="display:inline-block;padding:16px 32px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:600;color:${EMAIL_COLORS.buttonText};text-decoration:none;border-radius:12px;">${escapeEmailHtml(block.label)}</a></td></tr></table></td></tr>`;
    }
    case "link": {
      const url = safeUrl(block.url);
      if (!url) return "";
      return `<tr><td class="px" style="padding:0 40px 20px 40px;font-family:${FONT};font-size:13px;line-height:21px;color:${EMAIL_COLORS.muted};">${multiline(block.label)}<br /><a href="${escapeEmailHtml(url)}" style="color:${EMAIL_COLORS.accentSoft};word-break:break-all;text-decoration:underline;">${escapeEmailHtml(url)}</a></td></tr>`;
    }
    case "divider":
      return `<tr><td class="px" style="padding:8px 40px 24px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${EMAIL_COLORS.line}" style="height:1px;background-color:${EMAIL_COLORS.line};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>`;
  }
}

function renderHeader(baseUrl: string | null): string {
  const logo = baseUrl
    ? `<img src="${escapeEmailHtml(`${baseUrl}/email/build-logo.png`)}" width="112" height="32" alt="BUILD" style="display:block;width:112px;height:32px;border:0;" />`
    : `<span style="font-family:${FONT};font-size:22px;line-height:32px;font-weight:800;letter-spacing:0.18em;color:${EMAIL_COLORS.text};">BUILD</span>`;
  const home = baseUrl ? `<a href="${escapeEmailHtml(baseUrl)}" style="text-decoration:none;">${logo}</a>` : logo;
  return `<tr><td class="px" style="padding:48px 40px 44px 40px;">${home}</td></tr>`;
}

function renderFooter(footer: EmailFooter): string {
  const small = `font-family:${FONT};font-size:12px;line-height:20px;color:${EMAIL_COLORS.muted};`;
  const link = `color:${EMAIL_COLORS.accentSoft};text-decoration:underline;`;
  const mail = escapeEmailHtml(footer.contactEmail);
  const lines = [
    multiline(footer.reason),
    footer.unsubscribe
      ? `Pour ne plus recevoir ces messages, écris à <a href="mailto:${mail}?subject=${encodeURIComponent("Ne plus recevoir les e-mails BUILD")}" style="${link}">${mail}</a>, c'est pris en compte à la main.`
      : `Une question ? Écris à <a href="mailto:${mail}" style="${link}">${mail}</a>.`,
    `${escapeEmailHtml(footer.publisher)}, ${escapeEmailHtml(footer.address)}.`,
  ];
  const links = (footer.links ?? [])
    .map(([label, url]) => ({ label, url: safeUrl(url) }))
    .filter((item) => item.url)
    .map((item) => `<a href="${escapeEmailHtml(item.url)}" style="${link}">${escapeEmailHtml(item.label)}</a>`);
  return `<tr><td class="px" style="padding:12px 40px 56px 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${EMAIL_COLORS.line}" style="height:1px;background-color:${EMAIL_COLORS.line};font-size:0;line-height:0;">&nbsp;</td></tr><tr><td style="padding-top:24px;${small}">${lines.join("<br />")}${links.length ? `<br /><br />${links.join("&nbsp;&nbsp;&nbsp;")}` : ""}</td></tr></table></td></tr>`;
}

function renderText(doc: EmailDocument): string {
  const parts: string[] = ["BUILD", ""];
  for (const block of doc.blocks) {
    switch (block.type) {
      case "heading":
        parts.push(block.text, "");
        break;
      case "paragraph":
      case "note":
        parts.push(block.text.trim(), "");
        break;
      case "quote":
        parts.push(block.text.trim().split(/\r?\n/).map((line) => `> ${line}`).join("\n"), "");
        break;
      case "code":
        parts.push(block.text, "");
        break;
      case "facts":
        parts.push(...block.rows.map(([label, value]) => `${label} : ${value}`), "");
        break;
      case "button": {
        const url = safeUrl(block.url);
        if (url) parts.push(`${block.label} : ${url}`, "");
        break;
      }
      case "link": {
        // Le bouton a déjà donné cette adresse en clair : on ne la répète pas.
        const url = safeUrl(block.url);
        if (url && !parts.some((part) => part.endsWith(url))) parts.push(block.label, url, "");
        break;
      }
      case "image": {
        const url = safeUrl(block.href);
        if (url) parts.push(`Image : ${block.alt}`, url, "");
        break;
      }
      case "divider":
        parts.push("---", "");
        break;
    }
  }
  const f = doc.footer;
  parts.push("---", f.reason);
  parts.push(
    f.unsubscribe
      ? `Pour ne plus recevoir ces messages, écris à ${f.contactEmail}.`
      : `Une question ? Écris à ${f.contactEmail}.`,
  );
  parts.push(`${f.publisher}, ${f.address}.`);
  for (const [label, url] of f.links ?? []) if (safeUrl(url)) parts.push(`${label} : ${url}`);
  return french(parts.join("\n"));
}

export function renderEmail(doc: EmailDocument): RenderedEmail {
  const { page } = EMAIL_COLORS;
  const subject = french(doc.subject);
  const preheader = escapeEmailHtml(french(doc.preheader));
  const filler = "&#8199;&#847; ".repeat(40);
  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<meta name="x-apple-disable-message-reformatting" />
<title>${escapeEmailHtml(subject)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
:root{color-scheme:dark;supported-color-schemes:dark;}
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
table,td{mso-table-lspace:0;mso-table-rspace:0;}
img{-ms-interpolation-mode:bicubic;}
a{color:inherit;}
u + #body a{color:inherit;text-decoration:none;}
@media only screen and (max-width:620px){
  .shell{width:100% !important;}
  .px{padding-left:24px !important;padding-right:24px !important;}
  .h1{font-size:26px !important;line-height:32px !important;}
}
</style>
</head>
<body id="body" bgcolor="${page}" style="margin:0;padding:0;width:100%;background-color:${page};color:${EMAIL_COLORS.text};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${page};">${preheader}${filler}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${page}" style="background-color:${page};">
<tr><td align="center" bgcolor="${page}" style="background-color:${page};padding:0 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
<table role="presentation" class="shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
${renderHeader(doc.baseUrl)}
${doc.blocks.map(renderBlock).join("\n")}
${renderFooter(doc.footer)}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
  return { subject, html, text: renderText(doc) };
}
