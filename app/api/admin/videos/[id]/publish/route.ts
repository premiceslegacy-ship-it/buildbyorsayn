import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { publishVideoSchema, validateChapterTimeline, videoChapterSchema } from "@/lib/mux/adminLessons";
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
    .select("id,section_id,title,summary,transcript,deliverables,chapters,tier_required,status,mux_upload_id,mux_asset_id,playback_id,duration_seconds,error_code,published_at,approved_at,created_at")
    .eq("id", id)
    .maybeSingle();
  if (readError || !row) return NextResponse.json({ ok: false, error: "Vidéo introuvable." }, { status: 404 });

  const video = row as AdminVideoLessonRow;
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

  revalidatePath("/admin");
  revalidatePath(`/blocs/${video.section_id.slice(1).split("-")[0]}`);
  return NextResponse.json({
    ok: true,
    previousAssetId: typeof data[0]?.previous_mux_asset_id === "string" ? data[0].previous_mux_asset_id : null,
  });
}
