"use client";

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
  chapterNumber,
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
  const sections: ReaderChapter[] = chapters.map((chapter) => ({
    id: chapter.id,
    number: chapter.num,
    title: chapter.id === currentId ? title : chapter.label,
    summary: chapter.id === currentId ? summary : chapter.summary,
    href: chapter.href,
    content: chapter.id === currentId ? children : undefined,
  }));

  return <ReaderView
    title="Fondations"
    toolbarTitle={`Fondations, chapitre ${chapterNumber}`}
    backLabel="Fondations"
    backHref="/beginner"
    sections={sections}
    initialMode={initialMode}
    initialChapter={currentId}
    showUpcomingVideo
    syncAddress={false}
  />;
}
