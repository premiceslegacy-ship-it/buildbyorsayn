import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { ANGLE_MORT, SECTIONS } from "../app/beginner/sections.data";
import {
  allFoundationIntroductions,
  allFoundationMarkdown,
  foundationMarkdown,
} from "../lib/fondations/content";
import { collectFondationsDocuments } from "../lib/knowledge/sources";
import { buildSearchCatalog, searchCatalog } from "../lib/search/catalog";

const read = (relativePath: string) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("les Fondations suivent l'ordre validé sans changer les identifiants", () => {
  assert.deepEqual(SECTIONS.map((section) => section.id), [
    "mindset",
    "psychologie",
    "vente",
    "copywriting",
    "marketing",
    "penser",
    "environnement",
    "visuels",
    "site-web",
    "url",
  ]);
  assert.equal(ANGLE_MORT.num, "12");
  assert.deepEqual(SECTIONS.map((section) => section.num), ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]);
  assert.equal(ANGLE_MORT.id, "angle-mort");
});

test("les fichiers Markdown publics excluent les notes internes et le titre déjà rendu", () => {
  const chapters = allFoundationMarkdown();
  const introductions = allFoundationIntroductions();
  assert.equal(chapters.length, 11);
  assert.equal(introductions.length, 2);

  for (const { id, content } of [...chapters, ...introductions]) {
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, "");
    assert.doesNotMatch(body, /^#\s/m, `${id}: titre H1 dupliqué`);
    assert.doesNotMatch(content, /^## Inventaire des idées/m, `${id}: inventaire interne exposé`);
    assert.doesNotMatch(content, /^## Spécifications? (?:des |du )?(?:schémas|maquettes)/m, `${id}: spécification interne exposée`);
    assert.doesNotMatch(content, /[\u2013\u2014]/, `${id}: tiret interdit`);
  }

  assert.match(foundationMarkdown("copywriting"), /:::avant-apres/);
  assert.match(foundationMarkdown("url"), /```bash[\s\S]*git push -u origin main/);
  assert.match(foundationMarkdown("angle-mort"), /LE\u00a0COFFRE/);
  assert.doesNotMatch(foundationMarkdown("angle-mort"), /\{(?:COFFRE_LABEL|COFFRE_PRICE|UPGRADE_PRICE)\}/);
});

test("le lecteur commun reçoit le Markdown après la garde d'accès", () => {
  const detail = read("app/beginner/[sectionId]/page.tsx");
  const foundationReader = read("components/reader/FoundationReader.tsx");
  const readerView = read("components/reader/ReaderView.tsx");

  assert.equal(detail.includes('"use client"'), false);
  assert.ok(detail.indexOf('tier !== "beginner"') < detail.indexOf("foundationMarkdown(current.id)"));
  assert.match(detail, /markdown=\{markdown\}/);
  assert.match(foundationReader, /markdown: chapter\.id === currentId \? markdown : undefined/);
  assert.match(readerView, /currentMarkdown \? <ReaderProse/);
  assert.match(readerView, /videoIntroductionMarkdown/);
  assert.equal(existsSync(new URL("../app/beginner/sections.components.tsx", import.meta.url)), false);
});

test("la recherche et le corpus utilisent le nouveau texte sans l'exposer au palier gratuit", async () => {
  const beginnerCatalog = buildSearchCatalog("beginner");
  assert.ok(searchCatalog(beginnerCatalog, "sac préparé dans le noir").some((item) => item.id === "chapter-copywriting"));
  assert.deepEqual(searchCatalog(buildSearchCatalog("free"), "sac préparé dans le noir"), []);

  const documents = await collectFondationsDocuments();
  assert.equal(documents.length, 13);
  assert.ok(documents.every((document) => document.source === "fondations" && document.tier === "beginner"));
  assert.match(documents.find((document) => document.sourceId === "vente")?.content ?? "", /Le premier objectif d'une vente est de comprendre si tu dois vendre/);
});

test("les actifs publics n'exposent pas de connexion interne ni de preuve sociale non étayée", () => {
  const brandLogoReadme = read("public/brand-logos/README.md");
  const blocClient = read("app/blocs/[id]/BlocClient.tsx");

  assert.equal(brandLogoReadme.includes("treg.to"), false);
  assert.equal(blocClient.includes("Communauté privée de builders actifs"), false);
});
