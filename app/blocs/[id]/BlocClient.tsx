"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { McpStudyCallout } from "@/components/McpStudyCallout";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { ReaderView } from "@/components/reader/ReaderView";
import type { ReaderMode } from "@/components/reader/readerModel";
import { toggleBlocCompletion } from "@/app/actions/progress";
import { getMcpConnectionStatus } from "@/app/actions/mcpConnections";
import { useProgress } from "@/hooks/useProgress";
import { BLOCS_DATA, type DeliveredBloc } from "@/lib/blocCatalog";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import type { McpConnectionStatus } from "@/lib/mcp/connectionStatus";
import { COFFRE_LABEL, COFFRE_PRICE, STRIPE_FULL_CHECKOUT_LINK, formatEuro, withClientReferenceId } from "@/lib/pricing";

const MCP_CONNECTOR_LAUNCHED = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
const MCP_CONNECTOR_BETA_VISIBLE = process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true";
const MCP_CONNECTOR_VISIBLE = MCP_CONNECTOR_BETA_VISIBLE || MCP_CONNECTOR_LAUNCHED;

type BlocIdentity = {
  displayName: string;
  displayEmail: string;
  initials: string;
  isAdmin: boolean;
};

export default function BlocClient({
  bloc,
  tier,
  checkoutUserId,
  identity,
  initialMode,
  initialChapter,
}: {
  bloc: DeliveredBloc;
  tier: string | null;
  checkoutUserId: string;
  identity: BlocIdentity;
  initialMode?: ReaderMode | null;
  initialChapter?: string | null;
}) {
  const router = useRouter();
  const { checkedItems, toggleItem, globalProgress, isLoaded, setLastVisitedBloc } = useProgress();
  const normalizedTier = normalizeProfileTier(tier);
  const [mcpConnectionStatus, setMcpConnectionStatus] = useState<McpConnectionStatus>("unknown");
  const previousGlobalProgress = useRef<number | null>(null);
  const catalogIndex = BLOCS_DATA.findIndex((item) => item.id === bloc.id);
  const catalogBloc = BLOCS_DATA[catalogIndex];
  const previousBloc = catalogIndex > 0 ? BLOCS_DATA[catalogIndex - 1] : undefined;
  const nextBloc = catalogIndex >= 0 ? BLOCS_DATA[catalogIndex + 1] : undefined;
  const checkoutHref = withClientReferenceId(STRIPE_FULL_CHECKOUT_LINK, checkoutUserId) ?? STRIPE_FULL_CHECKOUT_LINK;

  useEffect(() => {
    setLastVisitedBloc(bloc.id);
  }, [bloc.id, setLastVisitedBloc]);

  useEffect(() => {
    if (!MCP_CONNECTOR_VISIBLE || normalizedTier === null || bloc.sections.length === 0) return;
    getMcpConnectionStatus().then(setMcpConnectionStatus).catch(() => setMcpConnectionStatus("unknown"));
  }, [bloc.sections.length, normalizedTier]);

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
      displayNumber={bloc.displayNumber}
      sections={bloc.sections}
      totalSections={catalogBloc?.sections.length ?? 0}
      completedIds={checkedItems}
      initialMode={initialMode}
      initialChapter={initialChapter}
      onToggleChapter={toggleItem}
      onValidateBloc={validateBloc}
      checkoutHref={checkoutHref}
      checkoutLabel={COFFRE_LABEL}
      checkoutPrice={formatEuro(COFFRE_PRICE)}
      previousBloc={previousBloc ? { href: `/blocs/${previousBloc.id}`, label: previousBloc.titre } : undefined}
      nextBloc={nextBloc ? { href: `/blocs/${nextBloc.id}`, label: nextBloc.titre } : undefined}
      headerExtra={MCP_CONNECTOR_VISIBLE && normalizedTier !== null && bloc.sections.length > 0 && mcpConnectionStatus === "disconnected" ? <McpStudyCallout /> : null}
    />
  </DaRoot>;
}
