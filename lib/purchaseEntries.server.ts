import "server-only";

import { BLOCS_DATA } from "@/lib/blocCatalog";
import type { McpTier } from "@/lib/mcpAccess";
import { programmeForTier } from "@/lib/programme";
import type { PurchaseEntry } from "@/components/ui5/purchaseModel";

export function purchaseEntriesForTier(tier: McpTier | null): PurchaseEntry[] {
  if (tier === "beginner") {
    return programmeForTier(tier)[0].cards.filter((card) => !card.locked).map((card) => ({
      id: card.id,
      label: card.id === "fondations-1" ? "Fondations 1" : card.id === "fondations-2" ? "Fondations 2" : "LA DISTILLATION",
      title: card.title,
      image: card.image,
    }));
  }
  if (tier === "full") {
    return BLOCS_DATA.slice(1).map((bloc) => ({
      id: bloc.id,
      label: `Bloc ${bloc.displayNumber}`,
      title: bloc.titre.replace(/^Bloc \d+\s*:\s*/, ""),
      image: `/da/mini/b${bloc.displayNumber}.jpg`,
    }));
  }
  return [];
}
