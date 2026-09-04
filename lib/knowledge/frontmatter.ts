import { parseDocument } from "yaml";

export type ParsedFrontmatter = {
  fields: Record<string, string>;
  bodyStartLine: number;
  body: string;
};

/**
 * Parses a line-one YAML frontmatter block with duplicate keys and aliases
 * rejected. Only a flat mapping of scalar values is accepted. Ambiguous or
 * structured metadata returns null so callers fail closed.
 */
export function parseFrontmatter(raw: string): ParsedFrontmatter | null {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  if (lines[0]?.trim() !== "---") return null;

  let endLine = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === "---") {
      endLine = index;
      break;
    }
  }
  if (endLine === -1) return null;

  const yamlSource = lines.slice(1, endLine).join("\n");
  let parsed: unknown;
  try {
    const document = parseDocument(yamlSource, {
      schema: "core",
      uniqueKeys: true,
    });
    if (document.errors.length > 0 || document.warnings.length > 0) return null;
    parsed = document.toJS({ maxAliasCount: 0 });
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

  const fields = Object.create(null) as Record<string, string>;
  for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(key)) return null;
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
      return null;
    }
    fields[key] = String(value).trim();
  }

  return {
    fields,
    bodyStartLine: endLine + 1,
    body: lines.slice(endLine + 1).join("\n"),
  };
}
