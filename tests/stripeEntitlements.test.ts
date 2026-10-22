import assert from "node:assert/strict";
import test from "node:test";
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
