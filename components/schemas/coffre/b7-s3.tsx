import type { CoffreVisualDefinition } from "./types";

export const b7_s3_VISUALS = [
  {
    "name": "QuatreModesOrchestration",
    "kind": "schema",
    "chapter": "b7-s3",
    "template": "workflow",
    "title": "Direct",
    "description": "Quatre plans de circulation couvrent les besoins courants sans tout compliquer.",
    "ariaLabel": "Quatre plans de circulation couvrent les besoins courants sans tout compliquer.",
    "labels": [
      "Direct",
      "Aiguillage",
      "Parallèle",
      "Orchestrateur"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "EquipeMinimaleAutourDuResultat",
    "kind": "schema",
    "chapter": "b7-s3",
    "template": "rings",
    "title": "Juste assez",
    "description": "L'équipe naît des décisions nécessaires, pas d'un nombre choisi à l'avance.",
    "ariaLabel": "L'équipe naît des décisions nécessaires, pas d'un nombre choisi à l'avance.",
    "labels": [
      "Résultat",
      "Sources",
      "Décision",
      "Contrôle",
      "Juste assez"
    ],
    "tools": [],
    "accentIndex": 4
  },
  {
    "name": "ContratTravailleurAnnote",
    "kind": "maquette",
    "chapter": "b7-s3",
    "template": "file-card",
    "title": "Arrêt",
    "description": "Un travailleur sait quoi recevoir, quoi produire et où s'arrêter.",
    "ariaLabel": "Un travailleur sait quoi recevoir, quoi produire et où s'arrêter.",
    "labels": [
      "Objectif",
      "Entrée",
      "Sources",
      "Outils",
      "Interdits",
      "Sortie",
      "Contrôle",
      "Arrêt"
    ],
    "tools": [],
    "accentIndex": 7
  },
  {
    "name": "HumainDeterministeAgentique",
    "kind": "schema",
    "chapter": "b7-s3",
    "template": "cycle",
    "title": "Trancher",
    "description": "La répétition, l'adaptation et l'engagement sensible demandent trois traitements.",
    "ariaLabel": "La répétition, l'adaptation et l'engagement sensible demandent trois traitements.",
    "labels": [
      "Répéter",
      "Adapter",
      "Trancher",
      "Règle",
      "Agent",
      "Humain"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "PropositionCommercialeIntegree",
    "kind": "maquette",
    "chapter": "b7-s3",
    "template": "workflow",
    "title": "Revue complète",
    "description": "Les lots se rejoignent dans une proposition complète avant toute transmission au client.",
    "ariaLabel": "Les lots se rejoignent dans une proposition complète avant toute transmission au client.",
    "labels": [
      "Pièces",
      "Brouillon",
      "Engagements",
      "Revue complète",
      "Envoyer"
    ],
    "tools": [],
    "accentIndex": 3
  }
] as const satisfies readonly CoffreVisualDefinition[];
