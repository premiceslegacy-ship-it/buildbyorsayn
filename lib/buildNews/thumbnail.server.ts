import "server-only";

import { createHash } from "node:crypto";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { signMuxPlaybackTokens } from "@/lib/mux/transcript.server";
import {
  MAX_VIDEO_THUMBNAIL_BYTES,
  storedVideoThumbnailPath,
  validateVideoThumbnailBytes,
} from "@/lib/mux/thumbnail.server";

const BUCKET = "video-thumbnails";
const NEWS_PATH = /^news\/[0-9a-f-]{36}\/[0-9a-f]{12}\.(?:jpg|png|webp)$/i;

type ThumbnailSourceVideo = {
  id: string;
  playback_id: string | null;
  thumbnail: string | null;
};

function requestPath(requestId: string, bytes: Uint8Array, extension: string) {
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  return `news/${requestId}/${hash}.${extension}`;
}

async function downloadMuxThumbnail(playbackId: string, thumbnail: string): Promise<Uint8Array> {
  const time = thumbnail.startsWith("mux:") ? Number(thumbnail.slice(4)) : 0;
  if (!Number.isFinite(time) || time < 0) throw new Error("La miniature de la vidéo est invalide.");
  const tokens = await signMuxPlaybackTokens(playbackId);
  const query = new URLSearchParams({ time: String(time), width: "1280", token: tokens.thumbnail });
  const response = await fetch(`https://image.mux.com/${encodeURIComponent(playbackId)}/thumbnail.jpg?${query}`, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("La miniature Mux est indisponible.");
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_VIDEO_THUMBNAIL_BYTES) throw new Error("La miniature dépasse 1,5 Mo.");
  return bytes;
}

export async function readVideoThumbnail(video: ThumbnailSourceVideo): Promise<Uint8Array> {
  if (!video.thumbnail) throw new Error("La vidéo n'a pas de miniature.");
  const admin = createAdminSupabase();
  const storedPath = storedVideoThumbnailPath(video.thumbnail);
  if (storedPath) {
    const { data, error } = await admin.storage.from(BUCKET).download(storedPath);
    if (error || !data) throw new Error("La miniature de la vidéo est indisponible.");
    return new Uint8Array(await data.arrayBuffer());
  }
  if (video.thumbnail.startsWith("mux:") && video.playback_id) {
    return downloadMuxThumbnail(video.playback_id, video.thumbnail);
  }
  throw new Error("La miniature de la vidéo est indisponible.");
}

export async function storeBuildNewsThumbnail(requestId: string, input: Uint8Array) {
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) throw new Error("La demande est invalide.");
  const validated = validateVideoThumbnailBytes(input);
  const path = requestPath(requestId, validated.bytes, validated.extension);
  const admin = createAdminSupabase();
  const { error } = await admin.storage.from(BUCKET).upload(path, Buffer.from(validated.bytes), {
    cacheControl: "31536000",
    contentType: validated.contentType,
    upsert: false,
  });
  if (error) throw new Error("La miniature n'a pas pu être enregistrée.");
  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  if (!data.publicUrl || !/^https:\/\//.test(data.publicUrl)) {
    throw new Error("L'adresse publique de la miniature est indisponible.");
  }
  return { path, publicUrl: data.publicUrl };
}
export async function removeBuildNewsRequestThumbnails(requestId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) return;
  const admin = createAdminSupabase();
  const { data, error } = await admin.storage.from(BUCKET).list(`news/${requestId}`);
  if (error) throw new Error("Les miniatures préparées n'ont pas pu être listées.");
  const paths = (data ?? [])
    .map((entry) => `news/${requestId}/${entry.name}`)
    .filter((path) => NEWS_PATH.test(path));
  if (paths.length > 0) {
    const { error: removeError } = await admin.storage.from(BUCKET).remove(paths);
    if (removeError) throw new Error("Les miniatures préparées n'ont pas pu être supprimées.");
  }
}
export async function assertBuildNewsThumbnail(path: string) {
  if (!NEWS_PATH.test(path)) throw new Error("La miniature préparée est invalide.");
  const { data, error } = await createAdminSupabase().storage.from(BUCKET).download(path);
  if (error || !data) throw new Error("La miniature préparée est indisponible.");
  validateVideoThumbnailBytes(new Uint8Array(await data.arrayBuffer()));
}

export async function removeBuildNewsThumbnail(path: string) {
  if (!NEWS_PATH.test(path)) return;
  const { error } = await createAdminSupabase().storage.from(BUCKET).remove([path]);
  if (error) throw new Error("La miniature préparée n'a pas pu être supprimée.");
}
