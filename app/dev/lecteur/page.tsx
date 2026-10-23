export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { DaRoot } from "@/components/da/DaRoot";
import { ReaderView, type ReaderChapter } from "@/components/reader/ReaderView";
import { COFFRE_VISUAL_DEFINITIONS } from "@/components/schemas/coffre";
import { DOCTRINE_VISUAL_CATALOG } from "@/components/schemas/doctrine";
import { INTRO_VISUAL_CATALOG } from "@/components/schemas/intro";
import { PROTOCOLE_VISUAL_CATALOG } from "@/components/schemas/protocole/index";
import { foundationIntroductionMarkdown, foundationMarkdown, type FoundationIntroductionId } from "@/lib/fondations/content";
import { HERMES_CHAPTER_PATHS, hermesIntroductionMarkdown, hermesMarkdown } from "@/lib/hermes/content";
import { BLOCS_DATA } from "@/lib/mockData";
import { ANGLE_MORT, SECTIONS, type BeginnerSectionId } from "@/app/beginner/sections.data";
import { CHAPTER_META, chapterSlug } from "@/app/videos/tutos/chapters";
import { DevReaderScroll } from "./DevReaderScroll";

type Query = { cours?: string | string[]; id?: string | string[]; nom?: string | string[]; scroll?: string | string[] };

