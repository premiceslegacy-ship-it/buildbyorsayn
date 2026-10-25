import assert from "node:assert/strict";
import test from "node:test";
import { resolveUpgradeRedirect } from "../lib/checkoutUpgrade";
import { refuseUpgradePurchase, type RefundRequest } from "../lib/stripeUpgradeRefusal";

const STRIPE = "https://checkout.stripe.com/c/pay/cs_test_123";

test("non connecté : connexion puis retour à la porte du complément", () => {
  assert.equal(
    resolveUpgradeRedirect({ authenticated: false, tier: null, upgradeUrl: null }),
    "/login?next=%2Fcheckout%2Fupgrade",
  );
});

test("compte Fondations : le lien Stripe du complément, ou une page honnête si le lien manque", () => {
  assert.equal(resolveUpgradeRedirect({ authenticated: true, tier: "beginner", upgradeUrl: STRIPE }), STRIPE);
  assert.equal(
    resolveUpgradeRedirect({ authenticated: true, tier: "beginner", upgradeUrl: null }),
    "/checkout?upgrade=indisponible",
  );
});

test("accès complet ou admin : retour au tableau de bord, jamais de paiement", () => {
  for (const tier of ["full", "admin"]) {
    assert.equal(resolveUpgradeRedirect({ authenticated: true, tier, upgradeUrl: STRIPE }), "/dashboard", tier);
  }
});

test("tout autre niveau est refusé et renvoyé vers Fondations ou LE COFFRE, même avec un lien prêt", () => {
  for (const tier of [null, undefined, "free", "preview", "inconnu", ""]) {
    assert.equal(
      resolveUpgradeRedirect({ authenticated: true, tier, upgradeUrl: STRIPE }),
      "/checkout?from=upgrade",
      String(tier),
    );
  }
});

test("erreur de lecture du profil : jamais le lien du complément", () => {
  for (const tier of [null, "beginner", "full"]) {
    const target = resolveUpgradeRedirect({ authenticated: true, profileError: true, tier, upgradeUrl: STRIPE });
    assert.equal(target, "/checkout");
    assert.equal(target.includes("stripe.com"), false);
  }
});

function fakeDeps(options: {
  refundFails?: boolean;
  emailFails?: boolean;
  refundStatus?: "pending" | "requires_action" | "succeeded" | "failed" | "canceled" | null;
  refreshedRefundStatus?: "pending" | "requires_action" | "succeeded" | "failed" | "canceled" | null;
} = {}) {
  const refunds: { params: RefundRequest; idempotencyKey: string }[] = [];
  const emails: string[] = [];
  const logs: string[] = [];
  return {
    refunds,
    emails,
    logs,
    deps: {
      createRefund: async (params: RefundRequest, opts: { idempotencyKey: string }) => {
        if (options.refundFails) throw new Error("stripe down");
        refunds.push({ params, idempotencyKey: opts.idempotencyKey });
        return {
          id: "re_1",
          status: options.refundStatus === undefined ? "succeeded" : options.refundStatus,
        };
      },
      retrieveRefund: async (refundId: string) => ({
        id: refundId,
        status: options.refreshedRefundStatus === undefined
          ? (options.refundStatus === undefined ? "succeeded" : options.refundStatus)
          : options.refreshedRefundStatus,
      }),
      notifyCustomer: async (email: string) => {
        if (options.emailFails) throw new Error("resend down");
        emails.push(email);
        return true;
      },
      log: (m: string) => logs.push(m),
    },
  };
}

test("complément refusé : un seul remboursement idempotent, motif clair, e-mail au client", async () => {
  const f = fakeDeps();
  const result = await refuseUpgradePurchase(f.deps, { sessionId: "cs_1", paymentIntent: "pi_1", customerEmail: "a@b.fr" });
  assert.deepEqual(result, { outcome: "refunded" });
  assert.equal(f.refunds.length, 1);
  assert.equal(f.refunds[0].params.payment_intent, "pi_1");
  assert.equal(f.refunds[0].params.reason, "requested_by_customer");
  assert.equal(f.refunds[0].params.metadata.refused_reason, "upgrade_requires_fondations");
  assert.equal(f.refunds[0].idempotencyKey, "upgrade-refused-cs_1");
  assert.deepEqual(f.emails, ["a@b.fr"]);
});

test("payment_intent donné sous forme d'objet : le même remboursement", async () => {
  const f = fakeDeps();
  await refuseUpgradePurchase(f.deps, { sessionId: "cs_2", paymentIntent: { id: "pi_2" }, customerEmail: null });
  assert.equal(f.refunds[0].params.payment_intent, "pi_2");
  assert.deepEqual(f.emails, [], "sans adresse, aucun e-mail");
});

test("sans payment_intent : rien n'est remboursé, c'est journalisé", async () => {
  const f = fakeDeps();
  const result = await refuseUpgradePurchase(f.deps, { sessionId: "cs_3", paymentIntent: null, customerEmail: "a@b.fr" });
  assert.deepEqual(result, { outcome: "no_payment_intent" });
  assert.equal(f.refunds.length, 0);
  assert.equal(f.emails.length, 0);
  assert.equal(f.logs.length, 1);
});

test("remboursement en échec : résultat refund_failed (le webhook répond 500 pour que Stripe réessaie), pas d'e-mail", async () => {
  const f = fakeDeps({ refundFails: true });
  const result = await refuseUpgradePurchase(f.deps, { sessionId: "cs_4", paymentIntent: "pi_4", customerEmail: "a@b.fr" });
  assert.deepEqual(result, { outcome: "refund_failed" });
  assert.equal(f.emails.length, 0);
});

test("un remboursement non final n'est pas annoncé comme réussi et conserve le retry du webhook", async () => {
  for (const refundStatus of ["pending", "requires_action", null] as const) {
    const f = fakeDeps({ refundStatus });
    const result = await refuseUpgradePurchase(f.deps, {
      sessionId: "cs_pending",
      paymentIntent: "pi_pending",
      customerEmail: "a@b.fr",
    });
    assert.deepEqual(result, { outcome: "refund_pending" });
    assert.equal(f.emails.length, 0);
  }
});

test("e-mail en échec : le remboursement reste acquis", async () => {
  const f = fakeDeps({ emailFails: true });
  const result = await refuseUpgradePurchase(f.deps, { sessionId: "cs_5", paymentIntent: "pi_5", customerEmail: "a@b.fr" });
  assert.deepEqual(result, { outcome: "refunded" });
  assert.equal(f.refunds.length, 1);
});

test("un retry rafraîchit le remboursement idempotent avant d'envoyer la confirmation", async () => {
  const f = fakeDeps({ refundStatus: "pending", refreshedRefundStatus: "succeeded" });
  const result = await refuseUpgradePurchase(f.deps, {
    sessionId: "cs_settled",
    paymentIntent: "pi_settled",
    customerEmail: "a@b.fr",
  });
  assert.deepEqual(result, { outcome: "refunded" });
  assert.deepEqual(f.emails, ["a@b.fr"]);
});
