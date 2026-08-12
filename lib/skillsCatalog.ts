export type SkillAccess = "free" | "beginner" | "full";

export type SkillCatalogItem = {
  slug: string;
  title: string;
  description: string;
  access: SkillAccess;
  fileName: string;
};

export const SKILLS_CATALOG: SkillCatalogItem[] = [
  {
    slug: "oracle-site-web",
    title: "ORACLE Site Web",
    description:
      "Construis un site ou une landing page qui vend : cadrage en une session (Ultra Lean) ou site complet, copy qui vient de ta vraie recherche marché, SEO/GEO et score Lighthouse 100 visés dès le départ. Livrable pour tes clients comme pour tes propres projets.",
    access: "beginner",
    fileName: "oracle-site-web.md",
  },
  {
    slug: "ux-ui-design",
    title: "UX/UI Design Premium",
    description:
      "Ton directeur artistique et designer système à la demande : donne tes références (ou choisis un style dans la taxonomie) et récupère une direction artistique complète, verrouillée, jamais générique. Fonctionne sur un projet neuf comme sur l'audit ou la refonte d'un existant.",
    access: "beginner",
    fileName: "ux-ui-design.zip",
  },
  {
    slug: "oracle-by-orsayn",
    title: "ORACLE by Orsayn",
    description:
      "Le chef d'orchestre avant le code : interview fondatrice, documents et capacités bien rangés, data, sécurité, UX, copy, stratégie GTM et acquisition. Il choisit les réseaux pertinents, le tunnel, le contenu et les ads selon le projet, puis délègue aux bons skills.",
    access: "full",
    fileName: "oracle-by-orsayn.zip",
  },
  {
    slug: "backend-orsayn",
    title: "Backend Orsayn",
    description:
      "Le skill qui t'évite de faire fuiter les données de tes clients : audite un backend existant ou en construit un neuf, toujours avec un plan validé avant le premier code. Auth, RLS, sécurité des agents IA, webhooks, performance - mapping OWASP inclus, un critique bloque toujours la livraison.",
    access: "full",
    fileName: "backend-orsayn.zip",
  },
  {
    slug: "deep-research-vertical",
    title: "Deep Research Verticale",
    description:
      "Sais si ta niche vaut le coup avant d'y toucher : marché, personas, douleurs réelles et angles publicitaires déjà prouvés par tes concurrents (Meta, TikTok, Google, LinkedIn), condensés en un verdict feu vert/orange/rouge. Pas d'idée ? Le skill t'en propose 3 selon ton profil.",
    access: "beginner",
    fileName: "deep-research-vertical.zip",
  },
  {
    slug: "apple-ux-ui-system",
    title: "Apple UX/UI System",
    description:
      "Orchestre une interface premium inspirée de la discipline Apple : brief, hiérarchie, composants, états, accessibilité, mouvement, adaptation web et contrôle anti-slop, sans copier la marque ni ses actifs propriétaires.",
    access: "full",
    fileName: "apple-ux-ui-system.zip",
  },
  {
    slug: "apple-ux-ui-designer-mindset",
    title: "Apple UX/UI - Designer Mindset",
    description:
      "Fait raisonner l'agent comme un senior product designer avant de dessiner ou coder : observation, cadrage, composition, priorisation, langage visuel, stress test et arbitrages explicites.",
    access: "full",
    fileName: "apple-ux-ui-designer-mindset.zip",
  },
  {
    slug: "apple-ux-ui-foundations",
    title: "Apple UX/UI - Fondations",
    description:
      "Transforme purpose, agency, simplicité, responsabilité, familiarité, flexibilité et craft en décisions d'interface testables, avec une hiérarchie qui reste claire sans décoration.",
    access: "full",
    fileName: "apple-ux-ui-foundations.zip",
  },
  {
    slug: "apple-ux-ui-branding",
    title: "Apple UX/UI - Branding",
    description:
      "Combine la rigueur HIG avec une identité produit originale : couleur, typographie, image, forme, mouvement, matériaux et signature visuelle, sans produire un clone d'Apple.",
    access: "full",
    fileName: "apple-ux-ui-branding.zip",
  },
  {
    slug: "apple-ux-ui-components",
    title: "Apple UX/UI - Composants",
    description:
      "Spécifie des composants réellement implémentables : purpose, anatomie, variantes, contenu, états, clavier, lecteur d'écran, responsive, mouvement et récupération d'erreur.",
    access: "full",
    fileName: "apple-ux-ui-components.zip",
  },
  {
    slug: "apple-ux-ui-patterns",
    title: "Apple UX/UI - Patterns",
    description:
      "Compose des écrans produit avec les bons patterns : cartes, listes, collections, split views, sidebars, tabs, sheets, dialogs, popovers, inspectors et surfaces de commande.",
    access: "full",
    fileName: "apple-ux-ui-patterns.zip",
  },
  {
    slug: "apple-ux-ui-interaction-states",
    title: "Apple UX/UI - États d'interaction",
    description:
      "Construit des machines d'état complètes pour que chaque action soit reçue, en cours, terminée ou récupérable : focus, loading, succès, erreur, retry, offline, permissions et prévention des doublons.",
    access: "full",
    fileName: "apple-ux-ui-interaction-states.zip",
  },
  {
    slug: "apple-ux-ui-layout",
    title: "Apple UX/UI - Layout",
    description:
      "Crée des layouts adaptatifs fondés sur la hiérarchie, le groupement, l'alignement, les safe areas, la progressive disclosure et des breakpoints dictés par le contenu.",
    access: "full",
    fileName: "apple-ux-ui-layout.zip",
  },
  {
    slug: "apple-ux-ui-type-color-materials",
    title: "Apple UX/UI - Type, couleur et matériaux",
    description:
      "Définit une typographie lisible, des couleurs sémantiques, le dark mode, le contraste et la profondeur, sans copier des RGB Apple ni transformer chaque carte en panneau de verre.",
    access: "full",
    fileName: "apple-ux-ui-type-color-materials.zip",
  },
  {
    slug: "apple-ux-ui-icons-motion",
    title: "Apple UX/UI - Icônes et mouvement",
    description:
      "Cadre la sélection d'icônes, l'alignement optique, les licences, le rôle de chaque animation, son interruption et son alternative en mode réduction des mouvements.",
    access: "full",
    fileName: "apple-ux-ui-icons-motion.zip",
  },
  {
    slug: "apple-ux-ui-accessibility",
    title: "Apple UX/UI - Accessibilité",
    description:
      "Rend l'interface perceptible, opérable, compréhensible et adaptable : zoom, contraste, clavier, lecteur d'écran, sémantique, focus, reduced motion et états asynchrones.",
    access: "full",
    fileName: "apple-ux-ui-accessibility.zip",
  },
  {
    slug: "apple-ux-ui-content",
    title: "Apple UX/UI - Contenu",
    description:
      "Écrit des labels, empty states, erreurs, permissions et contenus d'interface concis, actionnables, inclusifs, accessibles et prêts pour la localisation.",
    access: "full",
    fileName: "apple-ux-ui-content.zip",
  },
  {
    slug: "apple-ux-ui-web-adaptation",
    title: "Apple UX/UI - Adaptation Web",
    description:
      "Traduit les principes HIG vers le web avec HTML sémantique, CSS, React, tokens produit, états asynchrones, matériaux avec fallback et comportement browser-safe.",
    access: "full",
    fileName: "apple-ux-ui-web-adaptation.zip",
  },
  {
    slug: "apple-ux-ui-quality-gates",
    title: "Apple UX/UI - Quality Gates",
    description:
      "Valide une interface premium avec des preuves : purpose, complétude des états, accessibilité, responsive, craft visuel, anti-slop, sources et licences.",
    access: "full",
    fileName: "apple-ux-ui-quality-gates.zip",
  },
  {
    slug: "apple-ux-ui-resources",
    title: "Apple UX/UI - Ressources",
    description:
      "Guide l'usage des ressources officielles Apple, SF Symbols, fontes, UI kits, templates et vidéos, avec traçabilité des sources et respect strict des licences.",
    access: "full",
    fileName: "apple-ux-ui-resources.zip",
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
