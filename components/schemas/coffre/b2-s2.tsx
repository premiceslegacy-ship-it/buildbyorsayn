import type { CoffreVisualDefinition } from "./types";

export const b2_s2_VISUALS = [
  {
    "name": "CarteDesOutilsParRole",
    "kind": "schema",
    "chapter": "b2-s2",
    "template": "tool-map",
    "title": "Sources",
    "description": "La carte montre un outil principal par rôle et garde les alternatives à proximité.",
    "ariaLabel": "La carte montre un outil principal par rôle et garde les alternatives à proximité.",
    "labels": [
      "Sources",
      "Réflexion",
      "Missions",
      "Design",
      "Code",
      "Versions"
    ],
    "tools": [],
    "accentIndex": 0
  },
  {
    "name": "StackSiteEditorial",
    "kind": "schema",
    "chapter": "b2-s2",
    "template": "tool-map",
    "title": "Contenu",
    "description": "Un site simple suit un chemin court du contenu vers la mise en ligne.",
    "ariaLabel": "Un site simple suit un chemin court du contenu vers la mise en ligne.",
    "labels": [
      "Contenu",
      "Construire",
      "Habiller",
      "Versionner",
      "Mettre en ligne"
    ],
    "tools": [
      "Tailwind CSS",
      "shadcn/ui",
      "GitHub",
      "Next.js",
      "Vercel"
    ],
    "accentIndex": 0
  },
  {
    "name": "StackPortailClient",
    "kind": "schema",
    "chapter": "b2-s2",
    "template": "tool-map",
    "title": "Comptes",
    "description": "Un portail ajoute des services seulement quand une fonction les demande.",
    "ariaLabel": "Un portail ajoute des services seulement quand une fonction les demande.",
    "labels": [
      "Comptes",
      "Paiement",
      "Messages",
      "Erreurs",
      "Usage"
    ],
    "tools": [
      "Cloudflare",
      "Supabase",
      "PostHog",
      "Stripe",
      "Resend",
      "Linear",
      "Sentry",
      "Notion",
      "Neon"
    ],
    "accentIndex": 0
  },
  {
    "name": "OutilsQuiAttendent",
    "kind": "schema",
    "chapter": "b2-s2",
    "template": "tool-map",
    "title": "Besoin réel",
    "description": "Un outil non requis reste visible mais ne rejoint pas le projet.",
    "ariaLabel": "Un outil non requis reste visible mais ne rejoint pas le projet.",
    "labels": [
      "Pas maintenant",
      "Besoin réel",
      "Test",
      "Il entre"
    ],
    "tools": [],
    "accentIndex": 1
  }
] as const satisfies readonly CoffreVisualDefinition[];
