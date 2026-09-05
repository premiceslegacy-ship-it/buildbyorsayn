import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { GET as getMcpLogo } from "../app/api/mcp/logo/route";
import { GET as getAuthorizationMetadata } from "../app/.well-known/oauth-authorization-server/route";

process.env.MCP_OAUTH_ISSUER ??= "https://buildbyorsayn.com";

test("OAuth discovery exposes the official BUILD logo URL", async () => {
  const response = await getAuthorizationMetadata(
    new Request("https://buildbyorsayn.com/.well-known/oauth-authorization-server"),
  );
  const metadata = await response.json() as { issuer: string; logo_uri?: string };

  assert.equal(response.status, 200);
  assert.equal(metadata.logo_uri, `${metadata.issuer}/api/mcp/logo`);
});

test("the MCP branding route serves the official BUILD PNG", async () => {
  const response = await getMcpLogo();
  const bytes = new Uint8Array(await response.arrayBuffer());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");
  assert.deepEqual(Array.from(bytes.slice(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(bytes.byteLength > 1_000);
});

test("the consent page uses the controlled BUILD logo URL", async () => {
  const page = await readFile("app/mcp/consent/page.tsx", "utf8");

  assert.match(page, /\/api\/mcp\/logo/);
  assert.match(page, /alt="BUILD"/);
});
