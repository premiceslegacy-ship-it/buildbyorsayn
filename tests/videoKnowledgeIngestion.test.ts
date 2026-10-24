import assert from "node:assert/strict";
import test from "node:test";
import { computeContentHash } from "../lib/knowledge/chunk";
import { collectVideoTranscriptDocuments } from "../lib/knowledge/sources";

const row = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  bloc_id: "2",
  position: 1,
  title: "La stack utile",
  transcript: "[0:00] Introduction à la stack.\n[1:00] On choisit selon le projet.\n[2:30] On vérifie les droits.",
  chapters: [
    { index: 1, title: "Comprendre", startSeconds: 0 },
    { index: 2, title: "Choisir", startSeconds: 60 },
  ],
  duration_seconds: 240,
  tier_required: "full",
};

test("a published transcript becomes timestamped bloc knowledge with full-tier metadata", () => {
  const documents = collectVideoTranscriptDocuments([row]);
  assert.equal(documents.length, 2);
  assert.deepEqual(documents.map((document) => document.sourceId), [
    "video:bloc-2:video-1:chapter-1",
    "video:bloc-2:video-1:chapter-2",
  ]);
  assert.equal(documents[0].tier, "full");
  assert.match(documents[1].content, /\[1:00\]/);
  assert.equal(documents[1].metadata?.blocNumero, 2);
  assert.equal(documents[1].metadata?.chapterIndex, 2);
  assert.equal(documents[1].metadata?.startSeconds, 60);
  assert.equal(documents[1].metadata?.endSeconds, 240);
  assert.equal(documents[1].metadata?.kind, "transcript");
});
test("a published protocol transcript keeps its public location and beginner access tier", () => {
  const documents = collectVideoTranscriptDocuments([{ ...row, bloc_id: "protocole", tier_required: "beginner" }]);
  assert.equal(documents.length, 2);
  assert.equal(documents[0].sourceId, "video:protocole:video-1:chapter-1");
  assert.equal(documents[0].tier, "beginner");
  assert.equal(documents[0].metadata?.blocNumero, "protocole");
});

test("ingestion fails closed if a reserved video is mislabeled as beginner", () => {
  assert.throws(
    () => collectVideoTranscriptDocuments([{ ...row, tier_required: "beginner" }]),
    /tier mismatch/i,
  );
});

test("knowledge hash changes when a timestamp changes", () => {
  const base = computeContentHash("full", "Titre", "Texte", { startSeconds: 60, kind: "transcript" });
  const moved = computeContentHash("full", "Titre", "Texte", { startSeconds: 61, kind: "transcript" });
  assert.notEqual(base, moved);
});
