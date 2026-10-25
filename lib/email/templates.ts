import { COFFRE_LABEL, FONDATIONS_LABEL, UPGRADE_PRICE, formatEuro } from "@/lib/pricing";
import { render, renderAccount, renderText, type BuildMailRenderInput, type BuildMailAccountInput } from "./build-mail";

export type EmailSeller = { contactEmail: string };
export type EmailContext = { baseUrl: string | null; seller: EmailSeller };
export type RenderedEmail = { subject: string; html: string; text: string };
const NBSP = "\u00a0";

function logoUrl(ctx: EmailContext): string | undefined {
  return ctx.baseUrl ? `${ctx.baseUrl}/email/build-logo.png` : undefined;
}
function mail(ctx: EmailContext, subject: string, html: string, textInput: BuildMailRenderInput | BuildMailAccountInput): RenderedEmail {
  return { subject, html, text: renderText(textInput) };
}
function account(ctx: EmailContext, input: BuildMailAccountInput): RenderedEmail {
  return mail(ctx, input.subject || "BUILD", renderAccount({ ...input, logoUrl: logoUrl(ctx) }), input);
}

export function buildWelcomeEmail(ctx: EmailContext, actionLink: string): RenderedEmail {
  return account(ctx, {
    subject: "Bienvenue dans BUILD, active ton compte",
    preheader: "Ton paiement est confirmé. Il ne reste qu'une étape.",
    title: "Bienvenue dans ton espace BUILD.",
    body: "Ton paiement est confirmé. Il ne reste qu'une étape : active ton accès et choisis ton mot de passe.",
    ctaLabel: "Activer mon accès",
    ctaUrl: actionLink,
    notes: ["Si tu n'es pas à l'origine de cet achat, tu peux ignorer cet email."],
  });
}

export type PurchaseConfirmationInput = { offerName: string; amountCents: number; purchasedAt: Date };
function formatAmount(cents: number): string {
  const euros = cents / 100;
  const text = Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace(".", ",");
  return `${text}${NBSP}€`;
}

export function buildPurchaseConfirmationEmail(ctx: EmailContext, input: PurchaseConfirmationInput): RenderedEmail {
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) throw new Error("Montant de l'achat invalide.");
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }).format(input.purchasedAt);
  const subject = `Ton achat BUILD est confirmé${NBSP}: ${input.offerName}`;
  const body = `Offre : ${input.offerName}\nPrix payé : ${formatAmount(input.amountCents)}\nDate : ${date}`;
  return account(ctx, {
    subject,
    preheader: `${input.offerName}, ${formatAmount(input.amountCents)}. Ton accès est ouvert.`,
    title: "Ton achat est confirmé.",
    body,
    ctaLabel: "Ouvrir BUILD",
    ctaUrl: ctx.baseUrl ? `${ctx.baseUrl}/dashboard` : undefined,
  });
}

export function buildUpgradeRefusalEmail(ctx: EmailContext): RenderedEmail {
  const checkoutUrl = ctx.baseUrl ? `${ctx.baseUrl}/checkout` : undefined;
  return account(ctx, {
    subject: "Ton complément a été remboursé",
    preheader: "Ton paiement vient d'être remboursé en totalité.",
    title: "Ton complément a été remboursé.",
    body: `Le complément à ${formatEuro(UPGRADE_PRICE)} est réservé aux comptes ${FONDATIONS_LABEL}. Ton compte n'a pas ${FONDATIONS_LABEL}, donc ${COFFRE_LABEL} n'a pas pu être activé.\n\nTon paiement vient d'être remboursé en totalité.`,
    ctaLabel: checkoutUrl ? "Voir les offres" : undefined,
    ctaUrl: checkoutUrl,
  });
}

export type BroadcastInput = {
  kind?: "video" | "update";
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  thumbnailUrl?: string;
  heading?: string;
};

