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

test("the member dashboard exposes one functional MCP rail with free-standing client logos", async () => {
  const dashboard = await readFile("app/dashboard/page.tsx", "utf8");
  const entry = await readFile("components/McpDashboardEntry.tsx", "utf8");

  assert.match(dashboard, /import \{ McpDashboardEntry \}/);
  assert.match(dashboard, /<McpDashboardEntry tier=\{tier\} profileReady=\{profileReady\} resumeTitle=\{resumeBloc\.titre\} \/>/);
  assert.match(dashboard, /Carte "Reprendre"[\s\S]*?<\/LiquidCard>[\s\S]*?<McpDashboardEntry/);
  assert.match(entry, /getMcpConnectionStatus/);
  assert.match(entry, /resolveMcpDashboardEntryState/);
  assert.match(entry, /\/brand-logos\/claude\.svg/);
  assert.match(entry, /\/brand-logos\/chatgpt\.svg/);
  assert.match(entry, /Assistant connecté/);
  assert.match(entry, /Reprends ta formation sans chercher le bon bloc/);
  assert.match(entry, /resumeTitle/);
  assert.match(entry, /href:\s*"\/mcp\/start"/);
  assert.match(entry, /href:\s*"\/dashboard\/mcp"/);
  assert.doesNotMatch(entry, /LiquidCard|rounded-2xl|backdrop-blur|from-.*to-/);
});

test("the MCP setup page gates instructions by paid access and uses a focused layout", async () => {
  const page = await readFile("app/dashboard/mcp/page.tsx", "utf8");

  assert.match(page, /\/brand-logos\/claude\.svg/);
  assert.match(page, /\/brand-logos\/chatgpt\.svg/);
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
  assert.doesNotMatch(page, /LiquidCard|rounded-2xl|backdrop-blur/);
});
