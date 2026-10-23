import { readFileSync } from "node:fs";
import path from "node:path";
import type { BeginnerSectionId } from "@/app/beginner/sections.data";
import { COFFRE_LABEL, COFFRE_PRICE, UPGRADE_PRICE, formatEuro } from "@/lib/pricing";

const CONTENT_ROOT = path.join(process.cwd(), "content", "fondations");

const CHAPTER_FILES = {
  mindset: "mindset.md",
  psychologie: "psychologie.md",
  vente: "vente.md",
  copywriting: "copywriting.md",
  marketing: "marketing.md",
  penser: "penser.md",
  environnement: "environnement.md",
  visuels: "visuels.md",
  "site-web": "site-web.md",
  url: "url.md",
  "angle-mort": "angle-mort.md",
} as const satisfies Record<BeginnerSectionId, string>;

const INTRODUCTION_FILES = {
  "ce-qui-ne-change-pas": "intro-ce-qui-ne-change-pas.md",
  "de-l-idee-a-l-url": "intro-de-l-idee-a-l-url.md",
} as const;

export type FoundationIntroductionId = keyof typeof INTRODUCTION_FILES;

const cache = new Map<string, string>();

function readMarkdown(fileName: string): string {
  const cached = process.env.NODE_ENV === "development" ? undefined : cache.get(fileName);
  if (cached !== undefined) return cached;

  const content = readFileSync(path.join(CONTENT_ROOT, fileName), "utf8")
    .replaceAll("{COFFRE_LABEL}", COFFRE_LABEL)
    .replaceAll("{COFFRE_PRICE}", formatEuro(COFFRE_PRICE))
    .replaceAll("{UPGRADE_PRICE}", formatEuro(UPGRADE_PRICE));
  if (process.env.NODE_ENV !== "development") cache.set(fileName, content);
  return content;
}

export function foundationMarkdown(sectionId: BeginnerSectionId): string {
  return readMarkdown(CHAPTER_FILES[sectionId]);
}

export function foundationIntroductionMarkdown(introductionId: FoundationIntroductionId): string {
  return readMarkdown(INTRODUCTION_FILES[introductionId]);
}

export function foundationIntroductionForSection(sectionId: BeginnerSectionId): string | undefined {
  if (["mindset", "psychologie", "vente", "copywriting", "marketing"].includes(sectionId)) {
    return foundationIntroductionMarkdown("ce-qui-ne-change-pas");
  }
  if (["penser", "environnement", "visuels", "site-web", "url"].includes(sectionId)) {
    return foundationIntroductionMarkdown("de-l-idee-a-l-url");
  }
  return undefined;
}

export function allFoundationMarkdown(): Array<{ id: BeginnerSectionId; content: string }> {
  return (Object.keys(CHAPTER_FILES) as BeginnerSectionId[]).map((id) => ({
    id,
    content: foundationMarkdown(id),
  }));
}

export function allFoundationIntroductions(): Array<{ id: FoundationIntroductionId; content: string }> {
  return (Object.keys(INTRODUCTION_FILES) as FoundationIntroductionId[]).map((id) => ({
    id,
    content: foundationIntroductionMarkdown(id),
  }));
}
