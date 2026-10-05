import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/videos/tutos/page.tsx", import.meta.url), "utf8");
const learningContent = readFileSync(new URL("../app/videos/tutos/learn/content.tsx", import.meta.url), "utf8");
const learningRoute = readFileSync(new URL("../app/videos/tutos/learn/[slug]/page.tsx", import.meta.url), "utf8");

test("Hermes Agent garde une entrée concise et place le savoir-faire dans trois blocs", () => {
  for (const expected of [
    "APPRENDRE PAR BLOCS",
    "Trois chemins pour passer d'une idée à une méthode qui te reste.",
    "LEARNING_BLOCKS",
  ]) {
    assert.match(page, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(page, /masterclass/i);
  assert.doesNotMatch(page, /treg-workflows/);
  assert.match(learningRoute, /hermesGate\(\)/);
});

test("les blocs Hermes expliquent une méthode réutilisable, trois cas et une connexion Treg", () => {
  for (const expected of [
    "LES CINQ PIÈCES DU WORKFLOW",
    "Mission",
    "Contexte",
    "Méthode",
    "Outils",
    "Sortie",
    "Tu décides jusqu'où l'agent va.",
    "Chaque bon essai devient une méthode plus simple à refaire.",
    "Faire un carrousel qui reste fidèle à ton idée",
    "Une slide porte une idée, un chiffre, une tension ou une décision.",
    "Transformer un signal de recherche en page plus utile",
    "Préparer la semaine sans perdre les décisions importantes",
    "Relier Treg à Hermes et créer tes propres workflows.",
    "https://treg.to/mcp/",
    "hermes mcp login treg",
    "hermes mcp test treg",
    "TREG_TOKEN",
    "catalog_search",
    "Faire remonter des sujets qui méritent une prise de parole",
    "Préparer des comptes à comprendre avant de les contacter",
    "Comprendre une campagne avant de changer un budget",
    "Faire passer une intention réelle avant une simple position",
    "Nettoyer une fiche sans écraser ce que ton équipe sait déjà",
    "Préparer une réunion qui débouche sur des décisions",
    "/brand-logos/treg.svg",
    "/brand-logos/treg-google-ads.svg",
    "/brand-logos/treg-companies.svg",
  ]) {
    assert.match(learningContent, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(learningContent, /masterclass/i);
  assert.doesNotMatch(learningContent, /\bAtelier\b/);
  assert.equal(learningContent.includes(String.fromCharCode(0x2014)), false);
});

test("le bloc gratuit fait avancer le visiteur puis ouvre une projection honnête vers LE COFFRE", () => {
  for (const expected of [
    "Fais entrer l'IA dans un travail que tu connais déjà.",
    "Tu décides jusqu'où l'agent va.",
    "Le lundi, tu ouvres Hermes avec une mission déjà préparée.",
    "Il te permet de relier ce premier essai aux méthodes, aux skills et aux projets qui suivent",
    "LE COFFRE, avec Fondations incluses.",
    "Fondations est le bon point de départ",
    "Voir les parcours BUILD",
    'href="/checkout"',
  ]) {
    assert.match(learningContent, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(learningContent, /gagner des milliers|sans effort|r\u00e9volutionnaire|masterclass/i);
});
