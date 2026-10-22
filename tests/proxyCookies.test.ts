import assert from "node:assert/strict";
import test from "node:test";
import { NextResponse } from "next/server";
import { createRedirectWithCookies } from "../proxy";

test("les redirections conservent les options complètes des cookies Supabase et interdisent le cache", () => {
  const source = NextResponse.next();
  const expires = new Date("2030-01-02T03:04:05.000Z");
  source.cookies.set({
    name: "sb-refresh",
    value: "refresh-token",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/auth",
    maxAge: 345,
  });
  source.cookies.set({
    name: "sb-expiry",
    value: "expiring-token",
    secure: true,
    path: "/",
    expires,
  });
  source.cookies.set({
    name: "sb-expired",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  const response = createRedirectWithCookies(
    new URL("https://build.example/checkout"),
    source,
    { "X-Test-Security": "present" },
  );

  const refresh = response.cookies.get("sb-refresh");
  assert.equal(refresh?.maxAge, 345);
  assert.equal(refresh?.path, "/auth");
  assert.equal(refresh?.httpOnly, true);
  assert.equal(refresh?.secure, true);
  assert.equal(refresh?.sameSite, "lax");

  const expiring = response.cookies.get("sb-expiry");
  assert.equal(expiring?.expires ? new Date(expiring.expires).toISOString() : null, expires.toISOString());

  const expired = response.cookies.get("sb-expired");
  assert.equal(expired?.maxAge, 0);
  assert.equal(expired?.value, "");
  assert.equal(expired?.path, "/");
  assert.equal(expired?.sameSite, "strict");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("X-Test-Security"), "present");
});
