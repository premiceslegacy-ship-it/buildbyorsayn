import type { CoffreVisualDefinition } from "./types";

export const intro_5_VISUALS = [
  {
    "name": "SceneOffreTerrain",
    "kind": "schema",
    "chapter": "intro-5",
    "template": "cycle",
    "title": "Ce que tu apprends",
    "description": "Le business forme une boucle qui part d'une scène client et revient avec un apprentissage.",
    "ariaLabel": "Le business forme une boucle qui part d'une scène client et revient avec un apprentissage.",
    "labels": [
      "Scène",
      "Offre",
      "Vente",
      "Livraison",
      "Ce que tu apprends"
    ],
    "tools": [],
    "accentIndex": 4
  }
] as const satisfies readonly CoffreVisualDefinition[];
