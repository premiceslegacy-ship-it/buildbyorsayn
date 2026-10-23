import type { McpTier } from "@/lib/mcpAccess";
import type { ProgrammeCard } from "@/lib/programme";

export type WelcomeChoice = Pick<ProgrammeCard, "id" | "title" | "href" | "image" | "meta"> & {
  description: string;
};

const TIER_LABELS: Record<McpTier, string> = {
  free: "Gratuit",
  preview: "Aperçu",
  beginner: "Fondations",
  full: "LE\u00a0COFFRE",
};

export function welcomeTierLabel(tier: McpTier) {
  return TIER_LABELS[tier];
}

export function welcomeDisplayName(metadata: unknown): string {
  if (!metadata || typeof metadata !== "object") return "";
  const values = metadata as { first_name?: unknown; full_name?: unknown };
  const firstName = typeof values.first_name === "string" ? values.first_name.trim() : "";
  if (firstName) return firstName;
  const fullName = typeof values.full_name === "string" ? values.full_name.trim() : "";
  return fullName.split(/\s+/)[0] ?? "";
}

export function nonBreakingWelcomeName(name: string): string {
  return name.replaceAll("-", "\u2011");
}

export function welcomeChoices(tier: McpTier, cards: readonly ProgrammeCard[]): WelcomeChoice[] {
  const unlocked = cards.filter((card) => !card.locked);
  if (unlocked.length === 0) {
    return [{
      id: "programme",
      title: "Découvrir le programme",
      href: "/programme",
      image: "/da/mini/b1.jpg",
      meta: "Accès gratuit",
      description: "Vois le parcours et les accès disponibles avant de choisir ton niveau.",
    }];
  }

  const preferred = tier === "preview"
    ? unlocked.filter((card) => card.id === "bloc-1")
    : unlocked.filter((card) => card.id === "fondations-1" || card.id === "bloc-1");
  const selected = preferred.length > 0 ? preferred : unlocked.slice(0, 1);

  return selected.slice(0, 2).map((card) => ({
    id: card.id,
    title: card.title,
    href: card.href,
    image: card.image,
    meta: card.meta,
    description: card.id.startsWith("fondations")
      ? "Pose les bases avant de construire ton premier résultat."
      : "Commence par le premier chapitre inclus dans ton accès.",
  }));
}
