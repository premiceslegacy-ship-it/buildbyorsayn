import "server-only";

import { SECTIONS } from "@/app/beginner/sections.data";
import { buildContinueRail, completedChapterIds, type ProgressRow } from "@/lib/dashboard/today";
import { BLOCS_DATA, type LessonRecord } from "@/lib/blocCatalog";
import lessonsFile from "@/lib/blocLessons.json";
import { parseTextPositionKey } from "@/lib/lessons/textPosition";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const PROGRESS_ROWS_LIMIT = 300;

async function videoDurations(sectionIds: string[]) {
  const durations = new Map<string, number>();
  if (sectionIds.length === 0) return durations;
  for (const lesson of lessonsFile.lessons as LessonRecord[]) {
    if (lesson.durationSeconds && sectionIds.includes(lesson.sectionId)) durations.set(lesson.sectionId, lesson.durationSeconds);
  }
  // Same source as lesson playback: published lessons win over the JSON kept during the migration.
  try {
    const { data, error } = await createAdminSupabase().from("video_lessons").select("section_id,duration_seconds").in("section_id", sectionIds).eq("status", "ready").not("published_at", "is", null);
    if (!error) for (const row of data ?? []) if (row.duration_seconds) durations.set(row.section_id, row.duration_seconds);
  } catch {
    // A length only draws the bar: an unreachable table keeps the JSON values.
  }
  return durations;
}

/**
 * Everything Aujourd'hui knows about the member's progress, read with their own session:
 * the Reprendre rail (text and video, most recent first) and the completion of each programme card.
 */
export async function loadTodayProgress(userId: string, tier: string | null) {
  const supabase = await createClient();
  const [progress, ticked] = await Promise.all([
    supabase.from("lesson_progress").select("section_id,position_seconds,completed,updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).limit(PROGRESS_ROWS_LIMIT),
    supabase.from("progress").select("item_id").eq("user_id", userId),
  ]);
  if (progress.error || ticked.error) throw new Error("today.progress.unavailable");
  const rows = (progress.data ?? []) as ProgressRow[];
  const doneSectionIds = new Set((ticked.data ?? []).map((row) => row.item_id as string));
  const videoSectionIds = [...new Set(rows.filter((row) => !row.completed && !parseTextPositionKey(row.section_id)).map((row) => row.section_id))];
  const continueItems = buildContinueRail(rows, tier, doneSectionIds, await videoDurations(videoSectionIds));

  const completed = completedChapterIds(rows, doneSectionIds);
  const ratio = (ids: readonly string[]) => ids.length === 0 ? 0 : Math.round(ids.filter((id) => completed.has(id)).length / ids.length * 100);
  const progressByCard: Record<string, number> = {
    "fondations-1": ratio(SECTIONS.slice(0, 5).map((section) => section.id)),
    "fondations-2": ratio(SECTIONS.slice(5).map((section) => section.id)),
    ...Object.fromEntries(BLOCS_DATA.map((bloc) => [`bloc-${bloc.id}`, ratio(bloc.sections.map((section) => section.id))])),
  };
  return { continueItems, progressByCard };
}
