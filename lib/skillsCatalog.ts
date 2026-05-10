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
      "Le skill site web que j'ai configuré pour mon écosystème : cadrage, conversion, SEO/GEO, design system et livraison propre. Tu peux l'adapter à tes propres clients et projets.",
    access: "beginner",
    fileName: "oracle-site-web.md",
  },
  {
    slug: "ux-ui-design",
    title: "UX/UI Design Premium",
    description:
      "Le sous-skill visuel que j'utilise pour mon écosystème : direction artistique, brand system, design system, copy UI, assets, motion, audits et quality gates. À adapter selon ton identité.",
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
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((skill) => skill.slug === slug);
}
