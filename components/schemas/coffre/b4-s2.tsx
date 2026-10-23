import type { CoffreVisualDefinition } from "./types";

export const b4_s2_VISUALS = [
  {
    "name": "SkillsEnDossiersParents",
    "kind": "schema",
    "chapter": "b4-s2",
    "template": "file-card",
    "title": "Design",
    "description": "Un dossier parent oriente vers les skills proches sans recopier leur contenu.",
    "ariaLabel": "Un dossier parent oriente vers les skills proches sans recopier leur contenu.",
    "labels": [
      "Design",
      "Identité",
      "Interface",
      "Revue visuelle"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "ChaineSkillsProduit",
    "kind": "schema",
    "chapter": "b4-s2",
    "template": "workflow",
    "title": "Recherche",
    "description": "Chaque skill remet un livrable précis au suivant.",
    "ariaLabel": "Chaque skill remet un livrable précis au suivant.",
    "labels": [
      "Recherche",
      "Brief",
      "Design",
      "Produit",
      "Page"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "PassationAnnotee",
    "kind": "maquette",
    "chapter": "b4-s2",
    "template": "file-card",
    "title": "Version",
    "description": "Une passation permet de continuer sans refaire la décision précédente.",
    "ariaLabel": "Une passation permet de continuer sans refaire la décision précédente.",
    "labels": [
      "Livrable",
      "Version",
      "Décisions",
      "À confirmer",
      "Contrôle effectué",
      "Pour qui"
    ],
    "tools": [],
    "accentIndex": 1
  },
  {
    "name": "UneSourceOuCinqCopies",
    "kind": "schema",
    "chapter": "b4-s2",
    "template": "compare",
    "title": "Une source",
    "description": "Une source commune reste cohérente tandis que plusieurs copies finissent par diverger.",
    "ariaLabel": "Une source commune reste cohérente tandis que plusieurs copies finissent par diverger.",
    "labels": [
      "Une source",
      "Cinq liens",
      "Cinq copies",
      "Contradictions"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "CabinetComptableDeBoutEnBout",
    "kind": "schema",
    "chapter": "b4-s2",
    "template": "workflow",
    "title": "Questions",
    "description": "La chaîne complète transforme un besoin métier en produit utilisé sans réinventer les décisions.",
    "ariaLabel": "La chaîne complète transforme un besoin métier en produit utilisé sans réinventer les décisions.",
    "labels": [
      "Questions",
      "Brief",
      "Parcours",
      "Logiciel",
      "Prise en main"
    ],
    "tools": [],
    "accentIndex": 0
  }
] as const satisfies readonly CoffreVisualDefinition[];
