import type { CoffreVisualDefinition } from "./types";

export const b1_s3_VISUALS = [
  {
    "name": "BoucleCommercialeVivante",
    "kind": "schema",
    "chapter": "b1-s3",
    "template": "cycle",
    "title": "Demande",
    "description": "Une demande traverse le commerce et revient sous forme d'apprentissage.",
    "ariaLabel": "Une demande traverse le commerce et revient sous forme d'apprentissage.",
    "labels": [
      "Demande",
      "Devis",
      "Réponse",
      "Livraison",
      "Apprentissage"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "ContexteQuiPasse",
    "kind": "schema",
    "chapter": "b1-s3",
    "template": "workflow",
    "title": "Même fiche",
    "description": "Une fiche unique avance avec le dossier et évite les recopies.",
    "ariaLabel": "Une fiche unique avance avec le dossier et évite les recopies.",
    "labels": [
      "Demande",
      "Décision",
      "Suite",
      "Même fiche"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "MainAuxDecisions",
    "kind": "schema",
    "chapter": "b1-s3",
    "template": "fork",
    "title": "Prépare",
    "description": "Une personne valide chaque geste qui engage l'entreprise.",
    "ariaLabel": "Une personne valide chaque geste qui engage l'entreprise.",
    "labels": [
      "Prépare",
      "Tu valides",
      "Envoie"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "UneBouclePuisDeux",
    "kind": "schema",
    "chapter": "b1-s3",
    "template": "cycle",
    "title": "Stable",
    "description": "Une boucle stable reçoit une seconde boucle seulement après plusieurs passages.",
    "ariaLabel": "Une boucle stable reçoit une seconde boucle seulement après plusieurs passages.",
    "labels": [
      "Une boucle",
      "Plusieurs cas",
      "Stable",
      "Puis la suite"
    ],
    "tools": [],
    "accentIndex": 2
  }
] as const satisfies readonly CoffreVisualDefinition[];
