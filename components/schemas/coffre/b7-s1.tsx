import type { CoffreVisualDefinition } from "./types";

export const b7_s1_VISUALS = [
  {
    "name": "DeuxFoisPuisObserver",
    "kind": "schema",
    "chapter": "b7-s1",
    "template": "compare",
    "title": "Observe",
    "description": "La répétition déclenche d'abord une observation, pas une règle immédiate.",
    "ariaLabel": "La répétition déclenche d'abord une observation, pas une règle immédiate.",
    "labels": [
      "Première fois",
      "Deuxième fois",
      "Observe",
      "Puis écris"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "AnatomieSop",
    "kind": "schema",
    "chapter": "b7-s1",
    "template": "fork",
    "title": "Résultat",
    "description": "Une procédure complète prépare l'action, son résultat et la reprise.",
    "ariaLabel": "Une procédure complète prépare l'action, son résultat et la reprise.",
    "labels": [
      "Contexte",
      "Entrées",
      "Étapes",
      "Pièges",
      "Résultat",
      "Reprise"
    ],
    "tools": [],
    "accentIndex": 4
  },
  {
    "name": "TesterLeSiteAvantApres",
    "kind": "schema",
    "chapter": "b7-s1",
    "template": "web-compare",
    "title": "Tester le site",
    "description": "Une consigne utile montre le parcours et la preuve de fin.",
    "ariaLabel": "Une consigne utile montre le parcours et la preuve de fin.",
    "labels": [
      "Tester le site",
      "Envoyer",
      "Confirmer",
      "Relire"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "NoteSopOuSkill",
    "kind": "schema",
    "chapter": "b7-s1",
    "template": "fork",
    "title": "Une info",
    "description": "La bonne forme dépend de la répétition et du jugement nécessaire.",
    "ariaLabel": "La bonne forme dépend de la répétition et du jugement nécessaire.",
    "labels": [
      "Une info",
      "Note",
      "Chemin stable",
      "SOP",
      "Plusieurs choix",
      "Skill"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "SopLivraisonAnnotee",
    "kind": "maquette",
    "chapter": "b7-s1",
    "template": "file-card",
    "title": "Parcours critique",
    "description": "Une checklist de livraison relie chaque étape à une preuve et une personne.",
    "ariaLabel": "Une checklist de livraison relie chaque étape à une preuve et une personne.",
    "labels": [
      "Environnement",
      "Variables",
      "Domaine",
      "Parcours critique",
      "Accès transmis",
      "Sauvegarde",
      "Reprise"
    ],
    "tools": [
      "GitHub",
      "Vercel"
    ],
    "accentIndex": 3
  }
] as const satisfies readonly CoffreVisualDefinition[];
