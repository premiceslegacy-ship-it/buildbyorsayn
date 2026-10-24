import {
  MAX_VIDEO_TRANSCRIPT_CHARACTERS,
  parseTranscriptSegments,
  type TranscriptSegment,
  type VideoChapter,
} from "./adminLessons";

const MAX_CHAPTERS = 40;
const MAX_CHAPTER_TITLE = 160;

type ChapterParseResult = {
  chapters: VideoChapter[];
  error: string | null;
};

function timecodeToSeconds(raw: string): number | null {
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

/** Parses the admin's one-chapter-per-line editor and returns a line-specific error. */
export function parseChapterLines(value: string, durationSeconds?: number | null): ChapterParseResult {
  const lines = value.replace(/\r\n/g, "\n").split("\n").map((raw, index) => ({ raw: raw.trim(), line: index + 1 })).filter(({ raw }) => raw.length > 0);
  if (lines.length === 0) return { chapters: [], error: "Ajoute au moins un chapitre." };
  if (lines.length > MAX_CHAPTERS) return { chapters: [], error: `Ligne ${lines[MAX_CHAPTERS]?.line ?? MAX_CHAPTERS + 1} : limite de ${MAX_CHAPTERS} chapitres dépassée.` };

  const chapters: VideoChapter[] = [];
  for (const [index, entry] of lines.entries()) {
    const match = /^((?:\d+:)?\d{1,3}:\d{2})\s+(.+)$/.exec(entry.raw);
    if (!match) return { chapters: [], error: `Ligne ${entry.line} : utilise le format « 0:00 Titre ».` };
    const startSeconds = timecodeToSeconds(match[1]);
    const title = match[2].trim();
    if (startSeconds === null) return { chapters: [], error: `Ligne ${entry.line} : le repère de temps est invalide.` };
    if (title.length > MAX_CHAPTER_TITLE) return { chapters: [], error: `Ligne ${entry.line} : le titre ne peut pas dépasser ${MAX_CHAPTER_TITLE} caractères.` };
    const previous = chapters[index - 1];
    if (index === 0 && startSeconds !== 0) return { chapters: [], error: `Ligne ${entry.line} : le premier chapitre doit commencer à 0:00.` };
    if (previous && startSeconds <= previous.startSeconds) return { chapters: [], error: `Ligne ${entry.line} : le repère doit être après le précédent.` };
    if (durationSeconds !== null && durationSeconds !== undefined && startSeconds >= durationSeconds) {
      return { chapters: [], error: `Ligne ${entry.line} : le repère dépasse la durée de la vidéo.` };
    }
    chapters.push({ index: index + 1, title, startSeconds });
  }
  return { chapters, error: null };
}

export type ManualTranscriptResult = {
  transcript: string;
  segments: TranscriptSegment[];
  error: string | null;
};

/** Validates the reviewed transcript shared by the admin action and its editor. */
export function validateManualTranscript(value: string): ManualTranscriptResult {
  const transcript = value.trim();
  if (transcript.length > MAX_VIDEO_TRANSCRIPT_CHARACTERS) {
    return { transcript: "", segments: [], error: `La transcription ne peut pas dépasser ${MAX_VIDEO_TRANSCRIPT_CHARACTERS} caractères.` };
  }
  if (transcript.length < 20) return { transcript: "", segments: [], error: "La transcription relue doit contenir au moins 20 caractères." };
  const segments = parseTranscriptSegments(transcript);
  if (segments.length === 0) return { transcript: "", segments: [], error: "La transcription relue est vide ou invalide." };
  return { transcript, segments, error: null };
}
