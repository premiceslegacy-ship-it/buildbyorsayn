import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_LABEL, FONDATIONS_PRICE, UPGRADE_PRICE, formatEuro } from "@/lib/pricing";
import {
  buildAuthEmail,
  buildBroadcastEmail,
  buildPurchaseConfirmationEmail,
  buildUpgradeRefusalEmail,
  buildWelcomeEmail,
  type EmailContext,
} from "./templates";

export type EmailCatalogEntry = {
  id: string;
  name: string;
  /** Quand BUILD envoie cet e-mail. */
  trigger: string;
  /** Service qui l'expédie. */
  sender: "BUILD" | "Supabase";
  subject: string;
  html: string;
  text: string;
};

const DEMO_ACTION_LINK = "https://projet.supabase.co/auth/v1/verify?token=exemple&type=invite";
const DEMO_DATE = new Date("2026-10-22T08:30:00Z");

/**
 * Les e-mails de BUILD avec des données fictives crédibles : le HTML est celui que le même gabarit génère à l'envoi.
 * Alimente l'aperçu de l'administration.
 */
export function buildEmailCatalog(ctx: EmailContext): EmailCatalogEntry[] {
  const entries: Array<Omit<EmailCatalogEntry, "subject" | "html" | "text"> & { mail: { subject: string; html: string; text: string } }> = [
    {
      id: "purchase-coffre",
      name: `Confirmation d'achat, ${COFFRE_LABEL}`,
      trigger: "Dès que le paiement Stripe est réglé. Sert de reçu.",
      sender: "BUILD",
      mail: buildPurchaseConfirmationEmail(ctx, { offerName: COFFRE_LABEL, amountCents: COFFRE_PRICE * 100, purchasedAt: DEMO_DATE }),
    },
    {
      id: "purchase-fondations",
      name: `Confirmation d'achat, ${FONDATIONS_LABEL}`,
      trigger: "Dès que le paiement Stripe est réglé. Sert de reçu.",
      sender: "BUILD",
      mail: buildPurchaseConfirmationEmail(ctx, { offerName: FONDATIONS_LABEL, amountCents: FONDATIONS_PRICE * 100, purchasedAt: DEMO_DATE }),
    },
    {
      id: "purchase-upgrade",
      name: `Confirmation d'achat, complément vers ${COFFRE_LABEL}`,
      trigger: `Dès que le complément à ${formatEuro(UPGRADE_PRICE)} est réglé par un compte ${FONDATIONS_LABEL}.`,
      sender: "BUILD",
      mail: buildPurchaseConfirmationEmail(ctx, { offerName: `Passage de ${FONDATIONS_LABEL} à ${COFFRE_LABEL}`, amountCents: UPGRADE_PRICE * 100, purchasedAt: DEMO_DATE }),
    },
    {
      id: "welcome",
      name: "Bienvenue et activation du compte",
      trigger: "Après un achat fait par quelqu'un qui n'a pas encore de compte.",
      sender: "BUILD",
      mail: buildWelcomeEmail(ctx, DEMO_ACTION_LINK),
    },
    {
      id: "upgrade-refused",
      name: "Complément refusé et remboursé",
      trigger: `Quand le complément est payé par un compte qui n'a pas ${FONDATIONS_LABEL}.`,
      sender: "BUILD",
      mail: buildUpgradeRefusalEmail(ctx),
    },
    {
      id: "broadcast-video",
      name: "Diffusion, nouvelle vidéo",
      trigger: "Écrite et envoyée depuis l'onglet E-mails. Exemple avec le modèle Nouvelle vidéo.",
      sender: "BUILD",
      mail: buildBroadcastEmail(ctx, {
        subject: "Nouvelle vidéo : brancher ton premier agent",
        preheader: "Disponible maintenant dans ta bibliothèque BUILD.",
        body: "Une nouvelle vidéo vient d'être ajoutée à BUILD. Tu peux la regarder dès maintenant depuis ton espace.\n\n> Si tu ne dois en voir qu'une cette semaine, c'est celle-ci.",
        ctaLabel: "Regarder la vidéo",
        ctaUrl: `${ctx.baseUrl ?? "https://build.example"}/videos`,
      }),
    },
    {
      id: "broadcast-update",
      name: "Diffusion, mise à jour BUILD",
      trigger: "Écrite et envoyée depuis l'onglet E-mails. Exemple avec le modèle Mise à jour BUILD.",
      sender: "BUILD",
      mail: buildBroadcastEmail(ctx, {
        subject: "Mise à jour BUILD : un chapitre de plus",
        preheader: "Le contenu vient d'être mis à jour.",
        body: "Un nouveau chapitre vient d'arriver dans ton espace, avec ses étapes pas à pas.\n\nConnecte-toi pour voir ce qui a changé.",
        ctaLabel: "Voir la mise à jour",
        ctaUrl: `${ctx.baseUrl ?? "https://build.example"}/dashboard`,
      }),
    },
    {
      id: "auth-confirm-signup",
      name: "Confirmation d'inscription",
      trigger: "Quand quelqu'un crée un compte sur la page de connexion.",
      sender: "Supabase",
      mail: buildAuthEmail(ctx, "confirm-signup", { link: DEMO_ACTION_LINK }),
    },
    {
      id: "auth-invite",
      name: "Invitation à activer le compte",
      trigger: "Secours de l'e-mail de bienvenue après un achat.",
      sender: "Supabase",
      mail: buildAuthEmail(ctx, "invite", { link: DEMO_ACTION_LINK }),
    },
    {
      id: "auth-recovery",
      name: "Mot de passe oublié",
      trigger: "Quand quelqu'un demande à réinitialiser son mot de passe.",
      sender: "Supabase",
      mail: buildAuthEmail(ctx, "recovery", { link: DEMO_ACTION_LINK }),
    },
    {
      id: "auth-email-change",
      name: "Changement d'adresse e-mail",
      trigger: "Quand un membre change son adresse depuis son compte.",
      sender: "Supabase",
      mail: buildAuthEmail(ctx, "email-change", { link: DEMO_ACTION_LINK, newEmail: "camille.durand@example.com" }),
    },
  ];
  return entries.map(({ mail, ...entry }) => ({ ...entry, ...mail }));
}
