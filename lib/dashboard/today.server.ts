import "server-only";

import { SECTIONS } from "@/app/beginner/sections.data";
import { buildContinueRail, completedChapterIds, type ProgressRow, type VideoProgressMeta } from "@/lib/dashboard/today";
import { BLOCS_DATA } from "@/lib/blocCatalog";
import { getBlocVideos } from "@/lib/blocData.server";
import { normalizeProfileTier, canAccess, type McpTier } from "@/lib/mcpAccess";
import { parseTextPositionKey } from "@/lib/lessons/textPosition";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const PROGRESS_ROWS_LIMIT = 300;

async function loadVideoMeta(videoIds: string[], tier: string | null): Promise<VideoProgressMeta[]> {
  if (videoIds.length === 0) return [];
  try {
    const { data, error } = await createAdminSupabase()
      .from("video_lessons")
      .select("id,bloc_id,position,title,duration_seconds,tier_required")
      .in("id", videoIds)
      .eq("status", "ready")
      .not("published_at", "is", null)
      .is("replaced_at", null);
    if (error) return [];
    const normalizedTier = normalizeProfileTier(tier);
    if (!normalizedTier) return [];
    const videosByBlock = await Promise.all(
      [...new Set((data ?? []).map((row) => row.bloc_id))].map((blocId) => getBlocVideos(blocId, normalizedTier)),
    );
    const thumbnails = new Map(videosByBlock.flatMap((result) => result.state === "ready" ? result.videos : []).map((video) => [video.id, video.thumbnailUrl]));
    return (data ?? []).flatMap((row) => {
      const bloc = BLOCS_DATA.find((item) => item.id === row.bloc_id);
      const thumbnail = thumbnails.get(row.id);
      if (!bloc || !thumbnail || !Number.isSafeInteger(row.position) || !Number.isSafeInteger(row.duration_seconds) || row.duration_seconds <= 0 || typeof row.title !== "string" || !canAccess(normalizedTier, row.tier_required as McpTier)) return [];
      return [{ id: row.id, blocId: row.bloc_id, position: row.position, title: row.title, durationSeconds: row.duration_seconds, thumbnail, tierRequired: row.tier_required as string }];
    });
  } catch {
    return [];
  }
}

/**
 * Everything Aujourd'hui knows about the member's progress, read with their own session:
 * the Reprendre rail (text and block video, most recent first) and the completion of each programme card.
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
  const videoIds = [...new Set(rows.filter((row) => !row.completed && !parseTextPositionKey(row.section_id)).map((row) => row.section_id))];
  const videos = await loadVideoMeta(videoIds, tier);
  const durations = new Map(videos.map((video) => [video.id, video.durationSeconds]));
  const continueItems = buildContinueRail(rows, tier, doneSectionIds, durations, videos);

  const completed = completedChapterIds(rows, doneSectionIds);
  const ratio = (ids: readonly string[]) => ids.length === 0 ? 0 : Math.round(ids.filter((id) => completed.has(id)).length / ids.length * 100);
  const progressByCard: Record<string, number> = {
    "fondations-1": ratio(SECTIONS.slice(0, 5).map((section) => section.id)),
    "fondations-2": ratio(SECTIONS.slice(5).map((section) => section.id)),
    ...Object.fromEntries(BLOCS_DATA.map((bloc) => [`bloc-${bloc.id}`, ratio(bloc.sections.map((section) => section.id))])),
  };
  return { continueItems, progressByCard };
}
