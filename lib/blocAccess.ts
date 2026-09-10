import { normalizeProfileTier } from "./mcpAccess";
import type { DeliveredBloc } from "./blocCatalog";

export function canReadBlocSection(tier: string | null, blocId: string, sectionId: string) {
  const normalized = normalizeProfileTier(tier);
  return normalized === "full" || (blocId === "1" && (
    normalized === "beginner" || (normalized === "preview" && sectionId === "b1-s0")
  ));
}

// Only this projected result may cross the server/client boundary.
export function projectBlocForTier(bloc: DeliveredBloc, tier: string | null): DeliveredBloc {
  const normalized = normalizeProfileTier(tier);
  return {
    id: bloc.id, titre: bloc.titre, displayNumber: bloc.displayNumber,
    sections: bloc.sections.filter(section => canReadBlocSection(tier, bloc.id, section.id)),
    videos: normalized === "full" || (normalized === "beginner" && bloc.id === "1") ? bloc.videos : [],
  };
}