import "server-only";

import Mux from "@mux/ts";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { recoverMuxTranscript, type MuxTranscriptClient } from "./transcript";

function createMuxTranscriptClient(): MuxTranscriptClient {
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID?.trim(),
    tokenSecret: process.env.MUX_TOKEN_SECRET?.trim(),
    jwtSigningKey: process.env.MUX_SIGNING_KEY?.trim(),
    jwtPrivateKey: process.env.MUX_PRIVATE_KEY?.trim(),
    timeout: 15_000,
    maxRetries: 0,
  });
  return {
    retrieveAsset: (assetId) => mux.video.assets.retrieve(assetId),
    async signPlayback(playbackId) {
      return mux.jwt.signPlaybackId(playbackId, { expiration: "5m", type: "video" });
    },
    fetchVtt: (playbackId, trackId, token) => mux.video.playback.track(playbackId, trackId, { token }),
  };
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
    async writeTranscript(transcript) {
      const { data, error } = await admin.from("video_lessons")
        .update({ transcript, updated_at: new Date().toISOString() })
        .eq("id", input.videoId)
        .eq("mux_asset_id", input.assetId)
        .is("published_at", null)
        .select("id")
        .maybeSingle();
      if (error || !data) throw new Error("La transcription Mux n'a pas pu être enregistrée.");
    },
  });
}
