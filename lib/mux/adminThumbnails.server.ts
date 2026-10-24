import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { storedVideoThumbnailPath } from "./thumbnail.server";
import { signMuxThumbnailUrl } from "./transcript.server";

type RowWithThumbnail = { thumbnail?: string | null; playback_id?: string | null };

/** Ajoute à chaque vidéo l'adresse d'image que l'admin affiche : fichier déposé, sinon image Mux à la seconde choisie. */
export async function withAdminThumbnailUrls<T extends RowWithThumbnail>(admin: SupabaseClient, rows: readonly T[]): Promise<(T & { thumbnailUrl: string | null })[]> {
  return Promise.all(rows.map(async (row) => {
    const path = storedVideoThumbnailPath(row.thumbnail);
    if (path) return { ...row, thumbnailUrl: admin.storage.from("video-thumbnails").getPublicUrl(path).data.publicUrl };
    const time = typeof row.thumbnail === "string" && row.thumbnail.startsWith("mux:") ? Number(row.thumbnail.slice(4)) : null;
    if (time === null || !Number.isFinite(time) || typeof row.playback_id !== "string") return { ...row, thumbnailUrl: null };
    try {
      return { ...row, thumbnailUrl: await signMuxThumbnailUrl(row.playback_id, { time, width: 640 }) };
    } catch {
      return { ...row, thumbnailUrl: null };
    }
  }));
}
