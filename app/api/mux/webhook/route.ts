import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { readBoundedBody } from "@/lib/mcp/http";
import { pickSignedPlaybackId } from "@/lib/mux/lessons";
import { MAX_ADMIN_VIDEO_BYTES, parseMuxPassthrough } from "@/lib/mux/adminLessons";
import { createMuxAdminClient } from "@/lib/mux/adminServer";
import { syncMuxTranscriptForReadyAsset } from "@/lib/mux/transcript.server";

const MAX_MUX_WEBHOOK_BYTES = 256 * 1024;
async function reserveTrackEvent(admin: SupabaseClient, eventId: string, eventType: string, lockOwner: string) {
  return admin.rpc("reserve_mux_webhook_event", {
    p_event_id: eventId,
    p_event_type: eventType,
    p_lock_owner: lockOwner,
  });
}

async function completeTrackEvent(admin: SupabaseClient, eventId: string, lockOwner: string): Promise<boolean> {
  const { data, error } = await admin.rpc("complete_mux_webhook_event", {
    p_event_id: eventId,
    p_lock_owner: lockOwner,
  });
  return !error && data === true;
}
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
    const lockOwner = crypto.randomUUID();
    const { data: reservation, error: reservationError } = await reserveTrackEvent(
      admin,
      event.id,
      event.type,
      lockOwner,
    );
    if (reservationError || !["new", "retry", "duplicate", "in_progress"].includes(String(reservation))) {
      return NextResponse.json({ ok: false }, { status: 503 });
    }
    if (reservation === "duplicate") return NextResponse.json({ ok: true });
    if (reservation === "in_progress") return NextResponse.json({ ok: false, error: "in_progress" }, { status: 503 });
    const { data: video, error: videoError } = await admin.from("video_lessons")
      .select("id,playback_id")
      .eq("mux_asset_id", asset.asset_id)
      .is("published_at", null)
      .is("replaced_at", null)
      .maybeSingle();
    if (videoError) {
      return NextResponse.json({ ok: false }, { status: 503 });
    }
    if (!video?.playback_id) {
      if (!await completeTrackEvent(admin, event.id, lockOwner)) return NextResponse.json({ ok: false }, { status: 503 });
      return NextResponse.json({ ok: true });
    }
    if (event.type === "video.asset.track.errored") {
      const { error } = await admin.from("video_lessons").update({
        error_code: "mux_transcript_errored",
        updated_at: new Date().toISOString(),
      }).eq("id", video.id).is("published_at", null);
      if (error) {
        console.error("mux.webhook.transcript_error_update_failed");
        return NextResponse.json({ ok: false }, { status: 503 });
      }
      if (!await completeTrackEvent(admin, event.id, lockOwner)) return NextResponse.json({ ok: false }, { status: 503 });
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
      const { error: updateError } = await admin.from("video_lessons").update({
        error_code: "mux_transcript_fetch_failed",
        updated_at: new Date().toISOString(),
      }).eq("id", video.id).is("published_at", null);
      if (updateError) console.error("mux.webhook.transcript_error_update_failed");
      console.error("mux.webhook.transcript_fetch_failed");
      return NextResponse.json({ ok: false, error: "mux_transcript_fetch_failed" }, { status: 503 });
    }
    const { error } = await admin.from("video_lessons").update({
      error_code: null,
      updated_at: new Date().toISOString(),
    }).eq("id", video.id).is("published_at", null);
    if (error) {
      console.error("mux.webhook.transcript_clear_failed");
      return NextResponse.json({ ok: false }, { status: 503 });
    }
    if (!await completeTrackEvent(admin, event.id, lockOwner)) return NextResponse.json({ ok: false }, { status: 503 });
    return NextResponse.json({ ok: true });
  }

  const videoId = parseMuxPassthrough(asset.passthrough);
  if (!videoId || !asset.upload_id) return NextResponse.json({ ok: true });

  let update: Record<string, unknown>;
  if (event.type === "video.asset.ready") {
    const playbackId = pickSignedPlaybackId(asset.playback_ids);
    const durationSeconds = Math.round(asset.duration ?? 0);
    const sizeBytes = Number(asset.filesize);
    const tooLarge = Number.isFinite(sizeBytes) && sizeBytes > MAX_ADMIN_VIDEO_BYTES;
    if (tooLarge) await createMuxAdminClient().video.assets.delete(asset.id).catch(() => undefined);
    update = !tooLarge && playbackId && durationSeconds > 0
      ? {
          status: "ready",
          mux_asset_id: asset.id,
          playback_id: playbackId,
          duration_seconds: durationSeconds,
          error_code: null,
        }
      : {
          status: "errored",
          mux_asset_id: asset.id,
          error_code: tooLarge ? "asset_too_large" : playbackId ? "duration_missing" : "signed_playback_missing",
        };
  } else if (event.type === "video.asset.errored") {
    update = {
      status: "errored",
      mux_asset_id: asset.id,
      error_code: "mux_asset_errored",
    };
  } else {
    update = {
      status: "preparing",
      mux_asset_id: asset.id,
    };
  }

  const { data: outcome, error } = await admin.rpc("process_mux_asset_webhook", {
    p_event_id: event.id,
    p_event_type: event.type,
    p_video_id: videoId,
    p_upload_id: asset.upload_id,
    p_update: update,
    p_audit_action: event.type === "video.asset.ready"
      ? "mux.asset_ready"
      : event.type === "video.asset.errored"
        ? "mux.asset_errored"
        : "mux.asset_created",
    p_audit_result: event.type === "video.asset.errored" ? "failed" : "completed",
  });
  if (error) {
    console.error("mux.webhook.transaction_failed");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  if (outcome !== "processed" && outcome !== "noop" && outcome !== "duplicate") {
    console.error("mux.webhook.transaction_invalid_result");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
