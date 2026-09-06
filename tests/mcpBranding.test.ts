import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { GET as getMcpLogo } from "../app/api/mcp/logo/route";
import { GET as getAuthorizationMetadata } from "../app/.well-known/oauth-authorization-server/route";
import { createBuildMcpServer } from "../lib/mcp/server";

process.env.MCP_OAUTH_ISSUER ??= "https://buildbyorsayn.com";

test("OAuth discovery does not expose the MCP icon as an OAuth endpoint", async () => {
  const response = await getAuthorizationMetadata(
    new Request("https://buildbyorsayn.com/.well-known/oauth-authorization-server"),
  );
  const metadata = await response.json() as { issuer: string; logo_uri?: string };

  assert.equal(response.status, 200);
  assert.equal(metadata.logo_uri, undefined);
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

test("the MCP initialize response exposes the official BUILD icon", async () => {
  const server = createBuildMcpServer({
    userId: "user",
    clientId: "client",
    tokenHash: "token-hash",
    tier: "beginner",
    scope: "mcp",
  });
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  try {
    await server.connect(transport);
    const response = await transport.handleRequest(new Request("https://buildbyorsayn.com/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "branding-test", version: "1.0.0" },
        },
      }),
    }));
    const payload = await response.json() as {
      result?: { serverInfo?: { title?: string; websiteUrl?: string; icons?: Array<{ src?: string; mimeType?: string }> } };
    };
    const serverInfo = payload.result?.serverInfo;
    assert.equal(response.status, 200);
    assert.equal(serverInfo?.title, "BUILD by Orsayn");
    assert.equal(serverInfo?.websiteUrl, "https://buildbyorsayn.com");
    assert.deepEqual(serverInfo?.icons?.[0], {
      src: "https://buildbyorsayn.com/api/mcp/logo",
      mimeType: "image/png",
      sizes: ["549x528"],
    });
  } finally {
    await server.close();
  }
});

test("the consent page uses clear French copy and trusted client branding", async () => {
  const page = await readFile("app/mcp/consent/page.tsx", "utf8");

  assert.match(page, /\/api\/mcp\/logo/);
  assert.match(page, /alt="BUILD"/);
  assert.match(page, /Connecter \{presentation\.displayName\} à BUILD/);
  assert.match(page, /Autoriser \{presentation\.displayName\}/);
  assert.match(page, /Afficher les détails techniques/);
  assert.match(page, /title: "Connecter un assistant à BUILD"/);
  assert.doesNotMatch(page, /title: "Connecter Claude à BUILD"/);
  assert.doesNotMatch(page, /Application non verifiee/);
  assert.doesNotMatch(page, /Destination exacte/);
});
