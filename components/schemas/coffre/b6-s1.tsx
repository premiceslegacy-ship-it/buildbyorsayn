import type { CoffreVisualDefinition } from "./types";

export const b6_s1_VISUALS = [
  {
    "name": "IdeeFloueScenePrecise",
    "kind": "schema",
    "chapter": "b6-s1",
    "template": "compare",
    "title": "Synthèse prête",
    "description": "Une demande vague devient claire quand elle se resserre sur une scène et un résultat.",
    "ariaLabel": "Une demande vague devient claire quand elle se resserre sur une scène et un résultat.",
    "labels": [
      "Gérer les dossiers",
      "Mardi matin",
      "Sarah",
      "Synthèse prête"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "ChoisirLeModeProduit",
    "kind": "schema",
    "chapter": "b6-s1",
    "template": "fork",
    "title": "Interne",
    "description": "Le mode du produit change la manière de construire et de maintenir.",
    "ariaLabel": "Le mode du produit change la manière de construire et de maintenir.",
    "labels": [
      "Interne",
      "Dédié",
      "Partagé",
      "Intégré",
      "Cockpit"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "OracleProjectAnnote",
    "kind": "maquette",
    "chapter": "b6-s1",
    "template": "file-card",
    "title": "À confirmer",
    "description": "Le dossier projet sépare ce qui est décidé, supposé et encore inconnu.",
    "ariaLabel": "Le dossier projet sépare ce qui est décidé, supposé et encore inconnu.",
    "labels": [
      "Scène",
      "Résultat",
      "Mode du produit",
      "Données",
      "Risques",
      "Ce qui reste dehors",
      "Décisions",
      "À confirmer"
    ],
    "tools": [],
    "accentIndex": 7
  },
  {
    "name": "IADansLeProduit",
    "kind": "schema",
    "chapter": "b6-s1",
    "template": "web-compare",
    "title": "Relire",
    "description": "L'IA prépare en coulisse, la personne voit le résultat et choisit l'action.",
    "ariaLabel": "L'IA prépare en coulisse, la personne voit le résultat et choisit l'action.",
    "labels": [
      "Documents",
      "Brouillon",
      "Relire",
      "Envoyer"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "DossierSelonLeRisque",
    "kind": "schema",
    "chapter": "b6-s1",
    "template": "compare",
    "title": "Juste assez",
    "description": "Le nombre de documents suit le risque réel du projet.",
    "ariaLabel": "Le nombre de documents suit le risque réel du projet.",
    "labels": [
      "Petit outil",
      "Portail sensible",
      "Juste assez"
    ],
    "tools": [],
    "accentIndex": 2
  }
] as const satisfies readonly CoffreVisualDefinition[];
