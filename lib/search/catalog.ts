import { ANGLE_MORT, SECTIONS } from "@/app/beginner/sections.data";
import { CHAPTER_META } from "@/app/videos/tutos/chapters";
import { BLOCS_DATA } from "@/lib/blocCatalog";
import { canReadBlocSection } from "@/lib/blocAccess";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { SKILLS_CATALOG, SKILL_CATEGORY_LABELS } from "@/lib/skillsCatalog";

export type SearchKind = "Vidéo" | "Chapitre" | "Skill";
export type SearchItem = { id: string; kind: SearchKind; title: string; context: string; href: string; image: string; locked: boolean; searchText: string };

function skillAllowed(tier: ReturnType<typeof normalizeProfileTier>, required: string) {
  if (required === "free") return true;
  if (required === "beginner") return tier === "beginner" || tier === "full";
  return tier === "full";
}

export function buildSearchCatalog(rawTier: string | null): SearchItem[] {
  const tier = normalizeProfileTier(rawTier);
  const foundationAllowed = tier === "beginner" || tier === "full";
  const items: SearchItem[] = [];
  const foundationGroups = [
    { id: "fondations-1", title: "Fondations 1 : ce qui ne change pas", chapters: SECTIONS.slice(0, 5), image: "/da/mini/fondations-1.jpg" },
    { id: "fondations-2", title: "Fondations 2 : de l'idée à l'URL", chapters: SECTIONS.slice(5), image: "/da/mini/fondations-2.jpg" },
    { id: "distillation", title: "LA DISTILLATION : absorber, produire, distiller", chapters: [ANGLE_MORT], image: "/da/mini/protocole.jpg" },
  ];
  if (foundationAllowed) {
    for (const group of foundationGroups) {
      const href = group.id === "distillation" ? "/protocole" : `/beginner#${group.chapters[0]?.id ?? ""}`;
      items.push({ id: `video-${group.id}`, kind: "Vidéo", title: group.title, context: `${group.chapters.length} chapitres`, href, image: group.image, locked: false, searchText: `${group.title} ${group.chapters.map((chapter) => `${chapter.label} ${chapter.summary}`).join(" ")}` });
      group.chapters.forEach((chapter) => items.push({ id: `chapter-${chapter.id}`, kind: "Chapitre", title: chapter.label, context: group.title, href: group.id === "distillation" ? "/protocole" : `/beginner#${chapter.id}`, image: group.image, locked: false, searchText: `${chapter.label} ${chapter.summary} ${group.title}` }));
    }
  }
  BLOCS_DATA.forEach((bloc) => {
    const image = `/da/mini/b${bloc.displayNumber}.jpg`;
    const unlocked = bloc.sections.some((section) => canReadBlocSection(tier, bloc.id, section.id));
    if (unlocked) {
      const visibleSections = bloc.sections.filter((section) => canReadBlocSection(tier, bloc.id, section.id));
      items.push({ id: `video-bloc-${bloc.id}`, kind: "Vidéo", title: bloc.titre, context: `${visibleSections.length} chapitres`, href: `/blocs/${bloc.id}`, image, locked: false, searchText: `${bloc.titre} ${visibleSections.map((section) => section.title).join(" ")}` });
      visibleSections.forEach((section) => items.push({ id: `chapter-${section.id}`, kind: "Chapitre", title: section.title, context: bloc.titre, href: `/blocs/${bloc.id}#${section.id}`, image, locked: false, searchText: `${section.title} ${bloc.titre}` }));
    }
  });
  const hermesAllowed = tier === "full";
  if (hermesAllowed) {
    items.push({ id: "video-hermes", kind: "Vidéo", title: "Hermes Agent : de zéro à ton premier workflow", context: `${Object.keys(CHAPTER_META).length} chapitres`, href: "/videos/tutos", image: "/da/mini/hermes.jpg", locked: false, searchText: `Hermes Agent workflow ${Object.values(CHAPTER_META).map((chapter) => `${chapter.displayTitle} ${chapter.summary}`).join(" ")}` });
    Object.values(CHAPTER_META).forEach((chapter) => items.push({ id: `hermes-${chapter.path}`, kind: "Chapitre", title: chapter.displayTitle, context: "Hermes Agent", href: `/videos/tutos/${chapter.path.replace(/\.md$/, "")}`, image: "/da/mini/hermes.jpg", locked: false, searchText: `${chapter.displayTitle} ${chapter.summary} Hermes Agent` }));
  }
  SKILLS_CATALOG.filter((skill) => skillAllowed(tier, skill.access)).forEach((skill) => items.push({ id: `skill-${skill.slug}`, kind: "Skill", title: skill.title, context: SKILL_CATEGORY_LABELS[skill.category], href: `/skills#${skill.slug}`, image: `/da/skills/${skill.slug}.jpg`, locked: false, searchText: `${skill.title} ${skill.description} ${skill.category}` }));
  return items;
}

export function searchCatalog(items: SearchItem[], query: string) {
  const terms = query.toLocaleLowerCase("fr-FR").normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return items.filter((item) => {
    const haystack = `${item.title} ${item.context} ${item.searchText}`.toLocaleLowerCase("fr-FR").normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return terms.every((term) => haystack.includes(term));
  }).slice(0, 24);
}
