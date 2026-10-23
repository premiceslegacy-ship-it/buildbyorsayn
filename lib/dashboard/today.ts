import { BLOCS_DATA } from "@/lib/blocCatalog";
import { canReadBlocSection } from "@/lib/blocAccess";

export type ResumeItem = { sectionId: string; title: string; blocId: string; blocNumber: number; blocTitle: string; chapter: number; chapterCount: number; href: string; image: string; positionSeconds: number };

export function resumeFromProgress(progress: { section_id: string; position_seconds: number | null } | null): ResumeItem | null {
  if (!progress) return null;
  const bloc = BLOCS_DATA.find((entry) => entry.sections.some((section) => section.id === progress.section_id));
  const chapter = bloc?.sections.findIndex((section) => section.id === progress.section_id) ?? -1;
  if (!bloc || chapter < 0) return null;
  return { sectionId: progress.section_id, title: bloc.sections[chapter].title, blocId: bloc.id, blocNumber: bloc.displayNumber, blocTitle: bloc.titre.replace(/^Bloc \d+\s*:\s*/, ""), chapter: chapter + 1, chapterCount: bloc.sections.length, href: `/blocs/${bloc.id}#${progress.section_id}`, image: `/da/mini/b${bloc.displayNumber}.jpg`, positionSeconds: Math.max(0, progress.position_seconds ?? 0) };
}

export function resumeForTier(progress: { section_id: string; position_seconds: number | null } | null, tier: string | null) {
  const resume = resumeFromProgress(progress);
  return resume && canReadBlocSection(tier, resume.blocId, resume.sectionId) ? resume : null;
}
