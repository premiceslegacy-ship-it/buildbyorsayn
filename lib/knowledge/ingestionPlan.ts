import type { McpTier } from "@/lib/mcpAccess";

export type PreparedKnowledgeChunk = {
  source: string;
  sourceId: string;
  chunkIndex: number;
  title: string;
  content: string;
  tier: McpTier;
  contentHash: string;
};

export type ExistingChunkIdentity = {
  source: string;
  sourceId: string;
  chunkIndex: number;
  contentHash: string;
  embeddingFingerprint?: string | null;
};

export type ChunkIdentity = Pick<
  ExistingChunkIdentity,
  "source" | "sourceId" | "chunkIndex"
>;

function identityKey(identity: ChunkIdentity): string {
  return JSON.stringify([identity.source, identity.sourceId, identity.chunkIndex]);
}

export function parseMaxChunks(argument: string | undefined): number {
  if (argument === undefined) return Number.POSITIVE_INFINITY;
  const match = /^--max-chunks=(.+)$/.exec(argument);
  if (!match) throw new Error("Invalid --max-chunks argument.");
  const value = Number(match[1]);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error("--max-chunks must be a positive integer.");
  }
  return value;
}

/**
 * Builds a complete inventory independently from the optional embedding
 * limit. A complete source scan always withdraws absent or changed rows;
 * a limited run keeps only unchanged rows plus changes embedded in that run.
 */
export function buildIngestionPlan(
  prepared: PreparedKnowledgeChunk[],
  existing: ExistingChunkIdentity[],
  scannedSources: ReadonlySet<string>,
  maxChunks: number,
  currentEmbeddingFingerprint?: string
) {
  const existingByKey = new Map(existing.map((row) => [identityKey(row), row]));
  const changed = prepared.filter((chunk) => {
    const row = existingByKey.get(identityKey(chunk));
    if (!row || row.contentHash !== chunk.contentHash) return true;
    return Boolean(
      currentEmbeddingFingerprint &&
        row.embeddingFingerprint !== currentEmbeddingFingerprint
    );
  });

  const toEmbed = changed.slice(0, Number.isFinite(maxChunks) ? maxChunks : changed.length);
  const changedKeys = new Set(changed.map(identityKey));
  const selectedKeys = new Set(toEmbed.map(identityKey));
  const inventory = prepared
    .filter((chunk) => !changedKeys.has(identityKey(chunk)) || selectedKeys.has(identityKey(chunk)))
    .map<ChunkIdentity>((chunk) => ({
      source: chunk.source,
      sourceId: chunk.sourceId,
      chunkIndex: chunk.chunkIndex,
    }));
  const expectedKeys = new Set(inventory.map(identityKey));
  const stale = existing.filter(
    (row) => scannedSources.has(row.source) && !expectedKeys.has(identityKey(row))
  );

  return {
    inventory,
    toEmbed,
    deferredEmbeddingCount: Math.max(0, changed.length - maxChunks),
    stale,
    allowDeletion: true,
  };
}
