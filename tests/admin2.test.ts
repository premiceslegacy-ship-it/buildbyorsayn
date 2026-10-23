import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildNewsInputSchema } from "../lib/buildNews/model";
import { mergeNouveautesItems } from "../lib/nouveautes/videos";
import {
  MuxTranscriptUnavailableError,
  parseMuxVtt,
  recoverMuxTranscript,
  selectMuxGeneratedSubtitleTrack,
  type MuxTranscriptClient,
} from "../lib/mux/transcript";

test("build_news limite les champs et réserve l'écriture au service role après contrôle admin", async () => {
  const [migration, server] = await Promise.all([
    readFile("supabase/migrations/20261023170000_build_news.sql", "utf8"),
    readFile("lib/buildNews/server.ts", "utf8"),
  ]);
  assert.match(migration, /title text not null check \(char_length\(title\) between 1 and 160\)/);
  assert.match(migration, /sentence text not null check \(char_length\(sentence\) between 1 and 500\)/);
  assert.match(migration, /force row level security/);
  assert.match(migration, /create policy build_news_member_read[\s\S]*for select[\s\S]*to authenticated[\s\S]*using \(true\)/);
  assert.match(migration, /revoke all on table public\.build_news from anon, authenticated/);
  assert.match(migration, /grant select on table public\.build_news to authenticated/);
  assert.doesNotMatch(migration, /to anon/);
  assert.doesNotMatch(migration, /for (insert|update|delete|all)/i);
  assert.match(server, /getVerifiedAdmin\(\)/);
  assert.match(server, /action: "build_news\.create"/);
  assert.match(server, /action: "build_news\.delete"/);
});

test("la saisie build_news refuse les liens externes et les contenus trop longs", () => {
  const valid = {
    title: "La vidéo est en ligne",
    publishedAt: "2026-10-23T10:00:00+02:00",
    thumbnail: "/da/mini/b3.jpg",
    blocLabel: "Bloc 3, La logique business",
    internalUrl: "/blocs/3",
    sentence: "Tu peux maintenant regarder le nouveau chapitre.",
  };
  assert.equal(buildNewsInputSchema.safeParse(valid).success, true);
  assert.equal(buildNewsInputSchema.safeParse({ ...valid, internalUrl: "https://evil.example" }).success, false);
  assert.equal(buildNewsInputSchema.safeParse({ ...valid, title: "x".repeat(161) }).success, false);
  assert.equal(buildNewsInputSchema.safeParse({ ...valid, thumbnail: "http://unsafe.example/image.jpg" }).success, false);
});

test("YouTube et Sur BUILD sont fusionnés et triés par date sans entrée factice", () => {
  const items = mergeNouveautesItems([
    { video_id: "AAAAAAAAAAA", title: "YouTube ancien", published_at: "2026-10-20T10:00:00Z" },
    { video_id: "BBBBBBBBBBB", title: "YouTube récent", published_at: "2026-10-23T10:00:00Z" },
  ], [{
    id: "123e4567-e89b-42d3-a456-426614174000",
    title: "BUILD au milieu",
    published_at: "2026-10-22T10:00:00Z",
    thumbnail: "/da/mini/b3.jpg",
    bloc_label: "Bloc 3, La logique business",
    internal_url: "/blocs/3",
    sentence: "La vidéo est prête.",
  }]);
  assert.deepEqual(items.map((item) => item.title), ["YouTube récent", "BUILD au milieu", "YouTube ancien"]);
  assert.deepEqual(items.map((item) => item.source), ["youtube", "build", "youtube"]);
  assert.deepEqual(mergeNouveautesItems([], []), []);
});

test("le VTT Mux conserve les repères utiles et nettoie les balises", () => {
  const vtt = `WEBVTT\n\n00:00:00.000 --> 00:00:03.000\nBonjour <c.v>BUILD</c> &amp; bienvenue\n\ncue-2\n00:01:05.200 --> 00:01:07.000 align:start\nOn passe à la suite.`;
  assert.equal(parseMuxVtt(vtt), "[0:00] Bonjour BUILD & bienvenue\n[1:05] On passe à la suite.");
});

test("la récupération Mux utilise un client injecté puis écrit la transcription", async () => {
  const calls: unknown[] = [];
  const client: MuxTranscriptClient = {
    async retrieveAsset(assetId) {
      calls.push(["asset", assetId]);
      return { tracks: [{ id: "track-fr", type: "text", text_type: "subtitles", text_source: "generated_vod", language_code: "fr", passthrough: "build-fr-auto", status: "ready" }] };
    },
    async signPlayback(playbackId) { calls.push(["sign", playbackId]); return "signed-token"; },
    async fetchVtt(playbackId, trackId, token) {
      calls.push(["vtt", playbackId, trackId, token]);
      return "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nUne transcription simulée suffisamment longue.";
    },
  };
  let stored = "";
  const result = await recoverMuxTranscript({
    assetId: "asset-1",
    playbackId: "playback-1",
    client,
    async writeTranscript(transcript) { stored = transcript; calls.push(["write", transcript]); },
  });
  assert.equal(result.trackId, "track-fr");
  assert.equal(stored, "[0:00] Une transcription simulée suffisamment longue.");
  assert.deepEqual(calls.map((call) => (call as unknown[])[0]), ["asset", "sign", "vtt", "write"]);
});

test("une piste Mux absente ou encore en préparation produit une erreur claire", () => {
  assert.throws(() => selectMuxGeneratedSubtitleTrack([]), (error) => error instanceof MuxTranscriptUnavailableError && /n'existe pas encore/.test(error.message));
  assert.throws(() => selectMuxGeneratedSubtitleTrack([{ id: "track", type: "text", text_type: "subtitles", text_source: "generated_vod", status: "preparing" }]), (error) => error instanceof MuxTranscriptUnavailableError && /pas encore prête/.test(error.message));
});

test("la vue Agent masque le jeton après sa seule réponse et exige les confirmations humaines", async () => {
  const [client, actions] = await Promise.all([
    readFile("components/admin/agent/AgentClient.tsx", "utf8"),
    readFile("components/admin/agent/actions.ts", "utf8"),
  ]);
  assert.match(client, /setFreshToken\(token\)/);
  assert.match(client, /visibilitychange/);
  assert.match(client, /setFreshToken\(null\)/);
  assert.match(client, /btv_agt_xxxx/);
  assert.match(actions, /request\.kind === "publication" \? "PUBLIER" : "ENVOYER"/);
  assert.match(actions, /listPendingRequests\(\)/);
  assert.match(actions, /confirmation !== expected/);
  assert.match(actions, /decideRequest\(requestId, decision\)/);
  assert.match(client, /expected="AUTORISER"/);
});
