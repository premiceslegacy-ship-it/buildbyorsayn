import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildMcpLogRecord,
  resolveMcpRequestId,
  serializeMcpLogRecord,
} from "../lib/mcp/observability";

test("request IDs accept a bounded safe value and replace attacker-controlled values", () => {
  assert.equal(resolveMcpRequestId("req_abc-123.456"), "req_abc-123.456");
  assert.match(resolveMcpRequestId("Bearer secret-value\nforged"), /^[0-9a-f-]{36}$/);
  assert.match(resolveMcpRequestId("x".repeat(65)), /^[0-9a-f-]{36}$/);
});

test("MCP logs expose only bounded operational fields", () => {
  const record = buildMcpLogRecord({
    event: "mcp.request",
    requestId: "req-123",
    outcome: "allowed",
    status: 200,
    durationMs: 12.3456,
  });
  assert.deepEqual(Object.keys(record).sort(), [
    "durationMs",
    "event",
    "level",
    "outcome",
    "requestId",
    "status",
    "timestamp",
  ]);
  assert.equal(record.durationMs, 12.3);
  assert.doesNotMatch(serializeMcpLogRecord(record), /authorization|bearer|query|content|token/i);
});

test("every MCP authorization lifecycle boundary emits only structured operational logs", async () => {
  const boundaries = [
    ["app/api/mcp/oauth/register/route.ts", "mcp.oauth.register"],
    ["app/api/mcp/oauth/authorize/route.ts", "mcp.oauth.authorize"],
    ["app/api/mcp/oauth/token/route.ts", "mcp.oauth.token"],
    ["app/actions/mcpConsent.ts", "mcp.oauth.consent"],
    ["app/actions/mcpConnections.ts", "mcp.oauth.revoke"],
  ] as const;

  for (const [path, event] of boundaries) {
    const source = await readFile(path, "utf8");
    assert.match(source, /logMcpEvent|observeMcpRoute/, `${path} is not instrumented`);
    assert.match(source, new RegExp(event.replaceAll(".", "\\.")));
    assert.doesNotMatch(source, /console\.(?:log|warn|error)/);
  }
});
