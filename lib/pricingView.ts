import { BLOCS_DATA } from "@/lib/blocCatalog";
import { SKILLS_CATALOG } from "@/lib/skillsCatalog";
import { normalizeProfileTier } from "@/lib/mcpAccess";

/** Un bloc d'écran de la zone « Offres ». */
export type PricingBlock = "fondations" | "coffre" | "upgradeBand" | "upgradeCard" | "owned";

export type PricingView = { blocks: readonly PricingBlock[] };

const BOTH: PricingView = { blocks: ["fondations", "coffre", "upgradeBand"] };
const UPGRADE_ONLY: PricingView = { blocks: ["upgradeCard"] };
const OWNED: PricingView = { blocks: ["owned"] };

/**
 * Décide quels blocs d'achat afficher selon l'accès du visiteur.
 * - anonyme, free, preview, inconnu : les deux offres et la montée de Fondations à LE COFFRE ;
 * - beginner (Fondations) : uniquement la carte de montée vers LE COFFRE ;
 * - full ou admin : aucune carte d'achat, seulement la confirmation qu'il a tout.
 */
export function selectPricingView({ tier }: { tier: string | null | undefined }): PricingView {
  const normalized = normalizeProfileTier(tier);
  if (normalized === "full") return OWNED;
  if (normalized === "beginner") return UPGRADE_ONLY;
  return BOTH;
}

/** Les chiffres de l'offre, calculés depuis le catalogue (jamais écrits dans les textes). */
export type OfferFacts = {
  blocs: number;
  skillsFondations: number;
  skillsCoffre: number;
  skillsExtra: number;
};

export function getOfferFacts(): OfferFacts {
  const skillsCoffre = SKILLS_CATALOG.length;
  const skillsFondations = SKILLS_CATALOG.filter((skill) => skill.access === "beginner").length;
  return {
    blocs: BLOCS_DATA.length,
    skillsFondations,
    skillsCoffre,
    skillsExtra: skillsCoffre - skillsFondations,
  };
}
