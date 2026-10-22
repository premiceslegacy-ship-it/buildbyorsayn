import {
  resolveCheckoutLinks,
  sanitizeStripeCheckoutUrl,
  STRIPE_FULL_CHECKOUT_LINK,
  withClientReferenceId,
  type CheckoutBaseLinks,
  type CheckoutLinks,
} from "@/lib/pricing";

type Env = Record<string, string | undefined>;

/** Lecture serveur des liens Stripe de base (Fondations et LE COFFRE). Les valeurs d'environnement sont validées avant tout usage. */
export function readCheckoutBaseLinks(env: Env = process.env): CheckoutBaseLinks {
  return {
    beginner: sanitizeStripeCheckoutUrl(env.STRIPE_BEGINNER_CHECKOUT_LINK),
    full: sanitizeStripeCheckoutUrl(STRIPE_FULL_CHECKOUT_LINK),
  };
}

/** Liens prêts à l'emploi pour un visiteur (anonyme ou connecté), côté serveur. */
export function getCheckoutLinks(userId?: string | null): CheckoutLinks {
  return resolveCheckoutLinks(readCheckoutBaseLinks(), userId);
}

/**
 * Lien Stripe du complément, avec l'identifiant du compte. Réservé à la route /checkout/upgrade :
 * ne jamais l'envoyer dans une page, une action serveur ou une réponse JSON.
 */
export function getUpgradeCheckoutLink(userId: string, env: Env = process.env): string | null {
  return withClientReferenceId(sanitizeStripeCheckoutUrl(env.STRIPE_UPGRADE_CHECKOUT_LINK), userId);
}
