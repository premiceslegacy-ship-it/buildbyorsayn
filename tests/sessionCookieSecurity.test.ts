import assert from "node:assert/strict";
import test from "node:test";
import { secureSessionCookie } from "../lib/supabase/cookieSecurity";

test("cookies de session : Secure sur le déploiement, options Supabase conservées", () => {
  const options = { path: "/", sameSite: "lax" as const, maxAge: 34_560_000, httpOnly: false };
  assert.deepEqual(secureSessionCookie(options, true), { ...options, secure: true });
  assert.deepEqual(secureSessionCookie(undefined, true), { secure: true });
});

test("cookies de session : rien d'ajouté en local (Safari refuse Secure sur http://127.0.0.1)", () => {
  const options = { path: "/", sameSite: "lax" as const };
  assert.deepEqual(secureSessionCookie(options, false), options);
  assert.equal(secureSessionCookie(undefined, false).secure, undefined);
});
