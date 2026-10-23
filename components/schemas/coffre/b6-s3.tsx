import type { CoffreVisualDefinition } from "./types";

export const b6_s3_VISUALS = [
  {
    "name": "QuiFaitQuoiProduit",
    "kind": "schema",
    "chapter": "b6-s3",
    "template": "rings",
    "title": "Intégration",
    "description": "Chaque spécialiste approfondit une partie, puis l'intégrateur protège l'ensemble.",
    "ariaLabel": "Chaque spécialiste approfondit une partie, puis l'intégrateur protège l'ensemble.",
    "labels": [
      "Direction",
      "Visuel",
      "Backend",
      "Intégration",
      "Produit"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "FormulaireDeuxMetiers",
    "kind": "maquette",
    "chapter": "b6-s3",
    "template": "web-compare",
    "title": "Rôle demandé",
    "description": "Un même formulaire dépend de choix visibles et de règles invisibles.",
    "ariaLabel": "Un même formulaire dépend de choix visibles et de règles invisibles.",
    "labels": [
      "Nom",
      "E-mail",
      "Rôle demandé",
      "Créer mon compte"
    ],
    "tools": [
      "Supabase",
      "Figma"
    ],
    "accentIndex": 2
  },
  {
    "name": "BoucleDelegation",
    "kind": "schema",
    "chapter": "b6-s3",
    "template": "cycle",
    "title": "Réunir",
    "description": "Chaque travail spécialisé revient au projet avant la suite.",
    "ariaLabel": "Chaque travail spécialisé revient au projet avant la suite.",
    "labels": [
      "Décider",
      "Confier",
      "Produire",
      "Réunir",
      "Accepter"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "ChoisirDirectSkillOuDelegation",
    "kind": "schema",
    "chapter": "b6-s3",
    "template": "fork",
    "title": "Direct",
    "description": "Le mode de travail dépend de la difficulté, du risque et des dépendances.",
    "ariaLabel": "Le mode de travail dépend de la difficulté, du risque et des dépendances.",
    "labels": [
      "Direct",
      "Skill",
      "Spécialiste",
      "Difficulté",
      "Risque",
      "Dépendances"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "RevueDesRoles",
    "kind": "maquette",
    "chapter": "b6-s3",
    "template": "file-card",
    "title": "Patient",
    "description": "Les rôles se vérifient dans l'interface avec les autorisations et les refus.",
    "ariaLabel": "Les rôles se vérifient dans l'interface avec les autorisations et les refus.",
    "labels": [
      "Patient",
      "Accueil",
      "Praticien"
    ],
    "tools": [
      "Supabase"
    ],
    "accentIndex": 0
  }
] as const satisfies readonly CoffreVisualDefinition[];
