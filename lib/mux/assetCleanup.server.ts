import "server-only";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { createMuxAdminClient } from "./adminServer";

export async function cleanupMuxAsset(muxAssetId: string, signal?: AbortSignal): Promise<boolean> {
  const admin = createAdminSupabase({ signal });
  const { data: row, error } = await admin
    .from("video_asset_cleanup")
    .select("id,status,attempts")
    .eq("mux_asset_id", muxAssetId)
    .maybeSingle();
  if (error) throw new Error("La file de nettoyage vidéo est indisponible.");
  if (!row || row.status === "completed") return true;

  const attempts = Number.isInteger(row.attempts) ? row.attempts + 1 : 1;
  const { error: processingError } = await admin.from("video_asset_cleanup").update({
    status: "processing",
    attempts,
    updated_at: new Date().toISOString(),
  }).eq("id", row.id).in("status", ["pending", "failed"]);
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
