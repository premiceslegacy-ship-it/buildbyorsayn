import assert from "node:assert/strict";
import test from "node:test";

import nextConfig from "../next.config.mjs";
import { hasLocalMatch } from "next/dist/shared/lib/match-local-pattern.js";

test("the Next image optimizer rejects the revocable MCP asset route", () => {
  const localPatterns = nextConfig.images?.localPatterns;

  assert.ok(localPatterns);
  assert.equal(
    hasLocalMatch(
      localPatterns,
      "/api/mcp/showcase-asset",
    ),
    false,
  );
});
