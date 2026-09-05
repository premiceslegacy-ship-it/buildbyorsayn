import path from "node:path";
import { lstat, opendir } from "node:fs/promises";
import {
  containsSecret,
  evaluateObsidianNote,
  hasHardExcludedSegment,
  isPathConfinedToVault,
  readConfinedUtf8Prefix,
  readConfinedUtf8FileBounded,
} from "@/lib/knowledge/obsidianGate";
import type { KnowledgeDocument } from "@/lib/knowledge/sources";

export type ObsidianSourceMode = "preserve" | "scan" | "revoke";

export function resolveObsidianSourceMode(
  vaultPath: string | undefined,
  revoke: boolean
): ObsidianSourceMode {
  if (revoke) return "revoke";
  return vaultPath ? "scan" : "preserve";
}

export type ObsidianDecision = {
  relativePath: string;
  allowed: boolean;
  tier?: string;
  reason?: string;
  blocking?: boolean;
};

export type ObsidianScanStatus = {
  ok: boolean;
  scannedFiles: number;
  hazards: string[];
};

type WalkResult = {
  files: string[];
  decisions: ObsidianDecision[];
  hazards: string[];
};

const MAX_VAULT_DEPTH = 32;
const MAX_VAULT_ENTRIES = 10_000;
const MAX_MARKDOWN_FILES = 5_000;
const MAX_OBSIDIAN_FILE_BYTES = 1024 * 1024;
const MAX_OBSIDIAN_TOTAL_BYTES = 16 * 1024 * 1024;

type WalkBudget = {
  entries: number;
  markdownFiles: number;
  exhausted: boolean;
};

function reportablePath(relativePath: string): string {
  return containsSecret(relativePath) ? "[REDACTED_PATH]" : relativePath;
}

async function listMarkdownFiles(
  rootDir: string,
  currentDir = "",
  depth = 0,
  budget: WalkBudget = { entries: 0, markdownFiles: 0, exhausted: false }
): Promise<WalkResult> {
  const dir = path.join(rootDir, currentDir);
  const files: string[] = [];
  const decisions: ObsidianDecision[] = [];
  const hazards: string[] = [];

  if (depth > MAX_VAULT_DEPTH) {
    budget.exhausted = true;
    return { files, decisions, hazards: ["vault traversal depth limit exceeded"] };
  }

  let directory;
  try {
    directory = await opendir(dir);
  } catch {
    return {
      files,
      decisions,
      hazards: [`unreadable directory: ${reportablePath(currentDir || ".")}`],
    };
  }

  try {
    for await (const entry of directory) {
      budget.entries += 1;
      const relativePath = path.join(currentDir, entry.name);
      const secretInPath = containsSecret(relativePath);
      if (secretInPath) {
        const reason = "possible secret detected in path";
        const safePath = reportablePath(relativePath);
        decisions.push({ relativePath: safePath, allowed: false, reason, blocking: true });
        hazards.push(`${reason}: ${safePath}`);
      }
      if (budget.entries > MAX_VAULT_ENTRIES) {
        budget.exhausted = true;
        hazards.push("vault traversal entry limit exceeded");
        break;
      }
      if (secretInPath) continue;

      if (hasHardExcludedSegment(relativePath)) {
        if (entry.isFile() && entry.name.endsWith(".md")) {
          decisions.push({
            relativePath,
            allowed: false,
            reason: "hard-excluded path segment",
          });
        }
        continue;
      }

      if (entry.isSymbolicLink()) {
        const reason = "symbolic link encountered during vault scan";
        decisions.push({ relativePath, allowed: false, reason, blocking: true });
        hazards.push(`${reason}: ${relativePath}`);
        continue;
      }

      if (entry.isDirectory()) {
        const nested = await listMarkdownFiles(rootDir, relativePath, depth + 1, budget);
        files.push(...nested.files);
        decisions.push(...nested.decisions);
        hazards.push(...nested.hazards);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        budget.markdownFiles += 1;
        if (budget.markdownFiles > MAX_MARKDOWN_FILES) {
          budget.exhausted = true;
          hazards.push("vault markdown file limit exceeded");
          break;
        }
        files.push(relativePath);
      }
      if (budget.exhausted) break;
    }
  } catch {
    hazards.push(`unreadable directory: ${reportablePath(currentDir || ".")}`);
  }

  return { files, decisions, hazards };
}

