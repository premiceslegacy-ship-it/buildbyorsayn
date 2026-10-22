export const FONDATIONS_PRICE = 97;
export const COFFRE_PRICE = 267;
export const UPGRADE_PRICE = COFFRE_PRICE - FONDATIONS_PRICE;

/** Espace insécable dans LE COFFRE : le nom ne se coupe jamais en fin de ligne. */
export const COFFRE_LABEL = "LE\u00a0COFFRE";

/** Prix écrit pour l'écran, avec espace insécable avant le symbole. */
export function formatEuro(amount: number): string {
  return `${amount}\u00a0€`;
}
export const FONDATIONS_LABEL = "Fondations";

export const STRIPE_FULL_CHECKOUT_LINK = "https://buy.stripe.com/bJeaEYe46bxT00I0PC5AQ0c";

export function sanitizeStripeCheckoutUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "buy.stripe.com" ||
      url.username ||
      url.password ||
      url.port
    ) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function withClientReferenceId(
  baseUrl: string | null | undefined,
  userId: string | null | undefined,
): string | null {
  const safeBaseUrl = sanitizeStripeCheckoutUrl(baseUrl);
  if (!safeBaseUrl) return null;
  if (!userId) return safeBaseUrl;

  try {
    const parsed = new URL(safeBaseUrl);
    if (parsed.searchParams.has("client_reference_id")) return null;
  } catch {
    return null;
  }

  const hashIndex = safeBaseUrl.indexOf("#");
  const path = hashIndex === -1 ? safeBaseUrl : safeBaseUrl.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : safeBaseUrl.slice(hashIndex);
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}client_reference_id=${encodeURIComponent(userId)}${hash}`;
}

/** Liens Stripe de base, déjà validés (ou null quand le lien est absent ou invalide). */
export type CheckoutBaseLinks = {
  beginner: string | null;
  full: string | null;
};

/** Liens prêts à ouvrir pour un visiteur donné. null = bouton désactivé, jamais un lien mort. */
export type CheckoutLinks = {
  fondations: string | null;
  coffre: string | null;
};

/**
 * Porte serveur du complément Fondations vers LE COFFRE. Le lien Stripe du complément n'apparaît jamais dans une page :
 * tout le monde passe par cette route, qui n'ouvre le paiement qu'aux comptes Fondations.
 */
export const UPGRADE_PATH = "/checkout/upgrade";

/**
 * Point unique de résolution des liens de paiement (accueil, /checkout, tableau de bord).
 * Chaque lien est validé ; l'identifiant du compte est ajouté une seule fois quand le visiteur est connecté.
 */
export function resolveCheckoutLinks(
  base: CheckoutBaseLinks,
  userId?: string | null,
): CheckoutLinks {
  return {
    fondations: withClientReferenceId(base.beginner, userId),
    coffre: withClientReferenceId(base.full, userId),
  };
}
