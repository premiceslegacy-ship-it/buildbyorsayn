import type { CoffreVisualDefinition } from "./types";

export const b6_s2_VISUALS = [
  {
    "name": "OrchestrationSixTemps",
    "kind": "schema",
    "chapter": "b6-s2",
    "template": "workflow",
    "title": "Décisions",
    "description": "Le projet avance dans un ordre où chaque étape prépare la suivante.",
    "ariaLabel": "Le projet avance dans un ordre où chaque étape prépare la suivante.",
    "labels": [
      "Interview",
      "Documents",
      "Décisions",
      "Spécialistes",
      "Construction",
      "Audits"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "DocumentsQuiSeNourrissent",
    "kind": "schema",
    "chapter": "b6-s2",
    "template": "rings",
    "title": "Brief",
    "description": "Les documents partagent une source commune et se transmettent des décisions précises.",
    "ariaLabel": "Les documents partagent une source commune et se transmettent des décisions précises.",
    "labels": [
      "Brief",
      "Marque",
      "Copy",
      "Design",
      "Données",
      "PRD"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "ContratDeLotAnnote",
    "kind": "maquette",
    "chapter": "b6-s2",
    "template": "file-card",
    "title": "Test final",
    "description": "Un lot clair dit quoi faire, où agir et comment savoir que c'est fini.",
    "ariaLabel": "Un lot clair dit quoi faire, où agir et comment savoir que c'est fini.",
    "labels": [
      "Objectif",
      "Sources",
      "Fichiers autorisés",
      "Interdits",
      "Résultat attendu",
      "Test final",
      "Prochain responsable"
    ],
    "tools": [
      "GitHub"
    ],
    "accentIndex": 5
  },
  {
    "name": "CockpitIntegration",
    "kind": "maquette",
    "chapter": "b6-s2",
    "template": "workflow",
    "title": "À réunir",
    "description": "Les lots indépendants avancent ensemble, puis un seul responsable réunit le résultat.",
    "ariaLabel": "Les lots indépendants avancent ensemble, puis un seul responsable réunit le résultat.",
    "labels": [
      "À faire",
      "En cours",
      "À réunir",
      "Validé"
    ],
    "tools": [
      "Claude Code",
      "GitHub",
      "Claude",
      "Codex"
    ],
    "accentIndex": 2
  },
  {
    "name": "ParcoursE2EVisible",
    "kind": "schema",
    "chapter": "b6-s2",
    "template": "workflow",
    "title": "Confirmer",
    "description": "Le test suit ce que la personne voit du premier écran jusqu'au résultat.",
    "ariaLabel": "Le test suit ce que la personne voit du premier écran jusqu'au résultat.",
    "labels": [
      "Choisir",
      "Réserver",
      "Confirmer",
      "Revenir",
      "Refus attendu"
    ],
    "tools": [],
    "accentIndex": 2
  }
] as const satisfies readonly CoffreVisualDefinition[];
