/** Retire l'en-tête technique d'un fichier de contenu (id, titre, ordre) : il ne se lit ni ne se recherche. */
export function withoutFrontmatter(markdown: string): string {
  return markdown.replace(/^\s*---\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/, "").replace(/^\s+/, "");
}
