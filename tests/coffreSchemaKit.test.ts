import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

type Marker = { chapter: string; kind: "schema" | "maquette"; name: string };

function publishedMarkers(): Marker[] {
  return readdirSync(new URL("content/coffre/", root))
    .filter((file) => file.endsWith(".md"))
    .sort()
    .flatMap((file) => [...read(`content/coffre/${file}`).matchAll(/\[\[(schema|maquette):([^\]\n]+)\]\]/g)]
      .map((match) => ({ chapter: basename(file, ".md"), kind: match[1] as Marker["kind"], name: match[2].trim() })));
}

function generatedMarkers(): Marker[] {
  return readdirSync(new URL("components/schemas/coffre/", root))
    .filter((file) => /^(?:b\d|intro)-.+\.tsx$/.test(file))
    .sort()
    .flatMap((file) => {
      const source = read(`components/schemas/coffre/${file}`);
      return [...source.matchAll(/"name": "([^"]+)"[\s\S]*?"kind": "(schema|maquette)"[\s\S]*?"chapter": "([^"]+)"[\s\S]*?"template": "([^"]+)"/g)]
        .map((match) => ({ name: match[1], kind: match[2] as Marker["kind"], chapter: match[3], template: match[4] }));
    });
}

test("chaque marqueur publié du COFFRE possède une instance du kit enregistrée", () => {
  const published = publishedMarkers();
  const generated = generatedMarkers();
  const key = (marker: Marker) => `${marker.chapter}:${marker.kind}:${marker.name}`;

  assert.equal(published.length, 138);
  assert.equal(new Set(published.map(key)).size, published.length, "les marqueurs publiés sont uniques");
  assert.deepEqual(generated.map(key).sort(), published.map(key).sort());

  const registry = read("components/schemas/registry.ts");
  assert.match(registry, /COFFRE_VISUAL_CATALOG/);
  assert.match(registry, /course: "coffre"/);
});

test("la tranche COFFRE varie les gabarits et reste composée uniquement de données", () => {
  const generated = generatedMarkers() as Array<Marker & { template: string }>;
  const templates = new Set(generated.map((entry) => entry.template));
  assert.ok(templates.size >= 12, `${templates.size} gabarits seulement`);

  for (const file of readdirSync(new URL("components/schemas/coffre/", root)).filter((name) => /^(?:b\d|intro)-.+\.tsx$/.test(name))) {
    const source = read(`components/schemas/coffre/${file}`);
    assert.match(source, /satisfies readonly CoffreVisualDefinition\[\]/);
    assert.doesNotMatch(source, /<svg|<div|className=/);
  }
});

test("la route du lecteur de développement accepte le COFFRE et un marqueur ciblé", () => {
  const page = read("app/dev/lecteur/page.tsx");
  const scroll = read("app/dev/lecteur/DevReaderScroll.tsx");
  assert.match(page, /course === "coffre"/);
  assert.match(page, /COFFRE_VISUAL_DEFINITIONS/);
  assert.match(scroll, /data-coffre-visual/);
});
