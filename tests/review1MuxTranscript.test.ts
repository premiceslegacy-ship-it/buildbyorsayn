import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";
import type { MuxTranscriptClient } from "../lib/mux/transcript";

if (process.env.REVIEW1_MUX_INNER !== "1") {
  test("la transcription Mux ne peut écrire que la ligne vidéo et asset attendue", () => {
    const result = spawnSync(process.execPath, [
      "--import", "./tests/fixtures/serverOnlyStub.mjs",
      "--import", "tsx",
      "--experimental-test-module-mocks",
      "--test",
      "tests/review1MuxTranscript.test.ts",
    ], {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "test", REVIEW1_MUX_INNER: "1" },
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  });
} else {
  const file = (path: string) => pathToFileURL(resolve(path)).href;
  const writes: Array<{ values: unknown; filters: Array<[string, unknown]>; nullFilters: string[] }> = [];
  let matched = true;
  mock.module(file("lib/supabase/admin.ts"), {
    namedExports: {
      createAdminSupabase: () => ({
        from: () => {
          const state = { values: null as unknown, filters: [] as Array<[string, unknown]>, nullFilters: [] as string[] };
          const query = {
            update(values: unknown) { state.values = values; return query; },
            eq(column: string, value: unknown) { state.filters.push([column, value]); return query; },
            is(column: string) { state.nullFilters.push(column); return query; },
            select() { return query; },
            async maybeSingle() {
              writes.push(state);
              return { data: matched ? { id: "video-expected" } : null, error: null };
            },
          };
          return query;
        },
      }),
    },
  });

  const { syncMuxTranscriptForReadyAsset } = await import("../lib/mux/transcript.server");
  const client: MuxTranscriptClient = {
    async retrieveAsset() {
      return { tracks: [{ id: "track-fr", type: "text", text_type: "subtitles", passthrough: "build-fr-auto", status: "ready" }] };
    },
    async signPlayback() { return "signed"; },
    async fetchVtt() { return "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nTranscription assez longue pour être enregistrée."; },
  };

  test("l'écriture cumule id, mux_asset_id et absence de publication", async () => {
    await syncMuxTranscriptForReadyAsset({
      videoId: "video-expected",
      assetId: "asset-expected",
      playbackId: "playback-expected",
      client,
    });
    assert.deepEqual(writes[0].filters, [["id", "video-expected"], ["mux_asset_id", "asset-expected"]]);
    assert.deepEqual(writes[0].nullFilters, ["published_at"]);
    assert.match(JSON.stringify(writes[0].values), /Transcription assez longue/);
  });

  test("une ligne qui ne correspond plus fait échouer l'écriture", async () => {
    matched = false;
    await assert.rejects(() => syncMuxTranscriptForReadyAsset({
      videoId: "video-expected",
      assetId: "asset-replaced",
      playbackId: "playback-expected",
      client,
    }), /n'a pas pu être enregistrée/);
  });

  test("le client serveur Mux ne construit aucune URL fournie par l'appelant", async () => {
    const source = await readFile("lib/mux/transcript.server.ts", "utf8");
    assert.doesNotMatch(source, /\bfetch\s*\(|new URL\s*\(/);
    assert.match(source, /mux\.video\.playback\.track\(playbackId, trackId, \{ token \}\)/);
  });
}
