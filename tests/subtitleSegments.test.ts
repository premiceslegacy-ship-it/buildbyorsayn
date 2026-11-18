import assert from "node:assert/strict";
import test from "node:test";
import { SubtitleFormatError, parseSubtitleSegments, parseTranscriptSegmentsJson } from "../lib/mux/adminLessons";

test("un fichier VTT dont la première réplique démarre après 0 s est accepté et rattaché à 0 s", () => {
  const segments = parseSubtitleSegments("WEBVTT\n\n1\n00:00:00.333 --> 00:00:03.033\nBonsoir à tous.\n\n2\n00:00:03.067 --> 00:00:07.233\nOn commence.\n");
  assert.deepEqual(segments, [
    { startSeconds: 0, text: "Bonsoir à tous." },
    { startSeconds: 3, text: "On commence." },
  ]);
});

test("les repères sont des secondes entières relisibles par le stockage", () => {
  const segments = parseSubtitleSegments("WEBVTT\n\n00:00:00.000 --> 00:00:01.500\nUn\n\n00:00:01.600 --> 00:00:02.900\nDeux\n\n00:00:02.100 --> 00:00:03.000\nTrois\n");
  assert.deepEqual(segments, [
    { startSeconds: 0, text: "Un" },
    { startSeconds: 1, text: "Deux" },
    { startSeconds: 2, text: "Trois" },
  ]);
  assert.equal(parseTranscriptSegmentsJson(segments).length, segments.length);
});

test("deux répliques dans la même seconde sont regroupées", () => {
  const segments = parseSubtitleSegments("1\n00:00:05,100 --> 00:00:05,400\nA\n\n2\n00:00:05,500 --> 00:00:06,900\nB\n");
  assert.deepEqual(segments, [{ startSeconds: 0, text: "A B" }]);
});

test("le format SRT et les balises sont gérés", () => {
  const segments = parseSubtitleSegments("1\n00:00:00,000 --> 00:00:02,000\n<i>Salut</i>\ntout le monde\n");
  assert.deepEqual(segments, [{ startSeconds: 0, text: "Salut tout le monde" }]);
});

test("un fichier sans repère ou dans le désordre donne un message lisible", () => {
  assert.throws(() => parseSubtitleSegments("n'importe quoi"), SubtitleFormatError);
  assert.throws(
    () => parseSubtitleSegments("1\n00:00:09.000 --> 00:00:10.000\nA\n\n2\n00:00:03.000 --> 00:00:04.000\nB\n"),
    (error: unknown) => error instanceof SubtitleFormatError && /ordre/.test(error.message),
  );
});
