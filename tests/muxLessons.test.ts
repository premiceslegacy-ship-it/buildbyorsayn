import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { applyImportedLesson, pickSignedPlaybackId, serializeLessonsFile, type LessonsFile } from "../lib/mux/lessons";
import { BLOCS_DATA as corpus } from "../lib/mockData";

const base: LessonsFile = { lessons: [
  { sectionId: "b1-s0", muxAssetId: null, playbackId: null, durationSeconds: null, deliverables: ["Un livrable"] },
  { sectionId: "b1-s1", muxAssetId: "old-asset", playbackId: "old-playback", durationSeconds: 100, deliverables: [] },
] };

test("pickSignedPlaybackId never accepts a public playback id", () => {
  assert.equal(pickSignedPlaybackId([{ id: "pub", policy: "public" }, { id: "sig", policy: "signed" }]), "sig");
  assert.equal(pickSignedPlaybackId([{ id: "pub", policy: "public" }]), null);
  assert.equal(pickSignedPlaybackId([]), null);
  assert.equal(pickSignedPlaybackId(undefined), null);
});

test("applyImportedLesson rewrites only the target entry and keeps authored deliverables", () => {
  const { file, previousAssetId } = applyImportedLesson(base, "b1-s0", { muxAssetId: "a0", playbackId: "p0", durationSeconds: 612 });
  assert.deepEqual(file.lessons[0], { sectionId: "b1-s0", muxAssetId: "a0", playbackId: "p0", durationSeconds: 612, deliverables: ["Un livrable"] });
  assert.deepEqual(file.lessons[1], base.lessons[1]);
  assert.equal(previousAssetId, null);
  assert.equal(base.lessons[0].playbackId, null, "input must not be mutated");
});

test("applyImportedLesson reports a replaced asset so it can be deleted by hand, and rejects unknown sections", () => {
  const { previousAssetId } = applyImportedLesson(base, "b1-s1", { muxAssetId: "new", playbackId: "p", durationSeconds: 1 });
  assert.equal(previousAssetId, "old-asset");
  assert.equal(applyImportedLesson(base, "b1-s1", { muxAssetId: "old-asset", playbackId: "p", durationSeconds: 1 }).previousAssetId, null);
  assert.throws(() => applyImportedLesson(base, "b9-s9", { muxAssetId: "a", playbackId: "p", durationSeconds: 1 }), /b9-s9/);
});

test("serializeLessonsFile writes 2-space JSON with a trailing newline", () => {
  const text = serializeLessonsFile(base);
  assert.ok(text.endsWith("}\n"));
  assert.match(text, /^\{\n  "lessons": \[\n    \{\n      "sectionId"/);
  assert.deepEqual(JSON.parse(text), base);
});

test("every section has exactly one lesson entry, none is stray, and no identifier is imported yet by accident", () => {
  const shipped = JSON.parse(readFileSync(new URL("../lib/blocLessons.json", import.meta.url), "utf8")) as LessonsFile;
  const sectionIds = new Set(corpus.flatMap((bloc) => bloc.sections.map((section) => section.id)));
  const seen = new Set<string>();
  for (const lesson of shipped.lessons) {
    assert.ok(sectionIds.has(lesson.sectionId), lesson.sectionId);
    assert.ok(!seen.has(lesson.sectionId), `duplicate ${lesson.sectionId}`);
    seen.add(lesson.sectionId);
    assert.ok(lesson.deliverables.length <= 3, `${lesson.sectionId} deliverables`);
    assert.equal(lesson.playbackId === null, lesson.durationSeconds === null, `${lesson.sectionId} imported fields move together`);
  }
  assert.deepEqual([...seen].sort(), [...sectionIds].sort(), "every section of every bloc has exactly one lesson entry");
});

import { resolveAllowedDomains } from "../lib/mux/restriction";

test("playback restriction domains are explicit, normalised and never wider than the site", () => {
  assert.deepEqual(resolveAllowedDomains(["Build-System-Three.vercel.app", " build-system-three.vercel.app ", "*.orsayn.com"]), ["build-system-three.vercel.app", "*.orsayn.com"]);
  assert.throws(() => resolveAllowedDomains([]), /Pass the domain/);
  for (const bad of ["*", "https://orsayn.com", "orsayn.com/path", "localhost:3000", "*.vercel.app", "*.github.io", "not a host"]) {
    assert.throws(() => resolveAllowedDomains([bad]), undefined, bad);
  }
  assert.throws(() => resolveAllowedDomains(Array.from({ length: 11 }, (_, i) => `d${i}.example.com`)), /at most 10/);
});
