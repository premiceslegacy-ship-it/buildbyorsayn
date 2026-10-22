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
