/**
 * Reading position of a text chapter, stored in `lesson_progress` beside the video positions.
 * A video row keeps the bare section id (`b1-s2`) and a position in seconds.
 * A text row uses the key `texte:<scope>:<chapter>` and keeps how far the chapter was read,
 * in thousandths of its scrollable height, in the same `position_seconds` column.
 */
export type TextScope = "bloc" | "fondations" | "hermes";

export const TEXT_POSITION_SCALE = 1000;
/** Below this, opening a chapter is not reading it yet: nothing is saved or restored. */
export const TEXT_MIN_POSITION = 20;
/** From this point, the chapter counts as read. */
export const TEXT_COMPLETED_POSITION = 970;

const TEXT_KEY = /^texte:(bloc|fondations|hermes):([a-z0-9-]{1,120})$/;

export function textPositionKey(scope: TextScope, chapterId: string): string {
  return `texte:${scope}:${chapterId}`;
}

export function parseTextPositionKey(key: string): { scope: TextScope; chapterId: string } | null {
  const match = TEXT_KEY.exec(key);
  return match ? { scope: match[1] as TextScope, chapterId: match[2] } : null;
}

export function textPositionFromRatio(ratio: number): number {
  if (!Number.isFinite(ratio)) return 0;
  return Math.round(Math.min(1, Math.max(0, ratio)) * TEXT_POSITION_SCALE);
}

export function textRatioFromPosition(position: number | null | undefined): number {
  if (typeof position !== "number" || !Number.isFinite(position)) return 0;
  return Math.min(1, Math.max(0, position / TEXT_POSITION_SCALE));
}
