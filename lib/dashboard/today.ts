import { ANGLE_MORT, SECTIONS } from "@/app/beginner/sections.data";
import { CHAPTER_META, CURRICULUM_SECTIONS, chapterSlug, orderCurriculumFiles } from "@/app/videos/tutos/chapters";
import { BLOCS_DATA } from "@/lib/blocCatalog";
import { canReadBlocSection } from "@/lib/blocAccess";
import { TEXT_MIN_POSITION, parseTextPositionKey, textRatioFromPosition, type TextScope } from "@/lib/lessons/textPosition";
import { normalizeProfileTier } from "@/lib/mcpAccess";

export type ProgressRow = { section_id: string; position_seconds: number | null; completed: boolean | null; updated_at: string };
export type ContinueMode = "texte" | "video";

/** One card of the Reprendre rail: a chapter started and not finished, or the chapter after a finished one. */
export type ContinueItem = {
  id: string;
  kind: "reprendre" | "suivre";
  mode: ContinueMode;
  course: TextScope;
  /** "Bloc 3", "Fondations", "Hermes Agent". */
  courseLabel: string;
  /** Large number of the Aujourd'hui hero: bloc number, otherwise chapter number. */
  heroNumber: string;
  /** Part of the course the chapter belongs to. */
  partTitle: string;
  title: string;
  chapter: number;
  chapterCount: number;
  href: string;
  image: string;
  /** Share of the chapter already read or watched, from 0 to 1. Null when a video length is unknown. */
  progress: number | null;
  /** Sentence under the title of the Aujourd'hui hero. */
  summary: string;
  /** Short line under the title of a Reprendre card. */
  meta: string;
  updatedAt: string;
};

type CourseChapter = { id: string; title: string; partTitle: string; image: string };
type Course = {
  scope: TextScope;
  label: string;
  heroNumber: (index: number) => string;
  chapters: CourseChapter[];
  href: (chapterId: string, mode: ContinueMode) => string;
  canRead: (tier: string | null, chapterId: string) => boolean;
};

const FOUNDATION_COURSE: Course = {
  scope: "fondations",
  label: "Fondations",
  heroNumber: (index) => String(index + 1),
  chapters: [...SECTIONS, ANGLE_MORT].map((section, index) => ({
    id: section.id,
    title: section.label,
    partTitle: index < 5 ? "Ce qui ne change pas" : "De l'idée à l'URL",
    image: index < 5 ? "/da/mini/fondations-1.jpg" : "/da/mini/fondations-2.jpg",
  })),
  canRead: (tier) => {
    const normalized = normalizeProfileTier(tier);
    return normalized === "beginner" || normalized === "full";
  },
  href: (chapterId) => `/beginner/${chapterId}?mode=text`,
};

const HERMES_COURSE: Course = {
  scope: "hermes",
  label: "Hermes Agent",
  heroNumber: (index) => String(index + 1),
  chapters: orderCurriculumFiles(Object.values(CHAPTER_META)).map((meta) => ({
    id: chapterSlug(meta.path),
    title: meta.displayTitle,
    partTitle: CURRICULUM_SECTIONS.find((section) => section.key === meta.section)?.title.replace(/^\d+\.\s*/, "") ?? "Hermes Agent",
    image: "/da/mini/hermes.jpg",
  })),
  href: (chapterId) => `/videos/tutos/${chapterId}?mode=text`,
  canRead: (tier) => normalizeProfileTier(tier) === "full",
};

const BLOC_COURSES: Course[] = BLOCS_DATA.map((bloc) => ({
  scope: "bloc",
  label: `Bloc ${bloc.displayNumber}`,
  chapters: bloc.sections.map((section) => ({ id: section.id, title: section.title, partTitle: bloc.titre.replace(/^Bloc \d+\s*:\s*/, ""), image: `/da/mini/b${bloc.displayNumber}.jpg` })),
  heroNumber: () => String(bloc.displayNumber),
  href: (chapterId, mode) => `/blocs/${bloc.id}/lire?mode=${mode === "texte" ? "text" : "video"}&chapter=${chapterId}`,
  canRead: (tier, chapterId) => canReadBlocSection(tier, bloc.id, chapterId),
}));

const CHAPTER_INDEX = new Map<string, { course: Course; index: number }>(
  [FOUNDATION_COURSE, HERMES_COURSE, ...BLOC_COURSES].flatMap((course) => course.chapters.map((chapter, index) => [`${course.scope}:${chapter.id}`, { course, index }] as const)),
);

type Observation = { key: string; course: Course; index: number; mode: ContinueMode; position: number; completed: boolean; updatedAt: string };

