import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createMuxAdminClient, getVerifiedAdmin, recordAdminAction } from "@/lib/mux/adminServer";

type VideoRouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: VideoRouteContext) {
  const user = await getVerifiedAdmin();
  if (!user) return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ ok: false, error: "Vidéo invalide." }, { status: 400 });
  }

  const admin = createAdminSupabase({ signal: request.signal });
  const { data: video, error } = await admin
    .from("video_lessons")
    .select("mux_upload_id,status,published_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !video) return NextResponse.json({ ok: false, error: "Vidéo introuvable." }, { status: 404 });
  if (video.published_at || video.status !== "waiting") {
    return NextResponse.json({ ok: false, error: "Seul un envoi en attente peut être annulé." }, { status: 409 });
  }

  try {
    await createMuxAdminClient().video.uploads.cancel(video.mux_upload_id, { signal: request.signal });
    const { error: updateError } = await admin
      .from("video_lessons")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "waiting");
    if (updateError) throw updateError;
    await recordAdminAction({
      actorUserId: user.id,
      action: "video.upload_cancel",
      targetType: "video_lesson",
      targetId: id,
      result: "cancelled",
      approved: true,
    });
    return NextResponse.json({ ok: true });
  } catch {
    console.error("admin.video.cancel_failed");
    return NextResponse.json({ ok: false, error: "L'annulation a échoué." }, { status: 503 });
  }
}
