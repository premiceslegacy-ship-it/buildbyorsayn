import type { CoffreVisualDefinition } from "./types";

export const intro_2_VISUALS = [
  {
    "name": "UnOutilUnRole",
    "kind": "schema",
    "chapter": "intro-2",
    "template": "tool-map",
    "title": "Chercher",
    "description": "Une stack lisible attribue un seul rôle principal à chaque outil.",
    "ariaLabel": "Une stack lisible attribue un seul rôle principal à chaque outil.",
    "labels": [
      "Chercher",
      "Penser",
      "Dessiner",
      "Construire",
      "Stocker",
      "Livrer"
    ],
    "tools": [
      "Claude Code",
      "NotebookLM",
      "Supabase",
      "Vercel",
      "Claude",
      "Figma"
    ],
    "accentIndex": 0
  }
] as const satisfies readonly CoffreVisualDefinition[];
