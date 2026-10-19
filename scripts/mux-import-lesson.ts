import { existsSync, openAsBlob, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import Mux from "@mux/ts";
import { applyImportedLesson, pickSignedPlaybackId, serializeLessonsFile, type LessonsFile } from "../lib/mux/lessons";

const LESSONS_PATH = resolve(process.cwd(), "lib/blocLessons.json");
const POLL_MS = 3_000;
const TIMEOUT_MS = 15 * 60_000;

const fail = (message: string): never => { console.error(message); process.exit(1); };
const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

async function main() {
  const [sectionId, videoPath] = process.argv.slice(2);
  if (!sectionId || !videoPath) fail("Usage: npm run mux:import -- <sectionId> <file.mp4>");

  const file = JSON.parse(readFileSync(LESSONS_PATH, "utf8")) as LessonsFile;
  if (!file.lessons.some((lesson) => lesson.sectionId === sectionId)) fail(`No lesson entry for section ${sectionId} in lib/blocLessons.json`);
  if (!existsSync(videoPath)) fail(`File not found: ${videoPath}`);

  const mux = new Mux();
  const upload = await mux.video.uploads.create({
    cors_origin: "*",
    new_asset_settings: { playback_policies: ["signed"], video_quality: "basic", passthrough: sectionId },
  });
  const put = await fetch(upload.url, { method: "PUT", body: await openAsBlob(videoPath) });
  if (!put.ok) fail(`Upload failed: ${put.status}`);

  const deadline = Date.now() + TIMEOUT_MS;
  let assetId: string | undefined;
  while (!assetId) {
    if (Date.now() > deadline) fail("Timed out waiting for Mux to create the asset.");
    await sleep(POLL_MS);
    assetId = (await mux.video.uploads.retrieve(upload.id)).asset_id ?? undefined;
  }

  for (;;) {
    const asset = await mux.video.assets.retrieve(assetId);
    if (asset.status === "errored") fail(`Mux asset ${assetId} errored.`);
    if (asset.status === "ready") {
      const playbackId = pickSignedPlaybackId(asset.playback_ids);
      if (!playbackId) fail("Asset has no signed playback id; refusing to use a public one.");
      const { file: updated, previousAssetId } = applyImportedLesson(file, sectionId, {
        muxAssetId: assetId,
        playbackId: playbackId!,
        durationSeconds: Math.round(asset.duration ?? 0),
      });
      writeFileSync(LESSONS_PATH, serializeLessonsFile(updated));
      if (previousAssetId) console.log(`Ancien asset à supprimer dans le dashboard Mux : ${previousAssetId}`);
      console.log(`Imported ${sectionId}: asset ${assetId}, playback ${playbackId}`);
      return;
    }
    if (Date.now() > deadline) fail(`Timed out waiting for asset ${assetId} to be ready.`);
    await sleep(POLL_MS);
  }
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
