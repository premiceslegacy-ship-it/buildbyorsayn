import type { ReactNode } from "react";
import { ReaderView, type ReaderChapter } from "./ReaderView";
import type { ReaderMode } from "./readerModel";

type FoundationChapterLink = {
  id: string;
  num: string;
  label: string;
  summary: string;
  href: string;
};

export function FoundationReader({
  title,
  summary,
  currentId,
  chapters,
  initialMode = null,
  markdown,
  introductionMarkdown,
  afterContent,
}: {
  title: string;
  summary: string;
  chapterNumber: string;
  currentId: string;
  chapters: FoundationChapterLink[];
  previous?: { href: string; label: string };
  next?: { href: string; label: string } | null;
  initialMode?: ReaderMode | null;
  markdown: string;
  introductionMarkdown?: string;
  afterContent?: ReactNode;
}) {
  const currentIndex = chapters.findIndex((chapter) => chapter.id === currentId);
  const sections: ReaderChapter[] = chapters.map((chapter) => ({
    id: chapter.id,
    number: String(Number(chapter.num)),
    title: chapter.id === currentId ? title : chapter.label,
    summary: chapter.id === currentId ? summary : chapter.summary,
    href: chapter.href,
    markdown: chapter.id === currentId ? markdown : undefined,
    afterContent: chapter.id === currentId ? afterContent : undefined,
  }));

  return <ReaderView
    title="Fondations"
    toolbarTitle="Fondations"
    backLabel="Fondations"
    backHref="/beginner"
    sections={sections}
    initialMode={initialMode}
    initialChapter={currentId}
    showUpcomingVideo
    videoIntroductionMarkdown={introductionMarkdown}
    syncAddress={false}
    thumbnailSrc={currentIndex >= 0 && currentIndex < 5 ? "/da/mini/fondations-1.jpg" : "/da/mini/fondations-2.jpg"}
    readingScope="fondations"
  />;
}
