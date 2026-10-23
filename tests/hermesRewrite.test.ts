import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  CHAPTER_META,
  CHAPTER_REDIRECTS,
  chapterRedirectFromSlug,
  orderCurriculumFiles,
} from "../app/videos/tutos/chapters";
import {
  HERMES_CHAPTER_PATHS,
  allHermesMarkdown,
  hermesIntroductionMarkdown,
} from "../lib/hermes/content";
import { collectDoctrineDocuments } from "../lib/knowledge/doctrineSource";

test("la réécriture Hermes publie dix-neuf chapitres et garde les anciens slugs", () => {
  assert.equal(HERMES_CHAPTER_PATHS.length, 19);
  assert.equal(Object.keys(CHAPTER_META).length, 19);
  assert.deepEqual(CHAPTER_REDIRECTS, {
    "00-parcours": "readme",
    "entreprise-08-templates-et-exercices": "08-fiches-atelier",
  });
  assert.equal(chapterRedirectFromSlug("00-parcours"), "readme");
  assert.equal(chapterRedirectFromSlug("entreprise-08-templates-et-exercices"), "08-fiches-atelier");
  assert.equal(chapterRedirectFromSlug("01-diagnostic-et-offre"), undefined);
});

test("les textes Hermes retirent seulement les notes internes et gardent les fusions", () => {
  const files = allHermesMarkdown();
  assert.deepEqual(orderCurriculumFiles(files).map((file) => file.path), HERMES_CHAPTER_PATHS);
  assert.ok(files.every((file) => !file.content.includes("## Inventaire des idées du texte précédent")));
  assert.ok(files.every((file) => !file.content.includes("## Spécifications des schémas")));

  const first = files.find((file) => file.path === "README.md")?.content ?? "";
  assert.match(first, /Ton terminal doit répondre avant ton entreprise/);
  assert.match(first, /Un agent impressionnant peut quand même être inutile/);

  const pilot = files.find((file) => file.path === "08-fiches-atelier.md")?.content ?? "";
  assert.match(pilot, /Si tu es le seul à comprendre, ce n'est pas prêt/);
  assert.match(pilot, /Une arborescence propre ne suffit pas/);
});

test("l'introduction Hermes est publique dans le lecteur et dans le corpus local", async () => {
  const introduction = hermesIntroductionMarkdown();
  assert.match(introduction, /Tu reçois un message sur Telegram/);
  assert.doesNotMatch(introduction, /## Spécifications des schémas/);

  const documents = await collectDoctrineDocuments();
  assert.equal(documents.length, 20);
  assert.equal(documents[0].sourceId, "introduction:hermes");
  assert.ok(documents.every((document) => document.tier === "full"));
  assert.match(documents.find((document) => document.sourceId === "README.md")?.content ?? "", /Choisis ton fournisseur et ton modèle/);
});

test("la garde serveur précède la lecture et la version pour l'IA garde le Markdown", () => {
  const gate = readFileSync(new URL("../app/videos/tutos/gate.server.tsx", import.meta.url), "utf8");
  assert.ok(gate.indexOf("await doctrineAccessStatus()") < gate.indexOf("allHermesMarkdown()"));
  const chapter = readFileSync(new URL("../app/videos/tutos/[chapterSlug]/page.tsx", import.meta.url), "utf8");
  assert.match(chapter, /copyMarkdown=\{`# \$\{displayTitle\}\\n\\n\$\{body\}`\}/);
  const learning = readFileSync(new URL("../app/videos/tutos/learn/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(learning, /copyMarkdown=\{hermesMarkdown\(currentBlock\.chapterPath\)\}/);
});
