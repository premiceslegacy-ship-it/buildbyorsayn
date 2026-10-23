import type { ReactNode } from "react";
import { ProjectPipelineDiagram } from "@/components/schemas/foundations";
import { ReaderView, type ReaderChapter } from "./ReaderView";
import type { ReaderMode } from "./readerModel";
import styles from "./reader.module.css";

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
  children,
}: {
  title: string;
  summary: string;
  chapterNumber: string;
  currentId: string;
  chapters: FoundationChapterLink[];
  previous?: { href: string; label: string };
  next?: { href: string; label: string } | null;
  initialMode?: ReaderMode | null;
  children: ReactNode;
}) {
  const currentIndex = chapters.findIndex((chapter) => chapter.id === currentId);
  const sections: ReaderChapter[] = chapters.map((chapter, index) => ({
    id: chapter.id,
    number: String(index + 1),
    title: chapter.id === currentId ? title : chapter.label,
    summary: chapter.id === currentId ? summary : chapter.summary,
    href: chapter.href,
    content: chapter.id === currentId ? <div className={styles.foundationContent}>{children}</div> : undefined,
    diagram: chapter.id === currentId && currentId === "url" ? <ProjectPipelineDiagram /> : undefined,
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
    syncAddress={false}
    thumbnailSrc={currentIndex >= 0 && currentIndex < 5 ? "/da/mini/fondations-1.jpg" : "/da/mini/fondations-2.jpg"}
  />;
}
