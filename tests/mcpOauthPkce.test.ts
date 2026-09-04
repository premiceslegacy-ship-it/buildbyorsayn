import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import test from "node:test";
import {
  hashToken,
  isRedirectUriAllowed,
  isRedirectUriRegistrable,
  sanitizeClientName,
  isValidS256CodeChallenge,
  verifyCodeChallenge,
} from "../lib/mcp/oauth";

function s256Challenge(verifier: string): string {
  return createHash("sha256").update(verifier, "ascii").digest("base64url");
}

test("verifyCodeChallenge accepts a matching S256 verifier/challenge pair", () => {
  const verifier = "a".repeat(43);
  const challenge = s256Challenge(verifier);
  assert.equal(verifyCodeChallenge(verifier, challenge), true);
});

test("verifyCodeChallenge rejects a mismatched pair", () => {
  const verifier = "a".repeat(43);
  const wrongChallenge = s256Challenge("b".repeat(43));
  assert.equal(verifyCodeChallenge(verifier, wrongChallenge), false);
});

test("verifyCodeChallenge rejects empty inputs", () => {
  assert.equal(verifyCodeChallenge("", "something"), false);
  assert.equal(verifyCodeChallenge("something", ""), false);
  assert.equal(verifyCodeChallenge("", ""), false);
});

test("verifyCodeChallenge rejects a verifier outside the RFC 7636 charset/length", () => {
  const challenge = s256Challenge("a".repeat(43));
  assert.equal(verifyCodeChallenge("a".repeat(42), challenge), false); // too short
  assert.equal(verifyCodeChallenge("a".repeat(129), challenge), false); // too long
  assert.equal(verifyCodeChallenge("not valid chars!!".padEnd(43, "a"), challenge), false);
});

test("S256 challenges must be exact unpadded base64url SHA-256 values", () => {
  assert.equal(isValidS256CodeChallenge(s256Challenge("a".repeat(43))), true);
  assert.equal(isValidS256CodeChallenge("a".repeat(42)), false);
  assert.equal(isValidS256CodeChallenge(`${"a".repeat(43)}=`), false);
  assert.equal(isValidS256CodeChallenge("+".repeat(43)), false);
});

test("hashToken is deterministic and produces a 64-char hex digest", () => {
  const a = hashToken("some-opaque-token");
  const b = hashToken("some-opaque-token");
  assert.equal(a, b);
  assert.match(a, /^[a-f0-9]{64}$/);
});

test("hashToken differs for different inputs", () => {
  assert.notEqual(hashToken("token-a"), hashToken("token-b"));
});

const REGISTERED = ["https://claude.ai/api/mcp/callback"];

test("isRedirectUriAllowed accepts an exact match", () => {
  assert.equal(
    isRedirectUriAllowed("https://claude.ai/api/mcp/callback", REGISTERED),
    true
  );
});

test("isRedirectUriAllowed rejects a prefix match", () => {
  assert.equal(
    isRedirectUriAllowed("https://claude.ai/api/mcp/callback/extra", REGISTERED),
    false
  );
});

test("isRedirectUriAllowed rejects a different subdomain", () => {
  assert.equal(
    isRedirectUriAllowed("https://evil.claude.ai/api/mcp/callback", REGISTERED),
    false
  );
});

test("isRedirectUriAllowed rejects an open-redirect style host", () => {
  assert.equal(isRedirectUriAllowed("https://evil.com", REGISTERED), false);
  assert.equal(
    isRedirectUriAllowed("https://claude.ai.evil.com/api/mcp/callback", REGISTERED),
    false
  );
});

test("isRedirectUriAllowed rejects non-loopback http", () => {
  assert.equal(isRedirectUriAllowed("http://example.com/callback", REGISTERED), false);
});

test("isRedirectUriAllowed requires an exact loopback port", () => {
  const registeredLoopback = ["http://127.0.0.1:8080/callback"];
  assert.equal(
    isRedirectUriAllowed("http://127.0.0.1:54321/callback", registeredLoopback),
    false
  );
  assert.equal(
    isRedirectUriAllowed("http://localhost:54321/callback", registeredLoopback),
    false // different hostname than what's registered, exact hostname still required
  );
});

test("loopback redirects cannot vary path, query or port", () => {
  const registered = ["http://127.0.0.1:8080/callback?channel=a"];
  assert.equal(
    isRedirectUriAllowed("http://127.0.0.1:54321/callback?channel=a", registered),
    false
  );
  assert.equal(
    isRedirectUriAllowed("http://127.0.0.1:54321/other?channel=a", registered),
    false
  );
  assert.equal(
    isRedirectUriAllowed("http://127.0.0.1:54321/callback?channel=b", registered),
    false
  );
});

test("isRedirectUriAllowed rejects malformed candidates", () => {
  assert.equal(isRedirectUriAllowed("not-a-url", REGISTERED), false);
  assert.equal(isRedirectUriAllowed("//evil.com", REGISTERED), false);
});

test("isRedirectUriRegistrable accepts https and loopback http", () => {
  assert.equal(isRedirectUriRegistrable("https://example.com/cb"), true);
  assert.equal(isRedirectUriRegistrable("http://127.0.0.1:9999/cb"), true);
  assert.equal(isRedirectUriRegistrable("http://localhost/cb"), true);
  assert.equal(isRedirectUriRegistrable("http://[::1]:9999/cb"), true);
});

test("isRedirectUriRegistrable rejects non-loopback http and other schemes", () => {
  assert.equal(isRedirectUriRegistrable("http://example.com/cb"), false);
  assert.equal(isRedirectUriRegistrable("https://user@example.com/cb"), false);
  assert.equal(isRedirectUriRegistrable("https://example.com/cb#fragment"), false);
  assert.equal(isRedirectUriRegistrable("http://127.0.0.1/cb#fragment"), false);
  assert.equal(isRedirectUriRegistrable("javascript:alert(1)"), false);
  assert.equal(isRedirectUriRegistrable("not-a-url"), false);
});

test("sanitizeClientName strips angle brackets and truncates", () => {
  assert.equal(sanitizeClientName("<script>alert(1)</script>"), "scriptalert(1)/script");
  assert.equal(sanitizeClientName("a".repeat(200)).length, 100);
});

test("sanitizeClientName falls back on missing or empty input", () => {
  assert.equal(sanitizeClientName(undefined), "Application inconnue");
  assert.equal(sanitizeClientName(""), "Application inconnue");
  assert.equal(sanitizeClientName("   "), "Application inconnue");
  assert.equal(sanitizeClientName(42), "Application inconnue");
});
