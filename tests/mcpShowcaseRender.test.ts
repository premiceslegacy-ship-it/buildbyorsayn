import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const showcasePath = new URL("../components/McpConnectorShowcase.tsx", import.meta.url);

test("the showcase renders a direct Claude conversation with BUILD context", async () => {
  const source = await readFile(showcasePath, "utf8");

  assert.doesNotMatch(source, /src="\/api\/mcp\/showcase-asset"/);
  assert.match(source, /hermes-agent-mark\.png/);
  assert.match(source, /data-mcp-assistant-avatar="hermes-agent"/);
  assert.match(source, /unoptimized/);
  assert.match(source, /Claude/);
  assert.match(source, /Recherche dans le MCP BUILD/);
  assert.match(source, /Je veux lancer un SaaS pour les artisans du bâtiment/);
  assert.match(source, /Opus 5\.5/);
  assert.match(source, /useState|useEffect/);
  assert.match(source, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /Illustration|DANS CET EXEMPLE/);
  assert.doesNotMatch(source, /aria-pressed/);
  assert.match(source, /role="region"/);
  assert.match(source, /aria-live/);
  assert.doesNotMatch(source, /role="img"|whiteSpace: "nowrap"|absolute inset-2 border/);
  assert.match(source, /min-h-11/);
});