/** Lecteur réel, sans garde d'accès, disponible uniquement sur le serveur de développement. */
export default async function DevReaderPage({ searchParams }: { searchParams: Promise<Query> }) {
  if (process.env.NODE_ENV !== "development") notFound();

  const query = await searchParams;
  const course = typeof query.cours === "string" ? query.cours : "fondations";
  const requestedId = typeof query.id === "string" ? query.id : "mindset";
  const requestedScroll = typeof query.scroll === "string" ? Number(query.scroll) : 0;
  const scrollTop = Number.isFinite(requestedScroll) ? Math.max(0, requestedScroll) : 0;

  if (course === "protocole" || course === "intro" || course === "doctrine") {
    const catalog = course === "protocole"
      ? PROTOCOLE_VISUAL_CATALOG
      : course === "intro"
        ? INTRO_VISUAL_CATALOG
        : DOCTRINE_VISUAL_CATALOG;
    const requestedVisual = catalog.find((definition) => definition.name === requestedId);
    if (!requestedVisual) notFound();
    const heading = course === "protocole" ? "Le protocole zéro" : course === "intro" ? "Avant de commencer" : "Doctrine agentique";
    return <DaRoot className="da-app">
      <DevReaderScroll visual={requestedVisual.name} />
      <ReaderView
        title={heading}
        toolbarTitle={heading}
        backLabel="Planche"
        backHref={`/dev/schemas?cours=${course}`}
        sections={[{
          id: requestedVisual.chapter,
          number: "01",
          title: "title" in requestedVisual ? requestedVisual.title : heading,
          markdown: `[[${requestedVisual.kind}:${requestedVisual.name}]]`,
        }]}
        initialMode="texte"
        initialChapter={requestedVisual.chapter}
        syncAddress={false}
      />
    </DaRoot>;
  }

  if (course === "coffre") {
    const requestedVisual = COFFRE_VISUAL_DEFINITIONS.find((definition) => definition.name === requestedId);
    const chapterId = requestedVisual?.chapter ?? requestedId;
    const introMatch = chapterId.match(/^intro-([1-7])$/);
    const bloc = introMatch
      ? BLOCS_DATA.find((entry) => entry.id === introMatch[1])
      : BLOCS_DATA.find((entry) => entry.sections.some((section) => section.id === chapterId));
    if (!bloc) notFound();
    const selectedSection = bloc.sections.find((section) => section.id === chapterId);
    const sections: ReaderChapter[] = requestedVisual
      ? [{
          id: chapterId,
          number: introMatch ? "0" : String(Math.max(1, bloc.sections.findIndex((section) => section.id === chapterId) + 1)),
          title: introMatch ? "Introduction" : selectedSection?.title ?? requestedVisual.title,
          markdown: `[[${requestedVisual.kind}:${requestedVisual.name}]]`,
        }]
      : introMatch
        ? [{ id: chapterId, number: "0", title: "Introduction", markdown: bloc.introduction }]
        : bloc.sections.map((section, index) => ({ id: section.id, number: String(index + 1), title: section.title, markdown: section.content }));
    const visual = typeof query.nom === "string" ? query.nom : requestedVisual?.name;
    return <DaRoot className="da-app">
      {scrollTop > 0 || visual ? <DevReaderScroll top={scrollTop} visual={visual} /> : null}
      <ReaderView
        title={bloc.titre}
        toolbarTitle={`Bloc ${bloc.displayNumber}`}
        backLabel="Planche"
        backHref="/dev/schemas?cours=coffre"
        sections={sections}
        initialMode="texte"
        initialChapter={chapterId}
        syncAddress={false}
      />
    </DaRoot>;
  }

  if (course === "hermes") {
    const visual = typeof query.nom === "string" ? query.nom : undefined;
    const chapters = HERMES_CHAPTER_PATHS.map((path) => ({
      path,
      id: chapterSlug(path),
      markdown: path === "README.md"
        ? `${hermesIntroductionMarkdown()}\n\n${hermesMarkdown(path)}`
        : hermesMarkdown(path),
    }));
    const selected = chapters.find((chapter) => chapter.id === requestedId || chapter.path === requestedId)
      ?? (visual ? chapters.find((chapter) => chapter.markdown.includes(`:${visual}]]`)) : undefined);
    if (!selected) notFound();
    const sections: ReaderChapter[] = chapters.map((chapter, index) => ({
      id: chapter.id,
      number: String(index + 1).padStart(2, "0"),
      title: CHAPTER_META[chapter.path]?.displayTitle ?? chapter.path.replace(/\.md$/, ""),
      summary: CHAPTER_META[chapter.path]?.summary,
      markdown: chapter.path === selected.path ? chapter.markdown : undefined,
    }));
    return <DaRoot className="da-app">
      {scrollTop > 0 || visual ? <DevReaderScroll top={scrollTop} visual={visual} /> : null}
      <ReaderView
        title="Hermes Agent"
        toolbarTitle="Hermes Agent"
        backLabel="Planche"
        backHref="/dev/schemas?cours=hermes"
        sections={sections}
        initialMode="texte"
        initialChapter={selected.id}
        syncAddress={false}
      />
    </DaRoot>;
  }

  if (course !== "fondations") notFound();

  const introductionIds: readonly FoundationIntroductionId[] = ["ce-qui-ne-change-pas", "de-l-idee-a-l-url"];
  if (introductionIds.includes(requestedId as FoundationIntroductionId)) {
    const introductionId = requestedId as FoundationIntroductionId;
    const visual = typeof query.nom === "string" ? query.nom : undefined;
    const title = introductionId === "ce-qui-ne-change-pas" ? "Ce qui ne change pas" : "De l'idée à l'URL";
    return <DaRoot className="da-app">
      {scrollTop > 0 || visual ? <DevReaderScroll top={scrollTop} visual={visual} /> : null}
      <ReaderView
        title="Fondations"
        toolbarTitle="Fondations"
        backLabel="Planche"
        backHref="/dev/schemas"
        sections={[{ id: introductionId, number: "0", title, markdown: foundationIntroductionMarkdown(introductionId) }]}
        initialMode="texte"
        initialChapter={introductionId}
        syncAddress={false}
      />
    </DaRoot>;
  }

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
  return <DaRoot className="da-app">
    {scrollTop > 0 || typeof query.nom === "string" ? <DevReaderScroll top={scrollTop} visual={typeof query.nom === "string" ? query.nom : undefined} /> : null}
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
