import assert from "node:assert/strict";
import test from "node:test";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { ASSISTANT_BENCH_CASES, BENCH_TIERS, validateBenchCases } from "../scripts/bench-assistant/cases";
import {
  BUILD_ASSISTANT_INSTRUCTIONS_MAX_CHARS,
  buildAssistantInstructions,
} from "../lib/mcp/assistantInstructions";
import {
  createBuildMcpServer,
} from "../lib/mcp/server";
import { COFFRE_PRICE, FONDATIONS_PRICE, UPGRADE_PRICE } from "../lib/pricing";
import { SKILLS_CATALOG } from "../lib/skillsCatalog";

process.env.MCP_OAUTH_ISSUER ??= "https://buildbyorsayn.com";

test("the reproducible assistant benchmark keeps 60 hand-written cases and 20 sealed holdouts", () => {
  assert.doesNotThrow(() => validateBenchCases());
  assert.equal(ASSISTANT_BENCH_CASES.length, 60);
  assert.equal(ASSISTANT_BENCH_CASES.filter((item) => item.split === "holdout").length, 20);
  for (const tier of BENCH_TIERS) {
    assert.equal(ASSISTANT_BENCH_CASES.filter((item) => item.tier === tier).length, 20);
  }

  const instructions = buildAssistantInstructions({ syncOrigin: "https://sync.example.test" });
  for (const item of ASSISTANT_BENCH_CASES) {
    assert.equal(instructions.includes(item.question), false, `${item.id} leaked into the assistant instructions`);
  }
});

test("assistant instructions remain inside the declared context budget", () => {
  const instructions = buildAssistantInstructions({ syncOrigin: "https://sync.example.test" });
  assert.ok(instructions.length > 0);
  assert.ok(instructions.length <= BUILD_ASSISTANT_INSTRUCTIONS_MAX_CHARS);
});

test("list_available_content exposes current code-derived offers and only the requester's skills", async () => {
  const server = createBuildMcpServer({
    userId: "user",
    clientId: "client",
    tokenHash: "token-hash",
    quotaPrincipal: '["user","client"]',
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
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "list_available_content", arguments: {} },
      }),
    }));
    const payload = await response.json() as {
      result: {
        structuredContent: {
          kind: string;
          tier: string;
          offers: { foundations: { price: number }; full: { price: number }; upgrade: { price: number } };
          skills: Array<{ slug: string; access: string; delivery: string }>;
          lockedSkillsCount: number;
        };
      };
    };
    const content = payload.result.structuredContent;
    assert.equal(content.kind, "available_build_content");
    assert.equal(content.tier, "beginner");
    assert.equal(content.offers.foundations.price, FONDATIONS_PRICE);
    assert.equal(content.offers.full.price, COFFRE_PRICE);
    assert.equal(content.offers.upgrade.price, UPGRADE_PRICE);
    assert.deepEqual(
      content.skills.map((skill) => skill.slug).sort(),
      SKILLS_CATALOG.filter((skill) => skill.access !== "full").map((skill) => skill.slug).sort(),
    );
    assert.ok(content.skills.every((skill) => skill.access !== "full"));
    assert.equal(content.lockedSkillsCount, SKILLS_CATALOG.filter((skill) => skill.access === "full").length);
  } finally {
    await server.close();
  }
});
