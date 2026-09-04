import assert from "node:assert/strict";
import test from "node:test";
import { chunkText, computeContentHash } from "../lib/knowledge/chunk";

test("a short section becomes a single chunk prefixed with its title", () => {
  const chunks = chunkText("My Section", "Short content.");
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].chunkIndex, 0);
  assert.match(chunks[0].content, /^My Section\n\nShort content\./);
});

test("a long section is split into multiple chunks with increasing indices", () => {
  const longParagraph = "Sentence about the method and its details. ".repeat(60);
  const content = Array.from({ length: 6 }, () => longParagraph).join("\n\n");
  const chunks = chunkText("Long Section", content);
  assert.ok(chunks.length > 1);
  chunks.forEach((chunk, index) => assert.equal(chunk.chunkIndex, index));
  chunks.forEach((chunk) => assert.ok(chunk.content.startsWith("Long Section\n\n")));
  chunks.forEach((chunk) => assert.ok(chunk.content.length <= 1500));
});

test("a single oversized paragraph is split under the hard 1500 character ceiling", () => {
  const chunks = chunkText("Long", "One sentence with detail. ".repeat(300));
  assert.ok(chunks.length > 1);
  chunks.forEach((chunk) => assert.ok(chunk.content.length <= 1500));
});

test("chunk overlap preserves context near boundaries", () => {
  const content = Array.from(
    { length: 120 },
    (_, index) => `Sentence ${index} explains one precise business idea.`
  ).join(" ");
  const chunks = chunkText("Context", content);
  assert.ok(chunks.length > 1);
  const firstTail = chunks[0].content.slice(-80);
  assert.ok(chunks[1].content.includes(firstTail.trim()));
});

test("chunking is deterministic for the same input", () => {
  const content = "Paragraph one.\n\nParagraph two.\n\nParagraph three.".repeat(20);
  const first = chunkText("Section", content);
  const second = chunkText("Section", content);
  assert.deepEqual(first, second);
});

test("computeContentHash is a stable 64-char hex digest", () => {
  const hash = computeContentHash("beginner", "Title", "Content");
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(hash, computeContentHash("beginner", "Title", "Content"));
});

test("computeContentHash changes when only the tier changes", () => {
  const beginnerHash = computeContentHash("beginner", "Title", "Content");
  const fullHash = computeContentHash("full", "Title", "Content");
  assert.notEqual(beginnerHash, fullHash);
});

test("computeContentHash changes when content changes", () => {
  const a = computeContentHash("full", "Title", "Content A");
  const b = computeContentHash("full", "Title", "Content B");
  assert.notEqual(a, b);
});
