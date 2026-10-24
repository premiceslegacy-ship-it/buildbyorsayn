"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toggleBlocCompletion } from "@/app/actions/progress";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { ReaderView } from "@/components/reader/ReaderView";
import { useProgress } from "@/hooks/useProgress";
import { BLOCS_DATA, type DeliveredBloc } from "@/lib/blocCatalog";

type BlocIdentity = {
  displayName: string;
  displayEmail: string;
  initials: string;
  isAdmin: boolean;
};

export default function ReaderClient({ bloc, tier, identity, initialChapter }: { bloc: DeliveredBloc; tier: string | null; identity: BlocIdentity; initialChapter?: string | null }) {
  const router = useRouter();
  const { checkedItems, toggleItem, globalProgress, isLoaded, setLastVisitedBloc } = useProgress();
  const previousGlobalProgress = useRef<number | null>(null);
  const catalogIndex = BLOCS_DATA.findIndex((item) => item.id === bloc.id);
  const catalogBloc = BLOCS_DATA[catalogIndex];
  const nextBloc = catalogIndex >= 0 ? BLOCS_DATA[catalogIndex + 1] : undefined;

  useEffect(() => {
    setLastVisitedBloc(bloc.id);
  }, [bloc.id, setLastVisitedBloc]);

  useEffect(() => {
    if (!isLoaded) return;
    if (previousGlobalProgress.current !== null && previousGlobalProgress.current < 100 && globalProgress === 100) {
      const timer = window.setTimeout(() => router.push("/fin"), 800);
      return () => window.clearTimeout(timer);
    }
    previousGlobalProgress.current = globalProgress;
  }, [globalProgress, isLoaded, router]);

  const validateBloc = async () => {
    const advances = Number(sessionStorage.getItem("build_session_advances") ?? "0");
    sessionStorage.setItem("build_session_advances", String(advances + 1));
    const result = await toggleBlocCompletion(Number(bloc.id));
    if (!result.success) return;
    router.refresh();
    if (nextBloc) router.push(`/blocs/${nextBloc.id}`);
  };

  return <DaRoot className="da-app has-tabbar">
    <NavBar {...identity} tier={tier} />
    <ReaderView
      title={bloc.titre}
      toolbarTitle={`Bloc ${bloc.displayNumber}`}
      backLabel={`Bloc ${bloc.displayNumber}`}
      sections={bloc.sections}
      totalSections={catalogBloc?.sections.length ?? bloc.sections.length}
      completedIds={checkedItems}
      initialChapter={initialChapter}
      textOnly
      syncAddress={false}
      onToggleChapter={toggleItem}
      onValidateBloc={validateBloc}
      nextBloc={nextBloc ? { href: `/blocs/${nextBloc.id}`, label: nextBloc.titre, thumbnailSrc: `/da/mini/b${nextBloc.displayNumber}.jpg` } : undefined}
      backHref={`/blocs/${bloc.id}`}
      finishTitle="Ce bloc est terminé."
      thumbnailSrc={`/da/mini/b${bloc.displayNumber}.jpg`}
      readingScope="bloc"
    />
  </DaRoot>;
}
