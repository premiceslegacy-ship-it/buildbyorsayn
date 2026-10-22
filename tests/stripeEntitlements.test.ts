import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  decideUpgradeAccess,
  determineStripeTier,
  escapeIlikePattern,
  emailsMatch,
  isUuid,
  referenceMatchesProfile,
  shouldApplyStripeTier,
} from "../lib/stripeEntitlements";

const USER_ID = "11111111-1111-4111-8111-111111111111";

test("Stripe references require a UUID and an exact normalized customer email", () => {
  assert.equal(isUuid(USER_ID), true);
  assert.equal(isUuid("not-a-uuid"), false);
  assert.equal(referenceMatchesProfile(USER_ID, "Buyer@Example.com", "buyer@example.com"), true);
  assert.equal(referenceMatchesProfile(USER_ID, "buyer@example.com", "other@example.com"), false);
  assert.equal(referenceMatchesProfile("not-a-uuid", "buyer@example.com", "buyer@example.com"), false);
  assert.equal(emailsMatch(" Buyer@Example.com ", "buyer@example.com"), true);
  assert.equal(escapeIlikePattern("buyer_%@example.com"), "buyer\\_\\%@example.com");
});

test("Stripe price mapping fails closed for missing or unknown prices", () => {
  assert.equal(determineStripeTier(null, "price_beginner", "price_full", "price_upgrade"), null);
  assert.equal(determineStripeTier("price_unknown", "price_beginner", "price_full", "price_upgrade"), null);
  assert.equal(determineStripeTier("price_beginner", "price_beginner", "price_full", "price_upgrade"), "beginner");
  assert.equal(determineStripeTier("price_full", "price_beginner", "price_full", "price_upgrade"), "full");
  assert.equal(determineStripeTier("price_upgrade", "price_beginner", "price_full", "price_upgrade"), "full");
});

test("Stripe entitlement updates are monotonic and preserve admin access", () => {
  assert.equal(shouldApplyStripeTier(null, "beginner"), true);
  assert.equal(shouldApplyStripeTier("free", "beginner"), true);
  assert.equal(shouldApplyStripeTier("beginner", "full"), true);
  assert.equal(shouldApplyStripeTier("full", "beginner"), false);
  assert.equal(shouldApplyStripeTier("admin", "beginner"), false);
  assert.equal(shouldApplyStripeTier("admin", "full"), false);
});

test("Stripe persistence includes NULL profiles and tier mutation is admin-only", async () => {
  const webhook = await readFile("app/api/webhooks/stripe/route.ts", "utf8");
  const tierAction = await readFile("app/actions/setUserTier.ts", "utf8");

  assert.match(webhook, /\.or\("tier\.is\.null,tier\.neq\.admin"\)/g);
  assert.match(webhook, /\.or\("tier\.is\.null,tier\.neq\.full"\)/g);
  assert.match(webhook, /\.ilike\("email", escapeIlikePattern\(customerEmail\)\)/);
  assert.match(webhook, /Customer profile lookup failed[\s\S]*status: 500/);
  assert.match(webhook, /Supabase invitation failed[\s\S]*status: 500/);
  assert.match(webhook, /invitation link generation failed[\s\S]*status: 500/);
  assert.match(tierAction, /isPlatformAdminUser/);
  assert.doesNotMatch(tierAction, /isAccompanimentAdminUser/);
});

test("le complément n'est accordé qu'aux comptes Fondations, full ou admin", () => {
  for (const tier of ["beginner", "full", "admin"]) {
    assert.equal(decideUpgradeAccess("price_upgrade", "price_upgrade", tier), "grant", tier);
  }
  for (const tier of [null, undefined, "free", "preview", "inconnu", ""]) {
    assert.equal(decideUpgradeAccess("price_upgrade", "price_upgrade", tier), "refuse", String(tier));
  }
});

test("un autre prix, ou une configuration sans prix de complément, n'est jamais traité comme le complément", () => {
  assert.equal(decideUpgradeAccess("price_full", "price_upgrade", "free"), "noop");
  assert.equal(decideUpgradeAccess("price_beginner", "price_upgrade", null), "noop");
  assert.equal(decideUpgradeAccess(null, "price_upgrade", "free"), "noop");
  assert.equal(decideUpgradeAccess("price_upgrade", undefined, "free"), "noop");
  assert.equal(decideUpgradeAccess(undefined, undefined, "free"), "noop");
});

test("le webhook consulte le niveau actuel avant d'accorder le complément", async () => {
  const webhook = await readFile("app/api/webhooks/stripe/route.ts", "utf8");
  const decision = webhook.indexOf("decideUpgradeAccess(");
  const persist = webhook.indexOf("await persistProfileTier(");
  assert.ok(decision > 0 && persist > decision, "la décision précède l'écriture du niveau");
  assert.match(webhook, /refuseUpgradePurchase/);
  assert.match(webhook, /refund_failed[\s\S]*status: 500/);
});
