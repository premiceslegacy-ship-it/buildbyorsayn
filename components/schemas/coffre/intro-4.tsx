import type { CoffreVisualDefinition } from "./types";

export const intro_4_VISUALS = [
  {
    "name": "MethodeQuiReste",
    "kind": "schema",
    "chapter": "intro-4",
    "template": "tool-map",
    "title": "Ta méthode",
    "description": "Les outils changent, mais le dossier de méthode garde et améliore les décisions.",
    "ariaLabel": "Les outils changent, mais le dossier de méthode garde et améliore les décisions.",
    "labels": [
      "Outil 1",
      "Outil 2",
      "Outil 3",
      "Ta méthode",
      "Elle reste"
    ],
    "tools": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "accentIndex": 3
  }
] as const satisfies readonly CoffreVisualDefinition[];
