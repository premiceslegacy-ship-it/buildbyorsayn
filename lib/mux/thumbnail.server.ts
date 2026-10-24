
import { createHash } from "node:crypto";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const VIDEO_THUMBNAIL_BUCKET = "video-thumbnails";
export const MAX_VIDEO_THUMBNAIL_BYTES = 1_500_000;
export const MIN_VIDEO_THUMBNAIL_WIDTH = 1_280;
export const MIN_VIDEO_THUMBNAIL_HEIGHT = 720;
const TARGET_ASPECT_RATIO = 16 / 9;
const ASPECT_TOLERANCE = 0.02;

type ThumbnailFormat = "jpeg" | "png" | "webp";
export type ValidatedVideoThumbnail = {
  bytes: Uint8Array;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  extension: "jpg" | "png" | "webp";
  width: number;
  height: number;
};

function readUint16(view: DataView, offset: number, littleEndian = false) {
  return view.getUint16(offset, littleEndian);
}

function readUint24(view: DataView, offset: number, littleEndian = false) {
  return littleEndian
    ? view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16)
    : (view.getUint8(offset) << 16) | (view.getUint8(offset + 1) << 8) | view.getUint8(offset + 2);
}

function jpegDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 3 < bytes.length) {
    while (offset < bytes.length && bytes[offset] !== 0xff) offset += 1;
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) break;
    const marker = bytes[offset++];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 1 >= bytes.length) return null;
    const segmentLength = readUint16(view, offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) return null;
    const isStartOfFrame = (marker >= 0xc0 && marker <= 0xc3)
      || (marker >= 0xc5 && marker <= 0xc7)
      || (marker >= 0xc9 && marker <= 0xcb)
      || (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame && segmentLength >= 7) {
      return { height: readUint16(view, offset + 3), width: readUint16(view, offset + 5) };
    }
    offset += segmentLength;
  }
  return null;
}

function pngDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 24 || !bytes.subarray(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index])) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (String.fromCharCode(...bytes.subarray(12, 16)) !== "IHDR") return null;
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function webpDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 16 || String.fromCharCode(...bytes.subarray(0, 4)) !== "RIFF" || String.fromCharCode(...bytes.subarray(8, 12)) !== "WEBP") return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const kind = String.fromCharCode(...bytes.subarray(offset, offset + 4));
    const size = view.getUint32(offset + 4, true);
    const payload = offset + 8;
    if (payload + size > bytes.length) return null;
    if (kind === "VP8X" && size >= 10) {
      return { width: readUint24(view, payload + 4, true) + 1, height: readUint24(view, payload + 7, true) + 1 };
    }
    if (kind === "VP8 " && size >= 10 && bytes[payload + 3] === 0x9d && bytes[payload + 4] === 0x01 && bytes[payload + 5] === 0x2a) {
      return { width: readUint16(view, payload + 6, true) & 0x3fff, height: readUint16(view, payload + 8, true) & 0x3fff };
    }
    if (kind === "VP8L" && size >= 5 && bytes[payload] === 0x2f) {
      const width = 1 + (bytes[payload + 1] | (bytes[payload + 2] << 8) | ((bytes[payload + 3] & 0x3f) << 16));
      const height = 1 + ((bytes[payload + 3] >> 6) | (bytes[payload + 4] << 2) | ((bytes[payload + 5] & 0x0f) << 10));
      return { width, height };
    }
    offset = payload + size + (size % 2);
  }
  return null;
}

function formatFor(bytes: Uint8Array): { format: ThumbnailFormat; dimensions: { width: number; height: number } | null } {
  return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    ? { format: "jpeg", dimensions: jpegDimensions(bytes) }
    : bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71
      ? { format: "png", dimensions: pngDimensions(bytes) }
      : { format: "webp", dimensions: webpDimensions(bytes) };
}

export function validateVideoThumbnailBytes(input: Uint8Array): ValidatedVideoThumbnail {
  if (input.byteLength > MAX_VIDEO_THUMBNAIL_BYTES) throw new Error("La miniature dépasse 1,5 Mo.");
  const { format, dimensions } = formatFor(input);
  if (!dimensions || dimensions.width < MIN_VIDEO_THUMBNAIL_WIDTH || dimensions.height < MIN_VIDEO_THUMBNAIL_HEIGHT) {
    throw new Error("La miniature doit mesurer au moins 1280 × 720 pixels.");
  }
  if (Math.abs(dimensions.width / dimensions.height - TARGET_ASPECT_RATIO) / TARGET_ASPECT_RATIO > ASPECT_TOLERANCE) {
    throw new Error("La miniature doit respecter un format 16:9 à 2 % près.");
  }
  const contentType = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
  return {
    bytes: input,
    contentType,
    extension: format === "jpeg" ? "jpg" : format,
    width: dimensions.width,
    height: dimensions.height,
  };
}

export function decodeVideoThumbnailBase64(value: string): Uint8Array {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 === 1) throw new Error("Le fichier de miniature est invalide.");
  const bytes = Uint8Array.from(Buffer.from(value, "base64"));
  if (bytes.byteLength === 0) throw new Error("Le fichier de miniature est vide.");
  return bytes;
}

export async function storeVideoThumbnail(videoId: string, input: Uint8Array, signal?: AbortSignal) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(videoId)) {
    throw new Error("La vidéo est invalide.");
  }
  const validated = validateVideoThumbnailBytes(input);
  const hash = createHash("sha256").update(validated.bytes).digest("hex").slice(0, 12);
  const path = `${videoId}/${hash}.${validated.extension}`;
  const admin = createAdminSupabase({ signal });
  const { error } = await admin.storage.from(VIDEO_THUMBNAIL_BUCKET).upload(path, Buffer.from(validated.bytes), {
    cacheControl: "31536000",
    contentType: validated.contentType,
    upsert: true,
  });
  if (error) throw new Error("La miniature n'a pas pu être enregistrée.");
  const { data } = admin.storage.from(VIDEO_THUMBNAIL_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) throw new Error("L'adresse publique de la miniature est indisponible.");
  return { ...validated, path, publicUrl: data.publicUrl };
}

export async function removeStoredVideoThumbnail(path: string, signal?: AbortSignal) {
  if (!path) return;
  const { error } = await createAdminSupabase({ signal }).storage.from(VIDEO_THUMBNAIL_BUCKET).remove([path]);
  if (error) throw new Error("L'ancienne miniature n'a pas pu être supprimée.");
}

export function storedVideoThumbnailPath(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith("storage:")) return null;
  const path = value.slice("storage:".length);
  return /^[0-9a-f-]{36}\/[0-9a-f]{12}\.(?:jpg|png|webp)$/i.test(path) ? path : null;
}

