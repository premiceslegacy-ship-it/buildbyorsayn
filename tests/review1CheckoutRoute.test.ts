import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

if (process.env.REVIEW1_CHECKOUT_INNER !== "1") {
  test("la route du complément s'arrête avant Supabase et Stripe pour une navigation non fiable", () => {
    const result = spawnSync(process.execPath, [
      "--import", "tsx",
      "--experimental-test-module-mocks",
      "--test",
      "tests/review1CheckoutRoute.test.ts",
    ], {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "test", REVIEW1_CHECKOUT_INNER: "1" },
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  });
} else {
  const file = (path: string) => pathToFileURL(resolve(path)).href;
  const USER_ID = "123e4567-e89b-42d3-a456-426614174000";
  let clientCalls = 0;
  let stripeCalls = 0;

  mock.module(file("lib/supabase/server.ts"), {
    namedExports: {
      createClient: async () => {
        clientCalls += 1;
        const query = {
          select() { return query; },
          eq() { return query; },
          async maybeSingle() { return { data: { tier: "beginner" }, error: null }; },
        };
        return {
          auth: { getUser: async () => ({ data: { user: { id: USER_ID, email: "client@example.test" } }, error: null }) },
          from: () => query,
        };
      },
    },
  });
  mock.module("stripe", {
    defaultExport: class FakeStripe {
      checkout = { sessions: { create: async () => {
        stripeCalls += 1;
        return { url: "https://checkout.stripe.com/c/pay/cs_test_review1" };
      } } };
    },
  });

  process.env.STRIPE_SECRET_KEY = "sk_test_local";
  process.env.STRIPE_UPGRADE_PRICE_ID = "price_local";
  process.env.NEXT_PUBLIC_APP_URL = "https://build.example";
  const { GET } = await import("../app/checkout/upgrade/route");
  const navigation = (site: string, purpose?: string) => new Request("https://build.example/checkout/upgrade", {
    headers: {
      "sec-fetch-site": site,
      "sec-fetch-mode": "navigate",
      "sec-fetch-dest": "document",
      ...(purpose ? { purpose } : {}),
    },
  });

  test("navigation externe et préchargement ne touchent ni la session ni Stripe", async () => {
    for (const request of [navigation("cross-site"), navigation("same-origin", "prefetch")]) {
      const response = await GET(request);
      assert.equal(response.status, 303);
      assert.equal(response.headers.get("location"), "/checkout");
    }
    assert.equal(clientCalls, 0);
    assert.equal(stripeCalls, 0);
  });

  test("une navigation documentaire même origine peut créer la session du compte Fondations", async () => {
    const response = await GET(navigation("same-origin"));
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "https://checkout.stripe.com/c/pay/cs_test_review1");
    assert.equal(clientCalls, 1);
    assert.equal(stripeCalls, 1);
  });
}
