import type { CoffreVisualDefinition } from "./types";

export const b3_s1_VISUALS = [
  {
    "name": "CodeTropTot",
    "kind": "schema",
    "chapter": "b3-s1",
    "template": "compare",
    "title": "Code d'abord",
    "description": "Le même effort produit deux résultats différents selon la qualité du plan.",
    "ariaLabel": "Le même effort produit deux résultats différents selon la qualité du plan.",
    "labels": [
      "Code d'abord",
      "Retours coûteux",
      "Plan d'abord",
      "Construction nette"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "BriefQuatreReponses",
    "kind": "schema",
    "chapter": "b3-s1",
    "template": "fork",
    "title": "Quel geste ?",
    "description": "Quatre réponses éclairent le projet avant toute décision technique.",
    "ariaLabel": "Quatre réponses éclairent le projet avant toute décision technique.",
    "labels": [
      "Qui ?",
      "Quel moment ?",
      "Quel geste ?",
      "Quelle preuve ?"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "RouteDuSite",
    "kind": "schema",
    "chapter": "b3-s1",
    "template": "steps",
    "title": "Page",
    "description": "Un site avance dans un ordre continu, du besoin jusqu'à la vérification.",
    "ariaLabel": "Un site avance dans un ordre continu, du besoin jusqu'à la vérification.",
    "labels": [
      "Besoin",
      "Message",
      "Page",
      "Style",
      "Technique",
      "Vérifier"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "PageRenovationAnnotee",
    "kind": "maquette",
    "chapter": "b3-s1",
    "template": "web-compare",
    "title": "Rénove ta maison sans chercher cinq artisans",
    "description": "La structure de la page répond aux questions avant de demander les coordonnées.",
    "ariaLabel": "La structure de la page répond aux questions avant de demander les coordonnées.",
    "labels": [
      "Rénove ta maison sans chercher cinq artisans",
      "Un seul interlocuteur pour préparer et suivre ton chantier à Grenoble",
      "Décrire mon chantier"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "FeuVertAvantCode",
    "kind": "schema",
    "chapter": "b3-s1",
    "template": "ladder",
    "title": "Public",
    "description": "Le code démarre quand quatre décisions sont assez claires pour construire.",
    "ariaLabel": "Le code démarre quand quatre décisions sont assez claires pour construire.",
    "labels": [
      "Public",
      "Action",
      "Preuve",
      "Données",
      "Tu peux construire"
    ],
    "tools": [],
    "accentIndex": 0
  }
] as const satisfies readonly CoffreVisualDefinition[];
