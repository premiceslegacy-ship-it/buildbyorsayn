import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("beta visibility stays separate from the final launch gate", async () => {
  const dashboard = await readFile("app/dashboard/mcp/page.tsx", "utf8");
  const guide = await readFile("components/McpSetupGuide.tsx", "utf8");
  const assetRoute = await readFile("app/api/mcp/showcase-asset/route.ts", "utf8");
  const exampleEnv = await readFile(".env.example", "utf8");

  for (const source of [dashboard, assetRoute]) {
    assert.match(source, /process\.env\.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true"/);
    assert.match(source, /process\.env\.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true"/);
  }
  assert.match(dashboard, /Connexion bêta/);
  assert.match(dashboard, /getMcpConnectionStatus/);
  assert.match(dashboard, /connected = connectionStatus === "connected"/);
  assert.match(dashboard, /disconnected = connectionStatus === "disconnected"/);
  assert.match(dashboard, /unknown = connectionStatus === "unknown"/);
  assert.match(dashboard, /Connexion active/);
  assert.match(dashboard, /Impossible de vérifier l&apos;état de la connexion/);
  assert.match(dashboard, /\{disconnected \? \(/);
  assert.doesNotMatch(dashboard, /\{!connected \? \(/);
  assert.match(dashboard, /La connexion à Claude et ChatGPT n&apos;est pas encore ouverte/);
  assert.match(guide, /prise en charge complète/);
  assert.match(guide, /Business, Enterprise et Edu/);
  assert.match(guide, /actions de modification ou d&apos;écriture/);
  assert.match(guide, /autorisation de l&apos;administrateur/);
  assert.match(exampleEnv, /NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE="false"/);
  assert.match(exampleEnv, /NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED="false"/);
  assert.match(exampleEnv, /Claude ET ChatGPT sur l'URL publique/);
});

test("each accessible study block offers a direct assistant connection path only while disconnected", async () => {
  const blockPage = await readFile("app/blocs/[id]/BlocClient.tsx", "utf8");
  const callout = await readFile("components/McpStudyCallout.tsx", "utf8");
  const connectionAction = await readFile("app/actions/mcpConnections.ts", "utf8");

  assert.match(blockPage, /import \{ McpStudyCallout \}/);
  assert.match(blockPage, /getMcpConnectionStatus/);
  assert.match(blockPage, /const normalizedTier = normalizeProfileTier\(tier\);/);
  assert.match(blockPage, /const hasMcpAccess = normalizedTier !== null/);
  assert.match(blockPage, /MCP_CONNECTOR_VISIBLE && hasMcpAccess && showContent && mcpConnectionStatus === "disconnected"/);
  assert.match(blockPage, /if \(!MCP_CONNECTOR_VISIBLE \|\| !hasMcpAccess\) return/);
  assert.match(callout, /Continue ce bloc dans Claude ou ChatGPT/);
  assert.match(callout, /Ton assistant voit uniquement les contenus inclus dans ton accès/);
  assert.match(callout, /href="\/dashboard\/mcp"/);
  assert.match(callout, /Connecter mon assistant/);
  assert.match(connectionAction, /supabase\.auth\.getUser\(\)/);
  assert.match(connectionAction, /mcp_refresh_tokens/);
  assert.match(connectionAction, /mcp_access_tokens/);
  assert.match(connectionAction, /\.eq\("user_id", user\.id\)/);
  assert.match(connectionAction, /const resource = getMcpResourceUrl\(\)/);
  assert.match(connectionAction, /\.eq\("resource", resource\)/);
  assert.match(connectionAction, /\.is\("revoked_at", null\)/);
  assert.match(connectionAction, /\.is\("rotated_to", null\)/);
  assert.match(connectionAction, /\.gt\("family_expires_at", now\)/);
  assert.match(connectionAction, /return "unknown"/);
});

test("the MCP asset follows BUILD hierarchy and records mark provenance", async () => {
  const design = await readFile("product/accompagnement-site-web/DESIGN-SYSTEM.md", "utf8");
  const assetReadme = await readFile("public/brand-assets/README.md", "utf8");

  assert.match(design, /BUILD domine au centre/);
  assert.match(design, /Claude et ChatGPT restent des entrées secondaires reliées/);
  assert.match(design, /L'asset reste masqué tant que les validations réelles/);
  assert.match(assetReadme, /BUILD LOGO\.png/);
  assert.match(assetReadme, /Claude AI symbol\.svg/);
  assert.match(assetReadme, /openai\.com\/brand/);
  assert.match(assetReadme, /SHA-256/g);
  assert.doesNotMatch(assetReadme, /approved source marks/);
  assert.match(assetReadme, /must remain unpublished until/i);
  assert.match(assetReadme, /brand approval/i);
});
