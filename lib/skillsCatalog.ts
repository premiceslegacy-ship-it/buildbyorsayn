export type SkillAccess = "free" | "beginner" | "full";

export type SkillCategory = "recherche" | "produit" | "design" | "backend" | "site-web" | "motion";

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  recherche: "Recherche marché",
  produit: "Cadrage produit",
  design: "Design",
  backend: "Backend & sécurité",
  "site-web": "Site web",
  motion: "Motion design",
};

export type SkillCatalogItem = {
  slug: string;
  title: string;
  description: string;
  access: SkillAccess;
  fileName: string;
  category: SkillCategory;
};

// Ordre de workflow : recherche marché -> cadrage produit -> design -> backend -> site web -> motion.
export const SKILLS_CATALOG: SkillCatalogItem[] = [
  {
    slug: "deep-research-vertical",
    title: "Deep Research Verticale",
    description:
      "Sais si ta niche vaut le coup avant d'y toucher : marché, personas, douleurs réelles et angles publicitaires déjà prouvés par tes concurrents (Meta, TikTok, Google, LinkedIn), condensés en un verdict feu vert/orange/rouge. Pas d'idée ? Le skill t'en propose 3 selon ton profil.",
    access: "beginner",
    fileName: "deep-research-vertical.zip",
    category: "recherche",
  },
  {
    slug: "oracle-by-orsayn",
    title: "ORACLE by Orsayn",
    description:
      "Le chef d'orchestre avant le code : interview fondatrice, documents et capacités bien rangés, data, sécurité, UX, copy, stratégie GTM et acquisition. Il choisit les réseaux pertinents, le tunnel, le contenu et les ads selon le projet, puis délègue aux bons skills.",
    access: "full",
    fileName: "oracle-by-orsayn.zip",
    category: "produit",
  },
  {
    slug: "ux-ui-design",
    title: "UX/UI Design Premium",
    description:
      "Pars de tes sites et images de référence pour construire une direction adaptée à ton projet : analyse mesurée, copywriting, tokens, icônes originales et audit des états réels. Un cadre compact pour concevoir, auditer ou refondre sans appliquer un style générique.",
    access: "beginner",
    fileName: "ux-ui-design.zip",
    category: "design",
  },
  {
    slug: "apple-design-skills",
    title: "Apple Design Skills",
    description:
      "Un bundle complet de 15 skills pour concevoir des interfaces premium inspirées de la discipline Apple : mindset, fondations, branding, composants, patterns, états, layout, matériaux, mouvement, accessibilité, contenu, web et quality gates.",
    access: "full",
    fileName: "apple-design-skills.zip",
    category: "design",
  },
  {
    slug: "backend-orsayn",
    title: "Backend Orsayn",
    description:
      "Le skill qui t'évite de faire fuiter les données de tes clients : audite un backend existant ou en construit un neuf, toujours avec un plan validé avant le premier code. Auth, RLS, sécurité des agents IA, webhooks, performance - mapping OWASP inclus, un critique bloque toujours la livraison.",
    access: "full",
    fileName: "backend-orsayn.zip",
    category: "backend",
  },
  {
    slug: "oracle-site-web",
    title: "ORACLE Site Web",
    description:
      "Construis un site ou une landing page qui vend : cadrage en une session (Ultra Lean) ou site complet, copy qui vient de ta vraie recherche marché, SEO/GEO et score Lighthouse 100 visés dès le départ. Livrable pour tes clients comme pour tes propres projets.",
    access: "beginner",
    fileName: "oracle-site-web.md",
    category: "site-web",
  },
  {
    slug: "code-motion-production",
    title: "Motion Design par le code",
    description:
      "Anime tes visuels par le code plutôt qu'à la souris : titres, transitions, micro-interactions et séquences complètes, avec une direction visuelle cadrée et des exports vérifiés à chaque étape.",
    access: "beginner",
    fileName: "code-motion-production.zip",
    category: "motion",
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
