import type { CoffreVisualDefinition } from "./types";

export const b5_s1_VISUALS = [
  {
    "name": "ToiOuLeClient",
    "kind": "schema",
    "chapter": "b5-s1",
    "template": "compare",
    "title": "Sa journée",
    "description": "Deux boussoles peuvent guider le projet, mais une seule pointe vers le travail du client.",
    "ariaLabel": "Deux boussoles peuvent guider le projet, mais une seule pointe vers le travail du client.",
    "labels": [
      "Ce qui me plaît",
      "Ce qu'il doit faire",
      "Sa journée"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "DernierCasSurLaTable",
    "kind": "schema",
    "chapter": "b5-s1",
    "template": "file-card",
    "title": "Dernier cas",
    "description": "Un dossier récent révèle le travail mieux qu'une procédure idéale.",
    "ariaLabel": "Un dossier récent révèle le travail mieux qu'une procédure idéale.",
    "labels": [
      "Dernier cas",
      "Qu'est-il arrivé ?",
      "Qui décide ?",
      "Qu'est-ce qui manque ?"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "DefinitionDuSucces",
    "kind": "schema",
    "chapter": "b5-s1",
    "template": "compare",
    "title": "Accepté",
    "description": "Le succès devient un état visible que le client peut reconnaître.",
    "ariaLabel": "Le succès devient un état visible que le client peut reconnaître.",
    "labels": [
      "Outil moderne",
      "Dossier complet",
      "Accepté"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "PlusPetiteReponse",
    "kind": "schema",
    "chapter": "b5-s1",
    "template": "funnel",
    "title": "La cause",
    "description": "Plusieurs solutions possibles se resserrent vers celle qui traite la cause observée.",
    "ariaLabel": "Plusieurs solutions possibles se resserrent vers celle qui traite la cause observée.",
    "labels": [
      "Beaucoup d'idées",
      "La cause",
      "Une réponse",
      "Une limite"
    ],
    "tools": [],
    "accentIndex": 1
  }
] as const satisfies readonly CoffreVisualDefinition[];
