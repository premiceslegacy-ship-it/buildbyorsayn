import { z } from "zod";
import type { McpTier } from "@/lib/mcpAccess";

export const MAX_ADMIN_VIDEO_BYTES = 10 * 1024 * 1024 * 1024;
export const MAX_VIDEO_TRANSCRIPT_CHARACTERS = 250_000;
export const MAX_ADMIN_VIDEO_DURATION_SECONDS = 3 * 60 * 60;
const MAX_VIDEO_CHAPTERS = 40;
export const ADMIN_VIDEO_CONFIRMATION = "PUBLIER";
export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
] as const;

const BLOC_NUMBER_SCHEMA = z.number().int().min(1).max(7);
const BLOC_ID_PATTERN = /^(1|2|3|4|5|6|7)$/;
const MUX_PASSTHROUGH_PATTERN = /^build-video:([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

export type VideoChapter = {
  index: number;
  title: string;
  startSeconds: number;
};

export type TranscriptSegment = {
  startSeconds: number;
  text: string;
};

export const videoChapterSchema = z.object({
  index: z.number().int().min(1).max(MAX_VIDEO_CHAPTERS),
  title: z.string().trim().min(1).max(160),
  startSeconds: z.number().int().min(0).max(43_200),
}).strict();

export const adminVideoCreateSchema = z.object({
  blocNumero: BLOC_NUMBER_SCHEMA,
  position: z.number().int().min(1).max(1_000),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().max(2_000).default(""),
  transcript: z.string().trim().max(MAX_VIDEO_TRANSCRIPT_CHARACTERS).default(""),
  deliverables: z.array(z.string().trim().min(1).max(200)).max(3).default([]),
  chapters: z.array(videoChapterSchema).min(1).max(MAX_VIDEO_CHAPTERS),
  file: z.object({
    name: z.string().trim().min(1).max(255),
    size: z.number().int().positive().max(MAX_ADMIN_VIDEO_BYTES),
    type: z.enum(VIDEO_MIME_TYPES),
  }).strict(),
}).strict();
 
export const transcriptSegmentSchema = z.object({
  startSeconds: z.number().int().min(0).max(43_200),
  text: z.string().trim().min(1).max(20_000),
}).strict();

export const transcriptPageSchema = z.object({
  segments: z.array(transcriptSegmentSchema),
  nextOffset: z.number().int().min(0).nullable(),
  total: z.number().int().min(0),
}).strict();

export function isBlocId(value: string): boolean {
  return BLOC_ID_PATTERN.test(value);
}

export function tierForBloc(blocId: string): McpTier {
  if (!isBlocId(blocId)) throw new Error("Identifiant de bloc invalide.");
  return blocId === "1" ? "beginner" : "full";
}

export function parseTranscriptSegmentsJson(value: unknown): TranscriptSegment[] {
  const parsed = z.array(transcriptSegmentSchema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

export const publishVideoSchema = z.object({
  approved: z.literal(true),
  confirmation: z.literal(ADMIN_VIDEO_CONFIRMATION),
}).strict();


export function validateChapterTimeline(
  chapters: VideoChapter[],
  durationSeconds?: number | null,
): string | null {
  if (chapters.length === 0 || chapters.length > MAX_VIDEO_CHAPTERS) {
    return "Ajoute entre 1 et 40 chapitres.";
  }
  if (chapters[0]?.startSeconds !== 0) return "Le premier chapitre doit commencer à 0 seconde.";
  for (let index = 0; index < chapters.length; index += 1) {
    const chapter = chapters[index];
    if (chapter.index !== index + 1) return "Les numéros de chapitre doivent être consécutifs.";
    if (index > 0 && chapter.startSeconds <= chapters[index - 1].startSeconds) {
      return "Les repères de chapitre doivent être strictement croissants.";
    }
    if (durationSeconds && chapter.startSeconds >= durationSeconds) {
      return "Un repère de chapitre dépasse la durée de la vidéo.";
    }
  }
  return null;
}

export function buildMuxPassthrough(videoId: string): string {
  const parsed = z.string().uuid().safeParse(videoId);
  if (!parsed.success) throw new Error("Identifiant vidéo invalide.");
  return `build-video:${parsed.data}`;
}

export function parseMuxPassthrough(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return MUX_PASSTHROUGH_PATTERN.exec(value)?.[1]?.toLowerCase() ?? null;
}

function timestampToSeconds(raw: string): number | null {
  const parts = raw.split(":").map(Number);
  if (parts.some((part) => !Number.isInteger(part) || part < 0)) return null;
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return seconds < 60 ? minutes * 60 + seconds : null;
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return minutes < 60 && seconds < 60 ? hours * 3600 + minutes * 60 + seconds : null;
  }
  return null;
}

/**
 * Le texte relu peut contenir des lignes `[02:10] ...`. Sans repère, il reste
 * publiable mais toute la transcription est rattachée au début de la vidéo.
 */
export function parseTranscriptSegments(transcript: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  let current: TranscriptSegment | null = null;

  for (const rawLine of transcript.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = /^\[((?:\d+:)?\d{1,3}:\d{2})\]\s*(.+)$/.exec(line);
    if (match) {
      const startSeconds = timestampToSeconds(match[1]);
      if (startSeconds !== null) {
        current = { startSeconds, text: match[2].trim() };
        segments.push(current);
        continue;
      }
    }
    if (current) current.text = `${current.text} ${line}`;
    else {
      current = { startSeconds: 0, text: line };
      segments.push(current);
    }
  }

  return segments.filter((segment, index) => (
    segment.text.length > 0 && (index === 0 || segment.startSeconds >= segments[index - 1].startSeconds)
  ));
}

function subtitleTimestampToSeconds(raw: string): number | null {
  const parts = raw.trim().replace(",", ".").split(":");
  if (parts.length !== 2 && parts.length !== 3) return null;
  const seconds = Number(parts.at(-1));
  const minutes = Number(parts.at(-2));
  const hours = parts.length === 3 ? Number(parts[0]) : 0;
  if (![hours, minutes, seconds].every(Number.isFinite) || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

/** Parses reviewed WebVTT or SubRip captions into the MCP's paginable shape. */
export function parseSubtitleSegments(content: string): TranscriptSegment[] {
  const blocks = content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").split(/\n{2,}/);
  const segments: TranscriptSegment[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) continue;
    const startSeconds = subtitleTimestampToSeconds(lines[timingIndex].split("-->")[0] ?? "");
    const text = lines.slice(timingIndex + 1).join(" ").replace(/<[^>]*>/g, "").trim();
    if (startSeconds === null || !text) continue;
    const previous = segments.at(-1);
    if (previous && startSeconds <= previous.startSeconds) {
      throw new Error("Les repères de transcription doivent être strictement croissants.");
    }
    segments.push({ startSeconds, text });
  }
  if (segments[0]?.startSeconds !== 0) {
    throw new Error("La transcription doit commencer à 0 seconde.");
  }
  return segments;
}

export function formatTimecode(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remainder = safe % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}
