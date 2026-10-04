import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/videos/tutos/page.tsx", import.meta.url), "utf8");

test("Hermes Agent rend visibles les workflows, les cas et la synthèse originale", () => {
  for (const expected of [
    "Ce que ce parcours retient d'une étude de masterclass",
    "Un chat, une règle et un agent ne font pas la même chose",
    "Un skill est une fiche recette",
    "Un cron est un réveil, pas un pilote automatique",
    "Les cinq briques d'un workflow utile",
    "Google Search Console avec Treg, puis un brouillon contrôlé",
    "Treg : des idées de workflows, par métier.",
    "Ce sont des exemples à construire, pas des connexions déjà actives dans BUILD.",
    "Les données de contact ne servent pas à arroser des inconnus.",
    "/brand-logos/treg.svg",
    "/brand-logos/treg-google-ads.svg",
    "/brand-logos/treg-companies.svg",
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
