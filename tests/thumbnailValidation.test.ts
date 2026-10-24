import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_VIDEO_THUMBNAIL_BYTES,
  storedVideoThumbnailPath,
  validateVideoThumbnailBytes,
} from "../lib/mux/thumbnail.server";

function concat(...parts: Uint8Array[]) {
  const bytes = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return bytes;
}

function pngChunk(type: string, payload: Uint8Array) {
  const chunk = new Uint8Array(12 + payload.length);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, payload.length);
  chunk.set([...type].map((char) => char.charCodeAt(0)), 4);
  chunk.set(payload, 8);
  return chunk;
}

function png(width: number, height: number) {
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  header[8] = 8;
  header[9] = 2;
  return concat(
    Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", Uint8Array.from([0])),
    pngChunk("IEND", new Uint8Array()),
  );
}

function jpeg(width: number, height: number) {
  const frame = new Uint8Array(17);
  const view = new DataView(frame.buffer);
  view.setUint16(0, 17);
  frame[2] = 8;
  view.setUint16(3, height);
  view.setUint16(5, width);
  frame[7] = 3;
  return concat(Uint8Array.from([0xff, 0xd8, 0xff, 0xc0]), frame, Uint8Array.from([0xff, 0xd9]));
}

function webpChunk(type: string, payload: Uint8Array) {
  const chunk = new Uint8Array(8 + payload.length + (payload.length % 2));
  const view = new DataView(chunk.buffer);
  chunk.set([...type].map((char) => char.charCodeAt(0)), 0);
  view.setUint32(4, payload.length, true);
  chunk.set(payload, 8);
  return chunk;
}

function webp(type: "VP8 " | "VP8L" | "VP8X", width: number, height: number) {
  const payload = type === "VP8X"
    ? Uint8Array.from([0, 0, 0, 0, (width - 1) & 0xff, (width - 1) >> 8 & 0xff, (width - 1) >> 16 & 0xff, (height - 1) & 0xff, (height - 1) >> 8 & 0xff, (height - 1) >> 16 & 0xff])
    : type === "VP8 "
      ? Uint8Array.from([0, 0, 0, 0x9d, 0x01, 0x2a, width & 0xff, width >> 8 & 0x3f, height & 0xff, height >> 8 & 0x3f])
      : Uint8Array.from([0x2f, (width - 1) & 0xff, (width - 1) >> 8 & 0xff, ((width - 1) >> 16 & 0x3f) | (((height - 1) & 0x3) << 6), (height - 1) >> 2 & 0xff, (height - 1) >> 10 & 0x3f]);
  const chunk = webpChunk(type, payload);
  const header = new Uint8Array(12);
  const view = new DataView(header.buffer);
  header.set([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]);
  view.setUint32(4, 4 + chunk.length, true);
  return concat(header, chunk);
}

test("miniatures: refuse un faux JPEG ou PNG incomplet", () => {
  assert.throws(() => validateVideoThumbnailBytes(new Uint8Array([0xff, 0xd8, 0xff, 0x00])), /1280|invalide/);
  assert.throws(() => validateVideoThumbnailBytes(png(1280, 720).subarray(0, 24)), /1280|invalide/);
});

test("miniatures: refuse un format 4:3 et les fichiers trop lourds", () => {
  assert.throws(() => validateVideoThumbnailBytes(png(1280, 960)), /16:9/);
  assert.throws(() => validateVideoThumbnailBytes(new Uint8Array(MAX_VIDEO_THUMBNAIL_BYTES + 1)), /1,5 Mo/);
});

test("miniatures: accepte les conteneurs JPEG, PNG et les trois variantes WebP en 1280×720", () => {
  for (const [bytes, contentType, extension] of [
    [jpeg(1280, 720), "image/jpeg", "jpg"],
    [png(1280, 720), "image/png", "png"],
    [webp("VP8 ", 1280, 720), "image/webp", "webp"],
    [webp("VP8L", 1280, 720), "image/webp", "webp"],
    [webp("VP8X", 1280, 720), "image/webp", "webp"],
  ] as const) {
    const result = validateVideoThumbnailBytes(bytes);
    assert.deepEqual({ contentType: result.contentType, extension: result.extension, width: result.width, height: result.height }, { contentType, extension, width: 1280, height: 720 });
  }
});

test("miniatures: accepte un PNG valide de 1,4 Mo sous la limite serveur", () => {
  const base = png(1280, 720);
  const large = concat(base.subarray(0, base.length - 12), pngChunk("tEXt", new Uint8Array(1_400_000)), base.subarray(base.length - 12));
  assert.equal(large.byteLength < MAX_VIDEO_THUMBNAIL_BYTES, true);
  assert.equal(validateVideoThumbnailBytes(large).width, 1280);
});

test("miniatures: chemins storage valides et invalides", () => {
  assert.equal(storedVideoThumbnailPath("storage:123e4567-e89b-12d3-a456-426614174000/0123456789ab.webp"), "123e4567-e89b-12d3-a456-426614174000/0123456789ab.webp");
  assert.equal(storedVideoThumbnailPath("storage:not-a-path"), null);
});
