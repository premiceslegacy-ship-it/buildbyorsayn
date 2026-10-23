import { BLOCS_DATA } from "@/lib/blocCatalog";
import type { McpTier } from "@/lib/mcpAccess";
import { programmeForTier } from "@/lib/programme";

export type PurchaseEntry = { id: string; label: string; title: string; image: string };
export type PurchaseState =
  | { kind: "confirmed"; tier: "beginner" | "full"; label: string; entries: PurchaseEntry[]; destination: string }
  | { kind: "pending"; authenticated: boolean }
  | { kind: "error" };

export function purchaseRevealSchedule(entryCount: number) {
  const count = Math.max(0, Math.floor(entryCount));
  return {
    copyAt: 760,
    rows: Array.from({ length: count }, (_, index) => ({
      revealAt: 1_140 + index * 190,
      openAt: 1_310 + index * 190,
    })),
    actionAt: 1_300 + count * 190,
  };
}

export function purchaseState({ tier, authenticated, unverified }: { tier: McpTier | null; authenticated: boolean; unverified: boolean }): PurchaseState {
  if (unverified) return { kind: "error" };
  if (tier === "beginner") {
    const entries = programmeForTier(tier)[0].cards.filter((card) => !card.locked).map((card) => ({
      id: card.id,
      label: card.id === "fondations-1" ? "Fondations 1" : card.id === "fondations-2" ? "Fondations 2" : "LA DISTILLATION",
      title: card.title,
      image: card.image,
    }));
    return { kind: "confirmed", tier, label: "Fondations", entries, destination: "/beginner" };
  }
  if (tier === "full") {
    const entries = BLOCS_DATA.slice(1).map((bloc) => ({
      id: bloc.id,
      label: `Bloc ${bloc.displayNumber}`,
      title: bloc.titre.replace(/^Bloc \d+\s*:\s*/, ""),
      image: `/da/mini/b${bloc.displayNumber}.jpg`,
    }));
    return { kind: "confirmed", tier, label: "LE\u00a0COFFRE", entries, destination: "/programme" };
  }
  return { kind: "pending", authenticated };
}
