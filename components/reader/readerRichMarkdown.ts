export type ReaderDirectiveKind = "avant-apres" | "exemple" | "retiens";

export type ReaderDirective = {
  kind: ReaderDirectiveKind;
  title?: string;
  content: string;
  endIndex: number;
};

export type BeforeAfterKind = "web-page" | "button" | "email" | "ad" | "message" | "video" | "text";

export type BeforeAfterSide = {
  text: string;
  context?: string;
};

export type BeforeAfterPair = {
  before: BeforeAfterSide;
  after: BeforeAfterSide;
  context?: string;
  contextLabel?: string;
  kind: BeforeAfterKind;
  why: string;
};

const DIRECTIVE_OPEN = /^:::(retiens|avant-apres|exemple)(?:\s+(.+?))?\s*$/i;

export function parseDirectiveOpening(line: string): { kind: ReaderDirectiveKind; title?: string } | null {
  const match = line.trim().match(DIRECTIVE_OPEN);
  if (!match) return null;
  return {
    kind: match[1].toLowerCase() as ReaderDirectiveKind,
    title: match[2]?.trim() || undefined,
  };
}

export function parseReaderDirective(lines: readonly string[], startIndex: number): ReaderDirective | null {
  const opening = parseDirectiveOpening(lines[startIndex] ?? "");
  if (!opening) return null;

  let depth = 1;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (parseDirectiveOpening(lines[index])) {
      depth += 1;
      continue;
    }
    if (lines[index].trim() !== ":::") continue;
    depth -= 1;
    if (depth === 0) {
      return {
        ...opening,
        content: lines.slice(startIndex + 1, index).join("\n").trim(),
        endIndex: index,
      };
    }
  }

  return null;
}

function normalizedContext(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'")
    .toLocaleLowerCase("fr");
}

export function beforeAfterKind(context?: string): BeforeAfterKind {
  if (!context) return "text";
  const value = normalizedContext(context);
  if (/\b(?:h1|sous[ -]?titre|titre)\b/.test(value)) return "web-page";
  if (/\b(?:bouton|cta)\b/.test(value)) return "button";
  if (/\b(?:objet\s+d[' -]?e[ -]?mail|e[ -]?mail)\b/.test(value)) return "email";
  if (/\b(?:accroche\s+de\s+pub|publicite|annonce|pub)\b/.test(value)) return "ad";
  if (/\b(?:message|dm|prospection|relance)\b/.test(value)) return "message";
  if (/\b(?:script|video\s+courte|hook)\b/.test(value)) return "video";
  return "text";
}

export function formatBeforeAfterContext(context?: string): string | undefined {
  if (!context) return undefined;
  const compact = context
    .replace(/\s*:\s*$/, "")
    .replace(/\s+(?:d['’](?:un|une)|du|de la|des|pour (?:un|une|le|la|les))\s+/i, " · ")
    .replace(/\s+/g, " ")
    .trim();
  return compact ? `${compact.charAt(0).toLocaleUpperCase("fr")}${compact.slice(1)}` : undefined;
}

export function parseBeforeAfterSide(value: string): BeforeAfterSide {
  const source = value.trim();
  const quoteStart = source.indexOf("«");
  const quoteEnd = quoteStart >= 0 ? source.indexOf("»", quoteStart + 1) : -1;
  if (quoteStart < 0 || quoteEnd < 0) return { text: source };

  const context = source.slice(0, quoteStart).replace(/\s*:\s*$/, "").trim() || undefined;
  return {
    text: source.slice(quoteStart + 1, quoteEnd).trim(),
    context,
  };
}

export function parseBeforeAfterPairs(content: string): BeforeAfterPair[] {
  const pairs: BeforeAfterPair[] = [];
  let current: { before: string; after: string; why: string } | null = null;
  let field: "before" | "after" | "why" | null = null;

  const commit = () => {
    if (!current) return;
    const before = parseBeforeAfterSide(current.before);
    const after = parseBeforeAfterSide(current.after);
    const context = before.context ?? after.context;
    if (context) {
      before.context ??= context;
      after.context ??= context;
    }
    const why = current.why.trim();
    if (before.text || after.text || why) pairs.push({
      before,
      after,
      context,
      contextLabel: formatBeforeAfterContext(context),
      kind: beforeAfterKind(context),
      why,
    });
    current = null;
    field = null;
  };

  for (const sourceLine of content.replace(/\r\n?/g, "\n").split("\n")) {
    const line = sourceLine.trim();
    const marker = line.match(/^(Avant|Après|Apres|Pourquoi)\s*:\s*(.*)$/i);
    if (marker) {
      const label = marker[1].toLocaleLowerCase("fr");
      const nextField: "before" | "after" | "why" = label === "avant" ? "before" : label === "pourquoi" ? "why" : "after";
      if (nextField === "before") {
        commit();
        current = { before: "", after: "", why: "" };
      } else if (!current) {
        current = { before: "", after: "", why: "" };
      }
      field = nextField;
      current[field] = marker[2].trim();
      continue;
    }
    if (!line || !current || !field) continue;
    current[field] = `${current[field]} ${line}`.trim();
  }

  commit();
  return pairs;
}

export function splitExampleContent(content: string): { body: string; profession?: string } {
  const body: string[] = [];
  let profession: string | undefined;
  for (const line of content.split("\n")) {
    const match = line.trim().match(/^Métier\s*:\s*(.+)$/i);
    if (match && !profession) profession = match[1].trim();
    else body.push(line);
  }
  return { body: body.join("\n").trim(), profession };
}
