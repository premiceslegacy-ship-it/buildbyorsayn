import { ANGLE_MORT, SECTIONS } from "@/app/beginner/sections.data";
import { CHAPTER_META, CURRICULUM_SECTIONS, chapterSlug, orderCurriculumFiles } from "@/app/videos/tutos/chapters";
import { BLOCS_DATA } from "@/lib/blocCatalog";
import { canReadBlocSection } from "@/lib/blocAccess";
import { TEXT_MIN_POSITION, parseTextPositionKey, textRatioFromPosition, type TextScope } from "@/lib/lessons/textPosition";
import { canAccess, normalizeProfileTier, type McpTier } from "@/lib/mcpAccess";
export type ProgressRow = { section_id: string; position_seconds: number | null; completed: boolean | null; updated_at: string };
export type ContinueMode = "texte" | "video";
export type VideoProgressMeta = {
  id: string;
  blocId: string;
  position: number;
  title: string;
  durationSeconds: number;
  thumbnail: string | null;
  tierRequired: string;
};

export type ContinueItem = {
  id: string;
  kind: "reprendre" | "suivre";
  mode: ContinueMode;
  course: TextScope;
  courseLabel: string;
  heroNumber: string;
  partTitle: string;
  title: string;
  chapter: number;
  chapterCount: number;
  href: string;
  image: string;
  progress: number | null;
  summary: string;
  meta: string;
  updatedAt: string;
};

type CourseChapter = { id: string; title: string; partTitle: string; image: string; kind?: "texte" | "video"; videoPosition?: number };
type Course = {
  scope: TextScope;
  label: string;
  progressPrefix?: string;
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
  href: (chapterId) => `/blocs/${bloc.id}/lire?chapter=${chapterId}`,
  canRead: (tier, chapterId) => canReadBlocSection(tier, bloc.id, chapterId),
}));

function videoCourses(videos: readonly VideoProgressMeta[]): Course[] {
  return BLOCS_DATA.flatMap((bloc) => {
    const blockVideos = videos.filter((video) => video.blocId === bloc.id).sort((left, right) => left.position - right.position);
    if (blockVideos.length === 0) return [];
    const byId = new Map(blockVideos.map((video) => [video.id, video]));
    return [{
      scope: "bloc" as const,
      label: `Bloc ${bloc.displayNumber}`,
      progressPrefix: "video",
      chapters: blockVideos.map((video) => ({
        id: video.id,
        title: video.title,
        partTitle: bloc.titre.replace(/^Bloc \d+\s*:\s*/, ""),
        image: video.thumbnail ?? `/da/mini/b${bloc.displayNumber}.jpg`,
        kind: "video" as const,
        videoPosition: video.position,
      })),
      heroNumber: () => String(bloc.displayNumber),
      href: (chapterId) => {
        const video = byId.get(chapterId);
        return `/blocs/${bloc.id}${video ? `?video=${video.position}` : ""}`;
      },
      canRead: (tier: string | null, chapterId: string) => {
        const video = byId.get(chapterId);
        return Boolean(video && canAccess(tier, video.tierRequired as McpTier));
      },
    }];
  });
}

const STATIC_COURSES = [FOUNDATION_COURSE, HERMES_COURSE, ...BLOC_COURSES];
const STATIC_CHAPTER_INDEX = new Map<string, { course: Course; index: number }>(
  STATIC_COURSES.flatMap((course) => course.chapters.map((chapter, index) => [`${course.progressPrefix ?? course.scope}:${chapter.id}`, { course, index }] as const)),
);

type Observation = { key: string; course: Course; index: number; mode: ContinueMode; position: number; completed: boolean; updatedAt: string };

function observe(row: ProgressRow, chapterIndex: ReadonlyMap<string, { course: Course; index: number }>): Observation | null {
  const text = parseTextPositionKey(row.section_id);
  const video = chapterIndex.has(`video:${row.section_id}`);
  const key = text ? `${text.scope}:${text.chapterId}` : `${video ? "video" : "bloc"}:${row.section_id}`;
  const found = chapterIndex.get(key);
  if (!found) return null;
  return { key, ...found, mode: text || !video ? "texte" : "video", position: Math.max(0, row.position_seconds ?? 0), completed: row.completed === true, updatedAt: row.updated_at };
}

function toItem(observation: Pick<Observation, "course" | "index" | "mode" | "updatedAt">, kind: ContinueItem["kind"], progress: number | null, remainingSeconds: number | null): ContinueItem {
  const { course, index, mode } = observation;
  const chapter = course.chapters[index];
  const isVideo = chapter.kind === "video";
  const position = isVideo ? `Vidéo ${chapter.videoPosition ?? index + 1} sur ${course.chapters.length}` : `Chapitre ${index + 1} sur ${course.chapters.length}`;
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
    meta: kind === "suivre" ? position : `${position}, ${standing}`,
    updatedAt: observation.updatedAt,
  };
}

export function buildContinueRail(rows: readonly ProgressRow[], tier: string | null, doneSectionIds: ReadonlySet<string>, videoDurations: ReadonlyMap<string, number>, videos: readonly VideoProgressMeta[] = [], limit = 12): ContinueItem[] {
  const chapterIndex = new Map(STATIC_CHAPTER_INDEX);
  for (const course of videoCourses(videos)) course.chapters.forEach((chapter, index) => chapterIndex.set(`video:${chapter.id}`, { course, index }));
  const byChapter = new Map<string, Observation[]>();
  for (const row of rows) {
    const observation = observe(row, chapterIndex);
    if (!observation || !observation.course.canRead(tier, observation.course.chapters[observation.index].id)) continue;
    byChapter.set(observation.key, [...(byChapter.get(observation.key) ?? []), observation]);
  }

  const items: ContinueItem[] = [];
  const lastFinishedByCourse = new Map<Course, Observation>();
  for (const observations of byChapter.values()) {
    const latest = observations.reduce((left, right) => right.updatedAt > left.updatedAt ? right : left);
    const chapter = latest.course.chapters[latest.index];
    const done = observations.some((observation) => observation.completed) || (latest.course.progressPrefix !== "video" && latest.course.scope === "bloc" && doneSectionIds.has(chapter.id));
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
    const duration = videoDurations.get(chapter.id);
    items.push(toItem(latest, "reprendre", duration ? Math.min(1, latest.position / duration) : null, duration ? Math.max(0, duration - latest.position) : null));
  }

  for (const finished of lastFinishedByCourse.values()) {
    const next = finished.course.chapters[finished.index + 1];
    if (!next || byChapter.has(`${finished.course.progressPrefix ?? finished.course.scope}:${next.id}`) || (finished.course.progressPrefix !== "video" && finished.course.scope === "bloc" && doneSectionIds.has(next.id))) continue;
    if (!finished.course.canRead(tier, next.id)) continue;
    items.push(toItem({ ...finished, index: finished.index + 1 }, "suivre", null, null));
  }

  return items.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, limit);
}

export function completedChapterIds(rows: readonly Pick<ProgressRow, "section_id" | "completed">[], doneSectionIds: ReadonlySet<string>): Set<string> {
  const completed = new Set(doneSectionIds);
  for (const row of rows) {
    if (!row.completed) continue;
    completed.add(parseTextPositionKey(row.section_id)?.chapterId ?? row.section_id);
  }
  return completed;
}
