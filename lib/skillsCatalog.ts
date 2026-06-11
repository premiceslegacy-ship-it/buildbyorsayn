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
    access: "full",
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
    slug: "expert-backend-v2",
    title: "Expert Backend v2",
    description:
      "Le sous-skill backend que j'utilise pour durcir mes projets : architecture serveur, Supabase/Postgres/RLS, sécurité, migrations, webhooks, performance, tests et déploiement client-ready.",
    access: "full",
    fileName: "expert-backend-v2.md",
  },
  {
    slug: "deep-research-vertical",
    title: "Deep Research Verticale",
    description:
      "Pack de 10 prompts pour analyser une niche avant de créer une ligne Orsayn. Marché, ICP, personas, douleurs profondes, psychologie d'achat, canaux, wedges, offre V1 et plan de validation 14 jours. La bonne data, c'est la recette — une fois que tu l'as, l'IA peut répliquer la sauce à l'infini.",
    access: "full",
    fileName: "deep-research-vertical.zip",
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
