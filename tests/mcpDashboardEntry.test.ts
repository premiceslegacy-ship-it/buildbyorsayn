import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolveMcpDashboardEntryState } from "../lib/mcp/dashboardPresentation";

test("the member MCP entry resolves an honest state for every access and connection condition", () => {
  assert.equal(resolveMcpDashboardEntryState({ visible: false, profileReady: true, tier: "full", status: "connected" }), "hidden");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: false, tier: null, status: null }), "hidden");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: "free", status: null }), "locked");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: "preview", status: null }), "locked");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: null, status: null }), "unknown");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: "unexpected", status: null }), "unknown");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: "beginner", status: null }), "checking");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: "full", status: "connected" }), "connected");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: "beginner", status: "disconnected" }), "disconnected");
  assert.equal(resolveMcpDashboardEntryState({ visible: true, profileReady: true, tier: "admin", status: "unknown" }), "unknown");
});

test("the MCP setup page gates instructions by paid access and uses a focused layout", async () => {
  const page = await readFile("app/dashboard/mcp/page.tsx", "utf8");

  for (const tool of ["Claude", "ChatGPT", "Hermes Agent", "Oh My Pi"]) {
    assert.ok(page.includes(`"${tool}"`), tool);
  }
  assert.doesNotMatch(page, /"Cursor"/);
  assert.match(page, /<ToolLogo name=\{tool\}/);
  assert.doesNotMatch(page, /\/da\/logos\//);
  // 390 px : la rangée est flexible et le style UI-3 lui permet de revenir à la ligne.
  assert.match(page, /className="ui3-tool-logos"/);
  assert.match(page, /Connecte BUILD à ton assistant/);
  assert.match(page, /Impossible de vérifier ton accès BUILD/);
  assert.match(page, /Choisir mon accès/);
  assert.match(page, /href="\/checkout\?from=mcp"/);
  assert.match(page, /if \(profileError \|\| tier === null\)/);
  assert.match(page, /if \(tier !== "beginner" && tier !== "full"\)/);
  assert.match(
    page,
    /if \(tier !== "beginner" && tier !== "full"\)[\s\S]*?return[\s\S]*?const connectionStatus = await getMcpConnectionStatus\(\)/,
  );
  assert.match(page, /DaRoot/);
  assert.doesNotMatch(page, /LiquidCard|rounded-2xl/);
});
