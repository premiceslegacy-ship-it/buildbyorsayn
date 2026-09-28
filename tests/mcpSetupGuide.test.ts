import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = process.cwd();

async function exists(relativePath: string) {
  await access(`${root}/${relativePath}`);
}

test("the public BUILD favicon is a valid multi-size ICO asset", async () => {
  const bytes = await readFile("app/favicon.ico");

  assert.deepEqual(Array.from(bytes.slice(0, 4)), [0, 0, 1, 0]);
  assert.equal(bytes.readUInt16LE(4), 3);
  assert.ok(bytes.byteLength > 1_000);
});

test("the MCP setup guide contains a verified Claude guide and current ChatGPT route", async () => {
  const guide = await readFile("components/McpSetupGuide.tsx", "utf8");
  const page = await readFile("app/dashboard/mcp/page.tsx", "utf8");

  assert.match(page, /McpSetupGuide/);
  assert.match(guide, /Claude/);
  assert.match(guide, /ChatGPT/);
  assert.equal((guide.match(/<details/g) ?? []).length, 2);
  assert.match(guide, /function ClientSummary/);
  assert.equal((guide.match(/name="mcp-client-guide"/g) ?? []).length, 2);
  assert.match(guide, /mode développeur/);
  assert.match(guide, /Paramètres/);
  assert.match(guide, /Apps/);
  assert.match(guide, /Créer/);
  assert.match(guide, /endpoint MCP/);
  assert.match(guide, /permissions/);
  assert.match(guide, /\/mcp\/setup\/claude-connectors-fr\.png/);
  assert.match(guide, /\/mcp\/setup\/claude-add-fr\.png/);
  assert.match(guide, /\/mcp\/setup\/claude-custom-connector-fr\.png/);
  assert.match(guide, /\/mcp\/setup\/claude-oauth-options-fr\.png/);
  assert.match(guide, /\/mcp\/setup\/claude-oauth-final-fr\.png/);
  assert.match(guide, /procédure officielle OpenAI/);
  assert.doesNotMatch(guide, /\/mcp\/setup\/[^\"]+\.svg/);

  await exists("public/mcp/setup/claude-connectors-fr.png");
  await exists("public/mcp/setup/claude-add-fr.png");
  await exists("public/mcp/setup/claude-custom-connector-fr.png");
  await exists("public/mcp/setup/claude-oauth-options-fr.png");
  await exists("public/mcp/setup/claude-oauth-final-fr.png");
});

test("the MCP acquisition path starts with account creation and explains the paid access step", async () => {
  const start = await readFile("lib/mcp/startDestination.ts", "utf8");
  const checkout = await readFile("app/checkout/page.tsx", "utf8");

  assert.match(start, /\/login\?mode=signup&next=%2Fmcp%2Fstart/);
  assert.match(checkout, /fromMcp/);
  assert.match(checkout, /connecter ton assistant/i);
  assert.match(checkout, /MCP/);
});
