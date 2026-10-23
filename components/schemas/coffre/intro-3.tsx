import type { CoffreVisualDefinition } from "./types";

export const intro_3_VISUALS = [
  {
    "name": "AvantLePremierFichier",
    "kind": "schema",
    "chapter": "intro-3",
    "template": "steps",
    "title": "Code",
    "description": "Le code reste fermé tant que les décisions qui le dirigent ne sont pas posées.",
    "ariaLabel": "Le code reste fermé tant que les décisions qui le dirigent ne sont pas posées.",
    "labels": [
      "Besoin",
      "Message",
      "Page",
      "Style",
      "Code"
    ],
    "tools": [],
    "accentIndex": 4
  }
] as const satisfies readonly CoffreVisualDefinition[];
