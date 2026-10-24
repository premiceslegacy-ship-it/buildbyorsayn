import { z } from "zod";
import type { McpTier } from "@/lib/mcpAccess";

export const MAX_ADMIN_VIDEO_BYTES = 10 * 1024 * 1024 * 1024;
export const MAX_VIDEO_TRANSCRIPT_CHARACTERS = 250_000;
const MAX_VIDEO_CHAPTERS = 40;
export const ADMIN_VIDEO_CONFIRMATION = "PUBLIER";
export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
] as const;

const SECTION_ID_PATTERN = /^b\d+-s[0-9a-z]+$/;
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
  sectionId: z.string().regex(SECTION_ID_PATTERN),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().max(2_000).default(""),
  transcript: z.string().trim().min(20).max(MAX_VIDEO_TRANSCRIPT_CHARACTERS),
  deliverables: z.array(z.string().trim().min(1).max(200)).max(3).default([]),
  chapters: z.array(videoChapterSchema).min(1).max(MAX_VIDEO_CHAPTERS),
  file: z.object({
    name: z.string().trim().min(1).max(255),
    size: z.number().int().positive().max(MAX_ADMIN_VIDEO_BYTES),
    type: z.enum(VIDEO_MIME_TYPES),
  }).strict(),
}).strict();

export const publishVideoSchema = z.object({
  approved: z.literal(true),
  confirmation: z.literal(ADMIN_VIDEO_CONFIRMATION),
}).strict();

export function tierForSection(sectionId: string): McpTier {
  if (!SECTION_ID_PATTERN.test(sectionId)) throw new Error("Identifiant de chapitre invalide.");
  if (sectionId === "b1-s0") return "preview";
  if (sectionId.startsWith("b1-")) return "beginner";
  return "full";
}

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

export function formatTimecode(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remainder = safe % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}
