import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildIngestionPlan,
  parseMaxChunks,
  type ExistingChunkIdentity,
  type PreparedKnowledgeChunk,
} from "../lib/knowledge/ingestionPlan";

const chunks: PreparedKnowledgeChunk[] = [
  {
    source: "obsidian",
    sourceId: "folder:note.md",
    chunkIndex: 0,
    title: "A",
    content: "A",
    tier: "preview",
    contentHash: "a".repeat(64),
  },
  {
    source: "obsidian",
    sourceId: "folder:note.md",
    chunkIndex: 1,
    title: "A",
    content: "B",
    tier: "preview",
    contentHash: "b".repeat(64),
  },
];

test("max-chunks deletes revoked and deferred changed rows instead of serving stale access", () => {
  const existing: ExistingChunkIdentity[] = [
    { source: "obsidian", sourceId: "folder:note.md", chunkIndex: 0, contentHash: "old" },
    { source: "obsidian", sourceId: "folder:note.md", chunkIndex: 1, contentHash: "old" },
    { source: "obsidian", sourceId: "old:note.md", chunkIndex: 0, contentHash: "old" },
  ];
  const plan = buildIngestionPlan(chunks, existing, new Set(["obsidian"]), 1);
  assert.equal(plan.toEmbed.length, 1);
  assert.equal(plan.allowDeletion, true);
  assert.deepEqual(plan.stale, [existing[1], existing[2]]);
  assert.deepEqual(plan.inventory, [
    { source: "obsidian", sourceId: "folder:note.md", chunkIndex: 0 },
  ]);
});

test("a successful empty source scan removes all stale source rows", () => {
  const existing: ExistingChunkIdentity[] = [
    { source: "obsidian", sourceId: "revoked.md", chunkIndex: 0, contentHash: "old" },
  ];
  const plan = buildIngestionPlan([], existing, new Set(["obsidian"]), Number.POSITIVE_INFINITY);
  assert.equal(plan.allowDeletion, true);
  assert.deepEqual(plan.stale, [existing[0]]);
});

test("source ids containing colons remain intact in stale identities", () => {
  const existing: ExistingChunkIdentity[] = [
    { source: "obsidian", sourceId: "folder:note.md", chunkIndex: 7, contentHash: "old" },
  ];
  const plan = buildIngestionPlan([], existing, new Set(["obsidian"]), Number.POSITIVE_INFINITY);
  assert.equal(plan.stale[0].sourceId, "folder:note.md");
  assert.equal(plan.stale[0].chunkIndex, 7);
});

test("max-chunks accepts only positive integers", () => {
  assert.equal(parseMaxChunks(undefined), Number.POSITIVE_INFINITY);
  assert.equal(parseMaxChunks("--max-chunks=5"), 5);
  for (const value of [
    "--max-chunks=0",
    "--max-chunks=-1",
    "--max-chunks=1.5",
    "--max-chunks=NaN",
  ]) {
    assert.throws(() => parseMaxChunks(value));
  }
});

test("explicit Obsidian revocation runs before embedding setup and verifies deletion", async () => {
  const script = await readFile("scripts/ingest-knowledge.ts", "utf8");
  const revokeBranch = script.indexOf("if (REVOKE_OBSIDIAN)");
  const providerSetup = script.indexOf("createEmbeddingProvider()");
  assert.ok(revokeBranch >= 0 && providerSetup > revokeBranch);
  assert.match(script, /p_scanned_sources:\s*\["obsidian"\]/);
  assert.match(script, /\.select\("source",\s*\{ count: "exact", head: true \}\)[\s\S]{0,80}\.eq\("source", "obsidian"\)/);
});
