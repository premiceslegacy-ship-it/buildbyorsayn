import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BLOCS_DATA } from "../lib/mockData";
import { chapterPathFromSlug, chapterSlug, CHAPTER_META, orderCurriculumFiles } from "../app/videos/tutos/chapters";

const hermesPage = readFileSync(new URL("../app/videos/tutos/page.tsx", import.meta.url), "utf8");
const blocClient = readFileSync(new URL("../app/blocs/[id]/BlocClient.tsx", import.meta.url), "utf8");

test("les trois chapitres Coffre ajoutés sont placés dans le parcours et ouvrent leur route", () => {
  for (const path of [
    "09-message-decision-preuve.md",
    "10-qualification-experimentation-premiere-valeur.md",
    "entreprise-09-gouvernance-capacites-et-reprise.md",
  ]) {
    assert.ok(CHAPTER_META[path], `métadonnée absente : ${path}`);
    assert.equal(chapterPathFromSlug(chapterSlug(path)), path);
  }

  assert.doesNotMatch(hermesPage, /CHAPITRES SUPPLÉMENTAIRES/);
  assert.doesNotMatch(hermesPage, /unknownFiles/);
  assert.doesNotMatch(hermesPage, /RÉSERVÉ À \{COFFRE_LABEL\.toUpperCase\(\)\}/);
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

test("le Bloc 1 donne une projection business IA concrète et se termine par la prochaine décision", () => {
  const bloc = BLOCS_DATA.find((entry) => entry.id === "1");
  assert.ok(bloc);
  const copy = bloc.sections.map((section) => `${section.title}\n${section.content}`).join("\n");

  for (const expected of [
    "AI Growth Operating",
    "Le décalage se creuse",
    "Opus 5.5",
    "un système qui apprend à chaque cycle",
  ]) {
    assert.match(copy, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(copy, /locataires numériques/i);
  assert.match(blocClient, /blocId === "1"/);
  const firstBlocIndex = BLOCS_DATA.findIndex((entry) => entry.id === "1");
  assert.equal(BLOCS_DATA[firstBlocIndex + 1]?.id, "2");
  assert.match(blocClient, /href=\{`\/blocs\/\$\{nextBloc\.id\}`\}/);
  assert.match(blocClient, /Continuer avec \{nextBlocLabel\.toLowerCase\(\)\}/);
  assert.doesNotMatch(blocClient, /Voir comment construire ta stack/);
});
