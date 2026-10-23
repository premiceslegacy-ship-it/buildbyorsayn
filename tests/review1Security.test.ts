import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import type Stripe from "stripe";
import { hasStripeHistory } from "../app/admin/stripeHistory";
import { isTrustedUpgradeNavigation } from "../lib/checkoutUpgrade";
import { buildSearchCatalog, searchCatalog } from "../lib/search/catalog";
import { buildNewsInputSchema } from "../lib/buildNews/model";

test("la recherche ne sérialise aucun résultat verrouillé pour un palier inférieur", () => {
  for (const tier of ["free", "preview", "beginner"] as const) {
    const catalog = buildSearchCatalog(tier);
    assert.equal(catalog.some((item) => item.locked), false, tier);
  }

  assert.deepEqual(searchCatalog(buildSearchCatalog("free"), "Hermes"), []);
  assert.deepEqual(searchCatalog(buildSearchCatalog("beginner"), "Bloc 2"), []);
});

test("l'historique Stripe pagine la recherche avant de déclarer un compte impayé", async () => {
  const searchedPages: Array<string | undefined> = [];
  const stripe = {
    customers: {
      list: async () => ({ data: [], has_more: false }),
    },
    paymentIntents: {
      search: async ({ page }: { page?: string }) => {
        searchedPages.push(page);
        return page
          ? { data: [{ status: "succeeded" }], next_page: null }
          : { data: [{ status: "canceled" }], next_page: "second" };
      },
      list: async () => ({ data: [], has_more: false }),
    },
    subscriptions: {
      list: async () => ({ data: [], has_more: false }),
    },
  } as unknown as Stripe;

  assert.deepEqual(await hasStripeHistory(stripe, "client@example.test"), {
    hasPayment: true,
    hasSubscription: false,
  });
  assert.deepEqual(searchedPages, [undefined, "second"]);
});

test("l'historique Stripe examine les clients et paiements au-delà de la première page", async () => {
  const customerPages: Array<string | undefined> = [];
  const paymentPages: string[] = [];
  const stripe = {
    customers: {
      list: async ({ starting_after: after }: { starting_after?: string }) => {
        customerPages.push(after);
        return after
          ? { data: [{ id: "cus_paid" }], has_more: false }
          : { data: [{ id: "cus_empty" }], has_more: true };
      },
    },
    paymentIntents: {
      search: async () => ({ data: [], next_page: null }),
      list: async ({ customer, starting_after: after }: { customer: string; starting_after?: string }) => {
        paymentPages.push(`${customer}:${after ?? "first"}`);
        if (customer === "cus_empty") return { data: [], has_more: false };
        return after
          ? { data: [{ id: "pi_paid", status: "succeeded" }], has_more: false }
          : { data: [{ id: "pi_canceled", status: "canceled" }], has_more: true };
      },
    },
    subscriptions: {
      list: async () => ({ data: [], has_more: false }),
    },
  } as unknown as Stripe;

  assert.deepEqual(await hasStripeHistory(stripe, "client@example.test"), {
    hasPayment: true,
    hasSubscription: false,
  });
  assert.deepEqual(customerPages, [undefined, "cus_empty"]);
  assert.deepEqual(paymentPages, ["cus_empty:first", "cus_paid:first", "cus_paid:pi_canceled"]);
});

test("la porte du complément refuse préchargement, sous-ressource et navigation externe", () => {
  const headers = (values: Record<string, string>) => new Headers(values);
  assert.equal(isTrustedUpgradeNavigation(headers({ "sec-fetch-site": "same-origin", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" })), true);
  assert.equal(isTrustedUpgradeNavigation(headers({ "sec-fetch-site": "none", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" })), true);
  assert.equal(isTrustedUpgradeNavigation(headers({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" })), false);
  assert.equal(isTrustedUpgradeNavigation(headers({ "sec-fetch-site": "same-origin", "sec-fetch-mode": "cors", "sec-fetch-dest": "empty" })), false);
  assert.equal(isTrustedUpgradeNavigation(headers({ "sec-fetch-site": "same-origin", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document", purpose: "prefetch" })), false);
  assert.equal(isTrustedUpgradeNavigation(headers({})), false);
});

test("les liens du complément ne passent jamais par le préchargement Next", async () => {
  const checkout = await readFile("components/ui5/CheckoutView.tsx", "utf8");
  assert.doesNotMatch(checkout, /<Link[^>]+href=\{UPGRADE_PATH\}/);
  assert.equal((checkout.match(/<a[^>]+href=\{UPGRADE_PATH\}/g) ?? []).length, 2);
});

test("le modèle client de confirmation n'importe aucun contenu privé", async () => {
  const model = await readFile("components/ui5/purchaseModel.ts", "utf8");
  assert.doesNotMatch(model, /@\/lib\/programme/);
  assert.doesNotMatch(model, /app\/beginner|protocoleContent|sections\.data/);
});

test("les nouveautés refusent les schémas externes et les chemins à double barre", () => {
  const base = {
    title: "Nouveau chapitre",
    publishedAt: "2026-10-23T10:00:00+02:00",
    thumbnail: "/da/mini/b1.jpg",
    internalUrl: "/blocs/1",
    sentence: "Le chapitre est disponible.",
  };
  for (const internalUrl of ["//evil.example/path", "javascript:alert(1)", "https://evil.example/path"]) {
    assert.equal(buildNewsInputSchema.safeParse({ ...base, internalUrl }).success, false, internalUrl);
  }
  for (const thumbnail of ["//evil.example/image.jpg", "javascript:alert(1)", "http://evil.example/image.jpg"]) {
    assert.equal(buildNewsInputSchema.safeParse({ ...base, thumbnail }).success, false, thumbnail);
  }
  assert.equal(buildNewsInputSchema.safeParse({ ...base, thumbnail: "https://cdn.example/image.jpg" }).success, true);
});
