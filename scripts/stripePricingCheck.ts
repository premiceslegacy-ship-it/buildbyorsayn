import type Stripe from "stripe";
import { CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";
import {
  COFFRE_PRICE,
  FONDATIONS_PRICE,
  STRIPE_FULL_CHECKOUT_LINK,
  UPGRADE_PRICE,
} from "../lib/pricing";

type PricingEnv = {
  STRIPE_BEGINNER_PRICE_ID?: string;
  STRIPE_FULL_PRICE_ID?: string;
  STRIPE_UPGRADE_PRICE_ID?: string;
};

export const STRIPE_PRICE_EXPECTATIONS = [
  { name: "Fondations", env: "STRIPE_BEGINNER_PRICE_ID", amount: FONDATIONS_PRICE * 100 },
  { name: "LE COFFRE", env: "STRIPE_FULL_PRICE_ID", amount: COFFRE_PRICE * 100 },
  { name: "complément", env: "STRIPE_UPGRADE_PRICE_ID", amount: UPGRADE_PRICE * 100 },
] as const;

export async function verifyConfiguredStripePrices(
  stripe: Pick<Stripe, "prices">,
  env: PricingEnv = {
    STRIPE_BEGINNER_PRICE_ID: process.env.STRIPE_BEGINNER_PRICE_ID,
    STRIPE_FULL_PRICE_ID: process.env.STRIPE_FULL_PRICE_ID,
    STRIPE_UPGRADE_PRICE_ID: process.env.STRIPE_UPGRADE_PRICE_ID,
  },
): Promise<void> {
  for (const expected of STRIPE_PRICE_EXPECTATIONS) {
    const priceId = env[expected.env];
    if (!priceId?.trim()) throw new Error(`${expected.env} is required.`);
    const price = await stripe.prices.retrieve(priceId.trim());
    if (price.currency !== "eur" || price.unit_amount !== expected.amount) {
      throw new Error(
        `${expected.name} Price ${price.id} must be ${expected.amount} EUR cents; received ${price.unit_amount ?? "null"} ${price.currency}.`,
      );
    }
  }
}

type PaymentLinkEnv = PricingEnv & {
  STRIPE_BEGINNER_CHECKOUT_LINK?: string;
  STRIPE_FULL_CHECKOUT_LINK?: string;
};

export function hasRequiredPaymentLinkConsent(link: Stripe.PaymentLink): boolean {
  return link.consent_collection?.terms_of_service === "required"
    && link.custom_text?.terms_of_service_acceptance?.message === CHECKOUT_CONSENT_TEXT;
}

export async function verifyConfiguredStripePaymentLinks(
  stripe: Pick<Stripe, "paymentLinks"> & Pick<Stripe, "prices">,
  env: PaymentLinkEnv = {
    STRIPE_BEGINNER_PRICE_ID: process.env.STRIPE_BEGINNER_PRICE_ID,
    STRIPE_FULL_PRICE_ID: process.env.STRIPE_FULL_PRICE_ID,
    STRIPE_UPGRADE_PRICE_ID: process.env.STRIPE_UPGRADE_PRICE_ID,
    STRIPE_BEGINNER_CHECKOUT_LINK: process.env.STRIPE_BEGINNER_CHECKOUT_LINK,
    STRIPE_FULL_CHECKOUT_LINK: process.env.STRIPE_FULL_CHECKOUT_LINK ?? STRIPE_FULL_CHECKOUT_LINK,
  },
): Promise<void> {
  const links: Stripe.PaymentLink[] = [];
  for await (const link of stripe.paymentLinks.list({ active: true, limit: 100 })) links.push(link);
  const offers = [
    {
      name: "Fondations",
      url: env.STRIPE_BEGINNER_CHECKOUT_LINK,
      priceId: env.STRIPE_BEGINNER_PRICE_ID,
      amount: FONDATIONS_PRICE * 100,
    },
    {
      name: "LE COFFRE",
      url: env.STRIPE_FULL_CHECKOUT_LINK,
      priceId: env.STRIPE_FULL_PRICE_ID,
      amount: COFFRE_PRICE * 100,
    },
  ];
  for (const offer of offers) {
    if (!offer.url?.trim() || !offer.priceId?.trim()) {
      throw new Error(`${offer.name}: checkout link and Price ID are required.`);
    }
    const link = links.find((candidate) => candidate.url === offer.url);
    if (!link) throw new Error(`${offer.name}: configured Payment Link is absent or inactive.`);
    if (!hasRequiredPaymentLinkConsent(link)) {
      throw new Error(`${offer.name}: Payment Link is missing the required terms consent.`);
    }
    const items: Stripe.PaymentLinkCreateParams.LineItem[] = [];
    for await (const item of stripe.paymentLinks.listLineItems(link.id, { limit: 100 })) {
      if (!item.price?.id) throw new Error(`${offer.name}: Payment Link has a line without a Price ID.`);
      items.push({ price: item.price.id, quantity: item.quantity ?? 1 });
    }
    if (items.length !== 1 || items[0].quantity !== 1 || items[0].price !== offer.priceId.trim()) {
      throw new Error(`${offer.name}: Payment Link must contain exactly one line with quantity 1 and the configured Price ID.`);
    }
    await verifyPaymentLinkPrice(stripe, items[0].price, offer.amount, offer.name);
  }
}

export async function verifyPaymentLinkPrice(
  stripe: Pick<Stripe, "prices">,
  priceId: string,
  expectedAmount: number,
  label: string,
): Promise<void> {
  const price = await stripe.prices.retrieve(priceId);
  if (price.currency !== "eur" || price.unit_amount !== expectedAmount) {
    throw new Error(
      `${label} Payment Link Price ${price.id} must be ${expectedAmount} EUR cents; received ${price.unit_amount ?? "null"} ${price.currency}.`,
    );
  }
}
