/**
 * Texte exact que l'acheteur confirme sur la page de paiement Stripe (case à cocher obligatoire).
 * Les CGV l'affichent mot pour mot : le texte configuré dans Stripe (lien de paiement, conditions de service)
 * doit être identique à celui-ci, sinon la preuve du consentement ne correspond plus aux CGV.
 * Code de la consommation, article L221-28, 13° : accord préalable exprès à l'exécution immédiate et renoncement exprès à la rétractation.
 */
export const CHECKOUT_CONSENT_TEXT =
  "Je demande l'accès immédiat à mon contenu numérique BUILD. Je reconnais que, dès que l'accès est ouvert, je perds mon droit de rétractation de 14 jours. J'ai lu et j'accepte les conditions générales de vente.";

export type PurchaseConfirmationInput = {
  /** Nom de l'offre achetée, tel que Stripe l'a facturée (Fondations, le coffre, ou le passage de l'un à l'autre). */
  offerName: string;
  /** Montant réellement payé, en centimes, lu sur la session Stripe (amount_total). */
  amountCents: number;
  /** Date du paiement. */
  purchasedAt: Date;
  /** Adresse du site, sans barre finale (NEXT_PUBLIC_APP_URL). */
  baseUrl: string;
  seller: { fullName: string; tradeName: string; siret: string; address: string; contactEmail: string; vatMention: string };
};

export type PurchaseConfirmationEmail = { subject: string; text: string; html: string };

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ESCAPES[char]);

function formatAmount(cents: number): string {
  const euros = cents / 100;
  const text = Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace(".", ",");
  return `${text}\u00a0€`;
}

/**
 * E-mail de confirmation d'achat, envoyé à l'acheteur après le paiement : c'est la confirmation du contrat sur support durable
 * (Code de la consommation, L221-13) qui reprend l'accord à l'exécution immédiate et la renonciation au droit de rétractation (L221-28, 13°).
 */
export function buildPurchaseConfirmation(input: PurchaseConfirmationInput): PurchaseConfirmationEmail {
  const { offerName, amountCents, purchasedAt, baseUrl, seller } = input;
  if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error("Montant de l'achat invalide.");
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }).format(purchasedAt);
  const price = `${formatAmount(amountCents)} (prix net, ${seller.vatMention})`;
  const cgv = `${baseUrl}/cgv`;
  const subject = `Ton achat BUILD est confirmé : ${offerName}`;

  const lines = [
    "Bonjour,",
    "",
    `Ton paiement est bien arrivé. Voici la confirmation de ton achat, à garder.`,
    "",
    `Offre : ${offerName}`,
    `Prix payé : ${price}`,
    `Date : ${date}`,
    `Vendeur : ${seller.fullName}, entrepreneur individuel exerçant sous le nom commercial ${seller.tradeName}, SIRET ${seller.siret}, ${seller.address}`,
    "",
    "Ton accès est ouvert dès maintenant, sans délai. C'est un paiement unique : pas d'abonnement.",
    "",
    "Ce que tu as demandé et reconnu au moment de payer :",
    `${CHECKOUT_CONSENT_TEXT}`,
    "",
    `Conditions générales de vente : ${cgv}`,
    `Une question ? Écris à ${seller.contactEmail}, nous répondons.`,
    "",
    "BUILD by Orsayn",
  ];
  const text = lines.join("\n");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#0e0e0f;color:#f0ede8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <main style="max-width:600px;margin:0 auto;padding:40px 20px;font-size:16px;line-height:1.6;">
      <p>Bonjour,</p>
      <p>Ton paiement est bien arrivé. Voici la confirmation de ton achat, à garder.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr><td style="padding:8px 12px 8px 0;color:#b9b6b0;">Offre</td><td style="padding:8px 0;">${escapeHtml(offerName)}</td></tr>
        <tr><td style="padding:8px 12px 8px 0;color:#b9b6b0;">Prix payé</td><td style="padding:8px 0;">${escapeHtml(price)}</td></tr>
        <tr><td style="padding:8px 12px 8px 0;color:#b9b6b0;">Date</td><td style="padding:8px 0;">${escapeHtml(date)}</td></tr>
        <tr><td style="padding:8px 12px 8px 0;color:#b9b6b0;vertical-align:top;">Vendeur</td><td style="padding:8px 0;">${escapeHtml(`${seller.fullName}, entrepreneur individuel exerçant sous le nom commercial ${seller.tradeName}, SIRET ${seller.siret}, ${seller.address}`)}</td></tr>
      </table>
      <p>Ton accès est ouvert dès maintenant, sans délai. C'est un paiement unique : pas d'abonnement.</p>
      <p>Ce que tu as demandé et reconnu au moment de payer :</p>
      <p style="padding:14px 16px;border:1px solid #3a3a3c;border-radius:12px;">${escapeHtml(CHECKOUT_CONSENT_TEXT)}</p>
      <p><a href="${escapeHtml(cgv)}" style="color:#b9f5cf;">Conditions générales de vente</a></p>
      <p>Une question ? Écris à <a href="mailto:${escapeHtml(seller.contactEmail)}" style="color:#b9f5cf;">${escapeHtml(seller.contactEmail)}</a>, nous répondons.</p>
      <p style="color:#b9b6b0;">BUILD by Orsayn</p>
    </main>
  </body>
</html>`;

  return { subject, text, html };
}
