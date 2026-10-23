import type { CoffreVisualDefinition } from "./types";

export const b5_s2_VISUALS = [
  {
    "name": "AnatomieOffreClaire",
    "kind": "schema",
    "chapter": "b5-s2",
    "template": "rings",
    "title": "Le résultat",
    "description": "Une offre lisible réunit six éléments autour d'un résultat.",
    "ariaLabel": "Une offre lisible réunit six éléments autour d'un résultat.",
    "labels": [
      "Pour qui",
      "La scène",
      "Le résultat",
      "Livrables",
      "Limites",
      "Preuve"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "MessageQuiOuvre",
    "kind": "schema",
    "chapter": "b5-s2",
    "template": "chat",
    "title": "Une question",
    "description": "Le premier message devient une porte ouverte quand il pose une question réelle.",
    "ariaLabel": "Le premier message devient une porte ouverte quand il pose une question réelle.",
    "labels": [
      "Mon pitch",
      "Pas de réponse",
      "Une scène",
      "Une question"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "PrixCommePerimetre",
    "kind": "schema",
    "chapter": "b5-s2",
    "template": "rings",
    "title": "Inclus",
    "description": "Le prix entoure un travail défini et ses limites.",
    "ariaLabel": "Le prix entoure un travail défini et ses limites.",
    "labels": [
      "Inclus",
      "À ta charge",
      "Option",
      "Hors offre"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "ObjectionQuestion",
    "kind": "schema",
    "chapter": "b5-s2",
    "template": "chat",
    "title": "Risque ?",
    "description": "Une objection se déplie en plusieurs questions possibles avant la réponse.",
    "ariaLabel": "Une objection se déplie en plusieurs questions possibles avant la réponse.",
    "labels": [
      "Budget ?",
      "Preuve ?",
      "Risque ?",
      "Travail inclus ?"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "UneVariableALaFois",
    "kind": "schema",
    "chapter": "b5-s2",
    "template": "compare",
    "title": "Nouveau message",
    "description": "Deux essais restent comparables quand une seule variable change.",
    "ariaLabel": "Deux essais restent comparables quand une seule variable change.",
    "labels": [
      "Même segment",
      "Même canal",
      "Même moment",
      "Nouveau message"
    ],
    "tools": [],
    "accentIndex": 3
  }
] as const satisfies readonly CoffreVisualDefinition[];
