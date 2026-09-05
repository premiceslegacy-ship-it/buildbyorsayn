import assert from "node:assert/strict";
import test from "node:test";
import {
  buildNetworkRateLimitInput,
  corsHeadersForRequest,
  hashRateLimitSubject,
  isExactMcpResource,
  resolveRateLimitDecision,
  trustedClientAddress,
} from "../lib/mcp/security";

test("rate limiting distinguishes denial from infrastructure failure", () => {
  assert.equal(resolveRateLimitDecision(true, null), "allowed");
  assert.equal(resolveRateLimitDecision(false, null), "denied");
  assert.equal(resolveRateLimitDecision(null, null), "unavailable");
  assert.equal(resolveRateLimitDecision(true, new Error("database unavailable")), "unavailable");
});

test("CORS reflects only configured origins and never wildcard", () => {
  const allowed = corsHeadersForRequest(
    new Request("https://buildbyorsayn.com/api/mcp", { headers: { Origin: "https://claude.ai" } }),
    ["https://claude.ai"]
  );
  assert.equal(allowed["Access-Control-Allow-Origin"], "https://claude.ai");
  assert.equal(allowed.Vary, "Origin");

  const denied = corsHeadersForRequest(
    new Request("https://buildbyorsayn.com/api/mcp", { headers: { Origin: "https://evil.example" } }),
    ["https://claude.ai"]
  );
  assert.equal(denied["Access-Control-Allow-Origin"], undefined);
  assert.equal(denied.Vary, "Origin");
  assert.throws(() => corsHeadersForRequest(new Request("https://buildbyorsayn.com"), ["*"]));
});

test("an MCP access token must be bound to the exact resource", () => {
  const expected = "https://buildbyorsayn.com/api/mcp";
  assert.equal(isExactMcpResource(expected, expected), true);
  assert.equal(isExactMcpResource(null, expected), false);
  assert.equal(isExactMcpResource(undefined, expected), false);
  assert.equal(isExactMcpResource("https://other.example/api/mcp", expected), false);
});

test("rate-limit subjects never persist a raw network address", () => {
  const first = hashRateLimitSubject("mcp-dcr", "203.0.113.7", "dedicated-test-pepper");
  const again = hashRateLimitSubject("mcp-dcr", "203.0.113.7", "dedicated-test-pepper");
  assert.equal(first, again);
  assert.equal(first.includes("203.0.113.7"), false);
  assert.match(first, /^mcp-dcr:[a-f0-9]{64}$/);
});

test("network rate limits trust only the platform-owned forwarding header", () => {
  assert.equal(
    trustedClientAddress(new Headers({
      "x-vercel-forwarded-for": "203.0.113.7, 198.51.100.2",
      "x-forwarded-for": "127.0.0.1",
    })),
    "203.0.113.7"
  );
  assert.equal(trustedClientAddress(new Headers({ "x-forwarded-for": "203.0.113.7" })), null);
});

test("network rate-limit inputs are fail-closed and pseudonymous", () => {
  const headers = new Headers({ "x-vercel-forwarded-for": "203.0.113.7" });
  const input = buildNetworkRateLimitInput("mcp-token", headers, "dedicated-test-pepper", 30, 60);
  assert.ok(input);
  assert.match(input.p_subject, /^mcp-token:[a-f0-9]{64}$/);
  assert.equal(input.p_subject.includes("203.0.113.7"), false);
  assert.equal(buildNetworkRateLimitInput("mcp-token", new Headers(), "dedicated-test-pepper", 30, 60), null);
  assert.equal(buildNetworkRateLimitInput("mcp-token", headers, "short", 30, 60), null);
});