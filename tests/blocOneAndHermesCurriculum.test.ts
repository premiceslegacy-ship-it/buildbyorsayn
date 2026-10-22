import assert from "node:assert/strict";
import test from "node:test";
import { chapterPathFromSlug, chapterSlug, CHAPTER_META, orderCurriculumFiles } from "../app/videos/tutos/chapters";


test("les trois chapitres Coffre ajoutés sont placés dans le parcours et ouvrent leur route", () => {
  for (const path of [
    "09-message-decision-preuve.md",
    "10-qualification-experimentation-premiere-valeur.md",
    "entreprise-09-gouvernance-capacites-et-reprise.md",
  ]) {
    assert.ok(CHAPTER_META[path], `métadonnée absente : ${path}`);
    assert.equal(chapterPathFromSlug(chapterSlug(path)), path);
  }
});

test("le lecteur parcourt les chapitres dans le même ordre que le parcours visible", () => {
  const ordered = orderCurriculumFiles([
    { path: "entreprise-09-gouvernance-capacites-et-reprise.md" },
    { path: "10-qualification-experimentation-premiere-valeur.md" },
    { path: "entreprise-formats.md" },
    { path: "09-message-decision-preuve.md" },
    { path: "entreprise-01-cerveau-federe.md" },
    { path: "07-methode-offre-transmission.md" },
  ]);

  assert.deepEqual(ordered.map((file) => file.path), [
    "07-methode-offre-transmission.md",
    "09-message-decision-preuve.md",
    "10-qualification-experimentation-premiere-valeur.md",
    "entreprise-01-cerveau-federe.md",
    "entreprise-formats.md",
    "entreprise-09-gouvernance-capacites-et-reprise.md",
  ]);
});
