import "server-only";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { createMuxAdminClient } from "./adminServer";

export async function cleanupMuxAsset(muxAssetId: string, signal?: AbortSignal): Promise<boolean> {
  const admin = createAdminSupabase({ signal });
  const { data: row, error } = await admin
    .from("video_asset_cleanup")
    .select("id,status,attempts,updated_at")
    .eq("mux_asset_id", muxAssetId)
    .maybeSingle();
  if (error) throw new Error("La file de nettoyage vidéo est indisponible.");
  if (!row || row.status === "completed") return true;

  const attempts = Number.isInteger(row.attempts) ? row.attempts + 1 : 1;
  const { error: processingError } = await admin.from("video_asset_cleanup").update({
    status: "processing",
    attempts,
    updated_at: new Date().toISOString(),
  }).eq("id", row.id).in("status", ["pending", "failed", "processing"]);
  if (processingError) throw new Error("Le nettoyage Mux n'a pas pu être réservé.");

  try {
    await createMuxAdminClient().video.assets.delete(muxAssetId);
  } catch (cause) {
    const status = typeof cause === "object" && cause !== null && "status" in cause
      ? Number((cause as { status?: unknown }).status)
      : 0;
    if (status === 404) {
      const { error: missingError } = await admin.from("video_asset_cleanup").update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("id", row.id);
      if (missingError) throw new Error("Le nettoyage Mux n'a pas pu être confirmé.");
      return true;
    }
    const message = cause instanceof Error ? cause.message.slice(0, 500) : "Suppression Mux refusée.";
    const { error: failedError } = await admin.from("video_asset_cleanup").update({
      status: "failed",
      last_error: message,
      updated_at: new Date().toISOString(),
    }).eq("id", row.id);
    if (failedError) throw new Error("Le nettoyage Mux n'a pas pu être journalisé.");
    return false;
  }
  const { error: completedError } = await admin.from("video_asset_cleanup").update({
    status: "completed",
    last_error: null,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", row.id);
  if (completedError) throw new Error("Le nettoyage Mux n'a pas pu être confirmé.");
  return true;
}

const MAX_CLEANUP_PER_RUN = 20;
const RETRY_BASE_MS = 60_000;
const RETRY_MAX_MS = 60 * 60_000;
const STALE_PROCESSING_MS = 10 * 60_000;

export async function cleanupPendingMuxAssets(signal?: AbortSignal) {
  const admin = createAdminSupabase({ signal });
  const { data: rows, error } = await admin
    .from("video_asset_cleanup")
    .select("mux_asset_id,status,attempts,updated_at")
    .in("status", ["pending", "failed", "processing"])
    .order("created_at", { ascending: true })
    .limit(MAX_CLEANUP_PER_RUN);
  if (error) throw new Error("La file de nettoyage vidéo est indisponible.");

  const now = Date.now();
  let completed = 0;
  let failed = 0;
  let skipped = 0;
  for (const row of rows ?? []) {
    const updatedAt = Date.parse(row.updated_at);
    const attempts = Number.isInteger(row.attempts) ? row.attempts : 0;
    const retryDelay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * (2 ** Math.min(attempts, 6)));
    if (Number.isFinite(updatedAt) && row.status === "failed" && now - updatedAt < retryDelay) {
      skipped += 1;
      continue;
    }
    if (Number.isFinite(updatedAt) && row.status === "processing" && now - updatedAt < STALE_PROCESSING_MS) {
      skipped += 1;
      continue;
    }
    if (await cleanupMuxAsset(row.mux_asset_id, signal)) completed += 1;
    else failed += 1;
  }
  return { scanned: rows?.length ?? 0, completed, failed, skipped };
}

export async function cleanupQueuedAssetsForSlot(
  blocId: string,
  position: number,
  currentVideoId: string,
  signal?: AbortSignal,
) {
  const admin = createAdminSupabase({ signal });
  const { data: previousVideos, error: videosError } = await admin
    .from("video_lessons")
    .select("id")
    .eq("bloc_id", blocId)
    .eq("position", position)
    .neq("id", currentVideoId)
    .not("replaced_at", "is", null);
  if (videosError) throw new Error("Les anciennes vidéos ne peuvent pas être vérifiées.");
  const previousIds = (previousVideos ?? []).map((video) => video.id);
  if (previousIds.length === 0) return true;
  const { data: rows, error: queueError } = await admin
    .from("video_asset_cleanup")
    .select("mux_asset_id")
    .in("video_id", previousIds)
    .in("status", ["pending", "failed"]);
  if (queueError) throw new Error("La file de nettoyage vidéo est indisponible.");
  for (const row of rows ?? []) {
    if (!await cleanupMuxAsset(row.mux_asset_id, signal)) return false;
  }
  return true;
}
