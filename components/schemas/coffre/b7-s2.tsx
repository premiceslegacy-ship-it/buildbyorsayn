import type { CoffreVisualDefinition } from "./types";

export const b7_s2_VISUALS = [
  {
    "name": "VoirLeTravailReel",
    "kind": "schema",
    "chapter": "b7-s2",
    "template": "web-compare",
    "title": "Ouvre",
    "description": "Un cas montré révèle les détours que le récit idéal oublie.",
    "ariaLabel": "Un cas montré révèle les détours que le récit idéal oublie.",
    "labels": [
      "Ouvre",
      "Cherche",
      "Copie",
      "Décide",
      "Corrige",
      "Termine"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "DemandeVersTableur",
    "kind": "schema",
    "chapter": "b7-s2",
    "template": "chat",
    "title": "Formulaire",
    "description": "Plusieurs canaux deviennent gérables quand une entrée commune structure la demande.",
    "ariaLabel": "Plusieurs canaux deviennent gérables quand une entrée commune structure la demande.",
    "labels": [
      "Appel",
      "WhatsApp",
      "Instagram",
      "Formulaire",
      "Une ligne complète"
    ],
    "tools": [
      "Instagram",
      "WhatsApp"
    ],
    "accentIndex": 3
  },
  {
    "name": "MesureAvantApres",
    "kind": "schema",
    "chapter": "b7-s2",
    "template": "compare",
    "title": "Même résultat",
    "description": "Le même résultat se mesure avant et après le changement.",
    "ariaLabel": "Le même résultat se mesure avant et après le changement.",
    "labels": [
      "Préparer",
      "Faire",
      "Vérifier",
      "Reprendre",
      "Même résultat"
    ],
    "tools": [],
    "accentIndex": 4
  },
  {
    "name": "EchelleDesReponses",
    "kind": "schema",
    "chapter": "b7-s2",
    "template": "ladder",
    "title": "Règle",
    "description": "L'intervention monte en complexité seulement quand l'étage simple ne suffit pas.",
    "ariaLabel": "L'intervention monte en complexité seulement quand l'étage simple ne suffit pas.",
    "labels": [
      "Règle",
      "Mieux utiliser",
      "Connecter",
      "Automatiser",
      "Assister",
      "Adapter"
    ],
    "tools": [
      "Zapier",
      "Make",
      "n8n"
    ],
    "accentIndex": 0
  },
  {
    "name": "PiloteSansEffetExterne",
    "kind": "maquette",
    "chapter": "b7-s2",
    "template": "file-card",
    "title": "Envoi bloqué",
    "description": "Le premier essai produit des résultats visibles sans envoyer ni modifier dehors.",
    "ariaLabel": "Le premier essai produit des résultats visibles sans envoyer ni modifier dehors.",
    "labels": [
      "Cas préparés",
      "Résultat proposé",
      "Comparer",
      "Valider",
      "Envoi bloqué"
    ],
    "tools": [],
    "accentIndex": 4
  }
] as const satisfies readonly CoffreVisualDefinition[];