function observe(row: ProgressRow): Observation | null {
  const text = parseTextPositionKey(row.section_id);
  const key = text ? `${text.scope}:${text.chapterId}` : `bloc:${row.section_id}`;
  const found = CHAPTER_INDEX.get(key);
  if (!found) return null;
  return { key, ...found, mode: text ? "texte" : "video", position: Math.max(0, row.position_seconds ?? 0), completed: row.completed === true, updatedAt: row.updated_at };
}

function toItem(observation: Pick<Observation, "course" | "index" | "mode" | "updatedAt">, kind: ContinueItem["kind"], progress: number | null, remainingSeconds: number | null): ContinueItem {
  const { course, index, mode } = observation;
  const chapter = course.chapters[index];
  const position = `Chapitre ${index + 1} sur ${course.chapters.length}`;
  // Where the member stands in the chapter, in a few words.
  const standing = mode === "texte"
    ? `lu à ${Math.round((progress ?? 0) * 100)}\u00a0%`
    : remainingSeconds !== null ? `encore ${Math.max(1, Math.round(remainingSeconds / 60))}\u00a0min` : "en vidéo";
  return {
    id: `${kind}:${course.scope}:${chapter.id}`,
    kind,
    mode,
    course: course.scope,
    courseLabel: course.label,
    heroNumber: course.heroNumber(index),
    partTitle: chapter.partTitle,
    title: chapter.title,
    chapter: index + 1,
    chapterCount: course.chapters.length,
    href: course.href(chapter.id, mode),
    image: chapter.image,
    progress,
    summary: kind === "suivre" ? `${position}. Tu as fini le précédent, la suite t'attend.` : `${position}, ${standing}. Reprends là où tu t'es arrêté.`,
    meta: kind === "suivre" ? position : `Chapitre ${index + 1}, ${standing}`,
    updatedAt: observation.updatedAt,
  };
}

/**
 * Builds the Reprendre rail from the member's own progress rows, most recent first:
 * every readable chapter started and not finished (text position or video time), then, for each
 * course, the chapter after the last one finished when it has not been opened yet.
 * `doneSectionIds` adds bloc chapters ticked as read in the reader; `videoDurations` gives
 * the length of published lessons, in seconds, by section id.
 */
export function buildContinueRail(rows: readonly ProgressRow[], tier: string | null, doneSectionIds: ReadonlySet<string>, videoDurations: ReadonlyMap<string, number>, limit = 12): ContinueItem[] {
  const byChapter = new Map<string, Observation[]>();
  for (const row of rows) {
    const observation = observe(row);
    if (!observation || !observation.course.canRead(tier, observation.course.chapters[observation.index].id)) continue;
    byChapter.set(observation.key, [...(byChapter.get(observation.key) ?? []), observation]);
  }

  const items: ContinueItem[] = [];
  const lastFinishedByCourse = new Map<Course, Observation>();
  for (const observations of byChapter.values()) {
    const latest = observations.reduce((left, right) => right.updatedAt > left.updatedAt ? right : left);
    const chapterId = latest.course.chapters[latest.index].id;
    const done = observations.some((observation) => observation.completed) || (latest.course.scope === "bloc" && doneSectionIds.has(chapterId));
    if (done) {
      const previous = lastFinishedByCourse.get(latest.course);
      if (!previous || latest.updatedAt > previous.updatedAt || (latest.updatedAt === previous.updatedAt && latest.index > previous.index)) lastFinishedByCourse.set(latest.course, latest);
      continue;
    }
    if (latest.mode === "texte") {
      if (latest.position < TEXT_MIN_POSITION) continue;
      items.push(toItem(latest, "reprendre", textRatioFromPosition(latest.position), null));
      continue;
    }
    if (latest.position <= 0) continue;
    const duration = videoDurations.get(chapterId);
    items.push(toItem(latest, "reprendre", duration ? Math.min(1, latest.position / duration) : null, duration ? Math.max(0, duration - latest.position) : null));
  }

  for (const finished of lastFinishedByCourse.values()) {
    const next = finished.course.chapters[finished.index + 1];
    if (!next || byChapter.has(`${finished.course.scope}:${next.id}`) || (finished.course.scope === "bloc" && doneSectionIds.has(next.id))) continue;
    if (!finished.course.canRead(tier, next.id)) continue;
    items.push(toItem({ ...finished, index: finished.index + 1 }, "suivre", null, null));
  }

  return items.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, limit);
}

/** Bloc chapters done through any source, and Fondations chapters read to the end. */
export function completedChapterIds(rows: readonly Pick<ProgressRow, "section_id" | "completed">[], doneSectionIds: ReadonlySet<string>): Set<string> {
  const completed = new Set(doneSectionIds);
  for (const row of rows) {
    if (!row.completed) continue;
    completed.add(parseTextPositionKey(row.section_id)?.chapterId ?? row.section_id);
  }
  return completed;
}
