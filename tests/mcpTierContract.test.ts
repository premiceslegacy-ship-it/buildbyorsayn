import assert from "node:assert/strict";
import test from "node:test";
import {
  MCP_CLEANUP_READBACK_KEYS,
  MCP_TIER_THRESHOLDS,
  validateCleanupReadback,
  validateTierThresholds,
} from "../scripts/mcp-tier-contract";

test("cleanup readback requires every OAuth and fixture key to be numeric zero", () => {
  const complete = Object.fromEntries(MCP_CLEANUP_READBACK_KEYS.map((key) => [key, 0]));
  assert.deepEqual(validateCleanupReadback(complete), complete);
  assert.throws(() => validateCleanupReadback({}), /cleanup readback.*missing|missing.*cleanup readback/i);
  assert.throws(
    () => validateCleanupReadback({ ...complete, temporaryAccessTokensRemaining: 1 }),
    /cleanup readback/i
  );
  assert.throws(
    () => validateCleanupReadback({ ...complete, temporaryRefreshTokensRemaining: "0" }),
    /cleanup readback/i
  );
});

test("tier thresholds must match the published contract exactly", () => {
  assert.deepEqual(validateTierThresholds(MCP_TIER_THRESHOLDS), MCP_TIER_THRESHOLDS);
  assert.throws(
    () => validateTierThresholds({ ...MCP_TIER_THRESHOLDS, knowledgeSearchMsLessThan: 99_999 }),
    /threshold/i
  );
  assert.throws(
    () => validateTierThresholds({ toolsListP50MsLessThan: 750 }),
    /threshold/i
  );
});
