import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  determineStripeTier,
  escapeIlikePattern,
  emailsMatch,
  isUuid,
  referenceMatchesProfile,
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

test("le backfill ne rattache une référence qu'avec un e-mail Auth confirmé identique à Stripe", async () => {
  const source = await readFile("scripts/backfill-stripe-ledger.ts", "utf8");
  assert.match(source, /user\?\.email_confirmed_at/);
  assert.match(source, /user\.email\?\.trim\(\)\.toLowerCase\(\) === normalizedEmail/);
  assert.match(source, /candidate\.email_confirmed_at/);
});

test("le fallback du backfill vient des claims d'upgrade accordées et non du tier courant", async () => {
  const source = await readFile("scripts/backfill-stripe-ledger.ts", "utf8");
  assert.match(source, /stripe_upgrade_claims/);
  assert.match(source, /status", "granted"/);
  assert.match(source, /inferred\?\.priceId === process\.env\.STRIPE_UPGRADE_PRICE_ID/);
  assert.doesNotMatch(source, /loadProfileTiers/);
});

test("le ledger expose une transaction de backfill, les marqueurs terminaux et le fallback upgrade", async () => {
  const sql = await readFile("supabase/migrations/20261024101000_stripe_purchase_ledger.sql", "utf8");
  assert.match(sql, /create or replace function public\.backfill_stripe_purchase_ledger\(p_rows jsonb\)/);
  assert.match(sql, /record_stripe_checkout_terminal/);
  assert.match(sql, /status in \('refunded', 'revoked'\)/);
  assert.match(sql, /existing_status = 'granted'[\s\S]*fallback_tier[\s\S]*'beginner'/);
});
