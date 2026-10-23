import type { CoffreVisualDefinition } from "./types";

export const b6_s5_VISUALS = [
  {
    "name": "MemeVeriteTroisSurfaces",
    "kind": "schema",
    "chapter": "b6-s5",
    "template": "rings",
    "title": "Même promesse",
    "description": "La même promesse doit survivre au produit, à la page et à la conversation.",
    "ariaLabel": "La même promesse doit survivre au produit, à la page et à la conversation.",
    "labels": [
      "Produit",
      "Page",
      "Conversation",
      "Même promesse"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "PromesseProduitPreuve",
    "kind": "schema",
    "chapter": "b6-s5",
    "template": "ad-card",
    "title": "Aligné",
    "description": "Une promesse publiable repose sur un geste réel et une preuve disponible.",
    "ariaLabel": "Une promesse publiable repose sur un geste réel et une preuve disponible.",
    "labels": [
      "Promesse",
      "Produit",
      "Preuve",
      "Aligné"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "AvantApresPromesseAssistant",
    "kind": "schema",
    "chapter": "b6-s5",
    "template": "ad-card",
    "title": "Tu valides",
    "description": "Une promesse honnête montre la place de la validation humaine.",
    "ariaLabel": "Une promesse honnête montre la place de la validation humaine.",
    "labels": [
      "Envoie seul",
      "Prépare",
      "Tu valides",
      "Puis envoie"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "LandingProduitAnnotee",
    "kind": "maquette",
    "chapter": "b6-s5",
    "template": "web-page",
    "title": "Retrouve chaque demande avant qu'elle se perde",
    "description": "Une page de produit mène de la scène reconnue vers une action comprise.",
    "ariaLabel": "Une page de produit mène de la scène reconnue vers une action comprise.",
    "labels": [
      "Retrouve chaque demande avant qu'elle se perde",
      "Voir le tableau"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "ParcoursDeVenteTeste",
    "kind": "schema",
    "chapter": "b6-s5",
    "template": "workflow",
    "title": "Reprendre",
    "description": "La page est vérifiée jusqu'à la confirmation et après une erreur.",
    "ariaLabel": "La page est vérifiée jusqu'à la confirmation et après une erreur.",
    "labels": [
      "Arriver",
      "Comprendre",
      "Vérifier",
      "Agir",
      "Confirmer",
      "Reprendre"
    ],
    "tools": [],
    "accentIndex": 5
  }
] as const satisfies readonly CoffreVisualDefinition[];
