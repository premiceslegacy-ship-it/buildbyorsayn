import "server-only";

import { revalidatePath } from "next/cache";
import { displayLocationFromBlocId } from "@/lib/blocCatalog";
import { readVideoThumbnail, storeBuildNewsThumbnail } from "@/lib/buildNews/thumbnail.server";
import { recordAdminAction } from "@/lib/mux/adminServer";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { publishVideoNews, type AutoNewsResult, type VideoNewsDeps } from "./autoNews";

function blocLabelFor(blocId: string): string | null {
  const location = displayLocationFromBlocId(blocId);
  if (location === null) return null;
  return location === "protocole" ? "Protocole" : `Bloc ${location}`;
}

const loadThumbnail: VideoNewsDeps["loadThumbnail"] = async (video) => {
  const bytes = await readVideoThumbnail({ id: video.id, playback_id: video.playback_id, thumbnail: video.thumbnail });
  const stored = await storeBuildNewsThumbnail(video.id, bytes);
  return { url: stored.publicUrl, path: stored.path };
};

/**
 * Déclencheur unique appelé aux points de publication réels d'une vidéo
 * (publication admin, approbation d'une demande de l'agent, publication autonome).
 * Idempotent par clé de source `video:<id>:1`. Ne lève jamais : la vidéo est déjà
 * en ligne, un échec ici est journalisé et se rattrape avec `npm run news:backfill`.
 * N'envoie aucun e-mail.
 */
export async function recordVideoPublishedNews(
  videoId: string,
  options: { actorUserId?: string | null; deps?: Partial<VideoNewsDeps> } = {},
): Promise<AutoNewsResult | { status: "failed" }> {
  try {
    const client = options.deps?.client ?? createAdminSupabase();
    const result = await publishVideoNews(videoId, {
      client,
      loadThumbnail: options.deps?.loadThumbnail ?? loadThumbnail,
      blocLabelFor: options.deps?.blocLabelFor ?? blocLabelFor,
      createdBy: options.actorUserId ?? null,
    });
    if (result.status === "created") {
      if (options.actorUserId) {
        await recordAdminAction({
          actorUserId: options.actorUserId,
          action: "build_news.auto_create",
          targetType: "build_news",
          targetId: result.id,
          result: "completed",
          approved: true,
          details: { sourceKey: result.sourceKey },
        }).catch(() => undefined);
      }
      try { revalidatePath("/nouveautes"); } catch { /* hors contexte de requête (script) */ }
    }
    return result;
  } catch (error) {
    console.error("nouveautes.auto.video_failed", error instanceof Error ? error.message : error);
    return { status: "failed" };
  }
}
