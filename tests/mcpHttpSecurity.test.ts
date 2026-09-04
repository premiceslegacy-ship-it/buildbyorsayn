import test from "node:test";
import assert from "node:assert/strict";
import {
  isJsonMediaType,
  readBoundedBody,
  requestOriginAllowed,
} from "../lib/mcp/http";

test("OAuth JSON media type accepts parameters but rejects text/plain", () => {
  assert.equal(isJsonMediaType("application/json"), true);
  assert.equal(isJsonMediaType("application/json; charset=utf-8"), true);
  assert.equal(isJsonMediaType("text/plain"), false);
  assert.equal(isJsonMediaType(null), false);
});

test("an absent Origin is server-to-server and a present Origin must be allowlisted", () => {
  assert.equal(requestOriginAllowed(null, new Set(["https://claude.ai"])), true);
  assert.equal(requestOriginAllowed("https://claude.ai", new Set(["https://claude.ai"])), true);
  assert.equal(requestOriginAllowed("https://attacker.example", new Set(["https://claude.ai"])), false);
  assert.equal(requestOriginAllowed("null", new Set(["https://claude.ai"])), false);
});

test("bounded body counts bytes instead of characters", async () => {
  const accepted = await readBoundedBody(
    new Request("https://example.test", { method: "POST", body: "éé" }),
    4
  );
  assert.deepEqual(accepted, { ok: true, text: "éé" });

  const rejected = await readBoundedBody(
    new Request("https://example.test", { method: "POST", body: "ééé" }),
    4
  );
  assert.deepEqual(rejected, { ok: false, reason: "too_large" });
});

test("bounded body rejects invalid or oversized declared lengths", async () => {
  const invalid = await readBoundedBody(
    new Request("https://example.test", {
      method: "POST",
      headers: { "Content-Length": "wat" },
      body: "{}",
    }),
    32
  );
  assert.deepEqual(invalid, { ok: false, reason: "invalid_length" });

  const oversized = await readBoundedBody(
    new Request("https://example.test", {
      method: "POST",
      headers: { "Content-Length": "33" },
      body: "{}",
    }),
    32
  );
  assert.deepEqual(oversized, { ok: false, reason: "too_large" });
});
