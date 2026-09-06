import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolveMcpStartDecision } from "../lib/mcp/startDestination";

test("the public MCP entry sends each visitor to the next useful step", () => {
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: false, authenticated: false, tier: null, lookupFailed: false }),
    { kind: "redirect", destination: "/" },
  );
  assert.deepEqual(
    resolveMcpStartDecision({ connectorVisible: true, authenticated: false, tier: null, lookupFailed: false }),
    { kind: "redirect", destination: "/login?next=%2Fmcp%2Fstart" },
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

test("the public showcase uses the state-aware MCP entry instead of a protected dashboard URL", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");
  const startPage = await readFile("app/mcp/start/page.tsx", "utf8");

  assert.match(showcase, /href="\/mcp\/start"/);
  assert.doesNotMatch(showcase, /href="\/dashboard\/mcp"/);
  assert.match(startPage, /supabase\.auth\.getUser\(\)/);
  assert.match(startPage, /from\("profiles"\)/);
  assert.match(startPage, /resolveMcpStartDecision/);
  assert.match(startPage, /Impossible de vérifier ton accès/);
});
