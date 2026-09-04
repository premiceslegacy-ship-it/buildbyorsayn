import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { chunkText, computeContentHash } from "@/lib/knowledge/chunk";
import {
  createEmbeddingProvider,
  embeddingFingerprint,
} from "@/lib/knowledge/embeddings";
import {
  buildIngestionPlan,
  parseMaxChunks,
  type ExistingChunkIdentity,
  type PreparedKnowledgeChunk,
} from "@/lib/knowledge/ingestionPlan";
import { collectObsidianDocuments, resolveObsidianSourceMode } from "@/lib/knowledge/obsidianSource";
import { findKnowledgeSecretHazards } from "@/lib/knowledge/safety";
import {
  collectAccompagnementDocuments,
  collectBlocsDocuments,
  collectProtocoleDocuments,
  collectSkillsCatalogDocuments,
  collectSkillsContentDocuments,
  type KnowledgeDocument,
} from "@/lib/knowledge/sources";

loadEnv({ path: ".env.local", quiet: true });

const APPLY = process.argv.includes("--apply");
const VERBOSE_REPORT = process.argv.includes("--verbose-report");
const REVOKE_OBSIDIAN = process.argv.includes("--revoke-obsidian");
const maxChunksArgument = process.argv.find((argument) => argument.startsWith("--max-chunks="));
const MAX_CHUNKS = parseMaxChunks(maxChunksArgument);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase service role credentials are not configured.");
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const ALWAYS_SCANNED_SOURCES = [
  "blocs",
  "protocole",
  "accompagnement",
  "skills-catalog",
  "skills-content",
] as const;

async function collectAllDocuments(): Promise<{
  documents: KnowledgeDocument[];
  scannedSources: Set<string>;
  obsidianReport: {
    relativePath: string;
    allowed: boolean;
    tier?: string;
    reason?: string;
    blocking?: boolean;
  }[];
  obsidianScanOk: boolean;
  obsidianHazards: string[];
}> {
  const documents: KnowledgeDocument[] = [];
  documents.push(...(await collectBlocsDocuments()));
  documents.push(...(await collectProtocoleDocuments()));
  documents.push(...(await collectAccompagnementDocuments()));
  documents.push(...(await collectSkillsCatalogDocuments()));
  documents.push(...(await collectSkillsContentDocuments()));

  const scannedSources = new Set<string>(ALWAYS_SCANNED_SOURCES);
  let obsidianReport: {
    relativePath: string;
    allowed: boolean;
    tier?: string;
    reason?: string;
    blocking?: boolean;
  }[] = [];
  let obsidianScanOk = true;
  let obsidianHazards: string[] = [];

  const vaultPath = process.env.OBSIDIAN_VAULT_PATH;
  const obsidianMode = resolveObsidianSourceMode(vaultPath, REVOKE_OBSIDIAN);
  if (obsidianMode === "scan" && vaultPath) {
    const obsidian = await collectObsidianDocuments(vaultPath);
    documents.push(...obsidian.documents);
    obsidianReport = obsidian.decisions;
    obsidianScanOk = obsidian.scan.ok;
    obsidianHazards = obsidian.scan.hazards;
    if (obsidian.scan.ok) scannedSources.add("obsidian");
  } else if (obsidianMode === "revoke") {
    scannedSources.add("obsidian");
  }

  return {
    documents,
    scannedSources,
    obsidianReport,
    obsidianScanOk,
    obsidianHazards,
  };
}

function prepareChunks(documents: KnowledgeDocument[]): PreparedKnowledgeChunk[] {
  const chunks: PreparedKnowledgeChunk[] = [];
  for (const document of documents) {
    for (const draft of chunkText(document.title, document.content)) {
      chunks.push({
        source: document.source,
        sourceId: document.sourceId,
        chunkIndex: draft.chunkIndex,
        title: draft.title,
        content: draft.content,
        tier: document.tier,
        contentHash: computeContentHash(document.tier, draft.title, draft.content),
      });
    }
  }
  return chunks;
}

function printObsidianReport(
  report: {
    relativePath: string;
    allowed: boolean;
    tier?: string;
    reason?: string;
  }[]
) {
  if (report.length === 0) return;
  const allowedCount = report.filter((decision) => decision.allowed).length;
  const blockedCount = report.filter((decision) => !decision.allowed).length;
  console.log(`\nObsidian: ${allowedCount} allowed, ${blockedCount} excluded, ${report.length} scanned.`);

  if (VERBOSE_REPORT) {
    console.log("--- Obsidian decisions ---");
    for (const decision of report) {
      const status = decision.allowed ? `ALLOW [${decision.tier}]` : `SKIP (${decision.reason})`;
      console.log(`  ${status} ${decision.relativePath}`);
    }
  }
}

async function revokeObsidianSnapshot(): Promise<void> {
  const { data, error } = (await admin
    .rpc("apply_mcp_knowledge_snapshot", {
      p_rows: [],
      p_inventory: [],
      p_scanned_sources: ["obsidian"],
      p_delete_stale: true,
    })
    .maybeSingle()) as {
    data: { upserted_count: number; deleted_count: number } | null;
    error: unknown;
  };
  if (error || !data || data.upserted_count !== 0) {
    throw new Error("Atomic Obsidian revocation failed.");
  }

  const { count, error: verifyError } = await admin
    .from("knowledge_chunks")
    .select("source", { count: "exact", head: true })
    .eq("source", "obsidian");
  if (verifyError || count !== 0) {
    throw new Error("Obsidian revocation verification failed.");
  }

  console.log(`Deleted ${data.deleted_count} published Obsidian chunk(s).`);
  console.log("Obsidian revocation complete.");
}

