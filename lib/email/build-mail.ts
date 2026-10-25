const C = {
  nuit: "#050806",
  carte: "#1f2220",
  trait: "#2f3330",
  brume: "#f1f5f2",
  encre2: "#b2b6b3",
  pied: "#8d918e",
  menthe: "#b9f5cf",
} as const;

const SANS = "'General Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
const TITRE = "'Geist', 'General Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

export type BuildMailRenderInput = {
  kind?: "video" | "update";
  subject?: string;
  preheader?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  thumb?: string;
  logoUrl?: string;
};

export type BuildMailAccountInput = {
  subject?: string;
  preheader?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  code?: string;
  notes?: string[];
  logoUrl?: string;
};

export type BuildMailConfig = {
  logoUrl: string;
  logoAlt: string;
  logoW: 98;
  logoH: 28;
  thumbW: 520;
  thumbH: 293;
};

export const config: BuildMailConfig = {
  logoUrl: "",
  logoAlt: "BUILD",
  logoW: 98,
  logoH: 28,
  thumbW: 520,
  thumbH: 293,
};

export function escapeEmail(value: unknown): string {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function safeEmailUrl(value: unknown): string {
  const source = String(value == null ? "" : value).trim();
  return /^(javascript|data|vbscript):/i.test(source.replace(/[\u0000-\u0020]/g, "")) ? "" : source;
}

function splitParagraphs(text: unknown): string[] {
  return String(text == null ? "" : text)
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function button(label: string, url: string): string {
  return `<tr><td class="px" align="center" bgcolor="${C.nuit}" style="padding:40px 40px 0;background-color:${C.nuit};"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:separate;"><tr><td align="center" bgcolor="${C.brume}" style="background-color:${C.brume};border-radius:980px;mso-padding-alt:14px 28px;"><a href="${escapeEmail(url)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:17px;line-height:24px;font-weight:600;color:${C.nuit};text-decoration:none;border-radius:980px;">${escapeEmail(label)}</a></td></tr></table></td></tr>`;
}

function codeCell(code: string): string {
  const raw = String(code).trim();
  const digits = raw.includes("{{") ? raw : raw.replace(/\s+/g, "");
  return `<tr><td class="px" align="center" bgcolor="${C.nuit}" style="padding:36px 40px 0;background-color:${C.nuit};"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:separate;"><tr><td align="center" bgcolor="${C.carte}" style="background-color:${C.carte};border-radius:22px;padding:20px 22px 20px 32px;"><span style="display:inline-block;font-family:${TITRE};font-size:40px;line-height:48px;font-weight:700;letter-spacing:10px;color:${C.brume};white-space:nowrap;-webkit-user-select:all;user-select:all;">${escapeEmail(digits)}</span></td></tr></table></td></tr>`;
}

function image(thumb: string, url: string, alt: string): string {
  const img = `<img src="${escapeEmail(thumb)}" alt="${escapeEmail(alt)}" width="${config.thumbW}" height="${config.thumbH}" style="display:block;width:100%;max-width:${config.thumbW}px;height:auto;margin:0 auto;border:0;border-radius:20px;font-family:${SANS};font-size:15px;line-height:22px;color:${C.brume};">`;
  return `<tr><td class="px" align="center" bgcolor="${C.nuit}" style="padding:44px 40px 0;background-color:${C.nuit};">${url ? `<a href="${escapeEmail(url)}" target="_blank" style="text-decoration:none;">${img}</a>` : img}</td></tr>`;
}

type LayoutInput = {
  subject?: string;
  preheader?: string;
  headline: string;
  paras?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  thumb?: string;
  thumbAlt?: string;
  code?: string;
  notes?: string[];
  fallbackUrl?: string;
  logoUrl?: string;
};

function layout(input: LayoutInput): string {
  const url = safeEmailUrl(input.ctaUrl);
  const thumb = safeEmailUrl(input.thumb);
  const logoUrl = safeEmailUrl(input.logoUrl || config.logoUrl);
  const preheader = String(input.preheader || "").trim();
  let rows = "";
  const bg = `bgcolor="${C.nuit}" style="background-color:${C.nuit};`;
  const logo = logoUrl
    ? `<img src="${escapeEmail(logoUrl)}" alt="${escapeEmail(config.logoAlt)}" width="98" height="28" style="display:block;margin:0 auto;border:0;width:98px;height:28px;">`
    : `<span style="font-family:${SANS};font-size:20px;line-height:28px;font-weight:700;letter-spacing:.14em;color:${C.brume};">BUILD</span>`;
  rows += `<tr><td class="px logo" align="center" ${bg}padding:56px 40px 0;">${logo}</td></tr>`;
  rows += `<tr><td class="px air" align="center" ${bg}padding:72px 40px 0;"><h1 class="h1" style="margin:0;font-family:${TITRE};font-size:32px;line-height:36px;font-weight:700;letter-spacing:-0.6px;color:${C.brume};text-align:center;text-wrap:balance;">${escapeEmail(input.headline)}</h1></td></tr>`;
  if (input.paras?.length) {
    rows += `<tr><td class="px" align="center" ${bg}padding:20px 40px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:480px;"><tr><td align="center" ${bg}">${input.paras.map((part, index) => `<p style="margin:${index ? "16px" : "0"} 0 0;font-family:${SANS};font-size:17px;line-height:25px;font-weight:400;color:${C.encre2};text-align:center;text-wrap:balance;">${escapeEmail(part).replace(/\n/g, "<br>")}</p>`).join("")}</td></tr></table></td></tr>`;
  }
  if (thumb) rows += image(thumb, url, input.thumbAlt || "Miniature de la vidéo");
  if (url) rows += button(input.ctaLabel || "Voir", url);
  if (input.code) rows += codeCell(input.code);
  rows += `<tr><td class="px air" ${bg}padding:72px 40px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${C.trait}" style="height:1px;font-size:1px;line-height:1px;background-color:${C.trait};">&nbsp;</td></tr></table></td></tr>`;
  const footer: string[] = [];
  for (const note of input.notes || []) footer.push(escapeEmail(note));
  if (input.fallbackUrl) footer.push(`Si le bouton ne s'ouvre pas, copie ce lien dans ton navigateur&nbsp;:<br><a href="${escapeEmail(input.fallbackUrl)}" target="_blank" style="color:${C.menthe};text-decoration:underline;word-break:break-all;">${escapeEmail(input.fallbackUrl)}</a>`);
  footer.push("Tu reçois cet email car tu as un compte BUILD.");
  rows += `<tr><td class="px" align="center" ${bg}padding:28px 40px 56px;">${footer.map((part, index) => `<p style="margin:${index ? "12px" : "0"} 0 0;font-family:${SANS};font-size:13px;line-height:20px;color:${C.pied};text-align:center;">${part}</p>`).join("")}</td></tr>`;
  const css = `:root{color-scheme:dark light;supported-color-schemes:dark light;}body{margin:0;padding:0;background-color:${C.nuit};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;}img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}a{color:${C.menthe};}@media screen and (max-width:599px){.px{padding-left:24px!important;padding-right:24px!important;}.logo{padding-top:40px!important;}.air{padding-top:56px!important;}.h1{font-size:28px!important;line-height:32px!important;}}`;
  return `<!doctype html>\n<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta http-equiv="X-UA-Compatible" content="IE=edge">\n<meta name="x-apple-disable-message-reformatting">\n<meta name="color-scheme" content="dark light">\n<meta name="supported-color-schemes" content="dark light">\n<title>${escapeEmail(input.subject || input.headline)}</title>\n<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->\n<style>${css}</style>\n</head>\n<body bgcolor="${C.nuit}" style="margin:0;padding:0;background-color:${C.nuit};">\n${preheader ? `<span style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:${C.nuit};">${escapeEmail(preheader)}${"&#847;&zwnj;&nbsp;".repeat(59)}</span>` : ""}\n<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.nuit}" style="width:100%;background-color:${C.nuit};"><tr><td align="center" bgcolor="${C.nuit}" style="background-color:${C.nuit};"><!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.nuit}" style="width:100%;max-width:600px;background-color:${C.nuit};">${rows.replace(/<\/tr>/g, "</tr>\n")}</table><!--[if mso]></td></tr></table><![endif]--></td></tr></table>\n</body>\n</html>\n`;
}

export function render(input: BuildMailRenderInput = {}): string {
  const paragraphs = splitParagraphs(input.body);
  const headline = (paragraphs.shift() || String(input.subject || "")).replace(/\n/g, " ");
  return layout({
    subject: input.subject,
    preheader: input.preheader,
    headline,
    paras: paragraphs,
    thumb: input.kind === "video" ? input.thumb : "",
    thumbAlt: `Regarder la vidéo : ${headline}`,
    ctaLabel: input.ctaLabel,
    ctaUrl: input.ctaUrl,
    logoUrl: input.logoUrl,
  });
}

export function renderAccount(input: BuildMailAccountInput = {}): string {
  return layout({
    subject: input.subject,
    preheader: input.preheader,
    headline: String(input.title || input.subject || ""),
    paras: splitParagraphs(input.body),
    ctaLabel: input.ctaLabel,
    ctaUrl: input.ctaUrl,
    code: input.code,
    notes: input.notes,
    fallbackUrl: safeEmailUrl(input.ctaUrl),
    logoUrl: input.logoUrl,
  });
}

export function renderText(input: BuildMailRenderInput | BuildMailAccountInput = {}): string {
  const title = "title" in input && input.title ? String(input.title) : "";
  const body = splitParagraphs(input.body);
  const lines: string[] = [title || body.shift() || ""];
  lines.push(...body);
  if ("code" in input && input.code) lines.push("", String(input.code));
  if (input.ctaUrl) lines.push("", `${input.ctaLabel || "Voir"} : ${safeEmailUrl(input.ctaUrl)}`);
  if ("notes" in input && input.notes?.length) lines.push("", ...input.notes);
  lines.push("", "Tu reçois cet email car tu as un compte BUILD.");
  return lines.filter((line, index) => line || index === 0).join("\n");
}
