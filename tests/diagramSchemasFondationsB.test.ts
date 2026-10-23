import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("chaque marqueur Fondations de l'idée à l'URL et du seuil est enregistré", (context) => {
  const fallbackRoot = fileURLToPath(new URL("../../../Business%20Orsyan/ORSAYN%20AI/", import.meta.url));
  const orsaynRoot = process.env.ORSAYN_AI_ROOT || fallbackRoot;
  const contentRoot = resolve(
    orsaynRoot,
    "Identité Visuelle/Identité BUILD/plan-implementation/fiches-internes/redaction/fondations",
  );
  const files = [
    "10-intro-de-l-idee-a-l-url.md",
    "11-chapitre-06-penser-avant-de-construire.md",
    "12-chapitre-07-comprendre-l-environnement.md",
    "13-chapitre-08-generer-des-visuels-pro.md",
    "14-chapitre-09-construire-un-site-web-avec-l-ia.md",
    "15-chapitre-10-de-l-idee-a-l-url-en-ligne.md",
    "20-chapitre-12-le-seuil.md",
  ];
  if (!files.every((file) => existsSync(resolve(contentRoot, file)))) {
    context.skip("les fiches internes ne sont pas présentes dans cet environnement");
    return;
  }

  const markers = files.flatMap((file) => [...readFileSync(resolve(contentRoot, file), "utf8")
    .matchAll(/\[\[(schema|maquette):([^\]\n]+)\]\]/g)]
    .map((match) => `${match[1]}:${match[2].trim()}`));
  const registry = read("components/schemas/registry.ts");
  const registered = [...registry.matchAll(/\{ name: "([^"]+)", kind: "(schema|maquette)", course: "fondations"/g)]
    .map((match) => `${match[2]}:${match[1]}`);

  assert.equal(markers.length, 29, "les sept fiches contiennent 29 marqueurs");
  assert.equal(new Set(markers).size, markers.length, "les marqueurs de la tranche sont uniques");
  for (const marker of markers) assert.ok(registered.includes(marker), `${marker} est enregistré`);
});
