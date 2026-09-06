import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the public pricing presents one shared MCP connector below both offers", async () => {
  const pricing = await readFile("components/PricingCarousel.tsx", "utf8");
  const homepage = await readFile("app/page.tsx", "utf8");

  assert.doesNotMatch(pricing, /import \{ McpConnectorShowcase \}|<McpConnectorShowcase/);
  assert.match(homepage, /import \{ McpConnectorShowcase \}/);
  assert.match(homepage, /MCP_CONNECTOR_VISIBLE/);
  assert.match(homepage, /max-w-5xl mx-auto/);
  assert.match(homepage, /<McpConnectorShowcase beta=\{!MCP_CONNECTOR_LAUNCHED\} \/>/);
  assert.ok(homepage.indexOf("<PricingCarousel") < homepage.indexOf("<McpConnectorShowcase"));
  assert.match(pricing, /BUILD dans Claude et ChatGPT, avec les contenus Fondations/);
  assert.match(pricing, /BUILD dans Claude et ChatGPT, avec tout ton accès BUILD/);
  assert.match(pricing, /mcp:\s*true/g);
  assert.match(pricing, /!item\.mcp \|\| MCP_CONNECTOR_VISIBLE/);
});

test("beta visibility stays separate from the final launch gate", async () => {
  const pricing = await readFile("components/PricingCarousel.tsx", "utf8");
  const dashboard = await readFile("app/dashboard/mcp/page.tsx", "utf8");
  const assetRoute = await readFile("app/api/mcp/showcase-asset/route.ts", "utf8");
  const exampleEnv = await readFile(".env.example", "utf8");

  for (const source of [pricing, dashboard, assetRoute]) {
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
  assert.match(dashboard, /forfait web payant compatible/);
  assert.match(dashboard, /autorisation de l&apos;administrateur/);
  assert.match(exampleEnv, /NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE="false"/);
  assert.match(exampleEnv, /NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED="false"/);
  assert.match(exampleEnv, /Claude ET ChatGPT sur l'URL publique/);
});

test("each accessible study block offers a direct assistant connection path only while disconnected", async () => {
  const blockPage = await readFile("app/blocs/[id]/page.tsx", "utf8");
  const callout = await readFile("components/McpStudyCallout.tsx", "utf8");
  const connectionAction = await readFile("app/actions/mcpConnections.ts", "utf8");

  assert.match(blockPage, /import \{ McpStudyCallout \}/);
  assert.match(blockPage, /getMcpConnectionStatus/);
  assert.match(blockPage, /const hasMcpAccess = tier === "beginner" \|\| tier === "full" \|\| tier === "admin"/);
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

test("the shared MCP block demonstrates the training benefit with concise copy", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");

  assert.match(showcase, /Inclus dans les deux offres/);
  assert.match(showcase, /Bêta/);
  assert.match(showcase, /Fondations/);
  assert.match(showcase, /LE COFFRE/);
  assert.match(showcase, /Tu peux enfin poser la question qui te bloque\./);
  assert.match(showcase, /Ton assistant retrouve le contenu BUILD utile/);
  assert.match(showcase, /Comment j&apos;applique ce contenu à mon projet/);
  assert.match(showcase, /Quel skill peut m&apos;aider ici/);
  assert.match(showcase, /Fondations ou LE COFFRE : ton assistant voit uniquement les contenus inclus/);
  assert.match(showcase, /href="\/mcp\/start"/);
  assert.match(showcase, /Connecter mon assistant/);
  assert.doesNotMatch(showcase, /brand-logos|rounded-full/);
  assert.doesNotMatch(showcase, /Garde toute la puissance de ton assistant/);
  assert.doesNotMatch(showcase, /forfait web payant compatible/);
  assert.doesNotMatch(showcase, /administrateur de ton espace/);
  assert.doesNotMatch(showcase, /ACCESS_LEVELS|<Check|space-y-3/);
  assert.match(showcase, /focus-visible:ring-2/);
});

test("the MCP relationship is not enclosed in one large outer frame", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");

  assert.doesNotMatch(showcase, /<section[^>]*className="[^"]*(?:rounded-\[1\.75rem\]|border|shadow-\[)/s);
  assert.doesNotMatch(showcase, /border-b border-white/);
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

test("the public connector uses one useful reference image instead of decorative UI", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");

  assert.match(showcase, /src="\/api\/mcp\/showcase-asset"/);
  assert.match(showcase, /alt="Contexte BUILD transmis à ton assistant"/);
  assert.match(showcase, /TON CONTEXTE BUILD/);
  assert.match(showcase, /Exemples de questions/);
  assert.doesNotMatch(showcase, /useState|aria-pressed|setLevel/);
  assert.doesNotMatch(showcase, /rounded-2xl/g);
});
