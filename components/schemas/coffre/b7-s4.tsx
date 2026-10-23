import type { CoffreVisualDefinition } from "./types";

export const b7_s4_VISUALS = [
  {
    "name": "BilanDuSystemeAnnote",
    "kind": "maquette",
    "chapter": "b7-s4",
    "template": "file-card",
    "title": "Une correction choisie",
    "description": "Une revue courte classe les faits avant de choisir une correction.",
    "ariaLabel": "Une revue courte classe les faits avant de choisir une correction.",
    "labels": [
      "Ce qui bloque",
      "Erreur",
      "Réussite",
      "Décision urgente",
      "Une correction choisie"
    ],
    "tools": [],
    "accentIndex": 4
  },
  {
    "name": "ErreurVersTest",
    "kind": "schema",
    "chapter": "b7-s4",
    "template": "compare",
    "title": "Rejouer",
    "description": "Une erreur devient un apprentissage seulement après reproduction et nouvelle vérification.",
    "ariaLabel": "Une erreur devient un apprentissage seulement après reproduction et nouvelle vérification.",
    "labels": [
      "Attendu",
      "Obtenu",
      "Reproduire",
      "Corriger",
      "Rejouer",
      "Tester"
    ],
    "tools": [
      "GitHub"
    ],
    "accentIndex": 4
  },
  {
    "name": "ReussiteVersCandidat",
    "kind": "schema",
    "chapter": "b7-s4",
    "template": "ladder",
    "title": "Retester",
    "description": "Une réussite passe par la comparaison et plusieurs usages avant de devenir une règle.",
    "ariaLabel": "Une réussite passe par la comparaison et plusieurs usages avant de devenir une règle.",
    "labels": [
      "Une réussite",
      "Comparer",
      "Retester",
      "Réutiliser",
      "Règle"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "RangerAuBonEndroit",
    "kind": "schema",
    "chapter": "b7-s4",
    "template": "cycle",
    "title": "Mémoire",
    "description": "Chaque apprentissage possède une destination différente selon sa nature.",
    "ariaLabel": "Chaque apprentissage possède une destination différente selon sa nature.",
    "labels": [
      "Mémoire",
      "SOP",
      "Skill",
      "Modèle",
      "Test",
      "Décision",
      "Projet"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "ParcoursCompletCoffre",
    "kind": "schema",
    "chapter": "b7-s4",
    "template": "cycle",
    "title": "Nouveau projet",
    "description": "Le parcours revient toujours au terrain avec une méthode plus claire.",
    "ariaLabel": "Le parcours revient toujours au terrain avec une méthode plus claire.",
    "labels": [
      "Client",
      "Offre",
      "Cadrer",
      "Construire",
      "Livrer",
      "Apprendre",
      "Nouveau projet"
    ],
    "tools": [],
    "accentIndex": 6
  }
] as const satisfies readonly CoffreVisualDefinition[];
