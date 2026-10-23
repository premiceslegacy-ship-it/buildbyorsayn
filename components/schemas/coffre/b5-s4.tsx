import type { CoffreVisualDefinition } from "./types";

export const b5_s4_VISUALS = [
  {
    "name": "DeuxPaniersDerreurs",
    "kind": "schema",
    "chapter": "b5-s4",
    "template": "fork",
    "title": "Ça s'arrête",
    "description": "Les défauts à corriger se séparent des risques qui arrêtent la sortie.",
    "ariaLabel": "Les défauts à corriger se séparent des risques qui arrêtent la sortie.",
    "labels": [
      "À corriger",
      "Ça peut sortir",
      "Bloquant",
      "Ça s'arrête"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "LigneRouge",
    "kind": "schema",
    "chapter": "b5-s4",
    "template": "fork",
    "title": "Identité",
    "description": "Quatre conséquences arrêtent la livraison avant toute discussion de délai.",
    "ariaLabel": "Quatre conséquences arrêtent la livraison avant toute discussion de délai.",
    "labels": [
      "Identité",
      "Données",
      "Paiement",
      "Agir pour quelqu'un"
    ],
    "tools": [
      "Stripe"
    ],
    "accentIndex": 0
  },
  {
    "name": "ParcoursCritique",
    "kind": "schema",
    "chapter": "b5-s4",
    "template": "workflow",
    "title": "Refus",
    "description": "Le parcours normal reçoit quatre branches de test avant la sortie.",
    "ariaLabel": "Le parcours normal reçoit quatre branches de test avant la sortie.",
    "labels": [
      "Normal",
      "Refus",
      "Manquant",
      "Doublon",
      "Reprise"
    ],
    "tools": [],
    "accentIndex": 1
  },
  {
    "name": "TestQuiGardeLaPreuve",
    "kind": "schema",
    "chapter": "b5-s4",
    "template": "compare",
    "title": "Attendu",
    "description": "L'agent peut réparer l'exécution, tandis que la personne protège le résultat attendu.",
    "ariaLabel": "L'agent peut réparer l'exécution, tandis que la personne protège le résultat attendu.",
    "labels": [
      "Code cassé",
      "Réparer",
      "Attendu",
      "Revue humaine"
    ],
    "tools": [],
    "accentIndex": 2
  }
] as const satisfies readonly CoffreVisualDefinition[];
