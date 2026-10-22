import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";
import RealStripe from "stripe";

// La vérification de signature est celle du vrai SDK Stripe : seuls les appels réseau sont remplacés.
const SECRET = "whsec_signature_test";
const UPGRADE_USER = "11111111-1111-4111-8111-111111111111";
const OTHER_USER = "22222222-2222-4222-8222-222222222222";

const refundKeys: string[] = [];
const rpcCalls: Array<{ fn: string; args: Record<string, string> }> = [];
let rpcResult = "granted";
let touchedProfiles = 0;
let priceForSession: Record<string, string> = {};

class StubbedStripe extends RealStripe {
  constructor(key: string) {
    super(key);
    this.checkout.sessions.listLineItems = (async (id: string) => ({
      data: priceForSession[id] ? [{ price: { id: priceForSession[id] } }] : [],
    })) as never;
    this.refunds.create = (async (params: { payment_intent: string }, options: { idempotencyKey: string }) => {
      refundKeys.push(options.idempotencyKey);
      return { id: `re_${params.payment_intent}`, status: "succeeded" };
    }) as never;
    this.refunds.retrieve = (async (id: string) => ({ id, status: "succeeded" })) as never;
  }
}

mock.module("stripe", { defaultExport: StubbedStripe });
mock.module("next/cache", { namedExports: { revalidatePath: () => undefined } });
mock.module("@supabase/supabase-js", {
  namedExports: {
    createClient: () => ({
      auth: { admin: {} },
      from() { touchedProfiles += 1; throw new Error("profiles must not be touched"); },
      rpc(fn: string, args: Record<string, string>) { rpcCalls.push({ fn, args }); return Promise.resolve({ data: rpcResult, error: null }); },
    }),
  },
});

process.env.STRIPE_SECRET_KEY = "sk_test_local";
process.env.STRIPE_WEBHOOK_SECRET = SECRET;
process.env.STRIPE_BEGINNER_PRICE_ID = "price_beginner";
process.env.STRIPE_FULL_PRICE_ID = "price_full";
process.env.STRIPE_UPGRADE_PRICE_ID = "price_upgrade";
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:1";
process.env.SUPABASE_SERVICE_ROLE_KEY = "local-test-key";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
delete process.env.RESEND_API_KEY;

const file = (path: string) => pathToFileURL(resolve(path)).href;
const { NextRequest } = await import("next/server");
const { POST } = await import(file("app/api/webhooks/stripe/route.ts"));
const signer = new RealStripe("sk_test_local");

type SessionOverrides = Record<string, unknown>;
function eventBody(sessionId: string, overrides: SessionOverrides = {}): string {
  return JSON.stringify({
    id: `evt_${sessionId}`,
    object: "event",
    type: "checkout.session.completed",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: sessionId,
        object: "checkout.session",
        payment_status: "paid",
        payment_intent: `pi_${sessionId}`,
        consent: { terms_of_service: "accepted" },
        customer_details: { email: "buyer@example.test" },
        client_reference_id: UPGRADE_USER,
        metadata: { build_purchase_kind: "build_upgrade", build_user_id: UPGRADE_USER },
        ...overrides,
      },
    },
  });
}

function signed(body: string, options: { secret?: string; timestamp?: number } = {}) {
  const header = signer.webhooks.generateTestHeaderString({ payload: body, secret: options.secret ?? SECRET, timestamp: options.timestamp });
  return new NextRequest("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": header, "content-type": "application/json" },
    body,
  });
}

function reset() {
  refundKeys.length = 0;
  rpcCalls.length = 0;
  touchedProfiles = 0;
  rpcResult = "granted";
  priceForSession = {};
}

