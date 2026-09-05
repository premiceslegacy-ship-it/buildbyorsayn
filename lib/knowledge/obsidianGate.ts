import path from "node:path";
import { constants } from "node:fs";
import { lstat, open, realpath, stat } from "node:fs/promises";
import { parseFrontmatter } from "@/lib/knowledge/frontmatter";
import type { McpTier } from "@/lib/mcpAccess";

const BUILD_TIER_TO_MCP_TIER: Readonly<Record<string, McpTier>> = Object.freeze({
  preview: "preview",
  fondations: "beginner",
  coffre: "full",
});

const ALLOWED_STATUSES = new Set(["living", "published", "active", "approved", "stable"]);
const ALLOWED_AUTHORITIES = new Set(["synthesis", "internal", "original", "orsayn"]);
const ALLOWED_SENSITIVITIES = new Set(["public", "shareable", "training"]);
const HARD_EXCLUDE_SEGMENTS = ["private", "journal", "perso", ".trash", ".obsidian"];

export type ObsidianGateResult =
  | {
      allowed: true;
      tier: McpTier;
      title: string;
      fields: Record<string, string>;
      body: string;
    }
  | { allowed: false; reason: string; blocking?: boolean };

/**
 * Rejects lexical escapes, a symlinked vault root, a symlink at any path
 * component, and any real path outside the canonical vault root.
 */
export async function isPathConfinedToVault(
  filePath: string,
  vaultRoot: string
): Promise<boolean> {
  const resolvedRoot = path.resolve(vaultRoot);
  const resolvedFile = path.resolve(filePath);
  const relative = path.relative(resolvedRoot, resolvedFile);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return false;

  try {
    const rootStats = await lstat(resolvedRoot);
    if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) return false;

    let current = resolvedRoot;
    for (const segment of relative.split(path.sep)) {
      current = path.join(current, segment);
      const stats = await lstat(current);
      if (stats.isSymbolicLink()) return false;
    }

    const canonicalRoot = await realpath(resolvedRoot);
    const canonicalFile = await realpath(resolvedFile);
    const canonicalRelative = path.relative(canonicalRoot, canonicalFile);
    return Boolean(
      canonicalRelative &&
        !canonicalRelative.startsWith("..") &&
        !path.isAbsolute(canonicalRelative)
    );
  } catch {
    return false;
  }
}

export type ConfinedUtf8File = {
  text: string;
  bytesRead: number;
};

