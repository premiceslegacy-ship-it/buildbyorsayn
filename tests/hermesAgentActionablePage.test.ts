import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/videos/tutos/page.tsx", import.meta.url), "utf8");

test("Hermes Agent rend visibles les workflows, les cas et la synthèse originale", () => {
  for (const expected of [
    "Ce que ce parcours retient d'une étude de masterclass",
    "Les cinq briques d'un workflow utile",
    "Google Search Console avec Treg, puis un brouillon contrôlé",
    "Contexte autorisé",
    "Outils autorisés",
    "Sortie vérifiable",
    "contrôle humain",
    "Cible à construire, pas une intégration active",
    "Le transcript externe n'est ni reproduit ni traduit",
  ]) {
    assert.match(page, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
