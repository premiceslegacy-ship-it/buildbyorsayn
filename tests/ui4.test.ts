import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { filterSourceEntries } from "../app/sources/filter";

test("le filtre des sources garde toutes les entrées ou seulement la catégorie choisie", () => {
  const entries = [
    { id: 1, category: "IA", content: "Un" },
    { id: 2, category: "Design", content: "Deux" },
    { id: 3, category: "IA", content: "Trois" },
  ];
  assert.deepEqual(filterSourceEntries(entries, "Tous", "Tous").map((entry) => entry.id), [1, 2, 3]);
  assert.deepEqual(filterSourceEntries(entries, "IA", "Tous").map((entry) => entry.id), [1, 3]);
  assert.deepEqual(filterSourceEntries(entries, "Inconnue", "Tous"), []);
});

test("la liste des sources annonce aussi son état vide", async () => {
  const source = await readFile("app/sources/SourceCategoryFilter.tsx", "utf8");
  assert.match(source, /visibleEntries\.length > 0/);
  assert.match(source, /Aucune source n’est disponible/);
  assert.match(source, /role="status"/);
});

test("les pages de lecture restantes exposent un chargement et une reprise après erreur", async () => {
  const routes = [
    "app/protocole",
    "app/videos/tutos/[chapterSlug]",
    "app/videos/tutos/learn/[slug]",
    "app/doctrine",
    "app/intro",
    "app/sources",
  ];
  for (const route of routes) {
    const [loading, error] = await Promise.all([
      readFile(`${route}/loading.tsx`, "utf8"),
      readFile(`${route}/error.tsx`, "utf8"),
    ]);
    assert.match(loading, route === "app/doctrine" || route === "app/intro" || route === "app/sources" ? /Ui4Loading/ : /ReaderLoading/, route);
    assert.match(error, /reset/, route);
  }
});

test("Intro, Sources et Doctrine gardent leurs portes serveur et les états sans donnée", async () => {
  const [intro, sources, doctrine, doctrineContent] = await Promise.all([
    readFile("app/intro/page.tsx", "utf8"),
    readFile("app/sources/page.tsx", "utf8"),
    readFile("app/doctrine/page.tsx", "utf8"),
    readFile("app/doctrine/DoctrineContent.tsx", "utf8"),
  ]);
  assert.match(intro, /requirePageAccess\("full", "\/intro"\)/);
  assert.match(sources, /requirePageAccess\("beginner", "\/sources"\)/);
  assert.ok(doctrine.indexOf("await doctrineAccessStatus()") < doctrine.indexOf("await readPublishedDoctrine()"));
  assert.match(doctrineContent, /files\.length/);
  assert.match(doctrineContent, /role="status"/);
});
