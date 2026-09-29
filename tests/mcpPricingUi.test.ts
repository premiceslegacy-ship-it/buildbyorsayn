import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the public pricing presents one shared MCP connector below both offers", async () => {
  const pricing = await readFile("components/PricingCarousel.tsx", "utf8");
  const homepage = await readFile("app/page.tsx", "utf8");

  assert.doesNotMatch(pricing, /import \{ McpConnectorShowcase \}|<McpConnectorShowcase/);
  assert.match(homepage, /import \{ McpConnectorShowcase \}/);
  assert.match(homepage, /MCP_CONNECTOR_VISIBLE/);
  assert.match(homepage, /max-w-6xl/);
  assert.match(homepage, /<McpConnectorShowcase \/>/);
  assert.ok(homepage.indexOf("<PricingCarousel") < homepage.indexOf("<McpConnectorShowcase"));
  assert.match(pricing, /Ton assistant retrouve les contenus Fondations utiles au moment où tu en as besoin/);
  assert.match(pricing, /Ton assistant retrouve tout le contenu BUILD inclus dans ton accès/);
  assert.match(pricing, /mcp:\s*true/g);
  assert.match(pricing, /!item\.mcp \|\| MCP_CONNECTOR_VISIBLE/);
});

test("beta visibility stays separate from the final launch gate", async () => {
  const pricing = await readFile("components/PricingCarousel.tsx", "utf8");
  const dashboard = await readFile("app/dashboard/mcp/page.tsx", "utf8");
  const guide = await readFile("components/McpSetupGuide.tsx", "utf8");
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

test("the shared MCP block demonstrates the training benefit with concise copy", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");

  assert.match(showcase, /Inclus dans les deux offres/);
  assert.doesNotMatch(showcase, /bêta/i);
  assert.match(showcase, /Tu n&apos;apprends plus seul/);
  assert.match(showcase, /retrouve le contenu BUILD utile/);
  assert.match(showcase, /Le contenu visible dépend de ton offre/);
  assert.match(showcase, /Claude/);
  assert.match(showcase, /Recherche dans le MCP BUILD/);
  assert.match(showcase, /J'ai une idée, mais que devrais-je construire en premier \?/);
  assert.match(showcase, /Opus 5\.5/);
  assert.match(showcase, /max-w-\[680px\]/);
  assert.match(showcase, /aspect-video/);
  assert.match(showcase, /prefers-reduced-motion/);
  assert.match(showcase, /href="\/mcp\/start"/);
  assert.match(showcase, /Connecter mon assistant/);
  assert.doesNotMatch(showcase, /Illustration|DANS CET EXEMPLE|Contexte BUILD connecté|Prochaine étape|Pose une autre question/);
  assert.match(showcase, /Aperçu animé, pas une réponse en direct/);
  assert.match(showcase, /role="region"/);
  assert.match(showcase, /aria-live/);
  assert.doesNotMatch(showcase, /role="img"/);
  assert.doesNotMatch(showcase, /whiteSpace: "nowrap"/);
  assert.doesNotMatch(showcase, /absolute inset-2 border/);
  assert.doesNotMatch(showcase, /src="\/api\/mcp\/showcase-asset"/);
  assert.match(showcase, /brand-logos\/claude\.svg/);
  assert.match(showcase, /brand-logos\/build-logo-compact\.png/);
  assert.match(showcase, /fiche chantier/);
  assert.match(showcase, /premier module de ton SaaS/);
  assert.match(showcase, /mcp-claude-thinking/);
  assert.match(showcase, /mcp-loading-dot/);
  assert.match(showcase, /data-mcp-loading-dots="true"/);
  assert.doesNotMatch(showcase, /hermes-agent-mark\.png|\bToi\b/);
  assert.doesNotMatch(showcase, /rounded-full/);
  assert.doesNotMatch(showcase, /Garde toute la puissance de ton assistant/);
  assert.doesNotMatch(showcase, /forfait web payant compatible/);
  assert.doesNotMatch(showcase, /administrateur de ton espace/);
  assert.doesNotMatch(showcase, /ACCESS_LEVELS|<Check/);
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

test("the public connector uses a direct Claude conversation instead of a reference image", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");

  assert.match(showcase, /role="region"/);
  assert.match(showcase, /setStage/);
  assert.match(showcase, /setVisiblePrompt/);
  assert.match(showcase, /setVisibleAnswer/);
  assert.match(showcase, /Recherche dans le MCP BUILD/);
  assert.doesNotMatch(showcase, /src="\/api\/mcp\/showcase-asset"/);
  assert.match(showcase, /useState/);
  assert.doesNotMatch(showcase, /aria-pressed|setLevel/);
  assert.doesNotMatch(showcase, /rounded-2xl/g);
});
