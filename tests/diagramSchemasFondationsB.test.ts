import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("chaque marqueur publié de la seconde vidéo Fondations est enregistré", () => {
  const files = [
    "content/fondations/intro-de-l-idee-a-l-url.md",
    "content/fondations/penser.md",
    "content/fondations/environnement.md",
    "content/fondations/visuels.md",
    "content/fondations/site-web.md",
    "content/fondations/url.md",
    "content/fondations/angle-mort.md",
  ];
  const markers = files.flatMap((file) => [...read(file)
    .matchAll(/\[\[(schema|maquette):([^\]\n]+)\]\]/g)]
    .map((match) => `${match[1]}:${match[2].trim()}`));
  const registry = read("components/schemas/registry.ts");
  const registered = [...registry.matchAll(/\{ name: "([^"]+)", kind: "(schema|maquette)", course: "fondations"/g)]
    .map((match) => `${match[2]}:${match[1]}`);

  assert.equal(markers.length, 29, "les sept fiches contiennent 29 marqueurs");
  assert.equal(new Set(markers).size, markers.length, "les marqueurs de la tranche sont uniques");
  for (const marker of markers) assert.ok(registered.includes(marker), `${marker} est enregistré`);
});
