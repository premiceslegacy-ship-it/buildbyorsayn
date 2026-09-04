import { createHash } from "node:crypto";
import type { McpTier } from "@/lib/mcpAccess";

const MAX_CHUNK_SIZE = 1500;
const MIN_CHUNK_SIZE = 1200;
const OVERLAP_SIZE = 150;

export type KnowledgeChunkDraft = {
  chunkIndex: number;
  title: string;
  content: string;
};

function preferredCut(text: string, start: number, hardEnd: number): number {
  const minimum = Math.min(start + MIN_CHUNK_SIZE, hardEnd);
  const window = text.slice(start, hardEnd);
  const minimumOffset = minimum - start;

  const heading = window.lastIndexOf("\n#");
  if (heading >= minimumOffset) return start + heading;

  const paragraph = window.lastIndexOf("\n\n");
  if (paragraph >= minimumOffset) return start + paragraph;

  const sentenceMatches = [...window.matchAll(/[.!?](?:["')\]]*)\s+/g)];
  const sentence = sentenceMatches.at(-1);
  if (sentence && sentence.index !== undefined && sentence.index >= minimumOffset) {
    return start + sentence.index + sentence[0].length;
  }

  const whitespace = Math.max(window.lastIndexOf(" "), window.lastIndexOf("\n"));
  if (whitespace >= minimumOffset) return start + whitespace;

  return hardEnd;
}

/**
 * Deterministic Markdown-aware windowing with a strict 1500-character cap,
 * title prefix included. Cuts prefer headings, paragraphs, sentences and
 * words, then fall back to a hard boundary. Consecutive chunks overlap.
 */
export function chunkText(title: string, content: string): KnowledgeChunkDraft[] {
  const trimmed = content.trim();
  if (trimmed.length === 0) return [];

  const prefix = `${title}\n\n`;
  const maxBodySize = MAX_CHUNK_SIZE - prefix.length;
  if (maxBodySize <= OVERLAP_SIZE) {
    throw new Error("Knowledge title is too long to chunk safely.");
  }

  const chunks: KnowledgeChunkDraft[] = [];
  let start = 0;

  while (start < trimmed.length) {
    const hardEnd = Math.min(start + maxBodySize, trimmed.length);
    const end = hardEnd < trimmed.length ? preferredCut(trimmed, start, hardEnd) : hardEnd;
    const body = trimmed.slice(start, end).trim();
    if (!body) throw new Error("Knowledge chunker made no progress.");

    chunks.push({
      chunkIndex: chunks.length,
      title,
      content: `${prefix}${body}`,
    });

    if (end >= trimmed.length) break;
    const nextStart = Math.max(start + 1, end - OVERLAP_SIZE);
    if (nextStart <= start) throw new Error("Knowledge chunker made no progress.");
    start = nextStart;
  }

  return chunks;
}

export function computeContentHash(tier: McpTier, title: string, content: string): string {
  return createHash("sha256").update(`${tier}\n${title}\n${content}`, "utf8").digest("hex");
}
