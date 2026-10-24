import assert from "node:assert/strict";
import test from "node:test";
import { claimVerifiedStripePurchases } from "../lib/stripeClaim";

type Call = { name: string; args: Record<string, unknown> };

function fakeAdmin(quota: unknown, claimed: unknown, quotaError: Error | null = null) {
  const calls: Call[] = [];
  return {
    calls,
    rpc: async (name: string, args: Record<string, unknown>) => {
      calls.push({ name, args });
      if (name === "check_mcp_rate_limit") return { data: quota, error: quotaError };
      return { data: claimed, error: null };
    },
  };
}

test("le claim Stripe est poivré et quota avant la RPC d'attribution", async () => {
  const original = process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER;
  process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER = "local-test-pepper-1234";
  try {
    const admin = fakeAdmin(true, 2);
    const result = await claimVerifiedStripePurchases(admin as never, {
      userId: "11111111-1111-4111-8111-111111111111",
      email: "buyer@example.test",
    });
    assert.deepEqual(result, { decision: "allowed", claimed: 2 });
    assert.deepEqual(admin.calls.map((call) => call.name), [
      "check_mcp_rate_limit",
      "claim_stripe_purchase_for_verified_email",
    ]);
    assert.notEqual(admin.calls[0].args.p_subject, "11111111-1111-4111-8111-111111111111");
  } finally {
    if (original === undefined) delete process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER;
    else process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER = original;
  }
});

test("un quota refusé ne révèle pas l'état d'un achat", async () => {
  const original = process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER;
  process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER = "local-test-pepper-1234";
  try {
    const admin = fakeAdmin(false, 2);
    const result = await claimVerifiedStripePurchases(admin as never, {
      userId: "11111111-1111-4111-8111-111111111111",
      email: "buyer@example.test",
    });
    assert.deepEqual(result, { decision: "denied", claimed: 0 });
    assert.deepEqual(admin.calls.map((call) => call.name), ["check_mcp_rate_limit"]);
  } finally {
    if (original === undefined) delete process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER;
    else process.env.STRIPE_CLAIM_RATE_LIMIT_PEPPER = original;
  }
});
