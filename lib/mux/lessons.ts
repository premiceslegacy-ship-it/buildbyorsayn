import type { LessonRecord } from "../blocCatalog";

export type LessonsFile = { lessons: LessonRecord[] };
export type ImportedLesson = { muxAssetId: string; playbackId: string; durationSeconds: number };

/** Only a signed playback id may back a private lesson; a public one would bypass every gate. */
export function pickSignedPlaybackId(playbackIds: { id: string; policy: string }[] | undefined): string | null {
  return playbackIds?.find((playback) => playback.policy === "signed")?.id ?? null;
}

export function applyImportedLesson(
  file: LessonsFile,
  sectionId: string,
  imported: ImportedLesson
): { file: LessonsFile; previousAssetId: string | null } {
  const current = file.lessons.find((lesson) => lesson.sectionId === sectionId);
  if (!current) throw new Error(`No lesson entry for section ${sectionId}`);
  return {
    previousAssetId: current.muxAssetId && current.muxAssetId !== imported.muxAssetId ? current.muxAssetId : null,
    file: {
      ...file,
      lessons: file.lessons.map((lesson) => lesson.sectionId === sectionId ? { ...lesson, ...imported } : lesson),
    },
  };
}

export const serializeLessonsFile = (file: LessonsFile) => `${JSON.stringify(file, null, 2)}\n`;
