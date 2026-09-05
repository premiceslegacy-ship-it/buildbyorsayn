import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the public pricing presents one shared MCP connector below both offers", async () => {
  const pricing = await readFile("components/PricingCarousel.tsx", "utf8");
  const matches = pricing.match(/<McpConnectorShowcase\s*\/>/g) ?? [];

  assert.match(pricing, /import \{ McpConnectorShowcase \}/);
  assert.equal(matches.length, 1);
  assert.match(pricing, /MCP_CONNECTOR_LAUNCHED \? <McpConnectorShowcase\s*\/> : null/);
});

test("the MCP offer stays hidden until real Claude and ChatGPT proofs authorize launch", async () => {
  const pricing = await readFile("components/PricingCarousel.tsx", "utf8");
  const dashboard = await readFile("app/dashboard/mcp/page.tsx", "utf8");
  const exampleEnv = await readFile(".env.example", "utf8");

  assert.match(pricing, /process\.env\.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true"/);
  assert.match(dashboard, /process\.env\.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true"/);
  assert.doesNotMatch(dashboard, /process\.env\.MCP_CONNECTOR_LAUNCHED/);
  assert.match(dashboard, /La connexion aux assistants n&apos;est pas encore ouverte/);
  assert.match(dashboard, /Nous terminons les essais réels dans Claude et ChatGPT/);
  assert.match(dashboard, /forfait web payant compatible/);
  assert.match(dashboard, /autorisation de l&apos;administrateur/);
  assert.match(exampleEnv, /NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED="false"/);
  assert.doesNotMatch(exampleEnv, /^MCP_CONNECTOR_LAUNCHED=/m);
  assert.match(exampleEnv, /Claude ET ChatGPT sur l'URL publique/);
});

test("the shared MCP block explains both access depths without limiting native assistant knowledge", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");

  assert.match(showcase, /Inclus dans les deux offres/);
  assert.match(showcase, /Fondations/);
  assert.match(showcase, /LE COFFRE/);
  assert.match(showcase, /Garde toute la puissance de ton assistant/);
  assert.match(showcase, /forfait web payant compatible/);
  assert.match(showcase, /administrateur de ton espace/);
  assert.match(showcase, /\/dashboard\/mcp/);
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

test("the final Characters asset stays fully visible on compact screens", async () => {
  const showcase = await readFile("components/McpConnectorShowcase.tsx", "utf8");

  assert.match(showcase, /\/api\/mcp\/showcase-asset/);
  assert.doesNotMatch(showcase, /\/brand-assets\/build-mcp-connector-characters\.webp/);
  assert.match(showcase, /\bunoptimized\b/);
  assert.match(showcase, /aspect-\[16\/9\]/);
  assert.doesNotMatch(showcase, /min-h-\[250px\]/);
  assert.match(showcase, /logos BUILD, Claude et ChatGPT/);
});
