import {
  resolveCheckoutLinks,
  sanitizeStripeCheckoutUrl,
  STRIPE_FULL_CHECKOUT_LINK,
  type CheckoutBaseLinks,
  type CheckoutLinks,
} from "@/lib/pricing";

/** Lecture serveur des liens Stripe de base. Les valeurs d'environnement sont validées avant tout usage. */
export function readCheckoutBaseLinks(env: Record<string, string | undefined> = process.env): CheckoutBaseLinks {
  return {
    beginner: sanitizeStripeCheckoutUrl(env.STRIPE_BEGINNER_CHECKOUT_LINK),
    upgrade: sanitizeStripeCheckoutUrl(env.STRIPE_UPGRADE_CHECKOUT_LINK),
    full: sanitizeStripeCheckoutUrl(STRIPE_FULL_CHECKOUT_LINK),
  };
}

/** Liens prêts à l'emploi pour un visiteur (anonyme ou connecté), côté serveur. */
export function getCheckoutLinks(userId?: string | null): CheckoutLinks {
  return resolveCheckoutLinks(readCheckoutBaseLinks(), userId);
}
