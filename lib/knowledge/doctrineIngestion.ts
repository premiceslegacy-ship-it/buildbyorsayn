import { doctrineInventory } from "../doctrine/inventory";
import type { DoctrineFile } from "../doctrine/publication";
import { doctrineDocuments } from "./doctrineSource";
import { chunkText, computeContentHash } from "./chunk";
import { buildIngestionPlan } from "./ingestionPlan";
import { findKnowledgeSecretHazards } from "./safety";
import { normalizeAndValidateEmbedding } from "./embeddings";

export type DoctrineRow = {
  source: string; source_id: string; chunk_index: number;
  title: string; content: string; content_hash: string; tier_required: string;
  metadata: { embeddingFingerprint?: string };
};
export type InventoryPage = { rows: DoctrineRow[]; total: number };
const key = (row: DoctrineRow) => JSON.stringify([row.source, row.source_id, row.chunk_index]);

/** Exact count plus actual page length: never confuse server caps with EOF. */
export async function readDoctrineInventory(readPage: (offset: number, limit: number) => Promise<InventoryPage>): Promise<DoctrineRow[]> {
  const result: DoctrineRow[] = [];
  const seen = new Set<string>();
  let total: number | undefined;
  do {
    const page = await readPage(result.length, 500);
    if (!Number.isSafeInteger(page.total) || page.total < 0 || page.total > 100_000 ||
        (total !== undefined && page.total !== total) || !Array.isArray(page.rows) || page.rows.length > 500) throw new Error("Invalid inventory page");
    total = page.total;
    if ((!page.rows.length && result.length < total) || result.length + page.rows.length > total) throw new Error("Incomplete inventory");
    for (const row of page.rows) {
      if (row.source !== "doctrine" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.md$/.test(row.source_id) ||
          !Number.isSafeInteger(row.chunk_index) || row.chunk_index < 0 ||
          typeof row.title !== "string" || typeof row.content !== "string" ||
          !/^[a-f0-9]{64}$/.test(row.content_hash) || row.tier_required !== "full" ||
          !row.metadata || typeof row.metadata !== "object" || seen.has(key(row))) throw new Error("Invalid doctrine inventory row");
      seen.add(key(row)); result.push(row);
    }
  } while (result.length < total);
  return result;
}

export type DoctrineDependencies = {
  /** Production must use readPublishedDoctrine: no filesystem fallback. */
  readPublished: () => Promise<DoctrineFile[]>;
  readPage: (offset: number, limit: number) => Promise<InventoryPage>;
  fingerprint: string;
  embed: (texts: string[]) => Promise<number[][]>;
  lock: <T>(operation: () => Promise<T>) => Promise<T>;
  apply: (payload: { rows: DoctrineRow[]; inventory: DoctrineRow[]; deleteStale: boolean }) => Promise<void>;
};
export type DoctrineOptions = { apply: boolean; maxChunks?: number; exclusiveWritersConfirmed?: boolean; lockSchemaConfirmed?: boolean };

export async function runDoctrineIngestion(deps: DoctrineDependencies, options: DoctrineOptions) {
  if (typeof options.apply !== "boolean" || !/^[a-f0-9]{64}$/.test(deps.fingerprint) ||
      (options.maxChunks !== undefined && (!Number.isSafeInteger(options.maxChunks) || options.maxChunks <= 0))) throw new Error("Invalid ingestion options");
  if (options.apply && (options.exclusiveWritersConfirmed !== true || options.lockSchemaConfirmed !== true)) throw new Error("Unconfirmed ingestion prerequisite");
  const canonical = (rows: DoctrineRow[]) => JSON.stringify(rows.map(row => [key(row), row.title, row.content,
    row.content_hash, row.tier_required, row.metadata.embeddingFingerprint]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
  const sourceSignature = (files: DoctrineFile[]) => JSON.stringify(files.map(f => [f.path, f.content]).sort((a, b) => a[0].localeCompare(b[0])));
  const operation = async () => {
  const files = await deps.readPublished();
  const order = doctrineInventory(files.map(file => file.path));
  const documents = doctrineDocuments(order.map(path => files.find(file => file.path === path)!));
  if (documents.some(doc => !doc.content.trim() || doc.title.length > 500)) throw new Error("Invalid doctrine document");
  if (findKnowledgeSecretHazards(documents).length) throw new Error("Unsafe doctrine content");
  const prepared = documents.flatMap(doc => chunkText(doc.title, doc.content).map(chunk => ({
    ...chunk, source: "doctrine", sourceId: doc.sourceId, tier: "full" as const,
    contentHash: computeContentHash("full", chunk.title, chunk.content),
  })));
  const existing = await readDoctrineInventory(deps.readPage);
  // Freeze read evidence before asynchronous provider work (adapters may reuse objects).
  const initialInventory = canonical(existing);
  const initialSource = sourceSignature(files);
  const plan = buildIngestionPlan(prepared, existing.map(row => ({ source: row.source, sourceId: row.source_id,
    chunkIndex: row.chunk_index, contentHash: row.content_hash, embeddingFingerprint: row.metadata.embeddingFingerprint })),
    new Set(["doctrine"]), options.maxChunks ?? Infinity, deps.fingerprint);
  const expected: DoctrineRow[] = prepared.map(chunk => ({ source: "doctrine", source_id: chunk.sourceId,
    chunk_index: chunk.chunkIndex, title: chunk.title, content: chunk.content, content_hash: chunk.contentHash,
    tier_required: "full", metadata: { embeddingFingerprint: deps.fingerprint } }));
  const selected = new Set(plan.toEmbed.map(chunk => JSON.stringify([chunk.source, chunk.sourceId, chunk.chunkIndex])));
  const rows = expected.filter(row => selected.has(key(row)));
  const desiredKeys = new Set(expected.map(key));
  const stale = existing.filter(row => !desiredKeys.has(key(row)));
  const partial = plan.deferredEmbeddingCount > 0;
  const finalExpected = partial ? [...existing.filter(row => !selected.has(key(row))), ...rows] : expected;
  const result = { status: "dry-run", toEmbed: plan.toEmbed, expected: finalExpected, stale, deferred: plan.deferredEmbeddingCount, deleteStale: !partial };
  if (!options.apply) return result;
  const embedded: (DoctrineRow & { embedding: number[] })[] = [];
  for (let offset = 0; offset < rows.length; offset += 100) {
    const batch = rows.slice(offset, offset + 100);
    const vectors = await deps.embed(batch.map(row => row.content));
    if (vectors.length !== batch.length) throw new Error("Incomplete embeddings");
    embedded.push(...batch.map((row, i) => ({ ...row, embedding: normalizeAndValidateEmbedding(vectors[i]) })));
  }
  if (sourceSignature(await deps.readPublished()) !== initialSource ||
      canonical(await readDoctrineInventory(deps.readPage)) !== initialInventory) throw new Error("Doctrine pre-apply drift");
  if (rows.length || (!partial && stale.length)) await deps.apply({ rows: embedded, inventory: finalExpected, deleteStale: !partial });
  const actual = await readDoctrineInventory(deps.readPage);
  if (canonical(actual) !== canonical(finalExpected)) throw new Error("Doctrine readback mismatch");
  return { ...result, status: partial ? "partial" : "complete" };
  };
  return options.apply ? deps.lock(operation) : operation();
}

