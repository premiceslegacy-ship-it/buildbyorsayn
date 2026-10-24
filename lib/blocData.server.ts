import "server-only";
import { createClient } from "@/lib/supabase/server";
import { resolveMcpProfileTier, canAccess, type McpTier } from "@/lib/mcpAccess";
import { projectBlocForTier } from "@/lib/blocAccess";
import { tierForBloc, videoChapterSchema } from "@/lib/mux/adminLessons";
import { signMuxPlaybackTokens, type MuxPlaybackTokens } from "@/lib/mux/transcript.server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { z } from "zod";

export type BlocVideoChapter = { startSeconds: number; title: string; thumbnailUrl: string };
export type BlocVideo = {
  id: string;
  position: number;
  title: string;
  summary: string;
  durationSeconds: number;
  chapters: BlocVideoChapter[];
  thumbnail: string | null;
  playbackId: string;
  tokens: MuxPlaybackTokens;
};
function muxThumbnailUrl(playbackId: string, thumbnailToken: string, timeSeconds = 0): string {
  const query = new URLSearchParams({
    time: String(timeSeconds),
    width: "640",
    token: thumbnailToken,
  });
  return `https://image.mux.com/${encodeURIComponent(playbackId)}/thumbnail.jpg?${query.toString()}`;
}

/** Server-only contract for the Apple-TV video rail. It never returns transcript text. */
export async function getBlocVideos(blocId: string, tier: McpTier): Promise<BlocVideo[]> {
  const requiredTier = tierForBloc(blocId);
  if (!canAccess(tier, requiredTier)) return [];
  try {
    const { data, error } = await createAdminSupabase()
      .from("video_lessons")
      .select("id,position,title,summary,chapters,thumbnail,playback_id,duration_seconds,tier_required")
      .eq("bloc_id", blocId)
      .eq("status", "ready")
      .not("published_at", "is", null)
      .is("replaced_at", null)
      .order("position", { ascending: true });
    if (error) {
      console.error("bloc.videos.query_failed", error.code ?? "unknown");
      return [];
    }
    const visible = (data ?? []).filter((row) => (
      typeof row.playback_id === "string"
      && Number.isSafeInteger(row.duration_seconds)
      && row.duration_seconds > 0
      && canAccess(tier, row.tier_required as McpTier)
    ));
    return await Promise.all(visible.map(async (row) => {
      const chapters = z.array(videoChapterSchema).safeParse(row.chapters);
      const tokens = await signMuxPlaybackTokens(row.playback_id);
      const fallbackTime = typeof row.thumbnail === "string" && row.thumbnail.startsWith("mux:")
        ? Number(row.thumbnail.slice(4))
        : undefined;
      const thumbnail = muxThumbnailUrl(row.playback_id, tokens.thumbnail, Number.isFinite(fallbackTime) ? fallbackTime : undefined);
      return {
        id: row.id,
        position: row.position,
        title: row.title,
        summary: row.summary,
        durationSeconds: row.duration_seconds,
        chapters: chapters.success
          ? chapters.data.map((chapter) => ({
            startSeconds: chapter.startSeconds,
            title: chapter.title,
            thumbnailUrl: muxThumbnailUrl(row.playback_id, tokens.thumbnail, chapter.startSeconds),
          }))
          : [],
        thumbnail,
        playbackId: row.playback_id,
        tokens,
      };
    }));
  } catch (error) {
    console.error("bloc.videos.load_failed", error instanceof Error ? error.name : "unknown");
    return [];
  }
}

export async function getBlocForCurrentUser(id: string) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("tier").eq("id", user.id).maybeSingle();
  const tier = resolveMcpProfileTier(profile, profileError);
  const { BLOCS_DATA } = await import("@/lib/mockData");
  const bloc = BLOCS_DATA.find(item => item.id === id);
  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.first_name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    email.split("@")[0];
  const identity = {
    displayName,
    displayEmail: email,
    initials: displayName.substring(0, 2).toUpperCase(),
    isAdmin: user.app_metadata?.role === "admin",
  };
  if (!bloc) return { userId: user.id, tier, bloc: null, identity };
  const projected = projectBlocForTier(bloc, tier);
  if (projected.sections.length === 0) return { userId: user.id, tier, bloc: projected, identity };

  // Video rails are loaded independently through getBlocVideos. Keeping the
  // written chapters free of video transcript fields prevents accidental UI disclosure.
  return { userId: user.id, tier, bloc: projected, identity };
}