export async function collectObsidianDocuments(
  vaultPath: string
): Promise<{
  documents: KnowledgeDocument[];
  decisions: ObsidianDecision[];
  scan: ObsidianScanStatus;
}> {
  const vaultRoot = path.resolve(vaultPath);
  const vaultStats = await lstat(vaultRoot).catch(() => null);
  if (!vaultStats || !vaultStats.isDirectory() || vaultStats.isSymbolicLink()) {
    return {
      documents: [],
      decisions: [],
      scan: {
        ok: false,
        scannedFiles: 0,
        hazards: ["vault path is missing, unreadable, not a directory, or a symbolic link"],
      },
    };
  }

  const walk = await listMarkdownFiles(vaultRoot);
  const documents: KnowledgeDocument[] = [];
  const decisions = [...walk.decisions];
  const hazards = [...walk.hazards];
  let eligibleBytes = 0;

  for (const relativePath of walk.files) {
    const absolutePath = path.join(vaultRoot, relativePath);

    if (!(await isPathConfinedToVault(absolutePath, vaultRoot))) {
      const reason = "path escapes vault or contains a symlink";
      const safePath = reportablePath(relativePath);
      decisions.push({ relativePath: safePath, allowed: false, reason, blocking: true });
      hazards.push(`${reason}: ${safePath}`);
      continue;
    }

    const frontmatterPrefix = await readConfinedUtf8Prefix(absolutePath, vaultRoot, 8 * 1024);
    if (frontmatterPrefix === null) {
      const reason = "note frontmatter could not be read safely";
      const safePath = reportablePath(relativePath);
      decisions.push({ relativePath: safePath, allowed: false, reason, blocking: true });
      hazards.push(`${reason}: ${safePath}`);
      continue;
    }

    const eligibility = await evaluateObsidianNote(
      relativePath,
      absolutePath,
      vaultRoot,
      frontmatterPrefix
    );
    if (eligibility.allowed === false) {
      const safePath = reportablePath(relativePath);
      decisions.push({
        relativePath: safePath,
        allowed: false,
        reason: eligibility.reason,
        blocking: eligibility.blocking,
      });
      if (eligibility.blocking) hazards.push(`${eligibility.reason}: ${safePath}`);
      continue;
    }

    const remainingAggregateBytes = MAX_OBSIDIAN_TOTAL_BYTES - eligibleBytes;
    const readLimit = Math.min(MAX_OBSIDIAN_FILE_BYTES, remainingAggregateBytes);
    const boundedFile =
      readLimit > 0
        ? await readConfinedUtf8FileBounded(absolutePath, vaultRoot, readLimit)
        : null;
    if (boundedFile === null) {
      const reason =
        remainingAggregateBytes < MAX_OBSIDIAN_FILE_BYTES
          ? "eligible vault byte limit exceeded"
          : "eligible note byte limit exceeded or note could not be read safely";
      const safePath = reportablePath(relativePath);
      decisions.push({ relativePath: safePath, allowed: false, reason, blocking: true });
      hazards.push(`${reason}: ${safePath}`);
      continue;
    }
    eligibleBytes += boundedFile.bytesRead;
    const raw = boundedFile.text;

    const result = await evaluateObsidianNote(
      relativePath,
      absolutePath,
      vaultRoot,
      raw
    );

    if (result.allowed === false) {
      const safePath = reportablePath(relativePath);
      decisions.push({
        relativePath: safePath,
        allowed: false,
        reason: result.reason,
        blocking: result.blocking,
      });
      if (result.blocking) hazards.push(`${result.reason}: ${safePath}`);
      continue;
    }

    documents.push({
      source: "obsidian",
      sourceId: relativePath,
      title: result.title,
      content: result.body.trim(),
      tier: result.tier,
    });
    decisions.push({ relativePath, allowed: true, tier: result.tier });
  }

  decisions.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  hazards.sort();
  return {
    documents,
    decisions,
    scan: {
      ok: hazards.length === 0,
      scannedFiles: walk.files.length,
      hazards,
    },
  };
}
