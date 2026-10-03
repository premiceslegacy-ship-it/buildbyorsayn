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

// Catalogue v2 figé. Il reste la source de compatibilité des lecteurs déjà déployés.
export const SKILLS_CATALOG_V2: SkillCatalogItem[] = [
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
    title: "ORACLE Site Web + Pack Copy & LP",
    description:
      "Construis un site ou une landing page qui vend : cadrage, pack Copy & LP avec carte de message et hero lisible, vraie recherche marché, SEO/GEO et score Lighthouse 100 visés.",
    access: "beginner",
    fileName: "oracle-site-web.md",
    category: "site-web",
  },
  {
    slug: "code-motion-production",
    title: "Motion Design avec HyperFrames, V1",
    description:
      "Apprends le motion design avec HyperFrames : films narrés, interfaces vivantes, transitions, caméra utile et exports vérifiés, directement en HTML, CSS et JavaScript.",
    access: "beginner",
    fileName: "code-motion-production.zip",
    category: "motion",
  },
];

// Catalogue v3 courant. Toute modification future de set exige une nouvelle identité de catalogue.
export const SKILLS_CATALOG: SkillCatalogItem[] = [
  ...SKILLS_CATALOG_V2,
  {
    slug: "product-film-factory",
    title: "Product Film Factory",
    description:
      "Transforme une scène métier en film produit narré : script, HyperFrames, voix, musique, SFX et rendu vérifié, sans reprendre la vidéo de quelqu'un d'autre.",
    access: "beginner",
    fileName: "product-film-factory.zip",
    category: "motion",
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
