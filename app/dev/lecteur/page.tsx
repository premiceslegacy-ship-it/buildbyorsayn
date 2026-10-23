export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { DaRoot } from "@/components/da/DaRoot";
import { ReaderView, type ReaderChapter } from "@/components/reader/ReaderView";
import { foundationMarkdown } from "@/lib/fondations/content";
import { ANGLE_MORT, SECTIONS, type BeginnerSectionId } from "@/app/beginner/sections.data";
import { DevReaderScroll } from "./DevReaderScroll";

type Query = { cours?: string | string[]; id?: string | string[]; scroll?: string | string[] };

/** Lecteur réel, sans garde d'accès, disponible uniquement sur le serveur de développement. */
export default async function DevReaderPage({ searchParams }: { searchParams: Promise<Query> }) {
  if (process.env.NODE_ENV !== "development") notFound();

  const query = await searchParams;
  const course = typeof query.cours === "string" ? query.cours : "fondations";
  const requestedId = typeof query.id === "string" ? query.id : "mindset";
  if (course !== "fondations") notFound();

  const chapters = [...SECTIONS, ANGLE_MORT];
  const selected = chapters.find((chapter) => chapter.id === requestedId);
  if (!selected) notFound();

  const sections: ReaderChapter[] = chapters.map((chapter) => ({
    id: chapter.id,
    number: String(Number(chapter.num)),
    title: chapter.label,
    summary: chapter.summary,
    markdown: foundationMarkdown(chapter.id as BeginnerSectionId),
  }));
  const requestedScroll = typeof query.scroll === "string" ? Number(query.scroll) : 0;
  const scrollTop = Number.isFinite(requestedScroll) ? Math.max(0, requestedScroll) : 0;

  return <DaRoot className="da-app">
    {scrollTop > 0 ? <DevReaderScroll top={scrollTop} /> : null}
    <ReaderView
      title="Fondations"
      toolbarTitle="Fondations"
      backLabel="Planche"
      backHref="/dev/schemas"
      sections={sections}
      initialMode="texte"
      initialChapter={selected.id}
      showUpcomingVideo
      syncAddress={false}
    />
  </DaRoot>;
}
