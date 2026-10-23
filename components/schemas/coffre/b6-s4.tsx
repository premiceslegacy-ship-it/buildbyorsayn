import type { CoffreVisualDefinition } from "./types";

export const b6_s4_VISUALS = [
  {
    "name": "InstallerOracleQuatreGestes",
    "kind": "schema",
    "chapter": "b6-s4",
    "template": "steps",
    "title": "Détecter",
    "description": "L'installation devient fiable quand chaque geste produit un résultat visible.",
    "ariaLabel": "L'installation devient fiable quand chaque geste produit un résultat visible.",
    "labels": [
      "Télécharger",
      "Ranger",
      "Détecter",
      "Cadrer"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "EcranInstallationOracle",
    "kind": "maquette",
    "chapter": "b6-s4",
    "template": "web-compare",
    "title": "Nom détecté",
    "description": "La personne voit le dossier détecté, sa version et son emplacement avant le premier usage.",
    "ariaLabel": "La personne voit le dossier détecté, sa version et son emplacement avant le premier usage.",
    "labels": [
      "Fichier téléchargé",
      "Emplacement conseillé",
      "Nom détecté",
      "Version",
      "Ouvrir une nouvelle session"
    ],
    "tools": [
      "Claude Code",
      "Claude",
      "Codex"
    ],
    "accentIndex": 2
  },
  {
    "name": "PremierCadrageSeulement",
    "kind": "schema",
    "chapter": "b6-s4",
    "template": "steps",
    "title": "Relire",
    "description": "Le premier usage s'arrête après le dossier projet pour permettre une vraie relecture.",
    "ariaLabel": "Le premier usage s'arrête après le dossier projet pour permettre une vraie relecture.",
    "labels": [
      "Interview",
      "Cadrage",
      "Relire",
      "Code plus tard"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "UneErreurNeDevientPasUneRegle",
    "kind": "schema",
    "chapter": "b6-s4",
    "template": "curves",
    "title": "Tester",
    "description": "Un seul cas corrige le projet, plusieurs cas testés peuvent corriger le skill.",
    "ariaLabel": "Un seul cas corrige le projet, plusieurs cas testés peuvent corriger le skill.",
    "labels": [
      "Un cas",
      "Projet",
      "Plusieurs cas",
      "Tester",
      "Skill"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "ReadbackOracleProject",
    "kind": "maquette",
    "chapter": "b6-s4",
    "template": "file-card",
    "title": "À vérifier",
    "description": "La relecture sépare les décisions sûres de celles qui demandent une réponse.",
    "ariaLabel": "La relecture sépare les décisions sûres de celles qui demandent une réponse.",
    "labels": [
      "Confirmé",
      "À vérifier",
      "Inconnu",
      "Responsable",
      "Prochaine action"
    ],
    "tools": [],
    "accentIndex": 1
  }
] as const satisfies readonly CoffreVisualDefinition[];
