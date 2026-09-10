import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { sha256, parseDoctrineManifest, verifyDoctrineFiles } from "../lib/doctrine/publication";
import { serveDoctrine } from "../lib/doctrine/access";
import { doctrineDocuments } from "../lib/knowledge/doctrineSource";
import { SEARCH_KNOWLEDGE_INPUT_SCHEMA, validateKnowledgeMatches } from "../lib/mcp/server";

const bytes = Buffer.from("# Example\n\nA synthetic reference, not private doctrine.");
const entry = { path: "example.md", sha256: sha256(bytes), bytes: bytes.length };
const fixture = () => ({ schemaVersion: 1, releaseId: "test-release", tier: "full", artifacts: [entry] });

test("doctrine handler refuses anonymous and Foundation before storage, permits full", async () => {
  for (const status of [401, 403] as const) {
    let reads = 0;
    const response = await serveDoctrine(async () => status, async () => { reads++; return []; });
    assert.equal(response.status, status);
    assert.equal(reads, 0);
    assert.doesNotMatch(await response.text(), /synthetic reference/);
  }
  const response = await serveDoctrine(async () => 200, async () => [{ path: entry.path, content: bytes.toString() }]);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /synthetic reference/);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});

test("strict manifest rejects downgrade, traversal, duplicates and unknown keys", () => {
  assert.equal(parseDoctrineManifest(fixture()).tier, "full");
  for (const invalid of [
    { ...fixture(), tier: "beginner" }, { ...fixture(), schemaVersion: 2 },
    { ...fixture(), extra: true }, { ...fixture(), artifacts: [] },
    { ...fixture(), artifacts: [entry, entry] },
    { ...fixture(), artifacts: [{ ...entry, path: "../example.md" }] },
    { ...fixture(), artifacts: [{ ...entry, path: "example.html" }] },
  ]) assert.throws(() => parseDoctrineManifest(invalid));
});

test("exact artifact bytes and complete manifest inventory are required", async () => {
  const manifest = parseDoctrineManifest(fixture());
  const result = await verifyDoctrineFiles(manifest, async () => bytes);
  assert.equal(result[0].content, bytes.toString());
  await assert.rejects(verifyDoctrineFiles(manifest, async () => Buffer.from("changed")));
  await assert.rejects(verifyDoctrineFiles(manifest, async () => { throw Error("missing"); }));
});

test("doctrine ingestion is full-only and MCP rejects full rows for lower tiers", () => {
  const docs = doctrineDocuments([{ path: entry.path, content: bytes.toString() }]);
  assert.equal(docs[0].source, "doctrine");
  assert.equal(docs[0].tier, "full");
  SEARCH_KNOWLEDGE_INPUT_SCHEMA.parse({ query: "example", source: "doctrine" });
  const rows = [{ title: "Example", content: bytes.toString(), source: "doctrine", tier_required: docs[0].tier, similarity: 0.9 }];
  for (const tier of ["free", "preview", "beginner"] as const) assert.equal(validateKnowledgeMatches(rows, tier), null);
  assert.deepEqual(validateKnowledgeMatches(rows, "full"), rows);
});

test("doctrine page is dynamic server-only and has no local corpus fallback", () => {
  const page = readFileSync(new URL("../app/doctrine/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /use client|dangerouslySetInnerHTML/);
  assert.match(page, /force-dynamic/);
  assert.ok(page.indexOf("await doctrineAccessStatus()") < page.indexOf("await readPublishedDoctrine()"));
  const storage = readFileSync(new URL("../lib/doctrine/storage.ts", import.meta.url), "utf8");
  assert.doesNotMatch(storage, /readFile|process\.cwd|docs\//);
  assert.match(storage, /cache: "no-store"/);
});