export async function readConfinedUtf8FileBounded(
  filePath: string,
  vaultRoot: string,
  maxBytes: number
): Promise<ConfinedUtf8File | null> {
  if (!Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > 64 * 1024 * 1024) return null;
  const resolvedFile = path.resolve(filePath);
  if (!(await isPathConfinedToVault(resolvedFile, vaultRoot))) return null;

  let handle;
  try {
    handle = await open(resolvedFile, constants.O_RDONLY | constants.O_NOFOLLOW);
    const openedStats = await handle.stat();
    if (!openedStats.isFile() || openedStats.size > maxBytes) return null;

    const canonicalRoot = await realpath(path.resolve(vaultRoot));
    const canonicalFile = await realpath(resolvedFile);
    const relative = path.relative(canonicalRoot, canonicalFile);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;

    const canonicalStats = await stat(canonicalFile);
    if (canonicalStats.dev !== openedStats.dev || canonicalStats.ino !== openedStats.ino) return null;
    if (!(await isPathConfinedToVault(resolvedFile, vaultRoot))) return null;

    const buffer = Buffer.allocUnsafe(maxBytes);
    let bytesRead = 0;
    while (bytesRead < maxBytes) {
      const next = await handle.read(buffer, bytesRead, maxBytes - bytesRead, bytesRead);
      if (next.bytesRead === 0) break;
      bytesRead += next.bytesRead;
    }
    const finalStats = await handle.stat();
    if (!finalStats.isFile() || finalStats.size > maxBytes) return null;

    const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, bytesRead));
    return { text, bytesRead };
  } catch {
    return null;
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

export async function readConfinedUtf8File(
  filePath: string,
  vaultRoot: string
): Promise<string | null> {
  const result = await readConfinedUtf8FileBounded(filePath, vaultRoot, 64 * 1024 * 1024);
  return result?.text ?? null;
}

export async function readConfinedUtf8Prefix(
  filePath: string,
  vaultRoot: string,
  maxBytes: number
): Promise<string | null> {
  if (!Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > 64 * 1024) return null;
  const resolvedFile = path.resolve(filePath);
  if (!(await isPathConfinedToVault(resolvedFile, vaultRoot))) return null;

  let handle;
  try {
    handle = await open(resolvedFile, constants.O_RDONLY | constants.O_NOFOLLOW);
    const openedStats = await handle.stat();
    if (!openedStats.isFile()) return null;

    const canonicalRoot = await realpath(path.resolve(vaultRoot));
    const canonicalFile = await realpath(resolvedFile);
    const relative = path.relative(canonicalRoot, canonicalFile);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;

    const canonicalStats = await stat(canonicalFile);
    if (canonicalStats.dev !== openedStats.dev || canonicalStats.ino !== openedStats.ino) return null;
    if (!(await isPathConfinedToVault(resolvedFile, vaultRoot))) return null;

    const buffer = Buffer.alloc(maxBytes);
    const { bytesRead } = await handle.read(buffer, 0, maxBytes, 0);
    return buffer.subarray(0, bytesRead).toString("utf8");
  } catch {
    return null;
  } finally {
    await handle?.close().catch(() => undefined);
  }
}

export function hasHardExcludedSegment(relativePath: string): boolean {
  const segments = relativePath.split(/[\\/]/);
  return segments.some(
    (segment) => segment.startsWith(".") || HARD_EXCLUDE_SEGMENTS.includes(segment.toLowerCase())
  );
}

const SECRET_PATTERNS = [
  /\bsk_live_[a-zA-Z0-9]+\b/,
  /\b(?:sk|rk)_(?:live|test)_[a-zA-Z0-9]{16,}\b/,
  /\bsk-or-v1-[a-zA-Z0-9_-]{20,}\b/,
  /\bAIza[a-zA-Z0-9_-]{30,}\b/,
  /\bgh[opusr]_[a-zA-Z0-9]{30,}\b/,
  /\bgithub_pat_[a-zA-Z0-9_]{30,}\b/,
  /\bxox[baprs]-[a-zA-Z0-9-]{20,}\b/,
  /\bnpm_[a-zA-Z0-9]{30,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsb_secret_[a-zA-Z0-9]+\b/,
  /\bwhsec_[a-zA-Z0-9]+\b/,
  /\bre_[a-zA-Z0-9]{16,}\b/,
  /\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/,
  /\b[A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PEPPER)\s*[:=]\s*["']?(?!(?:(?:process|import\.meta)\.env|env)\.)[A-Za-z0-9_./+=-]{16,}/i,
  /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]{8,}@[^\s/]+/i,
];

export function containsSecret(content: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Single opt-in gate. Anything malformed, unknown or sensitive is excluded;
 * path escapes and detected secrets are blocking hazards for apply mode.
 */
export async function evaluateObsidianNote(
  relativePath: string,
  absolutePath: string,
  vaultRoot: string,
  rawContent: string
): Promise<ObsidianGateResult> {
  if (containsSecret(relativePath)) {
    return {
      allowed: false,
      reason: "possible secret detected in path",
      blocking: true,
    };
  }

  if (hasHardExcludedSegment(relativePath)) {
    return { allowed: false, reason: "hard-excluded path segment" };
  }

  if (!(await isPathConfinedToVault(absolutePath, vaultRoot))) {
    return {
      allowed: false,
      reason: "path escapes vault or contains a symlink",
      blocking: true,
    };
  }

  if (containsSecret(rawContent)) {
    return {
      allowed: false,
      reason: "possible secret detected in content",
      blocking: true,
    };
  }

  const parsed = parseFrontmatter(rawContent);
  if (!parsed) {
    return { allowed: false, reason: "invalid or missing frontmatter block" };
  }

  const buildTier = parsed.fields["build-tier"];
  if (
    !buildTier ||
    !Object.hasOwn(BUILD_TIER_TO_MCP_TIER, buildTier)
  ) {
    return { allowed: false, reason: "missing or unrecognized build-tier" };
  }

  const statusRaw = parsed.fields.status;
  if (statusRaw === undefined) {
    return { allowed: false, reason: "missing required publication status" };
  }
  const status = statusRaw.trim().toLowerCase();
  if (!ALLOWED_STATUSES.has(status)) {
    return { allowed: false, reason: `unrecognized or excluded status: ${status}` };
  }

  const authorityRaw = parsed.fields.authority;
  if (authorityRaw === undefined) {
    return { allowed: false, reason: "missing required authority" };
  }
  const authority = authorityRaw.trim().toLowerCase();
  if (!ALLOWED_AUTHORITIES.has(authority)) {
    return { allowed: false, reason: `unrecognized or excluded authority: ${authority}` };
  }

  const sensitivityRaw = parsed.fields.sensitivity;
  if (sensitivityRaw === undefined) {
    return { allowed: false, reason: "missing required sensitivity" };
  }
  const sensitivity = sensitivityRaw.trim().toLowerCase();
  if (!ALLOWED_SENSITIVITIES.has(sensitivity)) {
    return { allowed: false, reason: `unrecognized or excluded sensitivity: ${sensitivity}` };
  }

  const title = parsed.fields.title || path.basename(relativePath, ".md");
  return {
    allowed: true,
    tier: BUILD_TIER_TO_MCP_TIER[buildTier],
    title,
    fields: parsed.fields,
    body: parsed.body,
  };
}
