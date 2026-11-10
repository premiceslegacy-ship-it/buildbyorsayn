import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { GoTrueClient, AuthSessionMissingError, type SupabaseClient } from "@supabase/supabase-js";
import { initializePasswordSession } from "../lib/auth/passwordSession";

const userId = "11111111-1111-4111-8111-111111111111";
const accessToken = [
  { alg: "HS256", typ: "JWT" },
  { sub: userId, exp: 4102444800, aud: "authenticated", role: "authenticated" },
].map((part) => Buffer.from(JSON.stringify(part)).toString("base64url")).join(".") + ".diagnostic";
const user = { id: userId, aud: "authenticated", role: "authenticated", email: "activation@example.test", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" };

function fixture(t: TestContext, hash = "", reject = false) {
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const url = new URL(`https://build.example/update-password${hash}`);
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { href: url.href }, addEventListener() {}, removeEventListener() {} } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { visibilityState: "visible", addEventListener() {}, removeEventListener() {} } });
  const requests: Array<{ method: string; password?: string }> = [];
  let cleared = false;
  const auth = new GoTrueClient({
    url: "https://provider.example/auth/v1", flowType: "pkce", detectSessionInUrl: true,
    persistSession: false, autoRefreshToken: false, storageKey: t.name,
    fetch: async (input, init) => {
      assert.equal(cleared, true, "credentials must leave the URL before provider access");
      assert.equal(String(input), "https://provider.example/auth/v1/user");
      assert.equal(new Headers(init?.headers).get("Authorization"), `Bearer ${accessToken}`);
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      requests.push({ method: init?.method ?? "GET", ...(body.password ? { password: body.password } : {}) });
      return Response.json(reject ? { code: "bad_jwt", message: "Rejected token" } : user, {
        status: reject ? 401 : 200, headers: { "X-Supabase-Api-Version": "2024-01-01" },
      });
    },
  });
  t.after(async () => {
    await auth.stopAutoRefresh();
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window");
    if (oldDocument) Object.defineProperty(globalThis, "document", oldDocument); else Reflect.deleteProperty(globalThis, "document");
  });
  return { client: { auth } as SupabaseClient, auth, url, requests, clear: () => { cleared = true; }, wasCleared: () => cleared };
}

for (const type of ["invite", "recovery"]) {
  test(`a ${type} link establishes a session before the password update despite shared PKCE mode`, async (t) => {
    const f = fixture(t, `#access_token=${accessToken}&refresh_token=local-refresh&type=${type}`);
    assert.equal((await f.auth.initialize()).error?.name, "AuthPKCEGrantCodeExchangeError");
    await initializePasswordSession(f.client, f.url, f.clear);
    const { error } = await f.auth.updateUser({ password: "UniquePassword42" });
    assert.equal(error, null);
    assert.deepEqual(f.requests, [{ method: "GET" }, { method: "PUT", password: "UniquePassword42" }]);
    assert.equal((await f.auth.getSession()).data.session?.user.id, userId);
    // Normal recovery-code sessions survive navigation without another URL token.
    await initializePasswordSession(f.client, new URL("https://build.example/update-password"), () => assert.fail("No fragment to clear"));
  });
}

test("a page opened without a session cannot change a password", async (t) => {
  const f = fixture(t);
  await assert.rejects(initializePasswordSession(f.client, f.url, f.clear), AuthSessionMissingError);
  assert.deepEqual(f.requests, []);
  assert.equal(f.wasCleared(), false);
});

test("an expired provider link is cleared and rejected without granting a session", async (t) => {
  const f = fixture(t, "#error=access_denied&error_code=otp_expired&error_description=private");
  await assert.rejects(initializePasswordSession(f.client, f.url, f.clear), { code: "otp_expired" });
  assert.equal(f.wasCleared(), true);
  assert.equal((await f.auth.getSession()).data.session, null);
  assert.deepEqual(f.requests, []);
});

test("a rejected token cannot enable a password update", async (t) => {
  const f = fixture(t, `#access_token=${accessToken}&refresh_token=local-refresh&type=invite`, true);
  await assert.rejects(initializePasswordSession(f.client, f.url, f.clear), { code: "bad_jwt" });
  assert.equal((await f.auth.updateUser({ password: "UniquePassword42" })).error?.name, "AuthSessionMissingError");
  assert.deepEqual(f.requests, [{ method: "GET" }]);
});

test("partial or unrelated callback credentials cannot grant a session", async (t) => {
  const f = fixture(t, `#access_token=${accessToken}&type=invite`);
  await assert.rejects(initializePasswordSession(f.client, f.url, f.clear), AuthSessionMissingError);
  assert.equal(f.wasCleared(), true);
  assert.deepEqual(f.requests, []);
});
