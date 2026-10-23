import type { CoffreVisualDefinition } from "./types";

export const b4_s1b_VISUALS = [
  {
    "name": "ResultatVersCompetences",
    "kind": "schema",
    "chapter": "b4-s1b",
    "template": "rings",
    "title": "Résultat",
    "description": "Un résultat complet se déplie jusqu'aux tâches qui le rendent possible.",
    "ariaLabel": "Un résultat complet se déplie jusqu'aux tâches qui le rendent possible.",
    "labels": [
      "Résultat",
      "Domaines",
      "Compétences",
      "Tâches",
      "Contrôles"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "FormulaireQuatreMetiers",
    "kind": "maquette",
    "chapter": "b4-s1b",
    "template": "web-page",
    "title": "Ton besoin",
    "description": "Un seul écran rassemble quatre décisions différentes.",
    "ariaLabel": "Un seul écran rassemble quatre décisions différentes.",
    "labels": [
      "Ton besoin",
      "Date souhaitée",
      "Photos",
      "Envoyer ma demande"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "FicheCompetenceAnnotee",
    "kind": "maquette",
    "chapter": "b4-s1b",
    "template": "file-card",
    "title": "Vérification",
    "description": "Une compétence devient claire quand elle nomme ce qu'elle reçoit, décide et remet.",
    "ariaLabel": "Une compétence devient claire quand elle nomme ce qu'elle reçoit, décide et remet.",
    "labels": [
      "Entrée",
      "Source",
      "Décision",
      "Erreur à éviter",
      "Sortie",
      "Vérification",
      "Propriétaire"
    ],
    "tools": [],
    "accentIndex": 5
  },
  {
    "name": "QuandArreterDeDecouper",
    "kind": "schema",
    "chapter": "b4-s1b",
    "template": "fork",
    "title": "Stop",
    "description": "Le découpage s'arrête quand la tâche peut être confiée sans explication orale.",
    "ariaLabel": "Le découpage s'arrête quand la tâche peut être confiée sans explication orale.",
    "labels": [
      "But clair",
      "Entrée connue",
      "Sortie connue",
      "Contrôle clair",
      "Stop"
    ],
    "tools": [],
    "accentIndex": 4
  },
  {
    "name": "PratiqueSourcesRegle",
    "kind": "schema",
    "chapter": "b4-s1b",
    "template": "compare",
    "title": "Cas contraire",
    "description": "Une règle utile naît de projets comparés et de sources confrontées.",
    "ariaLabel": "Une règle utile naît de projets comparés et de sources confrontées.",
    "labels": [
      "Projets",
      "Erreurs",
      "Sources",
      "Cas contraire",
      "Règle testée"
    ],
    "tools": [],
    "accentIndex": 3
  }
] as const satisfies readonly CoffreVisualDefinition[];
