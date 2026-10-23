import { BLOCS_DATA } from "@/lib/blocCatalog";
import type { McpTier } from "@/lib/mcpAccess";
import { programmeForTier } from "@/lib/programme";

export type PurchaseEntry = { id: string; title: string; image: string; meta: string };
export type PurchaseState =
  | { kind: "confirmed"; tier: "beginner" | "full"; label: string; entries: PurchaseEntry[]; destination: string }
  | { kind: "pending"; authenticated: boolean }
  | { kind: "error" };

export function purchaseState({ tier, authenticated, unverified }: { tier: McpTier | null; authenticated: boolean; unverified: boolean }): PurchaseState {
  if (unverified) return { kind: "error" };
  if (tier === "beginner") {
    const entries = programmeForTier(tier)[0].cards.filter((card) => !card.locked).map((card) => ({ id: card.id, title: card.title, image: card.image, meta: card.meta }));
    return { kind: "confirmed", tier, label: "Fondations", entries, destination: "/beginner" };
  }
  if (tier === "full") {
    const entries = BLOCS_DATA.slice(1).map((bloc) => ({
      id: bloc.id,
      title: bloc.titre.replace(/^Bloc \d+\s*:\s*/, ""),
      image: `/da/mini/b${bloc.displayNumber}.jpg`,
      meta: `${bloc.sections.length} chapitre${bloc.sections.length > 1 ? "s" : ""}`,
    }));
    return { kind: "confirmed", tier, label: "LE\u00a0COFFRE", entries, destination: "/programme" };
  }
  return { kind: "pending", authenticated };
}
