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
      "Le skill site web V3 : cadrage, Ultra Lean en 1 session, LP Orsayn, conversion, SEO/GEO, performance Lighthouse 100, délégation UX/UI et livraison propre. Tu peux l'adapter à tes propres clients et projets.",
    access: "beginner",
    fileName: "oracle-site-web.md",
  },
  {
    slug: "ux-ui-design",
    title: "UX/UI Design Premium",
    description:
      "Le sous-skill UX/UI complet : direction artistique, brand/design system, audit ou refonte d'un site/app/SaaS existant, assets, motion, copy UI et quality gates. Les références Orsayn sont une base modifiable avec tes propres assets.",
    access: "beginner",
    fileName: "ux-ui-design.zip",
  },
  {
    slug: "oracle-by-orsayn",
    title: "ORACLE by Orsayn",
    description:
      "Le système complet que j'utilise pour cadrer et construire apps, SaaS, outils métier, cockpits et produits IA avec une logique de couches, délégation et audit.",
    access: "full",
    fileName: "oracle-by-orsayn.md",
  },
  {
    slug: "backend-orsayn",
    title: "Backend Orsayn",
    description:
      "Le cerveau backend complet qui remplace et étend Expert Backend v2 : un skill maître qui audite et construit (PLAN puis EXÉCUTION), et 7 sous-skills spécialisés - auth/RLS, routes API et validation, sécurité des agents IA, cron/webhooks, performance et observabilité, conformité RGPD/légale, sortie de Supabase. Mapping OWASP inclus.",
    access: "full",
    fileName: "backend-orsayn.zip",
  },
  {
    slug: "deep-research-vertical",
    title: "Deep Research Verticale",
    description:
      "Le système complet de recherche marché : 13 prompts pour analyser une niche avec de la data réelle. Marché, ICP, personas, douleurs profondes, psychologie d'achat, canaux, wedges, offre V1, ads intelligence complète (Meta, TikTok, Google, LinkedIn : angles prouvés et cimetière des angles morts), 8 CSV exploitables par LLM et Research Hub final en page web DA BUILD. La bonne data, c'est la recette - une fois que tu l'as, l'IA peut répliquer la sauce à l'infini.",
    access: "beginner",
    fileName: "deep-research-vertical.zip",
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
