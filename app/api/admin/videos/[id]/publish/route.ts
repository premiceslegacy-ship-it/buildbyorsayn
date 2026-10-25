import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { publishVideoSchema, validateChapterTimeline, videoChapterSchema } from "@/lib/mux/adminLessons";
import { cleanupMuxAsset, cleanupQueuedAssetsForSlot } from "@/lib/mux/assetCleanup.server";
import { recordVideoPublishedNews } from "@/lib/nouveautes/autoNews.server";
import { getVerifiedAdmin, type AdminVideoLessonRow } from "@/lib/mux/adminServer";
type VideoPublishRouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: VideoPublishRouteContext) {
  const user = await getVerifiedAdmin();
  if (!user) return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ ok: false, error: "Vidéo invalide." }, { status: 400 });
  }
  if (!isJsonMediaType(request.headers.get("content-type"))) {
    return NextResponse.json({ ok: false, error: "Corps JSON requis." }, { status: 415 });
  }
  const bounded = await readBoundedBody(request, 1_024);
  if (!bounded.ok) return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  let decoded: unknown;
  try {
    decoded = JSON.parse(bounded.text);
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  if (!publishVideoSchema.safeParse(decoded).success) {
    return NextResponse.json({ ok: false, error: "La confirmation humaine est requise." }, { status: 409 });
  }

  const admin = createAdminSupabase({ signal: request.signal });
  const { data: row, error: readError } = await admin
    .from("video_lessons")
    .select("id,bloc_id,position,title,summary,transcript,transcript_segments,transcript_source,deliverables,chapters,thumbnail,tier_required,status,mux_upload_id,mux_asset_id,playback_id,duration_seconds,error_code,published_at,replaced_at,approved_at,created_at")
    .eq("id", id)
    .maybeSingle();
  if (readError || !row) return NextResponse.json({ ok: false, error: "Vidéo introuvable." }, { status: 404 });

  const video = row as AdminVideoLessonRow;
  if (video.replaced_at) {
    return NextResponse.json({ ok: false, error: "Cette vidéo a été remplacée et ne peut plus être publiée." }, { status: 409 });
  }
  try {
    if (!await cleanupQueuedAssetsForSlot(video.bloc_id, video.position, video.id, request.signal)) {
      return NextResponse.json({ ok: false, error: "L'ancien asset Mux attend son nettoyage." }, { status: 503 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "La file de nettoyage Mux est indisponible." }, { status: 503 });
  }
  if (video.published_at) {
    revalidatePath("/admin");
    revalidatePath(`/blocs/${video.bloc_id}`);
    return NextResponse.json({ ok: true, resumedCleanup: true });
  }
  const chapters = z.array(videoChapterSchema).safeParse(video.chapters);
  const timelineError = chapters.success
    ? validateChapterTimeline(chapters.data, video.duration_seconds)
    : "Les chapitres sont invalides.";
  if (video.status !== "ready" || !video.playback_id || !video.duration_seconds || timelineError) {
    return NextResponse.json({ ok: false, error: timelineError ?? "La vidéo est encore en traitement." }, { status: 409 });
  }

  const { data, error } = await admin.rpc("publish_video_lesson", {
    p_video_id: id,
    p_actor_user_id: user.id,
  });
  if (error || !Array.isArray(data) || data.length !== 1) {
    return NextResponse.json({ ok: false, error: "La publication a échoué." }, { status: 503 });
  }
  await recordVideoPublishedNews(id, { actorUserId: user.id });
  const previousAssetId = typeof data[0]?.previous_mux_asset_id === "string"
    ? data[0].previous_mux_asset_id
    : null;
  if (previousAssetId) {
    try {
      if (!await cleanupMuxAsset(previousAssetId, request.signal)) {
        return NextResponse.json({ ok: false, error: "La vidéo est publiée mais l'ancien asset Mux attend son nettoyage." }, { status: 503 });
      }
    } catch {
      console.error("admin.video.previous_asset_cleanup_failed");
      return NextResponse.json({ ok: false, error: "La vidéo est publiée mais l'ancien asset Mux attend son nettoyage." }, { status: 503 });
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/blocs/${video.bloc_id}`);
  return NextResponse.json({ ok: true, previousAssetId });
}
