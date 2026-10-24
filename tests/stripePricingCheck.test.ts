import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";

import {
  verifyConfiguredStripePaymentLinks,
  verifyConfiguredStripePrices,
} from "../scripts/stripePricingCheck";

function asyncItems<T>(items: T[]): AsyncIterable<T> {
  return {
    async *[Symbol.asyncIterator]() {
      yield* items;
    },
  };
}

function stripeFixture(
  priceAmount = 9700,
  paymentLinkUrl = "https://buy.example/fondations",
  validConsent = true,
) {
  return {
    prices: {
      retrieve: async (id: string) => ({
        id,
        currency: "eur",
        unit_amount: id === "price_beginner"
          ? priceAmount
          : id === "price_upgrade" ? 17000 : 26700,
      }),
    },
    paymentLinks: {
      list: () => asyncItems([
        {
          id: "plink_beginner",
          url: paymentLinkUrl,
          consent_collection: validConsent ? { terms_of_service: "required" } : undefined,
          custom_text: validConsent
            ? { terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT } }
            : undefined,
        },
        {
          id: "plink_full",
          url: "https://buy.example/full",
          consent_collection: validConsent ? { terms_of_service: "required" } : undefined,
          custom_text: validConsent
            ? { terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT } }
            : undefined,
        },
      ]),
      listLineItems: (id: string) => asyncItems([
        { price: { id: id === "plink_full" ? "price_full" : "price_beginner" }, quantity: 1 },
      ]),
    },
  } as never;
}

test("Stripe pricing verification accepts exact EUR prices and configured one-line Payment Links", async () => {
  const stripe = stripeFixture();
  await verifyConfiguredStripePrices(stripe, {
    STRIPE_BEGINNER_PRICE_ID: "price_beginner",
    STRIPE_FULL_PRICE_ID: "price_full",
    STRIPE_UPGRADE_PRICE_ID: "price_upgrade",
  });
  await verifyConfiguredStripePaymentLinks(stripe, {
    STRIPE_BEGINNER_PRICE_ID: "price_beginner",
    STRIPE_FULL_PRICE_ID: "price_full",
    STRIPE_UPGRADE_PRICE_ID: "price_upgrade",
    STRIPE_BEGINNER_CHECKOUT_LINK: "https://buy.example/fondations",
    STRIPE_FULL_CHECKOUT_LINK: "https://buy.example/full",
  });
});

test("Stripe pricing verification rejects a Payment Link without the exact consent text", async () => {
  const stripe = stripeFixture(9700, "https://buy.example/fondations", false);
  await assert.rejects(
    verifyConfiguredStripePaymentLinks(stripe, {
      STRIPE_BEGINNER_PRICE_ID: "price_beginner",
      STRIPE_FULL_PRICE_ID: "price_full",
      STRIPE_UPGRADE_PRICE_ID: "price_upgrade",
      STRIPE_BEGINNER_CHECKOUT_LINK: "https://buy.example/fondations",
      STRIPE_FULL_CHECKOUT_LINK: "https://buy.example/full",
    }),
    /missing the required terms consent/,
  );
});

test("Stripe pricing verification rejects an absent or inactive configured Payment Link", async () => {
  const stripe = stripeFixture(9700, "https://buy.example/other");
  await assert.rejects(
    verifyConfiguredStripePaymentLinks(stripe, {
      STRIPE_BEGINNER_PRICE_ID: "price_beginner",
      STRIPE_FULL_PRICE_ID: "price_full",
      STRIPE_UPGRADE_PRICE_ID: "price_upgrade",
      STRIPE_BEGINNER_CHECKOUT_LINK: "https://buy.example/fondations",
      STRIPE_FULL_CHECKOUT_LINK: "https://buy.example/full",
    }),
    /absent or inactive/,
  );
});

test("la désactivation des anciens liens exige un unique upgrade et des remplaçants actifs", async () => {
  const source = await readFile("scripts/update-stripe-pricing.ts", "utf8");
  assert.match(source, /RETIRE && !PUBLIC_UPGRADE_LINK_URL/);
  assert.match(source, /upgradeLinks\.length !== 1/);
  assert.match(source, /retirementReplacements\.set/);
  assert.match(source, /retiredUpgradeCount !== 1/);
});
