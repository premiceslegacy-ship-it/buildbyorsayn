import { createElement as h, type ReactNode } from "react";

export type DoctrineFile = { path: string; content: string };

export function stripFrontmatter(content: string): string {
  const text = content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!text.startsWith("---\n")) return text;
  const end = text.slice(4).search(/^(?:---|\.\.\.)\s*$/m);
  // Fail closed on an unterminated metadata block.
  return end < 0 ? "" : text.slice(4 + end).replace(/^[^\n]*(?:\n|$)/, "");
}

export function chapterTitle(file: DoctrineFile): string {
  return stripFrontmatter(file.content).match(/^#\s+(.+?)\s*#*$/m)?.[1] || file.path.replace(/\.md$/, "");
}

export function doctrineHref(destination: string, file: DoctrineFile, files: readonly DoctrineFile[]): string | undefined {
  if (/[\s\\\u0000-\u001f\u007f]/.test(destination)) return undefined;
  if (/^https?:\/\//i.test(destination)) {
    try { const url = new URL(destination); return url.hostname && !url.username && !url.password ? destination : undefined; } catch { return undefined; }
  }
  // Local links resolve only against the verified inventory, never arbitrary routes.
  let path: string;
  try { path = decodeURIComponent(destination.split("#")[0]); } catch { return undefined; }
  if (path.startsWith("./")) path = path.slice(2);
  if (!path && destination.startsWith("#")) path = file.path;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.md$/.test(path)) return undefined;
  const index = files.findIndex(entry => entry.path === path);
  return index < 0 ? undefined : `#chapitre-${index}`;
}

function inline(text: string, file: DoctrineFile, files: readonly DoctrineFile[]): ReactNode[] {
  const result: ReactNode[] = [];
  const tokens = /(`[^`\n]+`|\[[^\]\n]+\]\([^\s)]+\)|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    result.push(text.slice(offset, match.index));
    const token = match[0];
    const link = token.match(/^\[([^\]]+)\]\((.+)\)$/);
    if (link) {
      const href = doctrineHref(link[2], file, files);
      result.push(href ? h("a", { key: match.index, href, rel: href.startsWith("http") ? "noreferrer noopener" : undefined }, inline(link[1], file, files)) : link[1]);
    } else {
      result.push(h(token.startsWith("`") ? "code" : token.startsWith("**") ? "strong" : "em", { key: match.index }, token.slice(token.startsWith("**") ? 2 : 1, token.startsWith("**") ? -2 : -1)));
    }
    offset = match.index! + token.length;
  }
  result.push(text.slice(offset));
  return result;
}

/** Deliberately constrained Markdown; React escapes all text, never HTML. */
export function DoctrineMarkdown({ file, files }: { file: DoctrineFile; files: readonly DoctrineFile[] }) {
  const renderInline = (text: string) => inline(text, file, files);
  const lines = stripFrontmatter(file.content).split("\n");
  const blocks: ReactNode[] = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*(`{3,}|~{3,})[^`]*$/);
    if (fence) {
      const key = i++; const code: string[] = [];
      const close = new RegExp(`^\\s*${fence[1][0]}{${fence[1].length},}\\s*$`);
      while (i < lines.length && !close.test(lines[i])) code.push(lines[i++]);
      if (i < lines.length) i++;
      blocks.push(h("pre", { key }, h("code", null, code.join("\n")))); continue;
    }
    if (/^\s*\|/.test(line) && /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[i + 1] || "")) {
      const key = i;
      const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
      const headers = cells(line); i += 2; const rows: ReactNode[] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        const values = cells(lines[i]);
        rows.push(h("tr", { key: i++ }, headers.map((_, index) => h("td", { key: index }, renderInline(values[index] || "")))));
      }
      blocks.push(h("div", { key, className: "doctrine-table", role: "region", "aria-label": `Tableau : ${headers.join(", ")}`, tabIndex: 0 },
        h("table", null, h("thead", null, h("tr", null, headers.map((cell, index) => h("th", { key: index, scope: "col" }, renderInline(cell))))), h("tbody", null, rows)))); continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      blocks.push(h(`h${Math.min(6, heading[1].length + 1)}`, { key: i }, renderInline(heading[2]))); i++; continue;
    }
    const list = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
    if (list) {
      const ordered = !!list[2]; const items: ReactNode[] = []; const key = i;
      while (i < lines.length) {
        const item = lines[i].match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
        if (!item || !!item[2] !== ordered) break;
        items.push(h("li", { key: i }, renderInline(item[3]))); i++;
      }
      blocks.push(h(ordered ? "ol" : "ul", { key, ...(ordered ? { start: Number(list[2]) } : {}) }, items)); continue;
    }
    const paragraph = [line]; const key = i++;
    while (i < lines.length && lines[i].trim() && !/^(?:#{1,6}\s|\s*(?:[-+*]|\d+\.)\s)/.test(lines[i])) paragraph.push(lines[i++]);
    blocks.push(h("p", { key }, renderInline(paragraph.join("\n"))));
  }
  return h("div", { className: "doctrine-markdown" }, blocks);
}
