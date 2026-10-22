import "server-only";
import { createClient } from "@/lib/supabase/server";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";
import { projectBlocForTier } from "@/lib/blocAccess";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { videoChapterSchema } from "@/lib/mux/adminLessons";
import { z } from "zod";

export async function getBlocForCurrentUser(id: string) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("tier").eq("id", user.id).maybeSingle();
  const tier = resolveMcpProfileTier(profile, profileError);
  const { BLOCS_DATA } = await import("@/lib/mockData");
  const bloc = BLOCS_DATA.find(item => item.id === id);
  if (!bloc) return { userId: user.id, tier, bloc: null };
  const projected = projectBlocForTier(bloc, tier);
  if (projected.sections.length === 0) return { userId: user.id, tier, bloc: projected };

  try {
    const admin = createAdminSupabase();
    const { data, error: videoError } = await admin
      .from("video_lessons")
      .select("section_id,duration_seconds,deliverables,transcript,chapters")
      .in("section_id", projected.sections.map((section) => section.id))
      .eq("status", "ready")
      .not("published_at", "is", null);
    if (videoError) return { userId: user.id, tier, bloc: projected };

    const lessons = new Map((data ?? []).map((row) => [row.section_id, row]));
    const withPublishedVideos = {
      ...projected,
      sections: projected.sections.map((section) => {
        const row = lessons.get(section.id);
        if (!row || !Number.isFinite(row.duration_seconds) || row.duration_seconds <= 0) return section;
        const parsedChapters = z.array(videoChapterSchema).safeParse(row.chapters);
        return {
          ...section,
          lesson: {
            durationSeconds: row.duration_seconds,
            deliverables: Array.isArray(row.deliverables)
              ? row.deliverables.filter((item): item is string => typeof item === "string").slice(0, 3)
              : [],
            transcript: typeof row.transcript === "string" ? row.transcript : undefined,
            chapters: parsedChapters.success ? parsedChapters.data : undefined,
          },
        };
      }),
    };
    return { userId: user.id, tier, bloc: withPublishedVideos };
  } catch {
    return { userId: user.id, tier, bloc: projected };
  }
}
