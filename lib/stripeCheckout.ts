import { CHECKOUT_CONSENT_TEXT } from "@/lib/legal/consent";
import type Stripe from "stripe";
import { isUuid, normalizeCustomerEmail } from "@/lib/stripeEntitlements";

export const STRIPE_UPGRADE_PURCHASE_KIND = "build_upgrade";
const UPGRADE_CHECKOUT_WINDOW_MS = 15 * 60 * 1_000;

type UpgradeCheckoutInput = {
  userId: string;
  userEmail: string | null | undefined;
  priceId: string;
  siteOrigin: string;
};

/**
 * Construit une Checkout Session créée côté serveur. L'identité placée dans les métadonnées
 * ne peut donc pas être remplacée par une valeur ajoutée à une URL de Payment Link.
 */
export function buildUpgradeCheckoutParams(input: UpgradeCheckoutInput): Stripe.Checkout.SessionCreateParams {
  if (!isUuid(input.userId)) throw new Error("Upgrade checkout requires a valid user id.");
  if (!input.priceId.trim()) throw new Error("Upgrade checkout requires a Stripe price id.");

  const origin = new URL(input.siteOrigin).origin;
  const metadata = {
    build_purchase_kind: STRIPE_UPGRADE_PURCHASE_KIND,
    build_user_id: input.userId,
  };
  const customerEmail = normalizeCustomerEmail(input.userEmail);

  return {
    mode: "payment",
    line_items: [{ price: input.priceId, quantity: 1 }],
    client_reference_id: input.userId,
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    success_url: `${origin}/dashboard?upgrade=success`,
    cancel_url: `${origin}/checkout?upgrade=cancelled`,
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT },
    },
    metadata,
    payment_intent_data: { metadata },
  };
}

export function upgradeCheckoutIdempotencyKey(userId: string, nowMs = Date.now()): string {
  if (!isUuid(userId) || !Number.isFinite(nowMs) || nowMs < 0) {
    throw new Error("Upgrade checkout idempotency requires valid input.");
  }
  return `build-upgrade:${userId}:${Math.floor(nowMs / UPGRADE_CHECKOUT_WINDOW_MS)}`;
}

export function isPaidCheckoutSession(
  session: Pick<Stripe.Checkout.Session, "payment_status">
): boolean {
  return session.payment_status === "paid";
}

export function hasAcceptedStripeTerms(
  session: Pick<Stripe.Checkout.Session, "consent">
): boolean {
  return session.consent?.terms_of_service === "accepted";
}

/** Identité d'un complément : uniquement la liaison signée par le webhook Stripe et créée par notre serveur. */
export function secureUpgradeUserId(
  session: Pick<Stripe.Checkout.Session, "client_reference_id" | "metadata">,
): string | null {
  const metadataUserId = session.metadata?.build_user_id?.trim() ?? null;
  const referenceId = session.client_reference_id?.trim() ?? null;
  if (session.metadata?.build_purchase_kind !== STRIPE_UPGRADE_PURCHASE_KIND) return null;
  if (!isUuid(metadataUserId) || referenceId !== metadataUserId) return null;
  return metadataUserId;
}

export function safeStripeCheckoutUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.stripe.com" ? url.toString() : null;
  } catch {
    return null;
  }
}
