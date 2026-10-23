import type { CoffreVisualDefinition } from "./types";

export const b1_s0_VISUALS = [
  {
    "name": "MemeDemandeDeuxFuturs",
    "kind": "schema",
    "chapter": "b1-s0",
    "template": "curves",
    "title": "Garde",
    "description": "Deux entreprises partent de la même demande, puis leur écart grandit à chaque projet.",
    "ariaLabel": "Deux entreprises partent de la même demande, puis leur écart grandit à chaque projet.",
    "labels": [
      "Même demande",
      "Recommence",
      "Garde",
      "Projet suivant"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "CapitalQuiReste",
    "kind": "schema",
    "chapter": "b1-s0",
    "template": "rings",
    "title": "Ça reste",
    "description": "Les apprentissages concrets remplissent un réservoir qui survit au changement d'outil.",
    "ariaLabel": "Les apprentissages concrets remplissent un réservoir qui survit au changement d'outil.",
    "labels": [
      "Mots",
      "Choix",
      "Erreurs",
      "Fichiers",
      "Ça reste"
    ],
    "tools": [],
    "accentIndex": 4
  },
  {
    "name": "SceneAvantOutil",
    "kind": "schema",
    "chapter": "b1-s0",
    "template": "workflow",
    "title": "Qui décide ?",
    "description": "L'observation du travail vient avant le choix d'une solution.",
    "ariaLabel": "L'observation du travail vient avant le choix d'une solution.",
    "labels": [
      "Regarde",
      "Demande",
      "Qui décide ?",
      "Ouvre ensuite"
    ],
    "tools": [],
    "accentIndex": 2
  }
] as const satisfies readonly CoffreVisualDefinition[];
