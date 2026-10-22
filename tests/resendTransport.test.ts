import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import {
  MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS,
  adminBroadcastIdempotencyKey,
  sendAdminBroadcast,
  sendResendMessage,
  stripeEmailIdempotencyKey,
} from "../lib/resendTransport";

const MESSAGE = {
  apiKey: "test-api-key",
  from: "BUILD <build@example.com>",
  to: "buyer@example.com",
  subject: "Confirmation",
  html: "<p>Confirmé</p>",
  text: "Confirmé",
  idempotencyKey: stripeEmailIdempotencyKey("purchase-confirmation", "cs_test_123"),
};

test("Resend reçoit une clé d'idempotence stable et un délai d'annulation", async () => {
  let request: RequestInit | undefined;
  const ok = await sendResendMessage(MESSAGE, {
    fetch: (async (_input, init) => {
      request = init;
      return new Response(null, { status: 202 });
    }) as typeof fetch,
  });

  assert.equal(ok, true);
  assert.equal(new Headers(request?.headers).get("Idempotency-Key"), "stripe-purchase-confirmation-cs_test_123");
  assert.ok(request?.signal instanceof AbortSignal);
  assert.equal(request?.signal?.aborted, false);
});

test("un transport Resend bloqué est annulé et le webhook peut continuer", async () => {
  let observedSignal: AbortSignal | null = null;
  const ok = await sendResendMessage(MESSAGE, {
    timeoutMs: 10,
    log: () => undefined,
    fetch: (async (_input, init) => {
      observedSignal = init?.signal ?? null;
      await delay(1_000, undefined, { signal: init?.signal });
      return new Response(null, { status: 202 });
    }) as typeof fetch,
  });

  assert.equal(ok, false);
  assert.equal(observedSignal?.aborted, true);
});

test("chaque type d'e-mail et chaque session obtient une clé différente", () => {
  const keys = new Set([
    stripeEmailIdempotencyKey("welcome", "cs_1"),
    stripeEmailIdempotencyKey("upgrade-refused", "cs_1"),
    stripeEmailIdempotencyKey("purchase-confirmation", "cs_1"),
    stripeEmailIdempotencyKey("purchase-confirmation", "cs_2"),
  ]);
  assert.equal(keys.size, 4);
});

test("une campagne conserve une clé propre à chaque destinataire quand son audience évolue", async () => {
  const campaignId = "94bc69dd-1df4-4ce4-815f-1cbb92ad1f55";
  const firstAttempt = [
    { id: "08f61666-dca3-4db8-ad69-7ae09e66d8c7", email: "first@example.com" },
    { id: "3bc253ad-502b-4879-ad67-f87ba74d9af3", email: "retained@example.com" },
  ];
  const retry = [
    { id: "3bc253ad-502b-4879-ad67-f87ba74d9af3", email: "retained@example.com" },
    { id: "81c2219d-dd2c-44c8-8376-396b93eae12c", email: "added@example.com" },
  ];
  const observed = new Map<string, string[]>();
  const fetchImpl = (async (_input, init) => {
    const payload: unknown = JSON.parse(String(init?.body));
    assert.ok(payload && typeof payload === "object" && "to" in payload);
    assert.ok(Array.isArray(payload.to) && typeof payload.to[0] === "string");
    const email = payload.to[0];
    const key = new Headers(init?.headers).get("Idempotency-Key");
    assert.ok(key);
    observed.set(email, [...(observed.get(email) ?? []), key]);
    return new Response(null, { status: 202 });
  }) as typeof fetch;
  const base = {
    apiKey: "test-api-key",
    from: "BUILD <build@example.com>",
    campaignId,
    subject: "Annonce",
    html: "<p>Annonce</p>",
    text: "Annonce",
  };

  assert.equal((await sendAdminBroadcast({ ...base, recipients: firstAttempt }, { fetch: fetchImpl })).ok, true);
  assert.equal((await sendAdminBroadcast({ ...base, recipients: retry }, { fetch: fetchImpl })).ok, true);

  const retainedKeys = observed.get("retained@example.com");
  assert.deepEqual(retainedKeys, [
    adminBroadcastIdempotencyKey(campaignId, retry[0].id),
    adminBroadcastIdempotencyKey(campaignId, retry[0].id),
  ]);
  assert.notEqual(
    observed.get("first@example.com")?.[0],
    observed.get("added@example.com")?.[0],
  );
});

test("une audience au-dessus du plafond synchrone est refusée avant tout appel Resend", async () => {
  let calls = 0;
  const recipients = Array.from(
    { length: MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS + 1 },
    (_, index) => ({ id: `user-${index}`, email: `user-${index}@example.com` }),
  );
  const result = await sendAdminBroadcast({
    apiKey: "test-api-key",
    from: "BUILD <build@example.com>",
    campaignId: "campaign",
    recipients,
    subject: "Annonce",
    html: "<p>Annonce</p>",
    text: "Annonce",
  }, {
    fetch: (async () => {
      calls += 1;
      return new Response(null, { status: 202 });
    }) as typeof fetch,
  });

  assert.deepEqual(result, {
    ok: false,
    accepted: 0,
    total: MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS + 1,
    reason: "too_large",
  });
  assert.equal(calls, 0);
});

test("un échec partiel rapporte exactement les acceptations confirmées", async () => {
  let calls = 0;
  const result = await sendAdminBroadcast({
    apiKey: "test-api-key",
    from: "BUILD <build@example.com>",
    campaignId: "campaign",
    recipients: [
      { id: "user-1", email: "one@example.com" },
      { id: "user-2", email: "two@example.com" },
    ],
    subject: "Annonce",
    html: "<p>Annonce</p>",
    text: "Annonce",
  }, {
    log: () => undefined,
    fetch: (async () => {
      calls += 1;
      return new Response(null, { status: calls === 1 ? 202 : 503 });
    }) as typeof fetch,
  });

  assert.deepEqual(result, {
    ok: false,
    accepted: 1,
    total: 2,
    reason: "provider_error",
  });
  assert.equal(calls, 2);
});

test("les appels d'un broadcast partagent un délai global", async () => {
  const signals = new Set<AbortSignal>();
  const result = await sendAdminBroadcast({
    apiKey: "test-api-key",
    from: "BUILD <build@example.com>",
    campaignId: "campaign",
    recipients: [
      { id: "user-1", email: "one@example.com" },
      { id: "user-2", email: "two@example.com" },
    ],
    subject: "Annonce",
    html: "<p>Annonce</p>",
    text: "Annonce",
  }, {
    timeoutMs: 10,
    log: () => undefined,
    fetch: (async (_input, init) => {
      const signal = init?.signal;
      assert.ok(signal);
      signals.add(signal);
      await delay(1_000, undefined, { signal });
      return new Response(null, { status: 202 });
    }) as typeof fetch,
  });

  assert.equal(result.ok, false);
  assert.equal(result.accepted, 0);
  assert.equal(signals.size, 1);
  assert.equal([...signals][0]?.aborted, true);
});
