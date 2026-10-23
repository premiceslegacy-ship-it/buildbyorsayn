import "server-only";
import { notFound } from "next/navigation";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { ReaderView, type ReaderChapter } from "@/components/reader/ReaderView";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { HERMES_CHAPTER_PATHS, hermesMarkdown } from "@/lib/hermes/content";
import { hermesGate } from "../../gate.server";
import { isLearningSlug, LEARNING_BLOCKS } from "../content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

export default async function HermesLearningBlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isLearningSlug(slug)) notFound();

  const [identity, gate] = await Promise.all([navIdentity(), hermesGate()]);
  if (gate.files === null) return gate.render;
  const currentBlock = LEARNING_BLOCKS.find((block) => block.slug === slug)!;

  const sections: ReaderChapter[] = LEARNING_BLOCKS.map((block) => ({
    id: block.slug,
    number: block.number,
    title: block.title,
    summary: block.description,
    durationLabel: block.duration,
    href: `/videos/tutos/learn/${block.slug}`,
    hideArticleHeader: block.slug === slug,
    markdown: block.slug === slug ? hermesMarkdown(block.chapterPath) : undefined,
  }));

  return <DaRoot className="da-app has-tabbar">
    <NavBar
      activeLink="videos-tutos"
      tier={identity?.tier ?? null}
      isAdmin={identity?.isAdmin}
      displayName={identity?.displayName}
      displayEmail={identity?.displayEmail}
      initials={identity?.initials}
    />
    <ReaderView
      title="Hermes Agent"
      toolbarTitle="Hermes Agent"
      backLabel="Hermes Agent"
      backHref="/videos/tutos"
      sections={sections}
      initialMode="texte"
      initialChapter={slug}
      syncAddress={false}
      copyMarkdown={hermesMarkdown(currentBlock.chapterPath)}
      markdownLocalPaths={HERMES_CHAPTER_PATHS}
      markdownBaseHref="/videos/tutos"
    />
  </DaRoot>;
}
