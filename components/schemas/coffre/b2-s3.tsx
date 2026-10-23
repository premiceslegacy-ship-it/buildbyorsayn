import type { CoffreVisualDefinition } from "./types";

export const b2_s3_VISUALS = [
  {
    "name": "QuatrePortes",
    "kind": "schema",
    "chapter": "b2-s3",
    "template": "rings",
    "title": "Commande",
    "description": "Quatre portes répondent à quatre questions différentes.",
    "ariaLabel": "Quatre portes répondent à quatre questions différentes.",
    "labels": [
      "Commande",
      "Connexion",
      "Découverte",
      "Méthode"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "PlusPetitePorte",
    "kind": "schema",
    "chapter": "b2-s3",
    "template": "fork",
    "title": "Suffisant",
    "description": "L'opération choisit la surface la plus simple qui couvre le besoin.",
    "ariaLabel": "L'opération choisit la surface la plus simple qui couvre le besoin.",
    "labels": [
      "CLI",
      "API",
      "MCP",
      "Suffisant"
    ],
    "tools": [],
    "accentIndex": 3
  },
  {
    "name": "AccesJugementPermission",
    "kind": "schema",
    "chapter": "b2-s3",
    "template": "compare",
    "title": "Droits",
    "description": "Accès, méthode et droits s'empilent sans se remplacer.",
    "ariaLabel": "Accès, méthode et droits s'empilent sans se remplacer.",
    "labels": [
      "Droits",
      "Accès",
      "Jugement",
      "Travail utile"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "CleProtegee",
    "kind": "schema",
    "chapter": "b2-s3",
    "template": "ad-card",
    "title": "Compte limité",
    "description": "La clé reste dans un coffre pendant que l'opération passe par une porte limitée.",
    "ariaLabel": "La clé reste dans un coffre pendant que l'opération passe par une porte limitée.",
    "labels": [
      "Clé",
      "Compte limité",
      "Action permise",
      "Refus testé"
    ],
    "tools": [],
    "accentIndex": 1
  }
] as const satisfies readonly CoffreVisualDefinition[];