export type EmailBlock = { type: "paragraph" | "quote" | "divider"; text?: string };
export function broadcastBodyToBlocks(body: string): EmailBlock[] {
  return body.split(/\r?\n{2,}/).map((part) => part.trim()).filter(Boolean).map((part): EmailBlock => {
    if (part === "---") return { type: "divider" };
    const lines = part.split(/\r?\n/);
    if (lines.every((line) => line.startsWith(">"))) return { type: "quote", text: lines.map((line) => line.replace(/^>\s?/, "")).join("\n") };
    return { type: "paragraph", text: part };
  });
}

export function buildBroadcastEmail(ctx: EmailContext, input: BroadcastInput): RenderedEmail {
  const kind = input.kind ?? (input.thumbnailUrl ? "video" : "update");
  const subject = input.subject.trim();
  const body = input.heading?.trim() && !input.body.trim().startsWith(input.heading.trim())
    ? `${input.heading.trim()}\n\n${input.body.trim()}`
    : input.body;
  const options: BuildMailRenderInput = {
    kind,
    subject,
    preheader: input.preheader,
    body,
    ctaLabel: input.ctaLabel.trim() || "Voir",
    ctaUrl: input.ctaUrl.trim(),
    thumb: input.thumbnailUrl?.trim(),
    logoUrl: logoUrl(ctx),
  };
  return mail(ctx, subject, render(options), options);
}

export const SUPABASE_PLACEHOLDERS = { link: "{{ .ConfirmationURL }}", newEmail: "{{ .NewEmail }}" } as const;
export type AuthEmailKind = "confirm-signup" | "invite" | "recovery" | "email-change";

export function buildAuthEmail(ctx: EmailContext, kind: AuthEmailKind, values: { link?: string; newEmail?: string } = {}): RenderedEmail {
  const link = values.link ?? SUPABASE_PLACEHOLDERS.link;
  const newEmail = values.newEmail ?? SUPABASE_PLACEHOLDERS.newEmail;
  const copy = {
    "confirm-signup": {
      subject: "Confirme ton adresse e-mail pour BUILD",
      preheader: "Un clic pour confirmer ton adresse et ouvrir ton compte.",
      title: "Confirme ton adresse e-mail.",
      body: "Tu viens de créer un compte BUILD. Confirme ton adresse pour l'activer.",
      button: "Confirmer mon adresse",
      notes: ["Si tu n'as pas créé de compte, ignore simplement cet e-mail."],
    },
    invite: {
      subject: "Active ton compte BUILD",
      preheader: "Choisis ton mot de passe pour ouvrir ton espace.",
      title: "Ton espace BUILD est prêt.",
      body: "Ton compte BUILD a été créé. Choisis ton mot de passe pour l'activer et entrer dans ton espace.",
      button: "Activer mon compte",
      notes: ["Si tu n'attendais pas cet e-mail, tu peux l'ignorer."],
    },
    recovery: {
      subject: "Ton code BUILD pour changer de mot de passe",
      preheader: "Saisis ce code pour choisir un nouveau mot de passe.",
      title: "Ton code de vérification.",
      body: "Saisis ce code dans BUILD pour choisir un nouveau mot de passe.\n\nCe code est personnel : ne le transmets à personne.",
      button: "",
      notes: ["Si tu n'as rien demandé, tu peux ignorer cet email."],
    },
    "email-change": {
      subject: "Confirme ta nouvelle adresse e-mail BUILD",
      preheader: "Confirme le changement d'adresse de ton compte.",
      title: "Confirme ta nouvelle adresse.",
      body: `Tu as demandé à utiliser ${newEmail} pour ton compte BUILD. Confirme ce changement pour qu'il prenne effet.`,
      button: "Confirmer le changement",
      notes: ["Si tu n'es pas à l'origine de cette demande, ignore cet e-mail."],
    },
  }[kind];
  return account(ctx, {
    subject: copy.subject,
    preheader: copy.preheader,
    title: copy.title,
    body: copy.body,
    ctaLabel: copy.button || undefined,
    ctaUrl: kind === "recovery" ? undefined : link,
    code: kind === "recovery" ? "{{ .Token }}" : undefined,
    notes: copy.notes,
  });
}
