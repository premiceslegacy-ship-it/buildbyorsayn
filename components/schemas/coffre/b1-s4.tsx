import type { CoffreVisualDefinition } from "./types";

export const b1_s4_VISUALS = [
  {
    "name": "PhraseDeLigne",
    "kind": "schema",
    "chapter": "b1-s4",
    "template": "steps",
    "title": "Geste",
    "description": "Quatre pièces suffisent pour écrire une ligne testable.",
    "ariaLabel": "Quatre pièces suffisent pour écrire une ligne testable.",
    "labels": [
      "Client",
      "Résultat",
      "Geste",
      "Ta réponse"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "EntretienDernierCas",
    "kind": "schema",
    "chapter": "b1-s4",
    "template": "chat",
    "title": "Ton avis ?",
    "description": "Une question sur le passé ouvre des faits, tandis qu'une demande d'avis ouvre un compliment.",
    "ariaLabel": "Une question sur le passé ouvre des faits, tandis qu'une demande d'avis ouvre un compliment.",
    "labels": [
      "Ton avis ?",
      "Sympa",
      "Dernier cas ?",
      "Montre-moi"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "DemoEtroite",
    "kind": "schema",
    "chapter": "b1-s4",
    "template": "web-compare",
    "title": "Tu valides",
    "description": "Une petite démonstration montre son travail et ses limites.",
    "ariaLabel": "Une petite démonstration montre son travail et ses limites.",
    "labels": [
      "Entre",
      "Prépare",
      "Tu valides",
      "N'envoie jamais seul"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "TroisDecisions",
    "kind": "schema",
    "chapter": "b1-s4",
    "template": "fork",
    "title": "Modifier",
    "description": "L'entretien mène à trois décisions distinctes.",
    "ariaLabel": "L'entretien mène à trois décisions distinctes.",
    "labels": [
      "Continuer",
      "Modifier",
      "Arrêter"
    ],
    "tools": [],
    "accentIndex": 1
  }
] as const satisfies readonly CoffreVisualDefinition[];
