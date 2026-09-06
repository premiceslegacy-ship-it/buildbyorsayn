import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

import { GET } from "@/app/api/mcp/showcase-asset/route";

test("the co-branded MCP asset is available only in beta or after final launch", async () => {
  const originalLaunch = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED;
  const originalBeta = process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE;

  try {
    process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED = "false";
    process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE = "false";
    const hidden = await GET();
    assert.equal(hidden.status, 404);
    assert.equal(hidden.headers.get("cache-control"), "no-store");

    process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE = "true";
    const beta = await GET();
    assert.equal(beta.status, 200);
    assert.equal(beta.headers.get("content-type"), "image/webp");
    assert.ok((await beta.arrayBuffer()).byteLength > 100_000);

    process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE = "false";
    process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED = "true";
    const launched = await GET();
    assert.equal(launched.status, 200);
    assert.equal(launched.headers.get("content-type"), "image/webp");
    assert.equal(launched.headers.get("cache-control"), "private, no-store");
    assert.ok((await launched.arrayBuffer()).byteLength > 100_000);
  } finally {
    if (originalLaunch === undefined) delete process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED;
    else process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED = originalLaunch;
    if (originalBeta === undefined) delete process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE;
    else process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE = originalBeta;
  }
});

test("no MCP co-brand asset is directly published from public", async () => {
  await assert.rejects(access("public/brand-assets/build-mcp-connector-characters.webp"));
  await assert.rejects(access("public/brand-assets/build-mcp-connector-source.png"));
});
