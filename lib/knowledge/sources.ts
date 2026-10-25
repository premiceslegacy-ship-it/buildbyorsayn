import type { McpTier } from "@/lib/mcpAccess";
import { displayLocationFromBlocId } from "@/lib/blocCatalog";
import { ANGLE_MORT, SECTIONS } from "@/app/beginner/sections.data";
import { allFoundationIntroductions, allFoundationMarkdown } from "@/lib/fondations/content";
import type { SkillAccess } from "@/lib/skillsCatalog";
import { skillCatalogKnowledgeContent } from "@/lib/knowledge/skillCatalogDescription";
import { z } from "zod";
import { withoutFrontmatter } from "@/lib/coffre/frontmatter";
import {
  formatTimecode,
  parseTranscriptSegments,
  parseTranscriptSegmentsJson,
  tierForBloc,
  videoChapterSchema,
} from "@/lib/mux/adminLessons";

export type KnowledgeMetadata = Record<string, string | number | boolean | null>;

export type KnowledgeDocument = {
  source: string;
  sourceId: string;
  title: string;
  content: string;
  tier: McpTier;
  metadata?: KnowledgeMetadata;
};

export type PublishedVideoTranscriptRow = {
  id: string;
  bloc_id: string;
  position: number;
  title: string;
  transcript: string;
  transcript_segments?: unknown;
  chapters: unknown;
  duration_seconds: number;
  tier_required: string;
};

function skillAccessToTier(access: SkillAccess): McpTier {
  return access;
}

/**
 * BLOCS_DATA (not BLOCS_DATA_SOURCE) is imported deliberately: it is the
 * already-reordered, already-renumbered export, so "Bloc 2" in an ingested
 * chunk matches what the app actually displays to the user.
 */
export async function collectBlocsDocuments(): Promise<KnowledgeDocument[]> {
  const { BLOCS_DATA } = await import("@/lib/mockData");
  const documents: KnowledgeDocument[] = [];

  for (const bloc of BLOCS_DATA) {
    documents.push({
      source: "blocs",
      sourceId: `introduction:bloc-${bloc.displayNumber}`,
      title: bloc.titre,
      content: bloc.introduction,
      tier: bloc.displayNumber === 1 ? "preview" : "full",
      metadata: { kind: "introduction" },
    });
    for (const section of bloc.sections) {
      const isShowcaseSection = bloc.displayNumber === 1 && section.id === "b1-s0";
      documents.push({
        source: "blocs",
        sourceId: section.id,
        title: `${bloc.titre} - ${section.title}`,
        content: withoutFrontmatter(section.content),
        tier: bloc.displayNumber !== 1 ? "full" : isShowcaseSection ? "preview" : "beginner",
        metadata: { kind: "chapter" },
      });
    }
  }

  return documents;
}

export async function collectFondationsDocuments(): Promise<KnowledgeDocument[]> {
  const metadata = new Map([...SECTIONS, ANGLE_MORT].map((chapter) => [chapter.id, chapter]));
  const introductions = allFoundationIntroductions().map((introduction) => ({
    source: "fondations",
    sourceId: `introduction:${introduction.id}`,
    title: introduction.id === "ce-qui-ne-change-pas" ? "Fondations 1 : ce qui ne change pas" : "Fondations 2 : de l'idée à l'URL",
    content: introduction.content,
    tier: "beginner" as const,
    metadata: { kind: "introduction" },
  }));
  const chapters = allFoundationMarkdown().map((chapter) => ({
    source: "fondations",
    sourceId: chapter.id,
    title: metadata.get(chapter.id)?.label ?? chapter.id,
    content: chapter.content,
    tier: "beginner" as const,
    metadata: { kind: "chapter" },
  }));
  return [...introductions, ...chapters];
}

export async function collectProtocoleDocuments(): Promise<KnowledgeDocument[]> {
  const { PHASES } = await import("@/lib/protocoleContent");
  return PHASES.map((phase) => ({
    source: "protocole",
    sourceId: `phase-${phase.num}`,
    title: `Protocole Zero - Phase ${phase.num} : ${phase.titre}`,
    content: [
      `Douleur : ${phase.douleur}`,
      `Solution : ${phase.solution.join("\n\n")}`,
      `Repère à retenir : ${phase.citation}`,
    ].join("\n\n"),
    tier: "beginner" as const,
  }));
}

