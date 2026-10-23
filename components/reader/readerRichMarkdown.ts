export type ReaderDirectiveKind = "avant-apres" | "exemple" | "retiens";

export type ReaderDirective = {
  kind: ReaderDirectiveKind;
  title?: string;
  content: string;
  endIndex: number;
};

export type BeforeAfterPair = {
  before: string;
  after: string;
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

export function parseBeforeAfterPairs(content: string): BeforeAfterPair[] {
  const pairs: BeforeAfterPair[] = [];
  let current: BeforeAfterPair | null = null;
  let field: keyof BeforeAfterPair | null = null;

  const commit = () => {
    if (!current) return;
    const pair = {
      before: current.before.trim(),
      after: current.after.trim(),
      why: current.why.trim(),
    };
    if (pair.before || pair.after || pair.why) pairs.push(pair);
    current = null;
    field = null;
  };

  for (const sourceLine of content.replace(/\r\n?/g, "\n").split("\n")) {
    const line = sourceLine.trim();
    const marker = line.match(/^(Avant|Après|Apres|Pourquoi)\s*:\s*(.*)$/i);
    if (marker) {
      const label = marker[1].toLocaleLowerCase("fr");
      const nextField: keyof BeforeAfterPair = label === "avant" ? "before" : label === "pourquoi" ? "why" : "after";
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
