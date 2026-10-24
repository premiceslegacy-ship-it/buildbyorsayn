import "server-only";

import Mux from "@mux/ts";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { recoverMuxTranscript, type MuxTranscriptClient } from "./transcript";

function createMuxClient() {
  return new Mux({
    tokenId: process.env.MUX_TOKEN_ID?.trim(),
    tokenSecret: process.env.MUX_TOKEN_SECRET?.trim(),
    jwtSigningKey: process.env.MUX_SIGNING_KEY?.trim(),
    jwtPrivateKey: process.env.MUX_PRIVATE_KEY?.trim(),
    timeout: 15_000,
    maxRetries: 0,
  });
}

function createMuxTranscriptClient(): MuxTranscriptClient {
  const mux = createMuxClient();
  return {
    retrieveAsset: (assetId) => mux.video.assets.retrieve(assetId),
    async signPlayback(playbackId) {
      return mux.jwt.signPlaybackId(playbackId, { expiration: "5m", type: "video" });
    },
    async fetchVtt(playbackId, trackId, token) {
      // Le SDK ajoute l'authentification Basic de l'API à toute requête : stream.mux.com la refuse (400). Seul le jeton signé compte.
      const url = `https://stream.mux.com/${encodeURIComponent(playbackId)}/text/${encodeURIComponent(trackId)}.vtt?token=${encodeURIComponent(token)}`;
      const response = await fetch(url, { headers: { Accept: "text/vtt" }, signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error("La transcription Mux est indisponible.");
      return response.text();
    },
  };
}


export type MuxPlaybackTokens = {
  playback: string;
  thumbnail: string;
  storyboard: string;
};

export async function signMuxPlaybackTokens(playbackId: string): Promise<MuxPlaybackTokens> {
  const mux = createMuxClient();
  const signed = await mux.jwt.signPlaybackId(playbackId, {
    expiration: "5m",
    type: [["video", {}], ["thumbnail", {}], ["storyboard", {}]],
  });
  const { ["playback-token"]: playback, ["thumbnail-token"]: thumbnail, ["storyboard-token"]: storyboard } = signed;
  if (!playback || !thumbnail || !storyboard) throw new Error("Les jetons Mux sont indisponibles.");
  return { playback, thumbnail, storyboard };
}

/**
 * URL d'image Mux signée pour une seconde précise. Avec une politique « signed », Mux ignore `time` et `width`
 * dans l'URL : ils doivent être dans les revendications du jeton (sinon toutes les images sont la même).
 */
export async function signMuxThumbnailUrl(playbackId: string, options: { time: number; width: number }): Promise<string> {
  const token = await createMuxClient().jwt.signPlaybackId(playbackId, {
    expiration: "5m",
    type: "thumbnail",
    params: { time: String(Math.max(0, Math.floor(options.time))), width: String(options.width) },
  });
  return `https://image.mux.com/${encodeURIComponent(playbackId)}/thumbnail.jpg?token=${encodeURIComponent(token)}`;
}

export async function syncMuxTranscriptForReadyAsset(input: {
  videoId: string;
  assetId: string;
  playbackId: string;
  signal?: AbortSignal;
  client?: MuxTranscriptClient;
}) {
  const admin = createAdminSupabase({ signal: input.signal });
  return recoverMuxTranscript({
    assetId: input.assetId,
    playbackId: input.playbackId,
    client: input.client ?? createMuxTranscriptClient(),
    async writeTranscript(transcript, segments, trackId) {
      const { error } = await admin.from("video_lessons")
        .update({
          transcript,
          transcript_segments: segments,
          subtitle_track_id: trackId,
          transcript_source: "automatic",
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.videoId)
        .eq("mux_asset_id", input.assetId)
        .eq("transcript", "")
        .eq("transcript_source", "automatic")
        .select("id")
        .maybeSingle();
      if (error) throw new Error("La transcription Mux n'a pas pu être enregistrée.");
    },
  });
}
