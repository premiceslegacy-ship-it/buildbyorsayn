import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  parseBeforeAfterPairs,
  parseReaderDirective,
  splitExampleContent,
} from "../components/reader/readerRichMarkdown";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("les cartes riches lisent leur contenu normal sans perdre la fermeture", () => {
  const lines = [":::retiens", "Une phrase simple.", ":::", "Après la carte."];
  assert.deepEqual(parseReaderDirective(lines, 0), {
    kind: "retiens",
    content: "Une phrase simple.",
    endIndex: 2,
    title: undefined,
  });

  const example = splitExampleContent("Métier : Plaquiste\nKarim rappelle son client.");
  assert.deepEqual(example, { profession: "Plaquiste", body: "Karim rappelle son client." });
});

test("une directive imbriquée appartient à la carte extérieure", () => {
  const lines = [
    ":::retiens",
    "Garde cette idée.",
    ":::exemple Karim",
    "Métier : Plaquiste",
    "Il répond au devis.",
    ":::",
    "Fin de la carte.",
    ":::",
  ];
  const outer = parseReaderDirective(lines, 0);
  assert.equal(outer?.endIndex, 7);
  assert.match(outer?.content ?? "", /:::exemple Karim[\s\S]*Il répond au devis\.[\s\S]*:::/);
  const innerLines = outer?.content.split("\n") ?? [];
  assert.equal(parseReaderDirective(innerLines, 1)?.title, "Karim");
});

test("une directive mal fermée reste un contenu lisible au lieu d'avaler le chapitre", () => {
  assert.equal(parseReaderDirective([":::retiens", "Le texte reste visible."], 0), null);
  const prose = read("components/reader/ReaderProse.tsx");
  assert.match(prose, /if \(!directive\) \{\s*index \+= 1;\s*continue;/);
});

test("plusieurs paires avant et après forment une galerie structurée", () => {
  assert.deepEqual(parseBeforeAfterPairs(`Avant : Gagner du temps avec l'IA.
Après : Chaque devis reçoit un responsable avant 18 h.
Pourquoi : La scène et le résultat sont visibles.

Avant : Cliquez ici.
Après : Voir les créneaux disponibles.
Pourquoi : Le bouton annonce le résultat.`), [
    {
      before: "Gagner du temps avec l'IA.",
      after: "Chaque devis reçoit un responsable avant 18 h.",
      why: "La scène et le résultat sont visibles.",
    },
    {
      before: "Cliquez ici.",
      after: "Voir les créneaux disponibles.",
      why: "Le bouton annonce le résultat.",
    },
  ]);
});

test("le rendu branche les marqueurs, les sélecteurs stables et le repli des visuels inconnus", () => {
  const prose = read("components/reader/ReaderProse.tsx");
  const registry = read("components/schemas/registry.ts");
  for (const marker of ["data-reader-highlight", "data-reader-card", "data-reader-before-after", "data-reader-visual"]) {
    assert.match(prose, new RegExp(marker));
  }
  assert.match(prose, /schema\|maquette/);
  assert.match(registry, /process\.env\.NODE_ENV !== "production"/);
  assert.match(registry, /console\.warn/);
});
