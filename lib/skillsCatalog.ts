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
    slug: "code-motion-production",
    title: "Production vidéo par le code",
    description:
      "Crée des vidéos animées par le code : cadrage, direction visuelle, animation et vérification des exports dans un processus de production reproductible.",
    access: "beginner",
    fileName: "code-motion-production.zip",
  },
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
      "Pars de tes sites et images de référence pour construire une direction adaptée à ton projet : analyse mesurée, copywriting, tokens, icônes originales et audit des états réels. Un cadre compact pour concevoir, auditer ou refondre sans appliquer un style générique.",
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
    slug: "apple-design-skills",
    title: "Apple Design Skills",
    description:
      "Un bundle complet de 15 skills pour concevoir des interfaces premium inspirées de la discipline Apple : mindset, fondations, branding, composants, patterns, états, layout, matériaux, mouvement, accessibilité, contenu, web et quality gates.",
    access: "full",
    fileName: "apple-design-skills.zip",
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
