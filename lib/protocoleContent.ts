import { readFileSync } from "node:fs";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "app", "protocole", "content");

const cache = new Map<string, string>();

function readMarkdown(fileName: string): string {
  const cached = cache.get(fileName);
  if (cached !== undefined) return cached;

  const content = readFileSync(path.join(CONTENT_ROOT, fileName), "utf8");
  cache.set(fileName, content);
  return content;
}

export function protocoleIntroductionMarkdown(): string {
  return readMarkdown("introduction.md");
}

export function protocoleMarkdown(): string {
  return readMarkdown("protocole-zero.md");
}

function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\s*/, "");
}

function splitAt(content: string, heading: string): [string, string] {
  const index = content.indexOf(heading);
  if (index < 0) throw new Error(`Section Protocole introuvable : ${heading}`);
  return [content.slice(0, index).trim(), content.slice(index).trim()];
}

const body = stripFrontmatter(protocoleMarkdown());
const [absorption, afterAbsorption] = splitAt(body, "## Va chercher une réponse sur le terrain");
const [production, distillation] = splitAt(afterAbsorption, "## Sors la méthode de ta tête");

/**
 * Identifiants historiques conservés pour l'ingestion du corpus.
 * L'interface affiche désormais un seul chapitre continu, mais les trois
 * documents restent stables pour ne pas déplacer les lignes déjà indexées.
 */
export const PHASES = [
  {
    num: "01",
    titre: "Absorber",
    label: "Choisir et apprendre une tâche",
    duree: "",
    douleur: absorption,
    solution: [] as string[],
    citation: "",
  },
  {
    num: "02",
    titre: "Produire",
    label: "Confronter la fiche au terrain",
    duree: "",
    douleur: production,
    solution: [] as string[],
    citation: "",
  },
  {
    num: "03",
    titre: "Distiller",
    label: "Garder ce qui résiste au réel",
    duree: "",
    douleur: distillation,
    solution: [] as string[],
    citation: "",
  },
] as const;
