import assert from "node:assert/strict";
import test from "node:test";
import {
  MCP_TIERS,
  canAccess,
  normalizeProfileTier,
  resolveMcpProfileTier,
  tierRank,
} from "../lib/mcpAccess";

test("tierRank ranks tiers in ascending order", () => {
  assert.equal(tierRank("free"), 0);
  assert.equal(tierRank("preview"), 1);
  assert.equal(tierRank("beginner"), 2);
  assert.equal(tierRank("full"), 3);
});

test("tierRank fails closed on unknown input", () => {
  assert.equal(tierRank(null), -1);
  assert.equal(tierRank(undefined), -1);
  assert.equal(tierRank(""), -1);
  assert.equal(tierRank("FULL"), -1);
  assert.equal(tierRank("admin"), -1);
  assert.equal(tierRank(42), -1);
});

test("canAccess grants access only at or above the required rank", () => {
  for (const required of MCP_TIERS) {
    for (const user of MCP_TIERS) {
      const expected = tierRank(user) >= tierRank(required);
      assert.equal(canAccess(user, required), expected, `${user} vs ${required}`);
    }
  }
});

test("canAccess is fail-closed for unrecognized user tiers", () => {
  assert.equal(canAccess(null, "free"), false);
  assert.equal(canAccess(undefined, "free"), false);
  assert.equal(canAccess("FULL", "full"), false);
  assert.equal(canAccess("beginner ", "beginner"), false);
});

test("preview never reaches beginner or full", () => {
  assert.equal(canAccess("preview", "beginner"), false);
  assert.equal(canAccess("preview", "full"), false);
  assert.equal(canAccess("preview", "preview"), true);
  assert.equal(canAccess("preview", "free"), true);
});

test("normalizeProfileTier maps admin to full", () => {
  assert.equal(normalizeProfileTier("admin"), "full");
});

test("normalizeProfileTier maps known tiers to themselves", () => {
  assert.equal(normalizeProfileTier("free"), "free");
  assert.equal(normalizeProfileTier("beginner"), "beginner");
  assert.equal(normalizeProfileTier("full"), "full");
});

test("normalizeProfileTier gives the intentional preview to missing profiles only", () => {
  assert.equal(normalizeProfileTier(null), "preview");
  assert.equal(normalizeProfileTier(undefined), "preview");
  assert.equal(normalizeProfileTier(""), null);
  assert.equal(normalizeProfileTier("FULL"), null);
  assert.equal(normalizeProfileTier("unknown"), null);
});

test("resolveMcpProfileTier fails closed when the profile lookup fails", () => {
  assert.equal(resolveMcpProfileTier(null, new Error("database unavailable")), null);
  assert.equal(resolveMcpProfileTier({ tier: "full" }, { code: "timeout" }), null);
});

test("resolveMcpProfileTier grants preview only after a successful empty lookup", () => {
  assert.equal(resolveMcpProfileTier(null, null), "preview");
  assert.equal(resolveMcpProfileTier({ tier: null }, null), null);
  assert.equal(resolveMcpProfileTier({ tier: "FULL" }, null), null);
  assert.equal(resolveMcpProfileTier({ tier: "admin" }, null), "full");
});
