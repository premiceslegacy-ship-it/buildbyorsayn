import type { CoffreVisualDefinition } from "./types";

export const b2_s1_VISUALS = [
  {
    "name": "TableDesOutils",
    "kind": "schema",
    "chapter": "b2-s1",
    "template": "steps",
    "title": "Rôles clairs",
    "description": "Une petite sélection maîtrisée laisse le projet respirer.",
    "ariaLabel": "Une petite sélection maîtrisée laisse le projet respirer.",
    "labels": [
      "Trop d'outils",
      "Gestes perdus",
      "Rôles clairs",
      "Projet avancé"
    ],
    "tools": [
      "GitHub",
      "Notion",
      "Claude",
      "Figma"
    ],
    "accentIndex": 2
  },
  {
    "name": "PorteEntreeOutil",
    "kind": "schema",
    "chapter": "b2-s1",
    "template": "fork",
    "title": "Son rôle ?",
    "description": "Un outil entre seulement si quatre questions reçoivent une réponse.",
    "ariaLabel": "Un outil entre seulement si quatre questions reçoivent une réponse.",
    "labels": [
      "Son rôle ?",
      "Il améliore ?",
      "Il s'intègre ?",
      "Tu peux sortir ?"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "CoutTotalVisible",
    "kind": "schema",
    "chapter": "b2-s1",
    "template": "funnel",
    "title": "Prix",
    "description": "Le prix affiché cache plusieurs coûts de travail.",
    "ariaLabel": "Le prix affiché cache plusieurs coûts de travail.",
    "labels": [
      "Prix",
      "Réglage",
      "Suivi",
      "Migration",
      "Sortie"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "DecisionGarderRemplacerRetirer",
    "kind": "schema",
    "chapter": "b2-s1",
    "template": "fork",
    "title": "Garder",
    "description": "L'audit d'un outil finit par une décision écrite.",
    "ariaLabel": "L'audit d'un outil finit par une décision écrite.",
    "labels": [
      "Garder",
      "Remplacer",
      "Retirer"
    ],
    "tools": [],
    "accentIndex": 0
  }
] as const satisfies readonly CoffreVisualDefinition[];
