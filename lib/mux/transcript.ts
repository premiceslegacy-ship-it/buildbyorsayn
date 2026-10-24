import { MAX_VIDEO_TRANSCRIPT_CHARACTERS, formatTimecode } from "./adminLessons";

export type MuxSubtitleTrack = {
  id?: string;
  type?: string;
  text_type?: string;
  text_source?: string;
  language_code?: string;
  passthrough?: string;
  status?: string;
};

export type MuxTranscriptClient = {
  retrieveAsset(assetId: string): Promise<{ tracks?: MuxSubtitleTrack[] }>;
  signPlayback(playbackId: string): Promise<string>;
  fetchVtt(playbackId: string, trackId: string, token: string): Promise<string>;
};

export class MuxTranscriptUnavailableError extends Error {}

function decodeVttText(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function vttTimeToSeconds(value: string): number | null {
  const match = /^(?:(\d+):)?(\d{2}):(\d{2})[.,](\d{3})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  if (minutes > 59 || seconds > 59) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

export function parseMuxVttSegments(vtt: string): Array<{ startSeconds: number; text: string }> {
  const blocks = vtt.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").split(/\n{2,}/);
  const segments: Array<{ startSeconds: number; text: string }> = [];
  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length || /^(WEBVTT|NOTE|STYLE|REGION)\b/.test(lines[0])) continue;
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) continue;
    const startSeconds = vttTimeToSeconds(lines[timingIndex].split("-->")[0]);
    const text = decodeVttText(lines.slice(timingIndex + 1).join(" "));
    if (startSeconds === null || !text) continue;
    if (segments.at(-1)?.text === text) continue;
    segments.push({ startSeconds, text });
  }
  return segments;
}

export function parseMuxVtt(vtt: string): string {
  const segments = parseMuxVttSegments(vtt);
  const transcript = segments.map((segment) => `[${formatTimecode(segment.startSeconds)}] ${segment.text}`).join("\n");
  if (transcript.length > MAX_VIDEO_TRANSCRIPT_CHARACTERS) {
    throw new MuxTranscriptUnavailableError("La transcription Mux dépasse la taille autorisée.");
  }
  return transcript;
}

export function selectMuxGeneratedSubtitleTrack(tracks: MuxSubtitleTrack[] | undefined): MuxSubtitleTrack {
  const candidates = (tracks ?? []).filter((track) => (
    track.type === "text"
    && track.text_type === "subtitles"
    && (track.text_source === "generated_vod" || track.passthrough === "build-fr-auto")
  ));
  const preferred = candidates.find((track) => track.passthrough === "build-fr-auto")
    ?? candidates.find((track) => track.language_code === "fr")
    ?? candidates[0];
  if (!preferred) {
    throw new MuxTranscriptUnavailableError("La piste de sous-titres Mux n'existe pas encore.");
  }
  if (preferred.status !== "ready" || !preferred.id) {
    throw new MuxTranscriptUnavailableError("La piste de sous-titres Mux n'est pas encore prête.");
  }
  return preferred;
}

export async function recoverMuxTranscript(input: {
  assetId: string;
  playbackId: string;
  client: MuxTranscriptClient;
  writeTranscript: (
    transcript: string,
    segments: Array<{ startSeconds: number; text: string }>,
    trackId: string,
  ) => Promise<void>;
}): Promise<{ transcript: string; trackId: string }> {
  const asset = await input.client.retrieveAsset(input.assetId);
  const track = selectMuxGeneratedSubtitleTrack(asset.tracks);
  const token = await input.client.signPlayback(input.playbackId);
  const vtt = await input.client.fetchVtt(input.playbackId, track.id!, token);
  const segments = parseMuxVttSegments(vtt);
  const transcript = segments.map((segment) => `[${formatTimecode(segment.startSeconds)}] ${segment.text}`).join("\n");
  if (transcript.trim().length < 20) {
    throw new MuxTranscriptUnavailableError("La transcription Mux est vide ou trop courte.");
  }
  await input.writeTranscript(transcript, segments, track.id!);
  return { transcript, trackId: track.id! };
}
