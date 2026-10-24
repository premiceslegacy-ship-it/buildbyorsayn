import type { HermesChapterPath } from "@/lib/hermes/content";

export const LEARNING_BLOCKS = [
  {
    slug: "faire-travailler-hermes",
    chapterPath: "README.md",
    number: "01",
    title: "Installe ton agent et fais un premier essai sans risque",
    description: "Tu vérifies le terminal avant de connecter une boîte mail ou un compte client. Tu apprends les mots simples : tâche, workflow, skill, outil et validation.",
    duration: "Texte complet",
  },
  {
    slug: "trois-projets-reutilisables",
    chapterPath: "entreprise-06-workflows-interpoles.md",
    number: "02",
    title: "Fais passer un prospect de la pub au suivi client",
    description: "Chaque outil fait une chose et chaque validation a un propriétaire.",
    duration: "Texte complet",
  },
  {
    slug: "treg-dans-hermes",
    chapterPath: "entreprise-05-outils-api-cli-mcp.md",
    number: "03",
    title: "Connecte les bons outils, pas tous les outils",
    description: "Tu distingues API, ligne de commande et MCP avec des exemples concrets.",
    duration: "Texte complet",
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  chapterPath: HermesChapterPath;
  number: string;
  title: string;
  description: string;
  duration: string;
}>;

export type LearningSlug = (typeof LEARNING_BLOCKS)[number]["slug"];

export function isLearningSlug(value: string): value is LearningSlug {
  return LEARNING_BLOCKS.some((block) => block.slug === value);
}
