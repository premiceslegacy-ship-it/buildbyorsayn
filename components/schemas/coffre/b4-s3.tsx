import type { CoffreVisualDefinition } from "./types";

export const b4_s3_VISUALS = [
  {
    "name": "SecondCerveauTroisEtages",
    "kind": "schema",
    "chapter": "b4-s3",
    "template": "ladder",
    "title": "Notes",
    "description": "Notes, méthodes et données du jour appartiennent à trois endroits différents.",
    "ariaLabel": "Notes, méthodes et données du jour appartiennent à trois endroits différents.",
    "labels": [
      "Notes",
      "Méthodes",
      "Données du jour",
      "Trois endroits"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "SystemeMetierVsSecondCerveau",
    "kind": "schema",
    "chapter": "b4-s3",
    "template": "web-compare",
    "title": "Facture payée",
    "description": "Le système métier garde l'état actuel, tandis que le second cerveau garde la méthode datée.",
    "ariaLabel": "Le système métier garde l'état actuel, tandis que le second cerveau garde la méthode datée.",
    "labels": [
      "Facture payée",
      "Aujourd'hui",
      "Méthode de relance",
      "Revue : vendredi"
    ],
    "tools": [
      "Obsidian"
    ],
    "accentIndex": 0
  },
  {
    "name": "TerrainAvantBibliotheque",
    "kind": "schema",
    "chapter": "b4-s3",
    "template": "ladder",
    "title": "Observer",
    "description": "Les vrais projets précèdent l'écriture d'une méthode générale.",
    "ariaLabel": "Les vrais projets précèdent l'écriture d'une méthode générale.",
    "labels": [
      "Vendre",
      "Livrer",
      "Observer",
      "Écrire",
      "Réutiliser"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "BoucleSkillVivant",
    "kind": "schema",
    "chapter": "b4-s3",
    "template": "cycle",
    "title": "Tester",
    "description": "Le skill progresse quand l'usage produit une correction testée.",
    "ariaLabel": "Le skill progresse quand l'usage produit une correction testée.",
    "labels": [
      "Utiliser",
      "Repérer",
      "Reproduire",
      "Corriger",
      "Tester",
      "Versionner"
    ],
    "tools": [
      "GitHub"
    ],
    "accentIndex": 4
  },
  {
    "name": "DecisionRangeeAnnotee",
    "kind": "maquette",
    "chapter": "b4-s3",
    "template": "file-card",
    "title": "Cas contraire",
    "description": "Une décision utile garde assez de contexte pour être revue plus tard.",
    "ariaLabel": "Une décision utile garde assez de contexte pour être revue plus tard.",
    "labels": [
      "Situation",
      "Source",
      "Décision",
      "Pourquoi",
      "Cas contraire",
      "Prochain contrôle",
      "Date de revue"
    ],
    "tools": [
      "Obsidian"
    ],
    "accentIndex": 4
  }
] as const satisfies readonly CoffreVisualDefinition[];
