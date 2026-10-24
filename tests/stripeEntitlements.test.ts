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
  assert.match(source, /claim\?\.status === "granted"/);
  assert.match(source, /inferred\?\.priceId === process\.env\.STRIPE_UPGRADE_PRICE_ID/);
  assert.match(source, /source: "upgrade_claim"/);
  assert.match(source, /unresolved_upgrade/);
  assert.match(source, /allow-unresolved/);
  assert.match(source, /markerCounts/);
  assert.match(source, /markerUsers/);
});

test("le ledger expose une transaction de backfill, les marqueurs terminaux et le fallback upgrade", async () => {
  const sql = await readFile("supabase/migrations/20261024101000_stripe_purchase_ledger.sql", "utf8");
  assert.match(sql, /create or replace function public\.backfill_stripe_purchase_ledger\(p_rows jsonb\)/);
  assert.match(sql, /record_stripe_checkout_terminal/);
  assert.match(sql, /status in \('refunded', 'revoked'\)/);
  assert.match(sql, /existing_status = 'granted'[\s\S]*fallback_tier[\s\S]*'beginner'/);
});

test("le chemin upgrade legacy garde le fallback et le même ordre ledger puis profil que le backfill", async () => {
  const sql = await readFile("supabase/migrations/20261024101000_stripe_purchase_ledger.sql", "utf8");
  assert.match(sql, /hashtextextended\(p_user_id::text/);
  assert.match(sql, /fallback_tier = coalesce\(public\.stripe_purchase_ledger\.fallback_tier, excluded\.fallback_tier\)/);
  assert.match(sql, /insert into public\.stripe_purchase_ledger[\s\S]*perform public\.recalculate_stripe_entitlement/);
  assert.doesNotMatch(sql, /select tier into current_tier from public\.profiles where id = p_user_id for update/);
});

test("les droits Stripe hérités sont marqués avant recalcul et restent service-role only", async () => {
  const sql = await readFile("supabase/migrations/20261024101000_stripe_purchase_ledger.sql", "utf8");
  assert.match(sql, /create table if not exists public\.stripe_legacy_entitlements/);
  assert.match(sql, /alter table public\.stripe_legacy_entitlements enable row level security/);
  assert.match(sql, /alter table public\.stripe_legacy_entitlements force row level security/);
  assert.match(sql, /revoke all on table public\.stripe_legacy_entitlements from public, anon, authenticated/);
  assert.match(sql, /grant all on table public\.stripe_legacy_entitlements to service_role/);
  assert.match(sql, /max\(tier_rank\)/);
  assert.match(sql, /insert into public\.stripe_legacy_entitlements[\s\S]*legacy_import[\s\S]*on conflict \(user_id\) do nothing/);
});