async function main() {
  console.log(APPLY ? "Running in APPLY mode." : "Running in DRY-RUN mode (no writes will happen)." );

  if (REVOKE_OBSIDIAN) {
    console.log("\nObsidian revocation requested: the published source inventory will be emptied.");
    if (!APPLY) {
      console.log("\nDry run complete. Re-run with --apply to revoke the published Obsidian source.");
      return;
    }
    await revokeObsidianSnapshot();
    return;
  }

  const collected = await collectAllDocuments();
  const secretHazards = findKnowledgeSecretHazards(collected.documents);
  if (secretHazards.length > 0) {
    throw new Error("Knowledge ingestion refused because a possible secret was detected.");
  }
  const chunks = prepareChunks(collected.documents);
  const bySource = new Map<string, number>();
  for (const chunk of chunks) {
    bySource.set(chunk.source, (bySource.get(chunk.source) ?? 0) + 1);
  }

  console.log("\n--- Chunk counts by source ---");
  for (const [source, count] of bySource) console.log(`  ${source}: ${count} chunk(s)`);
  printObsidianReport(collected.obsidianReport);

  if (!process.env.OBSIDIAN_VAULT_PATH) {
    console.log("\nOBSIDIAN_VAULT_PATH is not set: Obsidian is not scanned or deleted.");
  } else if (!collected.obsidianScanOk) {
    console.log(`\nObsidian scan blocked by ${collected.obsidianHazards.length} safety hazard(s).`);
  }

  if (!APPLY) {
    console.log("\nDry run complete. Re-run with --apply only after reviewing this inventory.");
    return;
  }

  if (!collected.obsidianScanOk) {
    throw new Error("Apply refused because the configured Obsidian scan was incomplete or unsafe.");
  }

  const provider = createEmbeddingProvider();
  if (!provider) {
    throw new Error("Embedding provider configuration is missing or ambiguous.");
  }
  const fingerprint = embeddingFingerprint(provider.config);

  const { data: existingRows, error: existingError } = await admin
    .from("knowledge_chunks")
    .select("source, source_id, chunk_index, content_hash, metadata");
  if (existingError) throw new Error("Could not read the current knowledge inventory.");

  const existing: ExistingChunkIdentity[] = (existingRows ?? []).map((row) => ({
    source: row.source,
    sourceId: row.source_id,
    chunkIndex: row.chunk_index,
    contentHash: row.content_hash,
    embeddingFingerprint:
      row.metadata && typeof row.metadata === "object"
        ? String((row.metadata as Record<string, unknown>).embeddingFingerprint ?? "")
        : null,
  }));

  const plan = buildIngestionPlan(
    chunks,
    existing,
    collected.scannedSources,
    MAX_CHUNKS,
    fingerprint
  );
  console.log(`\n${plan.toEmbed.length} chunk(s) will be embedded in this run.`);
  if (plan.deferredEmbeddingCount > 0) {
    console.log(`${plan.deferredEmbeddingCount} changed chunk(s) deferred by --max-chunks; stale versions are withdrawn.`);
  }

  const rows: Record<string, unknown>[] = [];
  for (let index = 0; index < plan.toEmbed.length; index += 100) {
    const batch = plan.toEmbed.slice(index, index + 100);
    const embeddings = await provider.embedBatch(
      batch.map((chunk) => chunk.content),
      "RETRIEVAL_DOCUMENT"
    );
    if (embeddings.length !== batch.length) {
      throw new Error("Embedding provider returned an incomplete batch.");
    }
    rows.push(
      ...batch.map((chunk, embeddingIndex) => ({
        source: chunk.source,
        source_id: chunk.sourceId,
        chunk_index: chunk.chunkIndex,
        title: chunk.title,
        content: chunk.content,
        content_hash: chunk.contentHash,
        tier_required: chunk.tier,
        embedding: embeddings[embeddingIndex],
        metadata: { embeddingFingerprint: fingerprint },
      }))
    );
  }

  const { data: applied, error: applyError } = (await admin
    .rpc("apply_mcp_knowledge_snapshot", {
      p_rows: rows,
      p_inventory: plan.inventory.map((identity) => ({
        source: identity.source,
        source_id: identity.sourceId,
        chunk_index: identity.chunkIndex,
      })),
      p_scanned_sources: [...collected.scannedSources],
      p_delete_stale: plan.allowDeletion,
    })
    .maybeSingle()) as {
    data: { upserted_count: number; deleted_count: number } | null;
    error: unknown;
  };

  if (applyError || !applied) {
    throw new Error("Atomic knowledge snapshot publication failed.");
  }

  console.log(`\nApplied ${applied.upserted_count} changed chunk(s).`);
  console.log(`Deleted ${applied.deleted_count} stale chunk(s).`);
  console.log("Knowledge ingestion complete.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Knowledge ingestion failed.";
  const safeMessages = new Set([
    "Supabase service role credentials are not configured.",
    "Apply refused because the configured Obsidian scan was incomplete or unsafe.",
    "Embedding provider configuration is missing or ambiguous.",
    "Could not read the current knowledge inventory.",
    "Embedding provider returned an incomplete batch.",
    "Atomic knowledge snapshot publication failed.",
    "Knowledge ingestion refused because a possible secret was detected.",
    "Atomic Obsidian revocation failed.",
    "Obsidian revocation verification failed.",
  ]);
  console.error(safeMessages.has(message) ? message : "Knowledge ingestion failed.");
  process.exit(1);
});
