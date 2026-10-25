import { COFFRE_LABEL, FONDATIONS_LABEL, UPGRADE_PRICE, formatEuro } from "@/lib/pricing";
import { renderEmail, type EmailBlock, type EmailFooter, type RenderedEmail } from "./layout";

/**
 * Tous les e-mails de BUILD, écrits une fois, rendus par le gabarit unique de layout.ts.
 * Les fonctions sont pures : aucune lecture d'environnement, le pied et l'origine du site arrivent en paramètres.
 */

/** Coordonnées utilisées uniquement pour le contact du pied de page. */
export type EmailSeller = {
  contactEmail: string;
};


export type EmailContext = {
  /** Origine publique du site sans barre finale, ou null quand elle n'est pas configurée. */
  baseUrl: string | null;
  seller: EmailSeller;
};

const NBSP = "\u00a0";

function footerFor(ctx: EmailContext, reason: string, extra: Partial<EmailFooter> = {}): EmailFooter {
  const links = ctx.baseUrl
    ? [
        ["Conditions générales de vente", `${ctx.baseUrl}/cgv`],
        ["Mentions légales", `${ctx.baseUrl}/mentions-legales`],
      ] as const
    : [];
  return {
    reason,
    contactEmail: ctx.seller.contactEmail,
    links,
    ...extra,
  };
}

function formatAmount(cents: number): string {
  const euros = cents / 100;
  const text = Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace(".", ",");
  return `${text}${NBSP}€`;
}

/** Achat réglé : le lien personnel qui ouvre le compte. */
export function buildWelcomeEmail(ctx: EmailContext, actionLink: string): RenderedEmail {
  return renderEmail({
    subject: `Ton accès BUILD est prêt${NBSP}: choisis ton mot de passe`,
    preheader: "Ton paiement est confirmé. Choisis ton mot de passe pour ouvrir ton espace.",
    baseUrl: ctx.baseUrl,
    blocks: [
      { type: "heading", text: "Ton accès est prêt." },
      { type: "paragraph", text: "Ton paiement est confirmé. Choisis ton mot de passe pour ouvrir ton espace membre." },
      { type: "button", label: "Activer mon compte", url: actionLink },
      { type: "link", label: "Le bouton ne s'ouvre pas ? Copie ce lien dans ton navigateur :", url: actionLink },
      { type: "note", text: "Ce lien est personnel. Si tu n'es pas à l'origine de cet achat, ignore simplement cet e-mail." },
    ],
    footer: footerFor(ctx, "Tu reçois ce message parce qu'un achat BUILD vient d'être réglé avec cette adresse."),
  });
}

export type PurchaseConfirmationInput = {
  /** Nom de l'offre achetée, tel que Stripe l'a facturée. */
  offerName: string;
  /** Montant réellement payé, en centimes, lu sur la session Stripe (amount_total). */
  amountCents: number;
  purchasedAt: Date;
};

/** Confirmation d'achat et reçu : offre, prix payé, date et accès BUILD. */
export function buildPurchaseConfirmationEmail(ctx: EmailContext, input: PurchaseConfirmationInput): RenderedEmail {
  const { offerName, amountCents, purchasedAt } = input;
  if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error("Montant de l'achat invalide.");
  const { baseUrl } = ctx;
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }).format(purchasedAt);
  const blocks: EmailBlock[] = [
    { type: "heading", text: "Ton achat est confirmé." },
    { type: "paragraph", text: "Ton paiement est bien arrivé. Voici la confirmation de ton achat." },
    {
      type: "facts",
      rows: [
        ["Offre", offerName],
        ["Prix payé", formatAmount(amountCents)],
        ["Date", date],
      ],
    },
    ...(baseUrl ? [{ type: "button", label: "Ouvrir BUILD", url: `${baseUrl}/dashboard` } as const] : []),
  ];
  return renderEmail({
    subject: `Ton achat BUILD est confirmé${NBSP}: ${offerName}`,
    preheader: `${offerName}, ${formatAmount(amountCents)}. Ton accès est ouvert.`,
    baseUrl,
    blocks,
    footer: footerFor(ctx, "Tu reçois ce message parce que tu viens d'acheter BUILD."),
  });
}

