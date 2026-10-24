import { SECTIONS } from "@/app/beginner/sections.data";
import { BLOCS_DATA } from "@/lib/blocCatalog";
import { canReadBlocSection } from "@/lib/blocAccess";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { PHASES } from "@/lib/protocoleContent";

export type ProgrammeCard = {
  id: string;
  title: string;
  href: string;
  image: string;
  meta: string;
  locked: boolean;
  description?: string;
};

export type ProgrammeSection = { id: string; title: string; description: string; cards: ProgrammeCard[] };

export function programmeForTier(rawTier: string | null): ProgrammeSection[] {
  const tier = normalizeProfileTier(rawTier);
  const foundationsAllowed = tier === "beginner" || tier === "full";
  const foundations = [
    { id: "fondations-1", title: "Ce qui ne change pas", href: "/beginner#mindset", image: "/da/mini/fondations-1.jpg", count: SECTIONS.slice(0, 5).length },
    { id: "fondations-2", title: "De l'idée à l'URL", href: "/beginner#penser", image: "/da/mini/fondations-2.jpg", count: SECTIONS.slice(5).length },
    { id: "protocole", title: "Absorber, produire, distiller", href: "/protocole", image: "/da/mini/protocole.jpg", count: PHASES.length, phases: true },
  ].map((item) => ({
    id: item.id,
    title: item.title,
    href: item.href,
    image: item.image,
    meta: `${item.count} ${item.phases ? "phases" : "chapitres"}`,
    locked: !foundationsAllowed,
  }));

  const blocs = BLOCS_DATA.map((bloc) => ({
    id: `bloc-${bloc.id}`,
    title: bloc.titre.replace(/^Bloc \d+\s*:\s*/, ""),
    href: `/blocs/${bloc.id}`,
    image: `/da/mini/b${bloc.displayNumber}.jpg`,
    meta: `${bloc.sections.length} chapitres`,
    locked: !bloc.sections.some((section) => canReadBlocSection(tier, bloc.id, section.id)),
  }));

  return [
    { id: "commencer", title: "Commencer ici", description: "Trois vidéos pour poser les bases, avant les sept blocs.", cards: foundations },
    { id: "blocs", title: "Les sept blocs", description: "Des vidéos par bloc, dans l'ordre. Chaque chapitre a son texte.", cards: blocs },
  ];
}


export function completedBlocCount(sectionIds: readonly string[]) {
  const completed = new Set(sectionIds);
  return BLOCS_DATA.filter((bloc) => bloc.sections.length > 0 && bloc.sections.every((section) => completed.has(section.id))).length;
}
