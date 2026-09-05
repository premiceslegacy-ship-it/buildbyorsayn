import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  assertMcpSuccess,
  assertTextToolResult,
  assertToolsList,
  sanitizeE2eDiagnostic,
} from "../scripts/mcp-e2e-assertions";

test("MCP success assertion binds the JSON-RPC ID and rejects both error channels", () => {
  assert.deepEqual(assertMcpSuccess({ jsonrpc: "2.0", id: 7, result: { ok: true } }, 7), { ok: true });
  assert.throws(() => assertMcpSuccess({ jsonrpc: "2.0", id: 8, result: {} }, 7));
  assert.throws(() => assertMcpSuccess({ jsonrpc: "2.0", id: 7, error: { code: -1 } }, 7));
  assert.throws(() => assertMcpSuccess({ jsonrpc: "2.0", id: 7, result: { isError: true } }, 7));
  assert.throws(() => assertMcpSuccess({ jsonrpc: "2.0", id: 7 }, 7));
});

test("tools/list must expose exactly the expected tool names", () => {
  const expected = ["get_skill", "list_available_content", "search_knowledge"];
  assert.deepEqual(assertToolsList({ tools: expected.map((name) => ({ name })) }), expected);
  assert.throws(() => assertToolsList({ tools: [{ name: "search_knowledge" }] }));
  assert.throws(() => assertToolsList({ tools: [...expected.map((name) => ({ name })), { name: "admin" }] }));
  assert.throws(() => assertToolsList({ tools: [{ name: 42 }] }));
});

test("text tool assertion requires one meaningful text content block", () => {
  assert.equal(
    assertTextToolResult({ content: [{ type: "text", text: "  Useful BUILD content  " }] }),
    "Useful BUILD content"
  );
  assert.throws(() => assertTextToolResult({ content: [] }));
  assert.throws(() => assertTextToolResult({ content: [{ type: "image", text: "not text" }] }));
  assert.throws(() => assertTextToolResult({ content: [{ type: "text", text: "   " }] }));
});

test("E2E diagnostics redact exact secrets and OAuth query parameters", () => {
  const secret = "sensitive-value-123";
  const diagnostic = sanitizeE2eDiagnostic(
    `failed https://example.test/cb?code=${secret}&state=${secret} Authorization: Bearer ${secret} user@example.test`,
    [secret]
  );
  assert.doesNotMatch(diagnostic, /sensitive-value-123|user@example\.test/);
  assert.match(diagnostic, /code=\[REDACTED\]/);
  assert.match(diagnostic, /state=\[REDACTED\]/);
});

test("the executable E2E gate validates every MCP response and proves revocation order", async () => {
  const script = await readFile("scripts/verify-mcp-e2e.ts", "utf8");
  assert.match(script, /assertMcpSuccess\(initialize\.payload, 1\)/);
  assert.match(script, /assertToolsList\(assertMcpSuccess\(toolsList\.payload, 2\)\)/);
  assert.match(script, /assertMcpSuccess\(search\.payload, 3\)/);
  assert.match(script, /MCP_E2E_TIER/);
  assert.match(script, /tier: E2E_TIER/);
  assert.match(script, /name: "get_skill"[\s\S]*slug: "oracle-site-web"/);
  assert.match(script, /assertTextToolResult\(assertMcpSuccess\(getSkill\.payload, 4\)\)/);
  assert.match(script, /name: "list_available_content"/);
  assert.match(script, /assertTextToolResult\(\s*assertMcpSuccess\(availableContent\.payload, 5\)\s*\)/);
  assert.match(script, /availableContentText[\s\S]*oracle-site-web/);
  assert.match(script, /availableContentText[\s\S]*doesNotMatch[\s\S]*oracle-by-orsayn/);
  assert.match(script, /foundationSlugs/);
  assert.match(script, /coffreSlugs/);
  assert.match(script, /tierBoundary/);
  assert.match(script, /assertToolsList\(assertMcpSuccess\(response\.payload, 100 \+ index\)\)/);
  assert.match(script, /assertToolsList\(assertMcpSuccess\(response\.payload, 200 \+ index\)\)/);
  assert.match(script, /const secondAccessBeforeReplay[\s\S]*assertMcpSuccess\(secondAccessBeforeReplay\.payload, 6\)[\s\S]*const replayedRefresh/);
  assert.match(script, /const revokedFamilyCall[\s\S]*id: 7[\s\S]*assert\.equal\(revokedFamilyCall\.payload\.error, "unauthorized"\)/);
  assert.match(script, /verifyCleanup\(/);
  assert.match(script, /AbortSignal\.timeout\(/);
  assert.equal((script.match(/\bfetch\(/g) ?? []).length, 1, "only the timeout wrapper may call fetch directly");
  assert.match(script, /next\/dist\/bin\/next"\), "start"/);
  assert.doesNotMatch(script, /next\/dist\/bin\/next"\), "dev"/);

  const clientAssignment = script.indexOf("clientId = registration.client_id");
  const registrationAssertion = script.indexOf("assert.equal(registrationResponse.status, 201)");
  assert.ok(clientAssignment > 0 && clientAssignment < registrationAssertion);
  assert.match(script, /knowledgeSearchDurationMs/);
  assert.match(script, /MCP_TIER_THRESHOLDS\.toolsListP50MsLessThan/);
  assert.match(script, /MCP_TIER_THRESHOLDS\.toolsListP95MsLessThan/);
  assert.match(script, /MCP_TIER_THRESHOLDS\.concurrentBatchMsLessThan/);
  assert.match(script, /MCP_TIER_THRESHOLDS\.knowledgeSearchMsLessThan/);
  assert.match(script, /assert\.equal\(tierBoundaryText, LOCKED_SKILL_RESPONSE\)/);
  assert.match(script, /assert\.equal\(tierBoundaryText, ARCHIVED_SKILL_RESPONSE\)/);
  assert.match(script, /mcp_authorization_requests/);
  assert.match(script, /mcp_authorization_codes/);
  assert.match(script, /mcp_access_tokens/);
  assert.match(script, /mcp_refresh_tokens/);
  assert.match(script, /temporaryAuthorizationRequestsRemaining/);
  assert.match(script, /temporaryAuthorizationCodesRemaining/);
  assert.match(script, /temporaryAccessTokensRemaining/);
  assert.match(script, /temporaryRefreshTokensRemaining/);
});

test("tier runtime evidence is generated by the executable verifier", async () => {
  const generator = await readFile("scripts/verify-mcp-tier-evidence.ts", "utf8");
  const manifest = JSON.parse(await readFile("package.json", "utf8")) as {
    scripts: Record<string, string>;
  };
  const evidence = JSON.parse(
    await readFile("product/accompagnement-site-web/visual-qa/mcp-tier-runtime-verification.json", "utf8")
  ) as Record<string, unknown>;
  assert.match(generator, /mcp-tier-runtime-verification\.json/);
  assert.match(generator, /writeFile/);
  assert.match(generator, /MCP_E2E_TIER/);
  assert.match(generator, /beginner/);
  assert.match(generator, /full/);
  assert.match(manifest.scripts["test:mcp-tiers"], /verify-mcp-tier-evidence\.ts/);
  assert.equal(evidence.generatedBy, "scripts/verify-mcp-tier-evidence.ts");
  assert.equal(evidence.verdict, "PASS");
  assert.deepEqual(
    (evidence.tierHttpRuns as Array<Record<string, unknown>>).map((run) => run.tier),
    ["beginner", "full"]
  );
});
