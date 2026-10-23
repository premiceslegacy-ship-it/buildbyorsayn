import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ReaderProse } from "@/components/reader/ReaderProse";
import {
  HERMES_CHAPTER_PATHS,
  hermesMarkdown,
  type HermesChapterPath,
} from "@/lib/hermes/content";

export const LEARNING_BLOCKS = [
  {
    slug: "faire-travailler-hermes",
    chapterPath: "README.md",
    number: "01",
    title: "Installe ton agent et fais un premier essai sans risque",
    description: "Tu vérifies le terminal avant de connecter une boîte mail ou un compte client. Tu apprends les mots simples : tâche, workflow, skill, outil et validation.",
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

function learningBlock(slug: LearningSlug) {
  return LEARNING_BLOCKS.find((block) => block.slug === slug)!;
}

export function HermesLearningContent({ slug }: { slug: LearningSlug }) {
  const block = learningBlock(slug);
  return (
    <ReaderProse
      section={{ content: hermesMarkdown(block.chapterPath) }}
      allowedLocalPaths={HERMES_CHAPTER_PATHS}
      localBaseHref="/videos/tutos"
    />
  );
}

export function HermesLearningBlock({ slug }: { slug: LearningSlug }) {
  const index = LEARNING_BLOCKS.findIndex((block) => block.slug === slug);
  const next = LEARNING_BLOCKS[index + 1];

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12">
      <Link href="/videos/tutos" className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/90">
        <ArrowLeft className="size-4" />
        Retour à Hermes Agent
      </Link>
      <div className="mt-12"><HermesLearningContent slug={slug} /></div>
      {next ? (
        <Link href={`/videos/tutos/learn/${next.slug}`} className="group mt-16 flex items-center justify-between gap-5 border-y border-white/[0.1] py-6 transition-colors hover:border-[var(--em)]/50">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[var(--em)]/75">CHAPITRE SUIVANT</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-[var(--encre)]">{next.title}</p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-[var(--em)] transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </article>
  );
}
