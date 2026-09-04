import path from "node:path";
import { lstat, readdir } from "node:fs/promises";
import {
  containsSecret,
  evaluateObsidianNote,
  hasHardExcludedSegment,
  isPathConfinedToVault,
  readConfinedUtf8File,
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

function reportablePath(relativePath: string): string {
  return containsSecret(relativePath) ? "[REDACTED_PATH]" : relativePath;
}

async function listMarkdownFiles(rootDir: string, currentDir = ""): Promise<WalkResult> {
  const dir = path.join(rootDir, currentDir);
  const files: string[] = [];
  const decisions: ObsidianDecision[] = [];
  const hazards: string[] = [];

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return {
      files,
      decisions,
      hazards: [`unreadable directory: ${reportablePath(currentDir || ".")}`],
    };
  }

  for (const entry of entries) {
    const relativePath = path.join(currentDir, entry.name);

    if (hasHardExcludedSegment(relativePath)) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        const secretInPath = containsSecret(relativePath);
        const reason = secretInPath
          ? "possible secret detected in path"
          : "hard-excluded path segment";
        const safePath = reportablePath(relativePath);
        decisions.push({
          relativePath: safePath,
          allowed: false,
          reason,
          ...(secretInPath ? { blocking: true } : {}),
        });
        if (secretInPath) hazards.push(`${reason}: ${safePath}`);
      }
      continue;
    }

    if (entry.isSymbolicLink()) {
      const reason = "symbolic link encountered during vault scan";
      const safePath = reportablePath(relativePath);
      decisions.push({ relativePath: safePath, allowed: false, reason, blocking: true });
      hazards.push(`${reason}: ${safePath}`);
      continue;
    }

    if (entry.isDirectory()) {
      const nested = await listMarkdownFiles(rootDir, relativePath);
      files.push(...nested.files);
      decisions.push(...nested.decisions);
      hazards.push(...nested.hazards);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(relativePath);
    }
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

  for (const relativePath of walk.files) {
    const absolutePath = path.join(vaultRoot, relativePath);

    if (!(await isPathConfinedToVault(absolutePath, vaultRoot))) {
      const reason = "path escapes vault or contains a symlink";
      const safePath = reportablePath(relativePath);
      decisions.push({ relativePath: safePath, allowed: false, reason, blocking: true });
      hazards.push(`${reason}: ${safePath}`);
      continue;
    }

    const raw = await readConfinedUtf8File(absolutePath, vaultRoot);
    if (raw === null) {
      const reason = "note could not be read completely";
      const safePath = reportablePath(relativePath);
      decisions.push({ relativePath: safePath, allowed: false, reason, blocking: true });
      hazards.push(`${reason}: ${safePath}`);
      continue;
    }

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
