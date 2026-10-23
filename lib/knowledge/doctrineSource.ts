import type { KnowledgeDocument } from "./sources";
import type { DoctrineFile } from "../doctrine/publication";
export function doctrineDocuments(files: readonly DoctrineFile[]): KnowledgeDocument[] {
  return files.map(file => ({
    source: "doctrine",
    sourceId: file.path,
    title: file.content.match(/^#\s+(.+)$/m)?.[1]?.trim() || file.path.replace(/\.md$/, ""),
    content: file.content,
    tier: "full",
  }));
}
export async function collectDoctrineDocuments(): Promise<KnowledgeDocument[]> {
  const [{ CHAPTER_META }, { allHermesMarkdown, hermesIntroductionMarkdown }] = await Promise.all([
    import("../../app/videos/tutos/chapters"),
    import("../hermes/content"),
  ]);
  const chapters = doctrineDocuments(allHermesMarkdown()).map((document) => ({
    ...document,
    title: CHAPTER_META[document.sourceId]?.displayTitle ?? document.title,
    metadata: { kind: "chapter" },
  }));
  return [{
    source: "doctrine",
    sourceId: "introduction:hermes",
    title: "Hermes Agent : de zéro à ton premier workflow",
    content: hermesIntroductionMarkdown(),
    tier: "full",
    metadata: { kind: "introduction" },
  }, ...chapters];
}
