import test from "node:test";
import assert from "node:assert/strict";
import { projectBlocForTier } from "../lib/blocAccess";
import { allCoffreIntroductions, allCoffreMarkdown } from "../lib/coffre/content";
import { collectBlocsDocuments } from "../lib/knowledge/sources";
import { BLOCS_DATA } from "../lib/mockData";
import { buildSearchCatalog, searchCatalog } from "../lib/search/catalog";

const EXPECTED_SECTION_IDS = [
  "b1-s0", "b1-s1", "b1-s2", "b1-s3", "b1-s4b", "b1-s4",
  "b2-s1", "b2-s2", "b2-s3",
  "b5-s1", "b5-s2", "b5-s3", "b5-s4",
  "b3-s1", "b3-s2", "b3-s3",
  "b4-s1", "b4-s1b", "b4-s2", "b4-s3",
  "b6-s1", "b6-s2", "b6-s3", "b6-s4", "b6-s5",
  "b7-s1", "b7-s2", "b7-s3", "b7-s4",
];

function frontmatterTitle(content: string): string | undefined {
  const value = content.match(/^titre:\s*(.+)$/m)?.[1]?.trim();
  return value?.replace(/^(["'])(.*)\1$/, "$2");
}

test("la réécriture du COFFRE garde tous les identifiants et les titres validés", () => {
  assert.deepEqual(BLOCS_DATA.flatMap((bloc) => bloc.sections.map((section) => section.id)), EXPECTED_SECTION_IDS);
  assert.equal(allCoffreMarkdown().length, EXPECTED_SECTION_IDS.length);
  assert.equal(allCoffreIntroductions().length, BLOCS_DATA.length);

  for (const bloc of BLOCS_DATA) {
    assert.ok(bloc.introduction.trim().length > 0, bloc.id);
    assert.doesNotMatch(bloc.introduction, /^#\s/m, bloc.id);
    assert.doesNotMatch(bloc.introduction, /^## Spécifications? du schéma/m, bloc.id);
    for (const section of bloc.sections) {
      assert.equal(frontmatterTitle(section.content), section.title, section.id);
      assert.doesNotMatch(section.content, /^#\s/m, section.id);
      assert.doesNotMatch(section.content, /^## Inventaire des idées/m, section.id);
      assert.doesNotMatch(section.content, /^## Spécifications? des schémas/m, section.id);
      assert.match(section.content, /^## Version pour ton IA$/m, section.id);
    }
  }
});

test("les introductions ne franchissent jamais une frontière d'accès", () => {
  const first = BLOCS_DATA.find((bloc) => bloc.id === "1");
  const paid = BLOCS_DATA.find((bloc) => bloc.id === "2");
  assert.ok(first && paid);
  assert.equal(projectBlocForTier(first, "free").introduction, undefined);
  assert.equal(projectBlocForTier(first, "preview").introduction, first.introduction);
  assert.equal(projectBlocForTier(paid, "beginner").introduction, undefined);
  assert.equal(projectBlocForTier(paid, "full").introduction, paid.introduction);
});

test("la recherche lit les nouveaux textes sans fuite entre les paliers", () => {
  assert.ok(searchCatalog(buildSearchCatalog("preview"), "photos salle de bains devis").some((item) => item.id === "chapter-b1-s0"));
  assert.deepEqual(searchCatalog(buildSearchCatalog("preview"), "boucle commerciale simple"), []);
  assert.ok(searchCatalog(buildSearchCatalog("beginner"), "boucle commerciale simple").some((item) => item.id === "chapter-b1-s3"));
  assert.ok(!searchCatalog(buildSearchCatalog("beginner"), "nouvel onglet").some((item) => item.id === "chapter-b2-s1"));
  assert.ok(searchCatalog(buildSearchCatalog("full"), "nouvel onglet").some((item) => item.id === "chapter-b2-s1"));
  assert.deepEqual(searchCatalog(buildSearchCatalog("free"), "photos salle de bains devis"), []);
});

test("la recherche classe les titres avant le contexte et respecte le numéro affiché du bloc", () => {
  const catalog = buildSearchCatalog("full");
  const siteResults = searchCatalog(catalog, "site");
  assert.match(siteResults[0]?.title ?? "", /site/i);
  assert.notEqual(siteResults[0]?.title, "Fondations 1 : ce qui ne change pas");
  assert.match(searchCatalog(catalog, "bloc 5")[0]?.title ?? "", /^Bloc 5\b/);
});

test("le corpus inclut les introductions et les chapitres avec le bon palier", async () => {
  const documents = await collectBlocsDocuments();
  assert.equal(documents.length, EXPECTED_SECTION_IDS.length + BLOCS_DATA.length);
  assert.equal(documents.find((document) => document.sourceId === "introduction:bloc-1")?.tier, "preview");
  assert.equal(documents.find((document) => document.sourceId === "introduction:bloc-2")?.tier, "full");
  assert.equal(documents.find((document) => document.sourceId === "b1-s3")?.tier, "beginner");
  assert.equal(documents.find((document) => document.sourceId === "b2-s1")?.tier, "full");
});