/** Complément refusé et remboursé : le compte n'avait pas Fondations. */
export function buildUpgradeRefusalEmail(ctx: EmailContext): RenderedEmail {
  const checkoutUrl = ctx.baseUrl ? `${ctx.baseUrl}/checkout` : null;
  return renderEmail({
    subject: "Ton complément a été remboursé",
    preheader: "Ton paiement vient d'être remboursé en totalité.",
    baseUrl: ctx.baseUrl,
    blocks: [
      { type: "heading", text: "Ton complément a été remboursé." },
      {
        type: "paragraph",
        text: `Le complément à ${formatEuro(UPGRADE_PRICE)} est réservé aux comptes ${FONDATIONS_LABEL}. Ton compte n'a pas ${FONDATIONS_LABEL}, donc nous n'avons pas pu activer ${COFFRE_LABEL}.`,
      },
      { type: "paragraph", text: "Ton paiement vient d'être remboursé en totalité. Tu le verras sur ton relevé sous quelques jours." },
      {
        type: "paragraph",
        text: `Pour entrer dans BUILD, tu peux prendre ${FONDATIONS_LABEL} ou ${COFFRE_LABEL}${checkoutUrl ? "." : " depuis ton espace BUILD."}`,
      },
      ...(checkoutUrl ? [{ type: "button", label: "Voir les offres", url: checkoutUrl } as const] : []),
    ],
    footer: footerFor(ctx, "Tu reçois ce message parce qu'un paiement vient d'être remboursé sur cette adresse."),
  });
}

export type BroadcastInput = {
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  /** Miniature publique de la vidéo, stockée dans video-thumbnails. */
  thumbnailUrl?: string;
  /** Titre visible dans le corps quand l'objet de boîte est différent. */
  heading?: string;
};

function youtubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
}

function broadcastThumbnail(input: BroadcastInput, ctaUrl: string): string | null {
  const supplied = input.thumbnailUrl?.trim();
  return supplied || youtubeThumbnail(ctaUrl);
}

/**
 * Le corps écrit par l'administrateur devient des blocs : un paragraphe par bloc vide, une citation quand chaque ligne
 * commence par « > », un séparateur pour une ligne « --- ». Rien d'autre n'est interprété, tout le reste est du texte échappé.
 */
export function broadcastBodyToBlocks(body: string): EmailBlock[] {
  return body
    .split(/\r?\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part): EmailBlock => {
      if (part === "---") return { type: "divider" };
      const lines = part.split(/\r?\n/);
      if (lines.every((line) => line.startsWith(">"))) {
        return { type: "quote", text: lines.map((line) => line.replace(/^>\s?/, "")).join("\n") };
      }
      return { type: "paragraph", text: part };
    });
}

/** Diffusion écrite par l'administrateur (nouvelle vidéo, mise à jour, message libre). */
export function buildBroadcastEmail(ctx: EmailContext, input: BroadcastInput): RenderedEmail {
  const ctaUrl = input.ctaUrl.trim();
  const thumbnail = broadcastThumbnail(input, ctaUrl);
  const heading = input.heading?.trim() || input.subject.trim();
  const blocks: EmailBlock[] = [
    { type: "heading", text: heading },
    ...(thumbnail ? [{ type: "image", src: thumbnail, href: ctaUrl, alt: `Miniature de ${heading || "la vidéo"}` } as const] : []),
    ...broadcastBodyToBlocks(input.body),
    ...(ctaUrl ? [{ type: "button", label: input.ctaLabel.trim() || "Voir", url: ctaUrl } as const] : []),
  ];
  return renderEmail({
    subject: input.subject.trim(),
    preheader: input.preheader,
    baseUrl: ctx.baseUrl,
    blocks,
    footer: footerFor(ctx, "Tu reçois ce message parce que tu as un compte BUILD.", { unsubscribe: true }),
  });
}

/** Valeurs que Supabase remplace à l'envoi dans ses gabarits d'authentification. */
export const SUPABASE_PLACEHOLDERS = {
  link: "{{ .ConfirmationURL }}",
  newEmail: "{{ .NewEmail }}",
} as const;

