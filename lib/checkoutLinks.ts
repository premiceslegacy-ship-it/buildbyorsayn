import {
  resolveCheckoutLinks,
  sanitizeStripeCheckoutUrl,
  STRIPE_FULL_CHECKOUT_LINK,
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
