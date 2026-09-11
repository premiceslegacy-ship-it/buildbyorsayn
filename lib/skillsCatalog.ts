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
      "Sais si ta niche vaut le coup avant d'y toucher : marché, personas, douleurs réelles et angles déjà prouvés par tes concurrents, en un verdict feu vert/orange/rouge.",
    access: "beginner",
    fileName: "deep-research-vertical.zip",
    category: "recherche",
  },
  {
    slug: "oracle-by-orsayn",
    title: "ORACLE by Orsayn",
    description:
      "Le chef d'orchestre avant le code : interview fondatrice, documents et capacités bien rangés, data, sécurité, UX, copy, GTM - puis délègue aux bons skills.",
    access: "full",
    fileName: "oracle-by-orsayn.zip",
    category: "produit",
  },
  {
    slug: "ux-ui-design",
    title: "UX/UI Design Premium",
    description:
      "Pars de tes sites et images de référence pour construire une direction adaptée à ton projet : analyse mesurée, copywriting, tokens, icônes et audit des états réels.",
    access: "beginner",
    fileName: "ux-ui-design.zip",
    category: "design",
  },
  {
    slug: "apple-design-skills",
    title: "Apple Design Skills",
    description:
      "Un bundle de 15 skills pour concevoir des interfaces premium inspirées de la discipline Apple : fondations, branding, composants, matériaux, mouvement, quality gates.",
    access: "full",
    fileName: "apple-design-skills.zip",
    category: "design",
  },
  {
    slug: "backend-orsayn",
    title: "Backend Orsayn",
    description:
      "T'évite de faire fuiter les données de tes clients : audite un backend existant ou en construit un neuf. Auth, RLS, sécurité des agents IA, mapping OWASP inclus.",
    access: "full",
    fileName: "backend-orsayn.zip",
    category: "backend",
  },
  {
    slug: "oracle-site-web",
    title: "ORACLE Site Web",
    description:
      "Construis un site ou une landing page qui vend : cadrage en une session ou site complet, copy issu de ta vraie recherche marché, SEO/GEO et score Lighthouse 100 visés.",
    access: "beginner",
    fileName: "oracle-site-web.md",
    category: "site-web",
  },
  {
    slug: "code-motion-production",
    title: "Motion Design par le code",
    description:
      "Anime tes visuels par le code plutôt qu'à la souris : titres, transitions, micro-interactions et séquences complètes, exports vérifiés.",
    access: "beginner",
    fileName: "code-motion-production.zip",
    category: "motion",
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
