import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { GET as getAuthorizationMetadata } from "../app/.well-known/oauth-authorization-server/route";
import {
  isMcpConnectorAccountAllowed,
  isMcpConnectorLaunched,
} from "../lib/mcp/launch";

test("the MCP server gate is closed without the server flag and allows only listed accounts", async () => {
  const env = {
    MCP_CONNECTOR_LAUNCHED: "false",
    MCP_CONNECTOR_ALLOWED_ACCOUNT_IDS: "user-approved",
  } as unknown as NodeJS.ProcessEnv;
  assert.equal(isMcpConnectorLaunched(env), false);
  assert.equal(isMcpConnectorAccountAllowed("user-other", env), false);
  assert.equal(isMcpConnectorAccountAllowed("user-approved", env), true);
  assert.equal(isMcpConnectorAccountAllowed("user-other", { ...env, MCP_CONNECTOR_LAUNCHED: "true" }), true);

  const original = process.env.MCP_CONNECTOR_LAUNCHED;
  try {
    process.env.MCP_CONNECTOR_LAUNCHED = "false";
    assert.equal(
      (await getAuthorizationMetadata(new Request("https://buildbyorsayn.com/.well-known/oauth-authorization-server"))).status,
      404,
    );
  } finally {
    if (original === undefined) delete process.env.MCP_CONNECTOR_LAUNCHED;
    else process.env.MCP_CONNECTOR_LAUNCHED = original;
  }
});

test("toutes les routes de connexion utilisent la gate serveur", async () => {
  const routes = [
    "app/.well-known/oauth-authorization-server/route.ts",
    "app/.well-known/oauth-protected-resource/route.ts",
    "app/api/mcp/oauth/register/route.ts",
    "app/api/mcp/oauth/authorize/route.ts",
    "app/api/mcp/oauth/token/route.ts",
    "app/api/mcp/route.ts",
    "app/api/build-sync/oauth/authorize/route.ts",
    "app/api/build-sync/oauth/token/route.ts",
    "app/api/mcp/showcase-asset/route.ts",
  ];
  for (const route of routes) {
    const source = await readFile(route, "utf8");
    assert.match(source, /isMcp(?:ConnectorLaunched|BetaAssetVisible)/, route);
  }
});