export type AuthEmailKind = "confirm-signup" | "invite" | "recovery" | "email-change";

/**
 * Gabarits des e-mails d'authentification envoyés par Supabase (inscription, invitation, mot de passe oublié,
 * changement d'adresse). Ils ne vivent pas dans notre code d'envoi : on les génère ici, puis on les colle dans
 * Supabase (Authentication, Emails). Voir supabase/email-templates/.
 */
export function buildAuthEmail(
  ctx: EmailContext,
  kind: AuthEmailKind,
  values: { link?: string; newEmail?: string } = {},
): RenderedEmail {
  const link = values.link ?? SUPABASE_PLACEHOLDERS.link;
  const newEmail = values.newEmail ?? SUPABASE_PLACEHOLDERS.newEmail;
  const copy = {
    "confirm-signup": {
      subject: "Confirme ton adresse e-mail pour BUILD",
      preheader: "Un clic pour confirmer ton adresse et ouvrir ton compte.",
      heading: "Confirme ton adresse e-mail.",
      text: "Tu viens de créer un compte BUILD. Confirme ton adresse pour l'activer.",
      button: "Confirmer mon adresse",
      reason: "Tu reçois ce message parce qu'un compte BUILD vient d'être créé avec cette adresse.",
      note: "Si tu n'as pas créé de compte, ignore simplement cet e-mail : rien ne sera activé.",
    },
    invite: {
      subject: "Active ton compte BUILD",
      preheader: "Choisis ton mot de passe pour ouvrir ton espace.",
      heading: "Ton espace BUILD est prêt.",
      text: "Ton compte BUILD a été créé. Choisis ton mot de passe pour l'activer et entrer dans ton espace.",
      button: "Activer mon compte",
      reason: "Tu reçois ce message parce qu'un compte BUILD a été créé pour cette adresse.",
      note: "Si tu n'attendais pas cet e-mail, tu peux l'ignorer.",
    },
    recovery: {
      subject: "Ton code BUILD pour changer de mot de passe",
      preheader: "Saisis ce code pour choisir un nouveau mot de passe.",
      heading: "Ton code de réinitialisation.",
      text: "Tu as demandé à réinitialiser ton mot de passe BUILD. Saisis ce code sur la page de réinitialisation pour en choisir un nouveau.",
      button: "",
      reason: "Tu reçois ce message parce qu'une réinitialisation de mot de passe a été demandée pour ce compte.",
      note: "Si tu n'es pas à l'origine de cette demande, ignore cet e-mail : ton mot de passe actuel reste valable.",
    },
    "email-change": {
      subject: "Confirme ta nouvelle adresse e-mail BUILD",
      preheader: "Confirme le changement d'adresse de ton compte.",
      heading: "Confirme ta nouvelle adresse.",
      text: `Tu as demandé à utiliser ${newEmail} pour ton compte BUILD. Confirme ce changement pour qu'il prenne effet.`,
      button: "Confirmer le changement",
      reason: "Tu reçois ce message parce qu'un changement d'adresse a été demandé sur ton compte BUILD.",
      note: "Si tu n'es pas à l'origine de cette demande, ignore cet e-mail : ton adresse ne change pas.",
    },
  }[kind];
  return renderEmail({
    subject: copy.subject,
    preheader: copy.preheader,
    baseUrl: ctx.baseUrl,
    blocks: kind === "recovery"
      ? [
          { type: "heading", text: copy.heading },
          { type: "paragraph", text: copy.text },
          { type: "code", text: "{{ .Token }}" },
          { type: "note", text: `${copy.note} Ce code est personnel et ne reste valable que peu de temps.` },
        ]
      : [
          { type: "heading", text: copy.heading },
          { type: "paragraph", text: copy.text },
          { type: "button", label: copy.button, url: link },
          { type: "link", label: "Le bouton ne s'ouvre pas ? Copie ce lien dans ton navigateur :", url: link },
          { type: "note", text: `${copy.note} Ce lien est personnel et ne reste valable que peu de temps.` },
        ],
    footer: footerFor(ctx, copy.reason),
  });
}
