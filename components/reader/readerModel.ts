export const READER_MODE_STORAGE_KEY = "btv-mode";

export type ReaderMode = "video" | "texte";
export type ReaderNavigationKey = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "End" | "Home";

export type ReaderMarkdownSection = {
  title: string;
  content: string;
};

export function parseReaderMode(value: string | null | undefined): ReaderMode | null {
  if (value === "video") return "video";
  if (value === "texte" || value === "text") return "texte";
  return null;
}

export function readerModeQuery(mode: ReaderMode): "video" | "text" {
  return mode === "texte" ? "text" : "video";
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

export function chapterIndexForKey(
  key: ReaderNavigationKey,
  currentIndex: number,
  total: number,
  wrap = false,
): number | null {
  if (total <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  const delta = key === "ArrowDown" || key === "ArrowRight" ? 1 : -1;
  const next = currentIndex + delta;
  if (wrap) return (next + total) % total;
  return next >= 0 && next < total ? next : null;
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
  const bounded = Math.min(total, Math.max(0, done));
  return `${bounded} chapitre${bounded === 1 ? "" : "s"} sur ${total} vu${bounded === 1 ? "" : "s"}`;
}

export function chapterSummary(content: string): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-\d]+[.)]?\s+/gm, "")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return "";
  return plain.match(/^.+?[.!?](?=\s|$)/u)?.[0]?.trim() ?? plain;
}
