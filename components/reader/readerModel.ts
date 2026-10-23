export const READER_MODE_STORAGE_KEY = "btv-mode";

export type ReaderMode = "video" | "texte";

export type ReaderMarkdownSection = {
  title: string;
  content: string;
};

export function parseReaderMode(value: string | null | undefined): ReaderMode | null {
  return value === "video" || value === "texte" ? value : null;
}

export function resolveReaderMode(
  addressMode: string | null | undefined,
  storedMode: string | null | undefined,
): ReaderMode {
  return parseReaderMode(addressMode) ?? parseReaderMode(storedMode) ?? "video";
}

export function resolveChapterIndex(
  sectionIds: readonly string[],
  requested: string | null | undefined,
): number {
  if (sectionIds.length === 0) return -1;
  if (!requested) return 0;
  const normalized = requested.replace(/^#/, "");
  const direct = sectionIds.indexOf(normalized);
  if (direct >= 0) return direct;
  const numeric = Number.parseInt(normalized, 10);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= sectionIds.length
    ? numeric - 1
    : 0;
}

export function serializeReaderMarkdown(
  title: string,
  sections: readonly ReaderMarkdownSection[],
): string {
  const body = sections
    .map((section, index) => `## ${index + 1}. ${section.title}\n\n${section.content.trim()}`)
    .join("\n\n");
  return `# ${title.trim()}\n\n${body}`.trim();
}

export function readingProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const available = Math.max(0, scrollHeight - clientHeight);
  if (available === 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / available));
}

export function chapterProgressLabel(done: number, total: number): string {
  if (total <= 0) return "Aucun chapitre disponible";
  if (done >= total) return "Terminé";
  if (done <= 0) return `${total} chapitre${total > 1 ? "s" : ""}`;
  return `${done} chapitre${done > 1 ? "s" : ""} sur ${total} lu${done > 1 ? "s" : ""}`;
}
