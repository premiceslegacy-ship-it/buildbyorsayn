import assert from "node:assert/strict";
import test from "node:test";
import { resolveMcpStartDecision } from "../lib/mcp/startDestination";

test("the public MCP entry sends each visitor to the next useful step", () => {
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: false, authenticated: false, tier: null, lookupFailed: false }),
    { kind: "redirect", destination: "/" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: false, tier: null, lookupFailed: false }),
    { kind: "redirect", destination: "/login?mode=signup&next=%2Fmcp%2Fstart" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: "free", lookupFailed: false }),
    { kind: "redirect", destination: "/checkout?from=mcp" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: "preview", lookupFailed: false }),
    { kind: "redirect", destination: "/checkout?from=mcp" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: null, lookupFailed: false }),
    { kind: "unavailable" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: "beginner", lookupFailed: false }),
    { kind: "redirect", destination: "/dashboard/mcp" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: "full", lookupFailed: false }),
    { kind: "redirect", destination: "/dashboard/mcp" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: "admin", lookupFailed: false }),
    { kind: "redirect", destination: "/dashboard/mcp" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: "unexpected", lookupFailed: false }),
    { kind: "unavailable" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: true, tier: "full", lookupFailed: true }),
    { kind: "unavailable" },
  );
});
