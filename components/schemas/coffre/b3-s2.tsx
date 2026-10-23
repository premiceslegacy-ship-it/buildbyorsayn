import type { CoffreVisualDefinition } from "./types";

export const b3_s2_VISUALS = [
  {
    "name": "TriangleDeDirection",
    "kind": "schema",
    "chapter": "b3-s2",
    "template": "rings",
    "title": "Message",
    "description": "Trois décisions différentes ferment une seule direction autour de la page.",
    "ariaLabel": "Trois décisions différentes ferment une seule direction autour de la page.",
    "labels": [
      "Message",
      "Structure",
      "Style",
      "Une page cohérente"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "TitreInterchangeableOuPrecis",
    "kind": "schema",
    "chapter": "b3-s2",
    "template": "web-compare",
    "title": "Grenoble",
    "description": "Un titre précis montre une scène, tandis qu'un titre vague peut appartenir à tout le monde.",
    "ariaLabel": "Un titre précis montre une scène, tandis qu'un titre vague peut appartenir à tout le monde.",
    "labels": [
      "Pour tous vos projets",
      "Rénovation complète",
      "Grenoble",
      "Un interlocuteur"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "QuestionsDansLaPage",
    "kind": "schema",
    "chapter": "b3-s2",
    "template": "chat",
    "title": "Et maintenant ?",
    "description": "Chaque section répond au doute qui apparaît juste avant elle.",
    "ariaLabel": "Chaque section répond au doute qui apparaît juste avant elle.",
    "labels": [
      "Pour moi ?",
      "Crédible ?",
      "Comment ?",
      "Et maintenant ?"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "ReferenceDecoupee",
    "kind": "schema",
    "chapter": "b3-s2",
    "template": "steps",
    "title": "Densité",
    "description": "Une référence devient une liste de choix visuels, jamais un modèle à copier.",
    "ariaLabel": "Une référence devient une liste de choix visuels, jamais un modèle à copier.",
    "labels": [
      "Densité",
      "Contraste",
      "Typographie",
      "Mouvement"
    ],
    "tools": [
      "Figma"
    ],
    "accentIndex": 0
  },
  {
    "name": "TroisCalquesUnePage",
    "kind": "maquette",
    "chapter": "b3-s2",
    "template": "web-compare",
    "title": "Planifie ta pièce avant d'acheter",
    "description": "Le message, l'ordre et l'allure doivent raconter la même promesse.",
    "ariaLabel": "Le message, l'ordre et l'allure doivent raconter la même promesse.",
    "labels": [
      "Planifie ta pièce avant d'acheter",
      "Préparer ma visite"
    ],
    "tools": [
      "Figma"
    ],
    "accentIndex": 0
  }
] as const satisfies readonly CoffreVisualDefinition[];
