import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  MAX_VIDEO_THUMBNAIL_BYTES,
  validateVideoThumbnailBytes,
} from "../lib/mux/thumbnail.server";

function png(width: number, height: number) {
  const bytes = new Uint8Array(24);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10], 0);
  bytes.set([0, 0, 0, 13, 73, 72, 68, 82], 8);
  const view = new DataView(bytes.buffer);
  view.setUint32(16, width);
  view.setUint32(20, height);
  return bytes;
}

test("miniatures: refuse un faux JPEG", () => {
  assert.throws(() => validateVideoThumbnailBytes(new Uint8Array([0xff, 0xd8, 0xff, 0x00])), /1280|invalide/);
});

test("miniatures: refuse un format 4:3", () => {
  assert.throws(() => validateVideoThumbnailBytes(png(1280, 960)), /16:9/);
});

test("miniatures: refuse un fichier trop lourd avant le décodage", () => {
  assert.throws(() => validateVideoThumbnailBytes(new Uint8Array(MAX_VIDEO_THUMBNAIL_BYTES + 1)), /1,5 Mo/);
});

test("miniatures: accepte un PNG 16:9 aux dimensions requises", () => {
  const result = validateVideoThumbnailBytes(png(1280, 720));
  assert.deepEqual({ contentType: result.contentType, extension: result.extension, width: result.width, height: result.height }, {
    contentType: "image/png",
    extension: "png",
    width: 1280,
    height: 720,
  });
});
test("miniatures: la migration crée le bucket public et supprime les anciennes images au remplacement", async () => {
  const [migration, cleanup, blocData, adminActions] = await Promise.all([
    readFile("supabase/migrations/20261024110000_block_video_lessons.sql", "utf8"),
    readFile("lib/mux/assetCleanup.server.ts", "utf8"),
    readFile("lib/blocData.server.ts", "utf8"),
    readFile("app/admin/actions.ts", "utf8"),
  ]);
  assert.match(migration, /video-thumbnails/);
  assert.match(migration, /file_size_limit[\s\S]*1500000/);
  assert.match(migration, /storage_path/);
  assert.match(cleanup, /removeStoredVideoThumbnail/);
  assert.match(blocData, /storedVideoThumbnailPath/);
  assert.match(blocData, /muxThumbnailUrl/);
  assert.match(blocData, /\/da\/mini\/b\$\{displayNumberFromBlocId/);
  assert.match(adminActions, /storedVideoThumbnailPath\(video\.thumbnail\)[\s\S]*removeStoredVideoThumbnail/);
});
