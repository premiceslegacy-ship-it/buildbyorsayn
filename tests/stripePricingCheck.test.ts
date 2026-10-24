import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";

import {
  retireOldLinks,
} from "../scripts/update-stripe-pricing";
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

test("la désactivation des anciens liens exige des remplaçants metadata et une relecture active", async () => {
  const source = await readFile("scripts/update-stripe-pricing.ts", "utf8");
  assert.match(source, /RETIRE && !PUBLIC_UPGRADE_LINK_URL/);
  assert.match(source, /metadata\?\.replaces/);
  assert.match(source, /activeAfter/);
  assert.match(source, /Expected three old links to be inactive/);
});

test("retire-old désactive les trois anciens liens et conserve les deux remplaçants conformes", async () => {
  const links = [
    { id: "old_beginner", url: "https://buy.example/old-fondations", metadata: {}, active: true },
    { id: "old_full", url: "https://buy.example/old-full", metadata: {}, active: true },
    { id: "old_upgrade", url: "https://buy.example/old-upgrade", metadata: {}, active: true },
    {
      id: "new_beginner",
      url: "https://buy.example/new-fondations",
      metadata: { replaces: "old_beginner" },
      active: true,
      consent_collection: { terms_of_service: "required" },
      custom_text: { terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT } },
    },
    {
      id: "new_full",
      url: "https://buy.example/new-full",
      metadata: { replaces: "old_full" },
      active: true,
      consent_collection: { terms_of_service: "required" },
      custom_text: { terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT } },
    },
  ] as Array<Record<string, unknown>>;
  const itemPrices: Record<string, string> = {
    old_beginner: "price_beginner",
    new_beginner: "price_beginner",
    old_full: "price_full",
    new_full: "price_full",
  };
  const updates: string[] = [];
  const client = {
    prices: {
      retrieve: async (id: string) => ({
        id,
        currency: "eur",
        unit_amount: id === "price_beginner" ? 9700 : 26700,
      }),
    },
    paymentLinks: {
      list: () => asyncItems(links.filter((link) => link.active !== false)),
      listLineItems: (id: string) => asyncItems([{ price: { id: itemPrices[id] }, quantity: 1 }]),
      update: async (id: string) => {
        updates.push(id);
        const link = links.find((candidate) => candidate.id === id);
        if (link) link.active = false;
        return link;
      },
    },
  } as never;

  await retireOldLinks(client, links as never, [
    {
      name: "Fondations",
      url: "https://buy.example/new-fondations",
      target: "beginner",
      priceId: "price_beginner",
      amount: 9700,
    },
    {
      name: "LE COFFRE",
      url: "https://buy.example/new-full",
      target: "full",
      priceId: "price_full",
      amount: 26700,
    },
  ], "https://buy.example/old-upgrade");

  assert.deepEqual(updates.sort(), ["old_beginner", "old_full", "old_upgrade"]);
  assert.equal(links.find((link) => link.id === "new_beginner")?.active, true);
  assert.equal(links.find((link) => link.id === "new_full")?.active, true);
  assert.equal(links.find((link) => link.id === "old_beginner")?.active, false);
  assert.equal(links.find((link) => link.id === "old_full")?.active, false);
  assert.equal(links.find((link) => link.id === "old_upgrade")?.active, false);
});
