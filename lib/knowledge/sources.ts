import type { McpTier } from "@/lib/mcpAccess";
import type { SkillAccess } from "@/lib/skillsCatalog";
import { z } from "zod";
import {
  formatTimecode,
  parseTranscriptSegments,
  tierForSection,
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
  section_id: string;
  title: string;
  transcript: string;
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
    for (const section of bloc.sections) {
      const isShowcaseSection = bloc.displayNumber === 1 && section.id === "b1-s0";
      documents.push({
        source: "blocs",
        sourceId: section.id,
        title: `${bloc.titre} - ${section.title}`,
        content: section.content,
        tier: bloc.displayNumber !== 1 ? "full" : isShowcaseSection ? "preview" : "beginner",
      });
    }
  }

  return documents;
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

export async function collectAccompagnementDocuments(): Promise<KnowledgeDocument[]> {
  const { THEMES, THEME_GUIDANCE } = await import("@/lib/siteWebAccompagnement");
  const documents: KnowledgeDocument[] = [];

  for (const theme of THEMES) {
    const guidance = THEME_GUIDANCE[theme.id];
    documents.push({
      source: "accompagnement",
      sourceId: theme.id,
      title: `Accompagnement Site Web - ${theme.title}`,
      content: [
        `Promesse : ${theme.promise}`,
        `Pourquoi : ${theme.why}`,
        `Livrables : ${theme.deliverables.join(", ")}`,
        `Ligne d'arrivee : ${theme.finishLine}`,
        guidance ? `Guidance : ${JSON.stringify(guidance)}` : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
      tier: "full" as const,
    });
  }

  return documents;
}

export async function collectSkillsCatalogDocuments(): Promise<KnowledgeDocument[]> {
  const { SKILLS_CATALOG } = await import("@/lib/skillsCatalog");
  return SKILLS_CATALOG.map((skill) => ({
    source: "skills-catalog",
    sourceId: skill.slug,
    title: skill.title,
    content: skill.description,
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
 * Une vidéo publiée produit un document par chapitre. La source reste `blocs`
 * pour être immédiatement compatible avec le contrat MCP existant ; sourceId et
 * métadonnées la distinguent du texte pédagogique de la même section.
 */
export function collectVideoTranscriptDocuments(rows: PublishedVideoTranscriptRow[]): KnowledgeDocument[] {
  const documents: KnowledgeDocument[] = [];

  for (const row of rows) {
    const expectedTier = tierForSection(row.section_id);
    if (row.tier_required !== expectedTier) {
      throw new Error(`Video tier mismatch for ${row.section_id}`);
    }
    if (!Number.isSafeInteger(row.duration_seconds) || row.duration_seconds <= 0) {
      throw new Error(`Video duration missing for ${row.section_id}`);
    }
    const parsedChapters = z.array(videoChapterSchema).min(1).safeParse(row.chapters);
    if (!parsedChapters.success) throw new Error(`Video chapters invalid for ${row.section_id}`);
    const segments = parseTranscriptSegments(row.transcript);
    if (segments.length === 0) throw new Error(`Video transcript empty for ${row.section_id}`);

    parsedChapters.data.forEach((chapter, chapterOffset) => {
      const endSeconds = parsedChapters.data[chapterOffset + 1]?.startSeconds ?? row.duration_seconds;
      const chapterSegments = segments.filter((segment) => (
        segment.startSeconds >= chapter.startSeconds && segment.startSeconds < endSeconds
      ));
      if (chapterSegments.length === 0) return;

      documents.push({
        source: "blocs",
        sourceId: `video:${row.section_id}:chapter:${chapter.index}`,
        title: `${row.title} - ${chapter.title}`,
        content: chapterSegments
          .map((segment) => `[${formatTimecode(segment.startSeconds)}] ${segment.text}`)
          .join("\n\n"),
        tier: expectedTier,
        metadata: {
          videoId: row.id,
          sectionId: row.section_id,
          bloc: Number(row.section_id.slice(1).split("-")[0]),
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
