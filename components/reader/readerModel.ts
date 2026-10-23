export const READER_MODE_STORAGE_KEY = "btv-mode";

export type ReaderMode = "video" | "texte";
export type ReaderNavigationKey = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "End" | "Home";

export type ReaderMarkdownSection = {
  title: string;
  content: string;
};

export type ReaderLinkOptions = {
  allowedLocalPaths?: readonly string[];
  localBaseHref?: string;
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

export function readerMarkdownHref(
  destination: string,
  { allowedLocalPaths = [], localBaseHref }: ReaderLinkOptions = {},
): string | undefined {
  if (!destination || /[\s\\\u0000-\u001f\u007f]/u.test(destination)) return undefined;
  if (destination.startsWith("/")) return destination.startsWith("//") ? undefined : destination;
  if (destination.startsWith("#")) return /^#[a-zA-Z0-9_-]+$/.test(destination) ? destination : undefined;
  if (/^https?:\/\//i.test(destination)) {
    try {
      const url = new URL(destination);
      return url.hostname && !url.username && !url.password ? destination : undefined;
    } catch {
      return undefined;
    }
  }
  if (!localBaseHref) return undefined;
  let path: string;
  try {
    path = decodeURIComponent(destination.split("#")[0]).replace(/^\.\//, "");
  } catch {
    return undefined;
  }
  if (!allowedLocalPaths.includes(path)) return undefined;
  const slug = path.replace(/\.md$/i, "").toLowerCase();
  return `${localBaseHref.replace(/\/$/, "")}/${slug}`;
}

export function readerImageSource(source: string): string | undefined {
  if (source.startsWith("/") && !source.startsWith("//")) return source;
  if (!/^https:\/\//i.test(source)) return undefined;
  try {
    const url = new URL(source);
    return url.hostname && !url.username && !url.password ? source : undefined;
  } catch {
    return undefined;
  }
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
