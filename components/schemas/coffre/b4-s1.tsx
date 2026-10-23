import type { CoffreVisualDefinition } from "./types";

export const b4_s1_VISUALS = [
  {
    "name": "PromptOuSkill",
    "kind": "schema",
    "chapter": "b4-s1",
    "template": "compare",
    "title": "Sois expert",
    "description": "Un prompt vague fait deviner, tandis qu'un skill rend les choix visibles.",
    "ariaLabel": "Un prompt vague fait deviner, tandis qu'un skill rend les choix visibles.",
    "labels": [
      "Sois expert",
      "Il devine",
      "Sources",
      "Choix",
      "Contrôles"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "DossierSkillReel",
    "kind": "schema",
    "chapter": "b4-s1",
    "template": "file-card",
    "title": "SKILL.md",
    "description": "Un vrai skill est un dossier lisible, pas un prompt géant.",
    "ariaLabel": "Un vrai skill est un dossier lisible, pas un prompt géant.",
    "labels": [
      "SKILL.md",
      "Références",
      "Scripts",
      "Modèles"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "SkillMdReelAnnote",
    "kind": "maquette",
    "chapter": "b4-s1",
    "template": "file-card",
    "title": "Skill Md Reel Annote",
    "description": "Les premières lignes d'un vrai SKILL.md disent son nom, son déclenchement et sa version.",
    "ariaLabel": "Les premières lignes d'un vrai SKILL.md disent son nom, son déclenchement et sa version.",
    "labels": [
      "Skill Md Reel Annote"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "SopSkillAgent",
    "kind": "schema",
    "chapter": "b4-s1",
    "template": "workflow",
    "title": "SOP",
    "description": "La procédure, la méthode et l'exécutant jouent trois rôles différents.",
    "ariaLabel": "La procédure, la méthode et l'exécutant jouent trois rôles différents.",
    "labels": [
      "SOP",
      "Chemin stable",
      "Skill",
      "Choix",
      "Agent",
      "Exécute"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "DroitsHorsDuSkill",
    "kind": "schema",
    "chapter": "b4-s1",
    "template": "rings",
    "title": "Permission",
    "description": "La méthode reste séparée des accès accordés à l'agent.",
    "ariaLabel": "La méthode reste séparée des accès accordés à l'agent.",
    "labels": [
      "Méthode",
      "Agent",
      "Permission",
      "Accès refusé"
    ],
    "tools": [],
    "accentIndex": 2
  }
] as const satisfies readonly CoffreVisualDefinition[];
