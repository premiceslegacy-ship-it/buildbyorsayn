import type { CoffreVisualDefinition } from "./types";

export const b1_s2_VISUALS = [
  {
    "name": "ZoomDeLaLigne",
    "kind": "schema",
    "chapter": "b1-s2",
    "template": "rings",
    "title": "Scène réelle",
    "description": "La précision transforme un marché vague en scène que l'on peut observer.",
    "ariaLabel": "La précision transforme un marché vague en scène que l'on peut observer.",
    "labels": [
      "Marché",
      "Métier",
      "Moment",
      "Scène réelle"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "QuatreAppuis",
    "kind": "schema",
    "chapter": "b1-s2",
    "template": "fork",
    "title": "Revient",
    "description": "Une ligne tient sur quatre conditions qui doivent rester solides ensemble.",
    "ariaLabel": "Une ligne tient sur quatre conditions qui doivent rester solides ensemble.",
    "labels": [
      "Revient",
      "Décide",
      "Se voit",
      "Ouvre une suite"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "PrestationVersMethode",
    "kind": "schema",
    "chapter": "b1-s2",
    "template": "compare",
    "title": "Ce qui revient",
    "description": "Une mission réelle produit des répétitions qui deviennent une méthode possédée.",
    "ariaLabel": "Une mission réelle produit des répétitions qui deviennent une méthode possédée.",
    "labels": [
      "Mission",
      "Ce qui revient",
      "Procédure",
      "Skill"
    ],
    "tools": [],
    "accentIndex": 1
  },
  {
    "name": "TroisLignesUnTerrain",
    "kind": "schema",
    "chapter": "b1-s2",
    "template": "fork",
    "title": "Cas réel",
    "description": "Le meilleur choix est la ligne qui mène le plus vite à un cas visible.",
    "ariaLabel": "Le meilleur choix est la ligne qui mène le plus vite à un cas visible.",
    "labels": [
      "Idée A",
      "Idée B",
      "Idée C",
      "Cas réel"
    ],
    "tools": [],
    "accentIndex": 3
  }
] as const satisfies readonly CoffreVisualDefinition[];
