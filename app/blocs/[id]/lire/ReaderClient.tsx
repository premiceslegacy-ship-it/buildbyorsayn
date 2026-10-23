"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toggleBlocCompletion } from "@/app/actions/progress";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { ReaderView } from "@/components/reader/ReaderView";
import type { ReaderMode } from "@/components/reader/readerModel";
import { useProgress } from "@/hooks/useProgress";
import { BLOCS_DATA, type DeliveredBloc } from "@/lib/blocCatalog";

type BlocIdentity = {
  displayName: string;
  displayEmail: string;
  initials: string;
  isAdmin: boolean;
};

export default function ReaderClient({ bloc, diagrams, tier, identity, initialMode, initialChapter }: { bloc: DeliveredBloc; diagrams: Record<string, ReactNode>; tier: string | null; identity: BlocIdentity; initialMode?: ReaderMode | null; initialChapter?: string | null }) {
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
      sections={bloc.sections.map((section) => ({ ...section, diagram: diagrams[section.id] }))}
      totalSections={catalogBloc?.sections.length ?? bloc.sections.length}
      completedIds={checkedItems}
      initialMode={initialMode}
      initialChapter={initialChapter}
      onToggleChapter={toggleItem}
      onValidateBloc={validateBloc}
      nextBloc={nextBloc ? { href: `/blocs/${nextBloc.id}`, label: nextBloc.titre } : undefined}
      backHref={`/blocs/${bloc.id}`}
      showUpcomingVideo
      finishTitle="Ce bloc est terminé."
    />
  </DaRoot>;
}
