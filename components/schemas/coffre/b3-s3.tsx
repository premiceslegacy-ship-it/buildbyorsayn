import type { CoffreVisualDefinition } from "./types";

export const b3_s3_VISUALS = [
  {
    "name": "BesoinAvantFramework",
    "kind": "schema",
    "chapter": "b3-s3",
    "template": "fork",
    "title": "Besoin d'abord",
    "description": "Le type de produit dirige le choix technique.",
    "ariaLabel": "Le type de produit dirige le choix technique.",
    "labels": [
      "Contenu",
      "Zone interactive",
      "Application complète",
      "Besoin d'abord"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "BibliothequeEtFrameworks",
    "kind": "schema",
    "chapter": "b3-s3",
    "template": "compare",
    "title": "React",
    "description": "React, Astro et Next.js n'occupent pas la même place.",
    "ariaLabel": "React, Astro et Next.js n'occupent pas la même place.",
    "labels": [
      "React",
      "Bibliothèque",
      "Astro",
      "Contenu",
      "Next.js",
      "Application"
    ],
    "tools": [
      "Next.js"
    ],
    "accentIndex": 0
  },
  {
    "name": "FicheArchitectureVisible",
    "kind": "maquette",
    "chapter": "b3-s3",
    "template": "file-card",
    "title": "Risque principal",
    "description": "Une fiche courte rend les raisons du choix technique visibles avant l'installation.",
    "ariaLabel": "Une fiche courte rend les raisons du choix technique visibles avant l'installation.",
    "labels": [
      "Type de produit",
      "Pages",
      "Données",
      "Comptes",
      "Hébergement",
      "Maintenance",
      "Risque principal",
      "Choix retenu"
    ],
    "tools": [
      "Next.js"
    ],
    "accentIndex": 6
  },
  {
    "name": "PlanPuisSessionPropre",
    "kind": "schema",
    "chapter": "b3-s3",
    "template": "workflow",
    "title": "Valider",
    "description": "Une session prépare le plan, une personne tranche, puis une autre session construit.",
    "ariaLabel": "Une session prépare le plan, une personne tranche, puis une autre session construit.",
    "labels": [
      "Lire",
      "Comparer",
      "Valider",
      "Construire",
      "Vérifier"
    ],
    "tools": [
      "Claude Code",
      "Claude",
      "Codex"
    ],
    "accentIndex": 2
  },
  {
    "name": "TestCritiqueAvantChoix",
    "kind": "schema",
    "chapter": "b3-s3",
    "template": "fork",
    "title": "Option A",
    "description": "Chaque option doit passer l'épreuve qui compte le plus pour le projet.",
    "ariaLabel": "Chaque option doit passer l'épreuve qui compte le plus pour le projet.",
    "labels": [
      "Option A",
      "Option B",
      "Option C",
      "Test critique",
      "Choix"
    ],
    "tools": [],
    "accentIndex": 0
  }
] as const satisfies readonly CoffreVisualDefinition[];
