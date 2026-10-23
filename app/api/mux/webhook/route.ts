import { NextRequest, NextResponse } from "next/server";
import { readBoundedBody } from "@/lib/mcp/http";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { pickSignedPlaybackId } from "@/lib/mux/lessons";
import { parseMuxPassthrough } from "@/lib/mux/adminLessons";
import { createMuxAdminClient } from "@/lib/mux/adminServer";
import { syncMuxTranscriptForReadyAsset } from "@/lib/mux/transcript.server";

const MAX_MUX_WEBHOOK_BYTES = 256 * 1024;

export async function POST(request: NextRequest) {
  const bounded = await readBoundedBody(request, MAX_MUX_WEBHOOK_BYTES);
  if (bounded.ok === false) {
    return NextResponse.json({ ok: false }, { status: bounded.reason === "too_large" ? 413 : 400 });
  }

  let event;
  try {
    event = await createMuxAdminClient({ webhook: true }).webhooks.unwrap(bounded.text, request.headers);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (![
    "video.asset.created",
    "video.asset.ready",
    "video.asset.errored",
    "video.asset.track.ready",
    "video.asset.track.errored",
  ].includes(event.type)) {
    return NextResponse.json({ ok: true });
  }

  const asset = event.data;
  const admin = createAdminSupabase({ signal: request.signal });

  if (event.type === "video.asset.track.ready" || event.type === "video.asset.track.errored") {
    const isGeneratedSubtitle = asset.type === "text"
      && asset.text_type === "subtitles"
      && (asset.passthrough === "build-fr-auto" || asset.text_source === "generated_vod");
    if (!isGeneratedSubtitle || !asset.asset_id) return NextResponse.json({ ok: true });
    const { data: video, error: videoError } = await admin.from("video_lessons")
      .select("id,playback_id")
      .eq("mux_asset_id", asset.asset_id)
      .is("published_at", null)
      .maybeSingle();
    if (videoError) return NextResponse.json({ ok: false }, { status: 503 });
    if (!video?.playback_id) return NextResponse.json({ ok: true });
    if (event.type === "video.asset.track.errored") {
      await admin.from("video_lessons").update({
        error_code: "mux_transcript_errored",
        updated_at: new Date().toISOString(),
      }).eq("id", video.id).is("published_at", null);
      return NextResponse.json({ ok: true });
    }
    try {
      await syncMuxTranscriptForReadyAsset({
        videoId: video.id,
        assetId: asset.asset_id,
        playbackId: video.playback_id,
        signal: request.signal,
      });
    } catch {
      await admin.from("video_lessons").update({
        error_code: "mux_transcript_fetch_failed",
        updated_at: new Date().toISOString(),
      }).eq("id", video.id).is("published_at", null);
      console.error("mux.webhook.transcript_fetch_failed");
      return NextResponse.json({ ok: false, error: "mux_transcript_fetch_failed" }, { status: 503 });
    }
    await admin.from("video_lessons").update({
      error_code: null,
      updated_at: new Date().toISOString(),
    }).eq("id", video.id).is("published_at", null);
    return NextResponse.json({ ok: true });
  }

  const videoId = parseMuxPassthrough(asset.passthrough);
  if (!videoId || !asset.upload_id) return NextResponse.json({ ok: true });

  let update: Record<string, unknown>;
  if (event.type === "video.asset.ready") {
    const playbackId = pickSignedPlaybackId(asset.playback_ids);
    const durationSeconds = Math.round(asset.duration ?? 0);
    update = playbackId && durationSeconds > 0
      ? {
          status: "ready",
          mux_asset_id: asset.id,
          playback_id: playbackId,
          duration_seconds: durationSeconds,
          error_code: null,
          updated_at: new Date().toISOString(),
        }
      : {
          status: "errored",
          mux_asset_id: asset.id,
          error_code: playbackId ? "duration_missing" : "signed_playback_missing",
          updated_at: new Date().toISOString(),
        };
  } else if (event.type === "video.asset.errored") {
    update = {
      status: "errored",
      mux_asset_id: asset.id,
      error_code: "mux_asset_errored",
      updated_at: new Date().toISOString(),
    };
  } else {
    update = {
      status: "preparing",
      mux_asset_id: asset.id,
      updated_at: new Date().toISOString(),
    };
  }

  const { data, error } = await admin
    .from("video_lessons")
    .update(update)
    .eq("id", videoId)
    .eq("mux_upload_id", asset.upload_id)
    .is("published_at", null)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("mux.webhook.video_update_failed");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  if (!data) return NextResponse.json({ ok: true });

  const { error: auditError } = await admin.from("admin_action_audit").insert({
    actor_user_id: null,
    action: event.type === "video.asset.ready" ? "mux.asset_ready" : event.type === "video.asset.errored" ? "mux.asset_errored" : "mux.asset_created",
    target_type: "video_lesson",
    target_id: videoId,
    result: event.type === "video.asset.errored" ? "failed" : "completed",
    details: { eventId: event.id },
  });
  if (auditError) {
    console.error("mux.webhook.audit_failed");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
