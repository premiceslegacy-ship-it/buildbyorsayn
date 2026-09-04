import assert from "node:assert/strict";
import test from "node:test";
import { findKnowledgeSecretHazards } from "../lib/knowledge/safety";

test("knowledge safety scan covers every source without returning content", () => {
  const hazards = findKnowledgeSecretHazards([
    {
      source: "skills-content",
      sourceId: "safe",
      title: "Safe",
      content: "Ordinary training content",
      tier: "full",
    },
    {
      source: "blocs",
      sourceId: "leaky",
      title: "Leaky",
      content: `Credential: ${"github_pat_"}${"a".repeat(40)}`,
      tier: "preview",
    },
  ]);

  assert.deepEqual(hazards, [{ source: "blocs", sourceId: "leaky" }]);
  assert.equal(JSON.stringify(hazards).includes("github_pat"), false);
});

test("knowledge safety scans source identifiers and redacts hazardous paths", () => {
  const hazardousValue = "MCP_REQUEST_RATE_LIMIT_PEPPER=" + "a".repeat(32);
  const hazards = findKnowledgeSecretHazards([
    {
      source: "obsidian",
      sourceId: `notes/${hazardousValue}.md`,
      title: "Safe title",
      content: "Ordinary training content",
      tier: "full",
    },
  ]);

  assert.deepEqual(hazards, [{ source: "obsidian", sourceId: "[REDACTED]" }]);
  assert.equal(JSON.stringify(hazards).includes(hazardousValue), false);
});
