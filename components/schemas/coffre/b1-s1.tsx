import type { CoffreVisualDefinition } from "./types";

export const b1_s1_VISUALS = [
  {
    "name": "VisiteDuTravail",
    "kind": "schema",
    "chapter": "b1-s1",
    "template": "workflow",
    "title": "Dernier cas",
    "description": "L'observation suit un dossier réel plutôt qu'une procédure racontée de mémoire.",
    "ariaLabel": "L'observation suit un dossier réel plutôt qu'une procédure racontée de mémoire.",
    "labels": [
      "Dernier cas",
      "Montre",
      "Qui décide ?",
      "Résultat"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "TroisRoles",
    "kind": "schema",
    "chapter": "b1-s1",
    "template": "rings",
    "title": "Décide",
    "description": "L'IA prépare, la personne décide et le client reçoit.",
    "ariaLabel": "L'IA prépare, la personne décide et le client reçoit.",
    "labels": [
      "Prépare",
      "Décide",
      "Reçoit"
    ],
    "tools": [],
    "accentIndex": 1
  },
  {
    "name": "FeuDesDecisions",
    "kind": "schema",
    "chapter": "b1-s1",
    "template": "fork",
    "title": "Tu valides",
    "description": "Chaque geste reçoit une règle de départ, de validation ou d'arrêt.",
    "ariaLabel": "Chaque geste reçoit une règle de départ, de validation ou d'arrêt.",
    "labels": [
      "Règle claire",
      "Tu valides",
      "On arrête"
    ],
    "tools": [],
    "accentIndex": 1
  }
] as const satisfies readonly CoffreVisualDefinition[];
