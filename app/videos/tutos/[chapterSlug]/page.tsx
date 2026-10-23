import "server-only";
import { notFound } from "next/navigation";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { ReaderView, type ReaderChapter } from "@/components/reader/ReaderView";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { chapterTitle, withoutLeadingTitle } from "../../../doctrine/markdown";
import { CHAPTER_DIAGRAMS } from "../chapterDiagrams";
import { CHAPTER_META, chapterSlug, chapterPathFromSlug, orderCurriculumFiles } from "../chapters";
import { hermesGate } from "../gate.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HermesChapterPage({ params }: { params: Promise<{ chapterSlug: string }> }) {
  const { chapterSlug: slug } = await params;
  const [gate, identity] = await Promise.all([hermesGate(), navIdentity()]);
  if (gate.files === null) return gate.render;

  const path = chapterPathFromSlug(slug);
  const file = path ? gate.files.find((entry) => entry.path === path) : undefined;
  if (!file) notFound();

  const meta = CHAPTER_META[file.path];
  const displayTitle = meta?.displayTitle ?? chapterTitle(file);
  const body = withoutLeadingTitle(file).content;
  const curriculumFiles = orderCurriculumFiles(gate.files);
  const currentId = chapterSlug(file.path);
  const sections: ReaderChapter[] = curriculumFiles.map((entry, index) => ({
    id: chapterSlug(entry.path),
    number: String(index + 1).padStart(2, "0"),
    title: CHAPTER_META[entry.path]?.displayTitle ?? chapterTitle(entry),
    summary: CHAPTER_META[entry.path]?.summary,
    href: `/videos/tutos/${chapterSlug(entry.path)}`,
    markdown: entry.path === file.path ? body : undefined,
    diagram: entry.path === file.path ? CHAPTER_DIAGRAMS[entry.path] : undefined,
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
      initialChapter={currentId}
      syncAddress={false}
      copyMarkdown={`# ${displayTitle}\n\n${body}`}
      markdownLocalPaths={curriculumFiles.map((entry) => entry.path)}
      markdownBaseHref="/videos/tutos"
    />
  </DaRoot>;
}
