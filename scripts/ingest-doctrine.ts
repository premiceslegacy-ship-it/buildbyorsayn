import { pathToFileURL } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readPublishedDoctrine } from "../lib/doctrine/storage";
import { withDoctrinePublicationLock } from "../lib/doctrine/publication";
import { createEmbeddingProvider, embeddingFingerprint, resolveEmbeddingConfig } from "../lib/knowledge/embeddings";
import { runDoctrineIngestion, type DoctrineDependencies, type DoctrineOptions, type DoctrineRow } from "../lib/knowledge/doctrineIngestion";

export function parseDoctrineArgs(args: string[]): DoctrineOptions {
  const seen = new Set<string>();
  const options: DoctrineOptions = { apply: false, exclusiveWritersConfirmed: false, lockSchemaConfirmed: false };
  for (const arg of args) {
    const name = arg.split("=")[0];
    if (seen.has(name)) throw new Error("Duplicate option");
    seen.add(name);
    if (arg === "--apply") options.apply = true;
    else if (arg === "--exclusive-writers-confirmed") options.exclusiveWritersConfirmed = true;
    else if (arg === "--lock-schema-confirmed") options.lockSchemaConfirmed = true;
    else if (/^--max-chunks=[1-9][0-9]*$/.test(arg)) {
      options.maxChunks = Number(arg.split("=")[1]);
      if (!Number.isSafeInteger(options.maxChunks)) throw new Error("Invalid chunk cap");
    } else throw new Error("Unknown or invalid option");
  }
  return options;
}

/** Uses only doctrine-scoped reads and the existing atomic snapshot RPC. */
export function createDoctrineDependencies(admin: SupabaseClient, fingerprint: string, embed: DoctrineDependencies["embed"]): DoctrineDependencies {
  return {
    fingerprint, embed, readPublished: readPublishedDoctrine,
    lock: operation => withDoctrinePublicationLock(admin, operation),
    readPage: async (offset, limit) => {
      const { data, count, error } = await admin.from("knowledge_chunks")
        .select("source,source_id,chunk_index,title,content,content_hash,tier_required,metadata", { count: "exact" })
        .eq("source", "doctrine").order("source_id").order("chunk_index")
        .range(offset, offset + limit - 1);
      if (error || count === null || !data) throw new Error("Doctrine inventory unavailable");
      return { rows: data as DoctrineRow[], total: count };
    },
    apply: async payload => {
      if (payload.rows.some(row => row.source !== "doctrine" || row.tier_required !== "full") ||
          payload.inventory.some(row => row.source !== "doctrine")) throw new Error("Invalid snapshot scope");
      const { data, error } = await admin.rpc("apply_mcp_knowledge_snapshot", {
        p_rows: payload.rows,
        p_inventory: payload.inventory.map(row => ({ source: "doctrine", source_id: row.source_id, chunk_index: row.chunk_index })),
        p_scanned_sources: ["doctrine"], p_delete_stale: payload.deleteStale,
      }).maybeSingle();
      const applied = data as { upserted_count: number; deleted_count: number } | null;
      if (error || !applied || applied.upserted_count !== payload.rows.length ||
          !Number.isSafeInteger(applied.deleted_count) || applied.deleted_count < 0 ||
          (!payload.deleteStale && applied.deleted_count !== 0)) throw new Error("Doctrine snapshot apply unverified");
    },
  };
}

export async function main(args = process.argv.slice(2)) {
  // Deliberately no dotenv: operator must supply an approved environment explicitly.
  const options = parseDoctrineArgs(args);
  if (options.apply && (!options.exclusiveWritersConfirmed || !options.lockSchemaConfirmed)) throw new Error("Unconfirmed ingestion prerequisite");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const credential = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !credential || new URL(url).protocol !== "https:") throw new Error("Missing operator configuration");
  const fingerprint = embeddingFingerprint(resolveEmbeddingConfig(process.env));
  const admin = createClient(url, credential, { auth: { persistSession: false, autoRefreshToken: false }, global: {
    fetch: (input, init) => fetch(input, { ...init, redirect: "error", signal: AbortSignal.any([AbortSignal.timeout(15_000), ...(init?.signal ? [init.signal] : [])]) }),
  } });
  const deps = createDoctrineDependencies(admin, fingerprint, async texts => {
    const provider = createEmbeddingProvider();
    if (!provider || embeddingFingerprint(provider.config) !== fingerprint) throw new Error("Embedding configuration drift");
    return provider.embedBatch(texts, "RETRIEVAL_DOCUMENT");
  });
  const result = await runDoctrineIngestion(deps, options);
  const identity = (row: DoctrineRow) => ({ source: row.source, sourceId: row.source_id, chunkIndex: row.chunk_index, contentHash: row.content_hash, embeddingFingerprint: row.metadata.embeddingFingerprint, tier: row.tier_required });
  // No private contents, credentials or titles in operator stdout.
  console.log(JSON.stringify({ status: result.status, snapshotAdvisory: !options.apply, fingerprint,
    changed: result.toEmbed.map(row => ({ source: row.source, sourceId: row.sourceId, chunkIndex: row.chunkIndex, contentHash: row.contentHash })),
    stale: result.stale.map(identity), deleteStale: result.deleteStale, deferred: result.deferred,
    expected: result.expected.map(identity), finalCount: result.expected.length }, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { console.error("Doctrine ingestion failed; any acquired lock is retained. Resolve in-flight writes and inspect exact state before recovery."); process.exitCode = 1; });
}
