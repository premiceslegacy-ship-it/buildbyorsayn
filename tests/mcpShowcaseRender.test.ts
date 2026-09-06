import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const showcasePath = new URL("../components/McpConnectorShowcase.tsx", import.meta.url);

test("the showcase uses the gated BUILD reference asset as useful context", async () => {
  const source = await readFile(showcasePath, "utf8");

  assert.match(source, /src="\/api\/mcp\/showcase-asset"/);
  assert.match(source, /alt="Contexte BUILD transmis à ton assistant"/);
  assert.match(source, /Fondations/);
  assert.match(source, /LE COFFRE/);
  assert.match(source, /Ton assistant retrouve/);
  assert.doesNotMatch(source, /useState|aria-pressed/);
});
