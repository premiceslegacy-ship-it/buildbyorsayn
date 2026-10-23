import { readFileSync } from "node:fs";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "content", "coffre");

const CHAPTER_FILES = {
  "b1-s0": "b1-s0.md",
  "b1-s1": "b1-s1.md",
  "b1-s2": "b1-s2.md",
  "b1-s3": "b1-s3.md",
  "b1-s4b": "b1-s4b.md",
  "b1-s4": "b1-s4.md",
  "b2-s1": "b2-s1.md",
  "b2-s2": "b2-s2.md",
  "b2-s3": "b2-s3.md",
  "b3-s1": "b3-s1.md",
  "b3-s2": "b3-s2.md",
  "b3-s3": "b3-s3.md",
  "b4-s1": "b4-s1.md",
  "b4-s1b": "b4-s1b.md",
  "b4-s2": "b4-s2.md",
  "b4-s3": "b4-s3.md",
  "b5-s1": "b5-s1.md",
  "b5-s2": "b5-s2.md",
  "b5-s3": "b5-s3.md",
  "b5-s4": "b5-s4.md",
  "b6-s1": "b6-s1.md",
  "b6-s2": "b6-s2.md",
  "b6-s3": "b6-s3.md",
  "b6-s4": "b6-s4.md",
  "b6-s5": "b6-s5.md",
  "b7-s1": "b7-s1.md",
  "b7-s2": "b7-s2.md",
  "b7-s3": "b7-s3.md",
  "b7-s4": "b7-s4.md",
} as const;

const INTRODUCTION_FILES = {
  "1": "intro-1.md",
  "2": "intro-2.md",
  "3": "intro-3.md",
  "4": "intro-4.md",
  "5": "intro-5.md",
  "6": "intro-6.md",
  "7": "intro-7.md",
} as const;

export type CoffreSectionId = keyof typeof CHAPTER_FILES;
export type CoffreBlockId = keyof typeof INTRODUCTION_FILES;

const cache = new Map<string, string>();

function readMarkdown(fileName: string): string {
  const cached = cache.get(fileName);
  if (cached !== undefined) return cached;

  const content = readFileSync(path.join(CONTENT_ROOT, fileName), "utf8");
  cache.set(fileName, content);
  return content;
}

export function coffreChapterMarkdown(sectionId: CoffreSectionId): string {
  return readMarkdown(CHAPTER_FILES[sectionId]);
}

export function coffreIntroductionMarkdown(blockId: CoffreBlockId): string {
  return readMarkdown(INTRODUCTION_FILES[blockId]);
}

export function allCoffreMarkdown(): Array<{ id: CoffreSectionId; content: string }> {
  return (Object.keys(CHAPTER_FILES) as CoffreSectionId[]).map((id) => ({
    id,
    content: coffreChapterMarkdown(id),
  }));
}

export function allCoffreIntroductions(): Array<{ id: CoffreBlockId; content: string }> {
  return (Object.keys(INTRODUCTION_FILES) as CoffreBlockId[]).map((id) => ({
    id,
    content: coffreIntroductionMarkdown(id),
  }));
}
