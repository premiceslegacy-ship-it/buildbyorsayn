import assert from "node:assert/strict";
import test from "node:test";
import {
  buildUpgradeCheckoutParams,
  hasAcceptedStripeTerms,
  isPaidCheckoutSession,
  safeStripeCheckoutUrl,
  secureUpgradeUserId,
  STRIPE_UPGRADE_PURCHASE_KIND,
  upgradeCheckoutIdempotencyKey,
} from "../lib/stripeCheckout";
import { processPaidUpgrade, type UpgradeClaimResult } from "../lib/stripeUpgradeProcessing";
import type { RefundRequest } from "../lib/stripeUpgradeRefusal";
import { CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";

const USER_ID = "11111111-1111-4111-8111-111111111111";

function upgradeSession(overrides: Record<string, unknown> = {}) {
  return {
    client_reference_id: USER_ID,
    metadata: {
      build_purchase_kind: STRIPE_UPGRADE_PURCHASE_KIND,
      build_user_id: USER_ID,
    },
    ...overrides,
  } as never;
}

test("le checkout du complément lie côté serveur le compte, le prix et les URLs de retour", () => {
  const params = buildUpgradeCheckoutParams({
    userId: USER_ID,
    userEmail: " Buyer@Example.com ",
    priceId: "price_upgrade",
    siteOrigin: "https://build.example",
  });

  assert.equal(params.client_reference_id, USER_ID);
  assert.equal(params.customer_email, "buyer@example.com");
  assert.deepEqual(params.line_items, [{ price: "price_upgrade", quantity: 1 }]);
  assert.deepEqual(params.metadata, {
    build_purchase_kind: STRIPE_UPGRADE_PURCHASE_KIND,
    build_user_id: USER_ID,
  });
  assert.deepEqual(params.payment_intent_data?.metadata, params.metadata);
  assert.equal(params.success_url, "https://build.example/dashboard?upgrade=success");
  assert.equal(params.cancel_url, "https://build.example/checkout?upgrade=cancelled");
  assert.deepEqual(params.consent_collection, { terms_of_service: "required" });
  assert.deepEqual(params.custom_text?.terms_of_service_acceptance, {
    message: CHECKOUT_CONSENT_TEXT,
  });
});

test("le webhook accepte uniquement la liaison serveur, indépendamment de l'e-mail de facturation", () => {
  assert.equal(secureUpgradeUserId(upgradeSession()), USER_ID);
  assert.equal(secureUpgradeUserId(upgradeSession({ client_reference_id: "22222222-2222-4222-8222-222222222222" })), null);
  assert.equal(secureUpgradeUserId(upgradeSession({ metadata: { build_user_id: USER_ID } })), null);
  assert.equal(secureUpgradeUserId(upgradeSession({ metadata: { build_purchase_kind: STRIPE_UPGRADE_PURCHASE_KIND, build_user_id: "not-a-uuid" } })), null);
});

test("le webhook exige un paiement acquis et le consentement Stripe signé", () => {
  assert.equal(isPaidCheckoutSession({ payment_status: "paid" } as never), true);
  assert.equal(isPaidCheckoutSession({ payment_status: "unpaid" } as never), false);
  assert.equal(
    hasAcceptedStripeTerms({ consent: { terms_of_service: "accepted" } } as never),
    true
  );
  assert.equal(hasAcceptedStripeTerms({ consent: null } as never), false);
});

test("les créations répétées dans la même fenêtre réutilisent la session Stripe", () => {
  const start = 15 * 60 * 1_000 * 100;
  assert.equal(
    upgradeCheckoutIdempotencyKey(USER_ID, start),
    upgradeCheckoutIdempotencyKey(USER_ID, start + 14 * 60 * 1_000)
  );
  assert.notEqual(
    upgradeCheckoutIdempotencyKey(USER_ID, start),
    upgradeCheckoutIdempotencyKey(USER_ID, start + 15 * 60 * 1_000)
  );
});

test("seule une URL de Checkout Stripe peut sortir de la porte serveur", () => {
  assert.equal(safeStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_1"), "https://checkout.stripe.com/c/pay/cs_test_1");
  assert.equal(safeStripeCheckoutUrl("https://buy.stripe.com/payment-link"), null);
  assert.equal(safeStripeCheckoutUrl("https://checkout.stripe.com.evil.test/c/pay/x"), null);
  assert.equal(safeStripeCheckoutUrl("not a url"), null);
});

function paidUpgradeDeps(claim: UpgradeClaimResult | Error) {
  const refunds: RefundRequest[] = [];
  const emails: string[] = [];
  return {
    refunds,
    emails,
    deps: {
      claimUpgrade: async () => {
        if (claim instanceof Error) throw claim;
        return claim;
      },
      createRefund: async (params: RefundRequest) => {
        refunds.push(params);
        return { id: "re_1", status: "succeeded" as const };
      },
      retrieveRefund: async (refundId: string) => ({ id: refundId, status: "succeeded" as const }),
      notifyCustomer: async (email: string) => {
        emails.push(email);
        return true;
      },
      log: () => undefined,
    },
  };
}

const PURCHASE = {
  userId: USER_ID,
  sessionId: "cs_upgrade_1",
  paymentIntent: "pi_1",
  customerEmail: "billing@example.com",
};

test("un claim accordé ou déjà traité ne rembourse jamais le paiement", async () => {
  for (const claim of ["granted", "duplicate"] as const) {
    const fixture = paidUpgradeDeps(claim);
    assert.deepEqual(await processPaidUpgrade(fixture.deps, PURCHASE), { outcome: claim });
    assert.equal(fixture.refunds.length, 0);
    assert.equal(fixture.emails.length, 0);
  }
});

test("une seconde session payée après la transition est remboursée de façon idempotente", async () => {
  const fixture = paidUpgradeDeps("refuse");
  assert.deepEqual(await processPaidUpgrade(fixture.deps, PURCHASE), { outcome: "refunded" });
  assert.equal(fixture.refunds.length, 1);
  assert.equal(fixture.refunds[0].payment_intent, "pi_1");
  assert.deepEqual(fixture.emails, ["billing@example.com"]);
});

test("un conflit d'identité ou une panne du claim échoue sans rembourser un paiement ambigu", async () => {
  for (const claim of ["conflict", new Error("db unavailable")] as const) {
    const fixture = paidUpgradeDeps(claim);
    assert.deepEqual(await processPaidUpgrade(fixture.deps, PURCHASE), { outcome: "claim_failed" });
    assert.equal(fixture.refunds.length, 0);
  }
});
