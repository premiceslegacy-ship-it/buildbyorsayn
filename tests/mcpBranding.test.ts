import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { GET as getMcpLogo } from "../app/api/mcp/logo/route";
import { GET as getAuthorizationMetadata } from "../app/.well-known/oauth-authorization-server/route";
import { buildAssistantInstructions } from "../lib/mcp/assistantInstructions";
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

test("the MCP branding route serves the new BUILD PNG at the size the server declares", async () => {
  const response = await getMcpLogo();
  const bytes = new Uint8Array(await response.arrayBuffer());
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");
  assert.deepEqual(Array.from(bytes.slice(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(`${view.getUint32(16)}x${view.getUint32(20)}`, "1024x1024");
});

test("the MCP branding route fails closed with a 404 and a log when the file is missing", async () => {
  const emptyDirectory = await mkdtemp(path.join(os.tmpdir(), "mcp-logo-"));
  const originalDirectory = process.cwd();
  const originalError = console.error;
  const logged: unknown[][] = [];
  console.error = (...args: unknown[]) => { logged.push(args); };

  try {
    process.chdir(emptyDirectory);
    const response = await getMcpLogo();
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(await response.text(), "");
    assert.equal(logged.length, 1);
    assert.match(String(logged[0][0]), /\[mcp-logo\]/);
  } finally {
    process.chdir(originalDirectory);
    console.error = originalError;
    await rm(emptyDirectory, { recursive: true, force: true });
  }
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
      result?: { instructions?: string; serverInfo?: { title?: string; websiteUrl?: string; icons?: Array<{ src?: string; mimeType?: string }> } };
    };
    const serverInfo = payload.result?.serverInfo;
    assert.equal(payload.result?.instructions, buildAssistantInstructions({ syncOrigin: "https://buildbyorsayn.com" }));
    assert.match(payload.result?.instructions ?? "", /Ne contourne jamais un refus/);
    assert.equal(response.status, 200);
    assert.equal(serverInfo?.title, "BUILD by Orsayn");
    assert.equal(serverInfo?.websiteUrl, "https://buildbyorsayn.com");
    assert.deepEqual(serverInfo?.icons?.[0], {
      src: "https://buildbyorsayn.com/api/mcp/logo",
      mimeType: "image/png",
      sizes: ["1024x1024"],
    });
  } finally {
    await server.close();
  }
});
