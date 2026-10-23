import type { CoffreVisualDefinition } from "./types";

export const intro_1_VISUALS = [
  {
    "name": "LigneDuTerrain",
    "kind": "schema",
    "chapter": "intro-1",
    "template": "steps",
    "title": "Le terrain",
    "description": "Une ligne utile naît d'une scène de travail, puis avance jusqu'à un test.",
    "ariaLabel": "Une ligne utile naît d'une scène de travail, puis avance jusqu'à un test.",
    "labels": [
      "Une scène",
      "Le métier",
      "Ta ligne",
      "Une démo",
      "Le terrain"
    ],
    "tools": [],
    "accentIndex": 4
  }
] as const satisfies readonly CoffreVisualDefinition[];