export async function collectSkillsCatalogDocuments(): Promise<KnowledgeDocument[]> {
  const { SKILLS_CATALOG } = await import("@/lib/skillsCatalog");
  return SKILLS_CATALOG.map((skill) => ({
    source: "skills-catalog",
    sourceId: skill.slug,
    title: skill.title,
    content: skillCatalogKnowledgeContent(skill),
    tier: skillAccessToTier(skill.access),
  }));
}

/**
 * Full skill markdown bodies, read from Supabase Storage (verified against
 * the signed manifest) rather than from docs/ - docs/ is gitignored and
 * absent on a fresh checkout or CI. Only .md skills are ingested; .zip
 * bundles are binary and not useful to embed.
 */
export async function collectSkillsContentDocuments(): Promise<KnowledgeDocument[]> {
  const { SKILLS_CATALOG } = await import("@/lib/skillsCatalog");
  const { getStoredSkillContent } = await import("@/lib/skills/storage");
  const documents: KnowledgeDocument[] = [];

  for (const skill of SKILLS_CATALOG) {
    if (!skill.fileName.endsWith(".md")) continue;
    const stored = await getStoredSkillContent(skill);
    if (!stored || typeof stored.body !== "string") {
      throw new Error(`Published Markdown skill unavailable: ${skill.slug}`);
    }

    documents.push({
      source: "skills-content",
      sourceId: skill.slug,
      title: skill.title,
      content: stored.body,
      tier: skillAccessToTier(skill.access),
    });
  }

  return documents;
}

/**
 * A published video produces one MCP knowledge document per video chapter.
 * Transcript text is never returned to the application reader.
 */
export function collectVideoTranscriptDocuments(rows: PublishedVideoTranscriptRow[]): KnowledgeDocument[] {
  const documents: KnowledgeDocument[] = [];

  for (const row of rows) {
    const location = displayLocationFromBlocId(row.bloc_id);
    const expectedTier = tierForBloc(row.bloc_id);
    if (location === null) throw new Error("Video emplacement inconnu");
    const locationLabel = location === "protocole" ? "Protocole" : `Bloc ${location}`;
    const sourceLocation = location === "protocole" ? "protocole" : `bloc-${location}`;
    if (row.tier_required !== expectedTier) {
      throw new Error(`Video tier mismatch for ${locationLabel}`);
    }
    if (!Number.isSafeInteger(row.position) || row.position < 1) {
      throw new Error(`Video position invalid for ${locationLabel}`);
    }
    if (!Number.isSafeInteger(row.duration_seconds) || row.duration_seconds <= 0) {
      throw new Error(`Video duration missing for ${locationLabel}`);
    }
    const parsedChapters = z.array(videoChapterSchema).min(1).safeParse(row.chapters);
    if (!parsedChapters.success) throw new Error(`Video chapters invalid for ${locationLabel}`);
    const storedSegments = parseTranscriptSegmentsJson(row.transcript_segments);
    const segments = storedSegments.length > 0 ? storedSegments : parseTranscriptSegments(row.transcript);
    if (segments.length === 0) throw new Error(`Video transcript empty for ${locationLabel}`);

    parsedChapters.data.forEach((chapter, chapterOffset) => {
      const endSeconds = parsedChapters.data[chapterOffset + 1]?.startSeconds ?? row.duration_seconds;
      const chapterSegments = segments.filter((segment) => (
        segment.startSeconds >= chapter.startSeconds && segment.startSeconds < endSeconds
      ));
      if (chapterSegments.length === 0) return;

      documents.push({
        source: "blocs",
        sourceId: `video:${sourceLocation}:video-${row.position}:chapter-${chapter.index}`,
        title: `${row.title} - ${chapter.title}`,
        content: chapterSegments
          .map((segment) => `[${formatTimecode(segment.startSeconds)}] ${segment.text}`)
          .join("\n\n"),
        tier: expectedTier,
        metadata: {
          videoId: row.id,
          blocNumero: location,
          position: row.position,
          video: row.position,
          chapterIndex: chapter.index,
          chapterTitle: chapter.title,
          startSeconds: chapter.startSeconds,
          endSeconds,
          durationSeconds: row.duration_seconds,
          kind: "transcript",
        },
      });
    });
  }

  return documents;
}
