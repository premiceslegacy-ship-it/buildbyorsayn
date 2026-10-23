import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const chapterFiles = Array.from({ length: 22 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const names = [
    "intro", "installer-et-essayer", "choisir-le-travail", "regarder-le-vrai-travail",
    "decouper-le-travail", "identite-memoire-contexte", "du-message-au-dossier",
    "droits-outils-couts", "preparer-un-pilote", "tester-avant-de-garder",
    "garder-le-savoir-faire", "expliquer-loffre", "qualifier-et-livrer", "relier-lequipe",
    "suivre-les-passages", "ranger-les-informations", "transformer-en-skill",
    "connecter-les-outils", "faire-passer-le-dossier", "commencer-petit",
    "laisser-un-dossier", "planifier-sans-perdre-la-main",
  ];
  return `components/schemas/hermes/${number}-${names[index]}.tsx`;
});

test("les 84 visuels Hermes sont des instances du kit sans SVG local", () => {
  const source = chapterFiles.map(read).join("\n");
  assert.equal((source.match(/export function /g) ?? []).length, 84);
  assert.doesNotMatch(source, /\.\.\/primitives|<svg|<path|<rect|<circle|viewBox=/);
  assert.equal((source.match(/from "\.\.\/kit"/g) ?? []).length, chapterFiles.length);

  const templates = new Set([...source.matchAll(/return <([A-Z][A-Za-z]+)/g)].map((match) => match[1]));
  for (const template of ["Chat", "Compare", "FileCard", "Fork", "Funnel", "Ladder", "Rings", "Steps", "ToolMap", "Workflow"]) {
    assert.ok(templates.has(template), `${template} est utilisé dans Hermes`);
  }
});

test("chaque marqueur Hermes publié possède une entrée du même type dans le registre", () => {
  const contentDirectory = new URL("../content/hermes/", import.meta.url);
  const published = readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .flatMap((filename) => [...readFileSync(new URL(filename, contentDirectory), "utf8").matchAll(/\[\[(schema|maquette):([^\]]+)\]\]/g)])
    .map((match) => ({ kind: match[1], name: match[2] }));
  const registry = read("components/schemas/registry.ts");

  assert.equal(published.length, 84);
  assert.equal(new Set(published.map(({ name }) => name)).size, published.length);
  for (const { kind, name } of published) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      registry,
      new RegExp(`\\{ name: "${escapedName}", kind: "${kind}", course: "hermes", component:`),
      `${kind}:${name} doit être enregistré pour Hermes`,
    );
  }
});

test("le lecteur de développement sait cibler un visuel Hermes", () => {
  const page = read("app/dev/lecteur/page.tsx");
  const scroll = read("app/dev/lecteur/DevReaderScroll.tsx");
  assert.match(page, /course === "hermes"/);
  assert.match(page, /HERMES_CHAPTER_PATHS/);
  assert.match(page, /hermesIntroductionMarkdown/);
  assert.match(scroll, /data-reader-visual-name/);
});
