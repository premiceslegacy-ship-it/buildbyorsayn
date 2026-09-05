import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

import { GET } from "@/app/api/mcp/showcase-asset/route";

test("the co-branded MCP asset is inaccessible until the launch gate is true", async () => {
  const original = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED;

  try {
    process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED = "false";
    const hidden = await GET();
    assert.equal(hidden.status, 404);
    assert.equal(hidden.headers.get("cache-control"), "no-store");

    process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED = "true";
    const launched = await GET();
    assert.equal(launched.status, 200);
    assert.equal(launched.headers.get("content-type"), "image/webp");
    assert.equal(launched.headers.get("cache-control"), "private, no-store");
    assert.ok((await launched.arrayBuffer()).byteLength > 100_000);
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED;
    else process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED = original;
  }
});

test("no MCP co-brand asset is directly published from public", async () => {
  await assert.rejects(access("public/brand-assets/build-mcp-connector-characters.webp"));
  await assert.rejects(access("public/brand-assets/build-mcp-connector-source.png"));
});
