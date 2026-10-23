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
  const sections = bloc.sections.filter(section => canReadBlocSection(tier, bloc.id, section.id));
  return {
    id: bloc.id, titre: bloc.titre, displayNumber: bloc.displayNumber,
    introduction: sections.length > 0 ? bloc.introduction : undefined,
    sections,
  };
}
