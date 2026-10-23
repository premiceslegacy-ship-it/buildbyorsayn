import { readFileSync } from "node:fs";
import path from "node:path";
import type { DoctrineFile } from "@/lib/doctrine/publication";

const CONTENT_ROOT = path.join(process.cwd(), "content", "hermes");

export const HERMES_CHAPTER_PATHS = [
  "README.md",
  "01-diagnostic-et-offre.md",
  "02-decomposition-et-agents.md",
  "03-connaissance-memoire-contexte.md",
  "04-evenements-inbox-execution.md",
  "05-autorite-outils-couts.md",
  "08-pilote-comprehensible.md",
  "08-dossier-final-et-passation.md",
  "06-preuve-iteration-skills.md",
  "07-methode-offre-transmission.md",
  "09-message-decision-preuve.md",
  "10-qualification-experimentation-premiere-valeur.md",
  "entreprise-01-cerveau-federe.md",
  "entreprise-02-cartographie-poles.md",
  "entreprise-formats.md",
  "entreprise-04-competences-skills-sop.md",
  "entreprise-05-outils-api-cli-mcp.md",
  "entreprise-06-workflows-interpoles.md",
  "entreprise-07-adoption-preuves-promotion.md",
  "entreprise-09-gouvernance-capacites-et-reprise.md",
] as const;

export type HermesChapterPath = (typeof HERMES_CHAPTER_PATHS)[number];

const cache = new Map<string, string>();

function readMarkdown(fileName: string): string {
  const cached = cache.get(fileName);
  if (cached !== undefined) return cached;

  const content = readFileSync(path.join(CONTENT_ROOT, fileName), "utf8");
  cache.set(fileName, content);
  return content;
}

export function hermesMarkdown(chapterPath: HermesChapterPath): string {
  return readMarkdown(chapterPath);
}

export function hermesIntroductionMarkdown(): string {
  return readMarkdown("introduction.md");
}

export function allHermesMarkdown(): DoctrineFile[] {
  return HERMES_CHAPTER_PATHS.map((chapterPath) => ({
    path: chapterPath,
    content: hermesMarkdown(chapterPath),
  }));
}
