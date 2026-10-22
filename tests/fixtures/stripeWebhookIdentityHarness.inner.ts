import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

type RefundCall = {
  params: { payment_intent: string; metadata: Record<string, string> };
  options: { idempotencyKey: string };
};

const refundCalls: RefundCall[] = [];
let refundStatus = "succeeded";
let supabaseDataTouched = false;

class FakeStripe {
  webhooks = {
    constructEvent: () => ({
      type: "checkout.session.completed",
      created: 1_800_000_000,
      data: {
        object: {
          id: "cs_missing_identity",
          payment_status: "paid",
          payment_intent: "pi_missing_identity",
          client_reference_id: "not-a-valid-reference",
          customer_details: { email: null },
          consent: { terms_of_service: "accepted" },
          amount_total: 9_700,
        },
      },
    }),
  };
  checkout = {
    sessions: {
      listLineItems: async () => ({ data: [{ price: { id: "price_beginner" } }] }),
    },
  };
  refunds = {
    create: async (params: RefundCall["params"], options: RefundCall["options"]) => {
      refundCalls.push({ params, options });
      return { id: "re_missing_identity", status: refundStatus };
    },
    retrieve: async () => ({ id: "re_missing_identity", status: refundStatus }),
  };
}

mock.module("stripe", { defaultExport: FakeStripe });
mock.module("next/cache", { namedExports: { revalidatePath: () => undefined } });
mock.module("@supabase/supabase-js", {
  namedExports: {
    createClient: () => ({
      get auth() { supabaseDataTouched = true; return {}; },
      from() { supabaseDataTouched = true; return {}; },
      rpc() { supabaseDataTouched = true; return {}; },
    }),
  },
});

process.env.STRIPE_SECRET_KEY = "sk_test_local";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_local";
process.env.STRIPE_BEGINNER_PRICE_ID = "price_beginner";
process.env.STRIPE_FULL_PRICE_ID = "price_full";
process.env.STRIPE_UPGRADE_PRICE_ID = "price_upgrade";
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:1";
process.env.SUPABASE_SERVICE_ROLE_KEY = "local-test-key";

const file = (path: string) => pathToFileURL(resolve(path)).href;
const { NextRequest } = await import("next/server");
const { POST } = await import(file("app/api/webhooks/stripe/route.ts"));

function request() {
  return new NextRequest("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "local-signature", "content-type": "application/json" },
    body: "{}",
  });
}

test("email nul et référence invalide remboursent sans attribuer d'accès", async () => {
  refundStatus = "succeeded";
  refundCalls.length = 0;
  supabaseDataTouched = false;
  const response = await POST(request());
  assert.equal(response.status, 200);
  assert.equal(supabaseDataTouched, false);
  assert.equal(refundCalls.length, 1);
  assert.equal(refundCalls[0].params.payment_intent, "pi_missing_identity");
  assert.equal(refundCalls[0].params.metadata.refused_reason, "missing_customer_identity");
  assert.equal(refundCalls[0].options.idempotencyKey, "missing_customer_identity-cs_missing_identity");
});

test("le webhook répond 500 tant que le remboursement d'identité manquante n'est pas confirmé", async () => {
  refundStatus = "pending";
  refundCalls.length = 0;
  supabaseDataTouched = false;
  const response = await POST(request());
  assert.equal(response.status, 500);
  assert.equal(supabaseDataTouched, false);
  assert.equal(refundCalls.length, 1);
});
