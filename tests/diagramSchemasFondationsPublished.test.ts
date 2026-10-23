import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const publishedFiles = [
  "intro-ce-qui-ne-change-pas.md",
  "mindset.md",
  "psychologie.md",
  "vente.md",
  "copywriting.md",
  "marketing.md",
  "intro-de-l-idee-a-l-url.md",
  "penser.md",
  "environnement.md",
  "visuels.md",
  "site-web.md",
  "url.md",
  "angle-mort.md",
] as const;

test("les 56 marqueurs Fondations publiés ont un composant enregistré", () => {
  const markers = publishedFiles.flatMap((file) => [...read(`content/fondations/${file}`)
    .matchAll(/\[\[(schema|maquette):([^\]\n]+)\]\]/g)]
    .map((match) => `${match[1]}:${match[2].trim()}`));
  const registry = read("components/schemas/registry.ts");
  const registered = [...registry.matchAll(/\{ name: "([^"]+)", kind: "(schema|maquette)", course: "fondations"/g)]
    .map((match) => `${match[2]}:${match[1]}`);

  assert.equal(markers.length, 56);
  assert.equal(new Set(markers).size, markers.length);
  assert.deepEqual([...registered].sort(), [...markers].sort());
});
