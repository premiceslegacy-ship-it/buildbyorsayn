import type { CoffreVisualDefinition } from "./types";

export const b1_s4b_VISUALS = [
  {
    "name": "OffreVersFilm",
    "kind": "schema",
    "chapter": "b1-s4b",
    "template": "ad-card",
    "title": "Relecture",
    "description": "Le film part de l'offre, traverse le storyboard et finit par une relecture humaine.",
    "ariaLabel": "Le film part de l'offre, traverse le storyboard et finit par une relecture humaine.",
    "labels": [
      "Offre",
      "Scènes",
      "Médias",
      "Relecture"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "StoryboardDePreuve",
    "kind": "schema",
    "chapter": "b1-s4b",
    "template": "fork",
    "title": "La main",
    "description": "Chaque case du storyboard doit porter une preuve visible.",
    "ariaLabel": "Chaque case du storyboard doit porter une preuve visible.",
    "labels": [
      "Le problème",
      "Le passage",
      "La main",
      "Le résultat"
    ],
    "tools": [],
    "accentIndex": 2
  },
  {
    "name": "DeuxEcoutes",
    "kind": "schema",
    "chapter": "b1-s4b",
    "template": "compare",
    "title": "Sans son",
    "description": "Deux revues séparées vérifient le récit visuel puis le récit sonore.",
    "ariaLabel": "Deux revues séparées vérifient le récit visuel puis le récit sonore.",
    "labels": [
      "Sans son",
      "Je comprends",
      "Sans image",
      "J'entends tout"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "FormatsQuiRespirent",
    "kind": "schema",
    "chapter": "b1-s4b",
    "template": "compare",
    "title": "Même preuve",
    "description": "Le même récit se recompose pour rester lisible dans chaque format.",
    "ariaLabel": "Le même récit se recompose pour rester lisible dans chaque format.",
    "labels": [
      "Vertical",
      "Carré",
      "Large",
      "Même preuve"
    ],
    "tools": [],
    "accentIndex": 3
  }
] as const satisfies readonly CoffreVisualDefinition[];
