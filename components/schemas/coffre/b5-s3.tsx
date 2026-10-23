import type { CoffreVisualDefinition } from "./types";

export const b5_s3_VISUALS = [
  {
    "name": "DuRetourALaDecision",
    "kind": "schema",
    "chapter": "b5-s3",
    "template": "cycle",
    "title": "Quelle décision ?",
    "description": "Plusieurs retours deviennent utiles lorsqu'ils rejoignent une décision précise.",
    "ariaLabel": "Plusieurs retours deviennent utiles lorsqu'ils rejoignent une décision précise.",
    "labels": [
      "Objection",
      "Abandon",
      "Correction",
      "Quelle décision ?"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "EntonnoirAvecFuite",
    "kind": "schema",
    "chapter": "b5-s3",
    "template": "funnel",
    "title": "Commencent",
    "description": "La largeur des étapes montre où les personnes sortent du parcours.",
    "ariaLabel": "La largeur des étapes montre où les personnes sortent du parcours.",
    "labels": [
      "Arrivent",
      "Commencent",
      "Ajoutent",
      "Valident"
    ],
    "tools": [
      "PostHog"
    ],
    "accentIndex": 1
  },
  {
    "name": "ChiffrePuisScene",
    "kind": "schema",
    "chapter": "b5-s3",
    "template": "steps",
    "title": "Où ?",
    "description": "Le chiffre trouve le passage, puis l'observation cherche la cause.",
    "ariaLabel": "Le chiffre trouve le passage, puis l'observation cherche la cause.",
    "labels": [
      "Où ?",
      "Regarde",
      "Parle",
      "Pourquoi ?"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "UneCorrectionUneMesure",
    "kind": "schema",
    "chapter": "b5-s3",
    "template": "cycle",
    "title": "Une correction",
    "description": "Une modification revient vers une mesure comparable et une décision.",
    "ariaLabel": "Une modification revient vers une mesure comparable et une décision.",
    "labels": [
      "Avant",
      "Une correction",
      "Après",
      "Décider"
    ],
    "tools": [],
    "accentIndex": 1
  }
] as const satisfies readonly CoffreVisualDefinition[];
