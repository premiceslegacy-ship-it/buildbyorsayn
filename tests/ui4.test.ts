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

test("les cartes Sources gardent de vraies tuiles et des segments défilants", async () => {
  const css = await readFile("app/sources/sources.module.css", "utf8");
  assert.match(css, /width: 64px !important/);
  assert.match(css, /height: 36px/);
  assert.match(css, /padding: 0 16px/);
  assert.match(css, /overflow-x: auto/);
  assert.match(css, /\.card \{[^}]*gap: 16px/s);
});

test("Aujourd’hui nomme le premier contenu sans doubler la rangée", async () => {
  const [page, css] = await Promise.all([
    readFile("app/dashboard/page.tsx", "utf8"),
    readFile("app/da-app.css", "utf8"),
  ]);
  assert.match(page, /<h2 className="cont__t">\{firstAccessible\.title\}<\/h2>/);
  assert.match(page, /Ton premier contenu, \{firstAccessible\.meta\}/);
  assert.doesNotMatch(page, /<h2 className="cont__t">Commence ici<\/h2>/);
  assert.match(css, /padding-bottom: calc\(88px \+ max\(12px, env\(safe-area-inset-bottom\)\)\)/);
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
    assert.match(loading, /PageLoading/, route);
    assert.match(error, /reset/, route);
    assert.match(error, /RouteErrorState/, route);
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
