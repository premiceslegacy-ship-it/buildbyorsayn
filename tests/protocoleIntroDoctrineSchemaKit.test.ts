import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const markerPattern = /\[\[(schema|maquette):([^\]\n]+)\]\]/g;

type Marker = { kind: "schema" | "maquette"; name: string };

function markers(source: string): Marker[] {
  return [...source.matchAll(markerPattern)].map((match) => ({ kind: match[1] as Marker["kind"], name: match[2].trim() }));
}

function definitionSources(directory: "protocole" | "intro" | "doctrine"): string {
  return readdirSync(new URL(`components/schemas/${directory}/`, root))
    .filter((file) => file.endsWith(".tsx") && !["index.tsx", "kit-instance.tsx"].includes(file))
    .sort()
    .map((file) => read(`components/schemas/${directory}/${file}`))
    .join("\n");
}

function definedMarkers(source: string): Marker[] {
  return [...source.matchAll(/name:\s*"([^"]+)"\s*,\s*kind:\s*"(schema|maquette)"/g)]
    .map((match) => ({ name: match[1], kind: match[2] as Marker["kind"] }));
}

test("chaque marqueur publié du protocole et de l'introduction possède une instance enregistrée", () => {
  const protocolPublished = readdirSync(new URL("app/protocole/content/", root))
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => markers(read(`app/protocole/content/${file}`)));
  const introPublished = markers(read("app/intro/content.md"));
  const protocolDefined = [
    { kind: "schema" as const, name: "LocataireVsCapitalDiagram" },
    { kind: "schema" as const, name: "ProtocolePipelineDiagram" },
    ...definedMarkers(definitionSources("protocole")),
  ];
  const introDefined = definedMarkers(definitionSources("intro"));

  assert.deepEqual(protocolDefined.map(({ kind, name }) => `${kind}:${name}`).sort(), protocolPublished.map(({ kind, name }) => `${kind}:${name}`).sort());
  assert.deepEqual(introDefined.map(({ kind, name }) => `${kind}:${name}`).sort(), introPublished.map(({ kind, name }) => `${kind}:${name}`).sort());

  const registry = read("components/schemas/registry.ts");
  assert.match(registry, /PROTOCOLE_VISUAL_CATALOG/);
  assert.match(registry, /INTRO_VISUAL_CATALOG/);
  assert.match(registry, /PROTOCOLE_VISUAL_CATALOG\.map/);
  assert.match(registry, /INTRO_VISUAL_CATALOG\.map/);
});

test("les 63 marqueurs publiés de doctrine sont définis une seule fois et branchés au registre", () => {
  const doctrineSource = definitionSources("doctrine");
  const doctrineDefined = definedMarkers(doctrineSource);
  assert.equal(doctrineDefined.length, 63);
  assert.equal(new Set(doctrineDefined.map(({ name }) => name)).size, 63);
  assert.equal(doctrineDefined.filter(({ kind }) => kind === "maquette").length, 2);

  const registry = read("components/schemas/registry.ts");
  assert.match(registry, /DOCTRINE_VISUAL_CATALOG/);
  assert.match(registry, /DOCTRINE_VISUAL_CATALOG\.map/);
});

test("le lecteur de développement cible protocole, intro et doctrine dans le lecteur réel", () => {
  const page = read("app/dev/lecteur/page.tsx");
  const scroll = read("app/dev/lecteur/DevReaderScroll.tsx");
  for (const course of ["protocole", "intro", "doctrine"]) assert.match(page, new RegExp(`course === "${course}"`));
  assert.match(scroll, /data-course-visual/);
});
