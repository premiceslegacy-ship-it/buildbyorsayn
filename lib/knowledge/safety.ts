import { containsSecret } from "@/lib/knowledge/obsidianGate";
import type { KnowledgeDocument } from "@/lib/knowledge/sources";

export type KnowledgeSecretHazard = Pick<KnowledgeDocument, "source" | "sourceId">;

export function findKnowledgeSecretHazards(
  documents: readonly KnowledgeDocument[]
): KnowledgeSecretHazard[] {
  return documents
    .filter((document) => containsSecret(`${document.sourceId}\n${document.title}\n${document.content}`))
    .map((document) => ({
      source: document.source,
      sourceId: containsSecret(document.sourceId) ? "[REDACTED]" : document.sourceId,
    }));
}
