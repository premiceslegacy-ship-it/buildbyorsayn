import assert from "node:assert/strict";
import test from "node:test";
import { resolveCallbackRedirect } from "../lib/auth/callbackRedirect";

test("le retour d'authentification garde les chemins connus, avec leur requête", () => {
  assert.equal(resolveCallbackRedirect("/dashboard"), "/dashboard");
  assert.equal(resolveCallbackRedirect("/update-password"), "/update-password");
  assert.equal(resolveCallbackRedirect("/blocs/1?x=1#a"), "/blocs/1?x=1#a");
  assert.equal(resolveCallbackRedirect(null), "/dashboard");
  assert.equal(resolveCallbackRedirect(undefined), "/dashboard");
});

test("le retour d'authentification refuse tout ce qui sort du site ou des chemins connus", () => {
  const rejected = [
    "//evil.example",
    "///evil.example",
    "/\\evil.example",
    "/%5Cevil.example",
    "/%2F%2Fevil.example",
    "/%09/evil.example",
    "/\t/evil.example",
    "https://evil.example",
    "javascript:alert(1)",
    "dashboard",
    "",
    "/..//evil.example",
    "/dashboard/..//evil.example",
    "/dashboardx",
    "/dashboard.evil.example",
    "/administrator",
    "/login",
    "/dashboard%0d%0aSet-Cookie:a=b",
  ];
  for (const value of rejected) {
    assert.equal(resolveCallbackRedirect(value), "/dashboard", JSON.stringify(value));
  }
});

test("la migration retire aux rôles navigateur les droits de table et de fonction inutiles", async () => {
  const { readFile } = await import("node:fs/promises");
  const sql = await readFile("supabase/migrations/20261023150000_revoke_excess_client_grants.sql", "utf8");
  assert.match(sql, /revoke all on table public\.profiles from anon/);
  assert.match(sql, /revoke insert, update, delete, truncate, references, trigger\s+on table public\.profiles from authenticated/);
  assert.match(sql, /revoke all on table public\.member_presence from anon, authenticated/);
  assert.match(sql, /revoke all on table public\.member_activity_events from anon, authenticated/);
  assert.match(sql, /revoke execute on function public\.has_current_accompaniment\(uuid, text\) from anon/);
  assert.doesNotMatch(sql, /grant (insert|update|delete)/i);
});
