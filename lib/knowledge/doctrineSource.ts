import type { KnowledgeDocument } from "./sources";
import type { DoctrineFile } from "../doctrine/publication";
export function doctrineDocuments(files: DoctrineFile[]): KnowledgeDocument[] {
  return files.map(file => ({
    source: "doctrine",
    sourceId: file.path,
    title: file.content.match(/^#\s+(.+)$/m)?.[1]?.trim() || file.path.replace(/\.md$/, ""),
    content: file.content,
    tier: "full",
  }));
}
export async function collectDoctrineDocuments(): Promise<KnowledgeDocument[]> {
  const { readPublishedDoctrine } = await import("../doctrine/storage");
  return doctrineDocuments(await readPublishedDoctrine());
}
