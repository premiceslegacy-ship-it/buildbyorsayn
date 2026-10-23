"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { BlocOverview } from "@/components/reader/BlocOverview";
import { useProgress } from "@/hooks/useProgress";
import { BLOCS_DATA, type DeliveredBloc } from "@/lib/blocCatalog";
import { COFFRE_LABEL, COFFRE_PRICE, STRIPE_FULL_CHECKOUT_LINK, formatEuro, withClientReferenceId } from "@/lib/pricing";

type BlocIdentity = {
  displayName: string;
  displayEmail: string;
  initials: string;
  isAdmin: boolean;
};

export default function BlocClient({ bloc, tier, checkoutUserId, identity }: { bloc: DeliveredBloc; tier: string | null; checkoutUserId: string; identity: BlocIdentity }) {
  const router = useRouter();
  const { checkedItems, setLastVisitedBloc } = useProgress();
  const catalogBloc = BLOCS_DATA.find((item) => item.id === bloc.id);
  const catalogIndex = BLOCS_DATA.findIndex((item) => item.id === bloc.id);
  const previousBloc = catalogIndex > 0 ? BLOCS_DATA[catalogIndex - 1] : undefined;
  const nextBloc = catalogIndex >= 0 ? BLOCS_DATA[catalogIndex + 1] : undefined;
  const checkoutHref = withClientReferenceId(STRIPE_FULL_CHECKOUT_LINK, checkoutUserId) ?? STRIPE_FULL_CHECKOUT_LINK;

  useEffect(() => {
    setLastVisitedBloc(bloc.id);
  }, [bloc.id, setLastVisitedBloc]);

  useEffect(() => {
    const chapter = window.location.hash.slice(1);
    const section = bloc.sections.find((item) => item.id === chapter);
    if (!section) return;
    router.replace(`/blocs/${bloc.id}/lire?chapter=${encodeURIComponent(chapter)}&mode=${section.lesson ? "video" : "text"}`);
  }, [bloc.id, bloc.sections, router]);

  return <DaRoot className="da-app has-tabbar">
    <NavBar {...identity} tier={tier} />
    <BlocOverview
      blocId={bloc.id}
      title={bloc.titre}
      displayNumber={bloc.displayNumber}
      sections={bloc.sections}
      previewSections={catalogBloc?.sections ?? []}
      totalSections={catalogBloc?.sections.length ?? bloc.sections.length}
      completedIds={checkedItems}
      checkoutHref={checkoutHref}
      checkoutLabel={COFFRE_LABEL}
      checkoutPrice={formatEuro(COFFRE_PRICE)}
      previousBloc={previousBloc ? { id: previousBloc.id, title: previousBloc.titre, displayNumber: previousBloc.displayNumber } : undefined}
      nextBloc={nextBloc ? { id: nextBloc.id, title: nextBloc.titre, displayNumber: nextBloc.displayNumber } : undefined}
    />
  </DaRoot>;
}