test("signatures refusées : absente, autre secret, corps modifié, trop ancienne : aucun effet de bord", async () => {
  reset();
  priceForSession.cs_sig = "price_upgrade";
  const body = eventBody("cs_sig");
  const noHeader = await POST(new NextRequest("http://localhost/api/webhooks/stripe", { method: "POST", body }));
  assert.equal(noHeader.status, 400);
  assert.equal((await POST(signed(body, { secret: "whsec_other_secret" }))).status, 400);
  const tampered = signed(body).headers.get("stripe-signature") as string;
  const tamperedRequest = new NextRequest("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": tampered },
    body: body.replace("buyer@example.test", "attacker@example.test"),
  });
  assert.equal((await POST(tamperedRequest)).status, 400);
  const tenMinutesAgo = Math.floor(Date.now() / 1000) - 600;
  assert.equal((await POST(signed(body, { timestamp: tenMinutesAgo }))).status, 400);
  assert.deepEqual({ rpc: rpcCalls.length, refunds: refundKeys.length, profiles: touchedProfiles }, { rpc: 0, refunds: 0, profiles: 0 });
});

test("un événement correctement signé et récent atteint la base une seule fois par livraison", async () => {
  reset();
  priceForSession.cs_ok = "price_upgrade";
  const response = await POST(signed(eventBody("cs_ok")));
  assert.equal(response.status, 200);
  assert.deepEqual(rpcCalls, [{ fn: "apply_stripe_upgrade", args: { p_user_id: UPGRADE_USER, p_checkout_session_id: "cs_ok" } }]);
  assert.equal(refundKeys.length, 0);
});

test("livraison en double : la base répond duplicate, aucun remboursement ni second accès", async () => {
  reset();
  priceForSession.cs_dup = "price_upgrade";
  rpcResult = "duplicate";
  assert.equal((await POST(signed(eventBody("cs_dup")))).status, 200);
  assert.equal(refundKeys.length, 0);
});

test("compte sans Fondations (la base refuse) : remboursement avec clé d'idempotence stable, rejeu identique", async () => {
  reset();
  priceForSession.cs_free = "price_upgrade";
  rpcResult = "refuse";
  assert.equal((await POST(signed(eventBody("cs_free")))).status, 200);
  assert.equal((await POST(signed(eventBody("cs_free")))).status, 200);
  assert.deepEqual(refundKeys, ["upgrade-refused-cs_free", "upgrade-refused-cs_free"]);
});

test("identité du complément incohérente ou absente : remboursé sans jamais interroger la base", async () => {
  const cases: Array<[string, SessionOverrides]> = [
    ["cs_mismatch", { client_reference_id: OTHER_USER }],
    ["cs_noreference", { client_reference_id: null }],
    ["cs_nometadata", { metadata: {} }],
    ["cs_badkind", { metadata: { build_purchase_kind: "other", build_user_id: UPGRADE_USER } }],
    ["cs_baduuid", { client_reference_id: "pas-un-uuid", metadata: { build_purchase_kind: "build_upgrade", build_user_id: "pas-un-uuid" } }],
  ];
  for (const [id, overrides] of cases) {
    reset();
    priceForSession[id] = "price_upgrade";
    assert.equal((await POST(signed(eventBody(id, overrides)))).status, 200, id);
    assert.deepEqual(rpcCalls, [], id);
    assert.deepEqual(refundKeys, [`upgrade-refused-${id}`], id);
  }
});

test("consentement CGV absent ou prix inconnu : remboursé, jamais d'accès", async () => {
  reset();
  priceForSession.cs_terms = "price_upgrade";
  assert.equal((await POST(signed(eventBody("cs_terms", { consent: null })))).status, 200);
  priceForSession.cs_price = "price_inconnu";
  assert.equal((await POST(signed(eventBody("cs_price")))).status, 200);
  assert.equal((await POST(signed(eventBody("cs_noprice")))).status, 200);
  assert.deepEqual(refundKeys, ["missing_terms_consent-cs_terms", "unknown_price-cs_price", "unknown_price-cs_noprice"]);
  assert.deepEqual({ rpc: rpcCalls.length, profiles: touchedProfiles }, { rpc: 0, profiles: 0 });
});

test("session non payée : ignorée sans appel Stripe ni base", async () => {
  reset();
  assert.equal((await POST(signed(eventBody("cs_unpaid", { payment_status: "unpaid" })))).status, 200);
  assert.deepEqual({ rpc: rpcCalls.length, refunds: refundKeys.length, profiles: touchedProfiles }, { rpc: 0, refunds: 0, profiles: 0 });
});
