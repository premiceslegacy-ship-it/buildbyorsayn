export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { BlocOverview } from "@/components/reader/BlocOverview";
import { BLOCS_DATA } from "@/lib/mockData";
import type { BlocVideo } from "@/lib/blocData.server";
import { COFFRE_LABEL, COFFRE_PRICE, STRIPE_FULL_CHECKOUT_LINK, formatEuro } from "@/lib/pricing";
type Query = { bloc?: string | string[]; videos?: string | string[]; video?: string | string[]; summary?: string | string[]; episodes?: string | string[]; lecture?: string | string[]; sans?: string | string[] };

function one(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function demoVideos(bloc: (typeof BLOCS_DATA)[number], count: number, withoutSummary: boolean, withoutChapters: boolean, lectureUnavailable: boolean): BlocVideo[] {
  const titles = [
    "Voir le problème avant de choisir l'outil",
    "Transformer le signal en décision concrète",
    "Assembler le prochain geste utile pour le dossier",
    "Rendre la démonstration lisible sans tout montrer",
    "Préparer la livraison et le prochain échange",
    "Relire la séquence avant de la partager",
  ];
  const shortSummary = "Un repère pour passer de l'observation à une décision testable.";
  const longSummary = "Tu pars d'un signal observé dans le travail, tu le reformules avec des mots simples, puis tu choisis le plus petit geste qui permet de vérifier l'hypothèse. Cette vidéo montre aussi ce qui reste volontairement hors du périmètre, pour garder une séquence lisible et réutilisable dans ton dossier.";
  return Array.from({ length: count }, (_, index) => {
    const chapterCount = 6 + (index % 4);
    const durationSeconds = [14 * 60 + 42, 19 * 60 + 18, 11 * 60 + 36, 23 * 60 + 4, 16 * 60 + 27, 9 * 60 + 55][index] ?? 15 * 60;
    const fixtureThumbnail = `/da/mini/b${(index % 7) + 1}.jpg`;
    const chapters = withoutChapters ? [] : Array.from({ length: chapterCount }, (_, chapterIndex) => ({
      startSeconds: Math.round(chapterIndex * (durationSeconds / chapterCount)),
      title: bloc.sections[chapterIndex % bloc.sections.length]?.title ?? `Repère ${chapterIndex + 1}`,
      thumbnailUrl: fixtureThumbnail,
    }));
    return {
      id: `dev-${bloc.id}-${index + 1}`,
      position: index + 1,
      title: titles[index] ?? `Vidéo ${index + 1} du bloc`,
      summary: withoutSummary ? "" : index === 1 ? longSummary : shortSummary,
      durationSeconds,
      chapters,
      thumbnailUrl: fixtureThumbnail,
      playbackId: lectureUnavailable ? "" : "fixture-invalid",
      tokens: { playback: "", thumbnail: "", storyboard: "" },
      progressPercent: index === 0 ? 100 : index === 1 ? 40 : 0,
      completed: index === 0,
    };
  });
}

export default async function DevBlocVideosPage({ searchParams }: { searchParams: Promise<Query> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const query = await searchParams;
  const displayNumber = Number(one(query.bloc) ?? "1");
  const bloc = BLOCS_DATA.find((entry) => entry.displayNumber === displayNumber);
  if (!bloc) notFound();
  const requestedCount = Number(one(query.videos) ?? "2");
  const count = Number.isInteger(requestedCount) ? Math.min(6, Math.max(0, requestedCount)) : 2;
  const without = one(query.sans);
  const requestedVideo = Number(one(query.video) ?? "1");
  const initialVideoPosition = Number.isInteger(requestedVideo) && requestedVideo >= 1 && requestedVideo <= count ? requestedVideo : undefined;
  const initialSummaryOpen = one(query.summary) === "ouvert";
  const lectureUnavailable = one(query.lecture) === "absente";
  const initialEpisodeListExpanded = one(query.episodes) === "ouvert";
  const videos = demoVideos(bloc, count, without === "resume", without === "chapitres", lectureUnavailable);
  const previousBloc = BLOCS_DATA[bloc.displayNumber - 2];
  const nextBloc = BLOCS_DATA[bloc.displayNumber];
  return <DaRoot className="da-app has-tabbar">
    <NavBar displayName="Aperçu" displayEmail="dev@localhost" initials="DV" tier="full" isAdmin />
    <BlocOverview
      blocId={bloc.id}
      title={bloc.titre}
      displayNumber={bloc.displayNumber}
      sections={bloc.sections}
      previewSections={bloc.sections}
      totalSections={bloc.sections.length}
      completedIds={[]}
      videos={videos}
      initialEpisodeListExpanded={initialEpisodeListExpanded}
      initialVideoPosition={initialVideoPosition}
      initialSummaryOpen={initialSummaryOpen}
      checkoutHref={STRIPE_FULL_CHECKOUT_LINK}
      checkoutLabel={COFFRE_LABEL}
      checkoutPrice={formatEuro(COFFRE_PRICE)}
      previousBloc={previousBloc ? { id: previousBloc.id, title: previousBloc.titre, displayNumber: previousBloc.displayNumber } : undefined}
      nextBloc={nextBloc ? { id: nextBloc.id, title: nextBloc.titre, displayNumber: nextBloc.displayNumber } : undefined}
    />
  </DaRoot>;
}
