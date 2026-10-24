import assert from "node:assert/strict";
import test from "node:test";
import { parseChapterLines, validateManualTranscript } from "../lib/mux/videoContent";

test("les chapitres admin signalent la ligne mal formée et produisent un aperçu valide", () => {
  assert.match(parseChapterLines("0:00 Introduction\nligne invalide", 300).error ?? "", /Ligne 2/);
  const parsed = parseChapterLines("0:00 Introduction\n1:30 Mise en pratique", 300);
  assert.equal(parsed.error, null);
  assert.deepEqual(parsed.chapters.map((chapter) => [chapter.index, chapter.startSeconds, chapter.title]), [
    [1, 0, "Introduction"],
    [2, 90, "Mise en pratique"],
  ]);
});

test("les chapitres admin refusent le premier repère, le désordre et la durée dépassée", () => {
  assert.match(parseChapterLines("0:01 Départ", 300).error ?? "", /premier chapitre.*0:00/);
  assert.match(parseChapterLines("0:00 Départ\n0:00 Suite", 300).error ?? "", /Ligne 2.*après le précédent/);
  assert.match(parseChapterLines("0:00 Départ\n5:00 Fin", 300).error ?? "", /Ligne 2.*durée/);
});

test("une transcription relue conserve ses repères et devient manuelle", () => {
  const result = validateManualTranscript("[0:00] Départ\n[0:30] Une idée relue.");
  assert.equal(result.error, null);
  assert.equal(result.transcript, "[0:00] Départ\n[0:30] Une idée relue.");
  assert.deepEqual(result.segments.map((segment) => segment.startSeconds), [0, 30]);
  assert.match(validateManualTranscript("trop court").error ?? "", /20 caractères/);
});
