import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  containsSecret,
  evaluateObsidianNote,
  hasHardExcludedSegment,
  isPathConfinedToVault,
  readConfinedUtf8File,
} from "../lib/knowledge/obsidianGate";
import { collectObsidianDocuments, resolveObsidianSourceMode } from "../lib/knowledge/obsidianSource";
import { parseFrontmatter } from "../lib/knowledge/frontmatter";

async function withVault(fn: (vaultRoot: string) => Promise<void>) {
  const vaultRoot = await mkdtemp(path.join(tmpdir(), "obsidian-gate-test-"));
  try {
    await fn(vaultRoot);
  } finally {
    await rm(vaultRoot, { recursive: true, force: true });
  }
}

async function writeNote(vaultRoot: string, relativePath: string, content: string) {
  const absolutePath = path.join(vaultRoot, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, "utf8");
  return absolutePath;
}

test("a note with no frontmatter is excluded", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "30 Methodes/no-frontmatter.md";
    const abs = await writeNote(vaultRoot, rel, "Just some content, no frontmatter at all.\n");
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, "Just some content, no frontmatter at all.\n");
    assert.equal(result.allowed, false);
  });
});

test("a note with an unrecognized build-tier value is excluded", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "30 Methodes/wrong-tier.md";
    const content = "---\nbuild-tier: personnel\nstatus: living\n---\nContent.\n";
    const abs = await writeNote(vaultRoot, rel, content);
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
    assert.equal(result.allowed, false);
  });
});

test("frontmatter that does not open on line 1 is excluded", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "30 Methodes/late-frontmatter.md";
    const content = "# Title\n---\nbuild-tier: preview\n---\nContent.\n";
    const abs = await writeNote(vaultRoot, rel, content);
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
    assert.equal(result.allowed, false);
  });
});

test("a note with authority: external-bibliographic is excluded", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "90 Sources/Livres/Some Book.md";
    const content = "---\nbuild-tier: coffre\nauthority: external-bibliographic\n---\nSummary of someone else's book.\n";
    const abs = await writeNote(vaultRoot, rel, content);
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
    assert.equal(result.allowed, false);
  });
});

test("a note with sensitivity: private is excluded", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "10 Identite/note.md";
    const content = "---\nbuild-tier: coffre\nsensitivity: private\n---\nPersonal content.\n";
    const abs = await writeNote(vaultRoot, rel, content);
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
    assert.equal(result.allowed, false);
  });
});

test("a note with an excluded status (template, archived, exploratory, candidate) is excluded", async () => {
  await withVault(async (vaultRoot) => {
    for (const status of ["template", "archived", "exploratory", "candidate"]) {
      const rel = `99 Modeles/${status}.md`;
      const content = `---\nbuild-tier: preview\nstatus: ${status}\n---\nContent.\n`;
      const abs = await writeNote(vaultRoot, rel, content);
      const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
      assert.equal(result.allowed, false, `status ${status} should be excluded`);
    }
  });
});

test("a path with a hard-excluded segment is excluded even when correctly tagged", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "40 Projets/private/secret-project.md";
    const content = "---\nbuild-tier: coffre\nstatus: living\n---\nContent.\n";
    const abs = await writeNote(vaultRoot, rel, content);
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
    assert.equal(result.allowed, false);
  });
});

test("content containing a live secret key is excluded entirely", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "30 Methodes/leaky-note.md";
    const secret = "sk_" + "live_" + "a".repeat(24);
    const content =
      `---\nbuild-tier: coffre\nstatus: living\n---\nHere is my key: ${secret}\n`;
    const abs = await writeNote(vaultRoot, rel, content);
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
    assert.equal(result.allowed, false);
  });
});

test("a credential-bearing note path is blocked without entering reports", async () => {
  await withVault(async (vaultRoot) => {
    const hazardousValue = "MCP_REQUEST_RATE_LIMIT_PEPPER=" + "a".repeat(32);
    const rel = `30 Methodes/${hazardousValue}.md`;
    await writeNote(vaultRoot, rel, "---\nbuild-tier: coffre\nstatus: living\n---\nSafe body.\n");
    const result = await collectObsidianDocuments(vaultRoot);
    assert.equal(result.documents.length, 0);
    assert.equal(result.scan.ok, false);
    assert.equal(JSON.stringify(result.decisions).includes(hazardousValue), false);
    assert.equal(JSON.stringify(result.scan.hazards).includes(hazardousValue), false);
  });
});

test("a hard-excluded credential-bearing filename is redacted and blocks the scan", async () => {
  await withVault(async (vaultRoot) => {
    const hazardousValue = "MCP_REQUEST_RATE_LIMIT_PEPPER=" + "b".repeat(32);
    const rel = `30 Methodes/.${hazardousValue}.md`;
    await writeNote(vaultRoot, rel, "This hard-excluded note must never be read.\n");

    const result = await collectObsidianDocuments(vaultRoot);
    const serialized = JSON.stringify(result);

    assert.equal(result.documents.length, 0);
    assert.equal(result.scan.ok, false);
    assert.equal(serialized.includes(hazardousValue), false);
    assert.deepEqual(result.decisions, [
      {
        relativePath: "[REDACTED_PATH]",
        allowed: false,
        reason: "possible secret detected in path",
        blocking: true,
      },
    ]);
    assert.deepEqual(result.scan.hazards, [
      "possible secret detected in path: [REDACTED_PATH]",
    ]);
  });
});

test("a path outside the vault root is rejected by path confinement", async () => {
  await withVault(async (vaultRoot) => {
    const outside = path.join(tmpdir(), "outside-vault-note.md");
    await writeFile(outside, "content", "utf8");
    try {
      assert.equal(await isPathConfinedToVault(outside, vaultRoot), false);
    } finally {
      await rm(outside, { force: true });
    }
  });
});

test("a symlink inside the vault is rejected even if it resolves within the vault", async () => {
  await withVault(async (vaultRoot) => {
    const realFile = await writeNote(vaultRoot, "real.md", "---\nbuild-tier: preview\n---\nok\n");
    const linkPath = path.join(vaultRoot, "link.md");
    try {
      await symlink(realFile, linkPath);
    } catch {
      // Symlink creation can fail without privileges on some CI runners;
      // skip rather than false-fail the suite.
      return;
    }
    assert.equal(await isPathConfinedToVault(linkPath, vaultRoot), false);
  });
});

test("confined reads bind validation to the opened regular file", async () => {
  await withVault(async (vaultRoot) => {
    const realFile = await writeNote(vaultRoot, "opened.md", "safe content");
    assert.equal(await readConfinedUtf8File(realFile, vaultRoot), "safe content");

    const linkPath = path.join(vaultRoot, "opened-link.md");
    try {
      await symlink(realFile, linkPath);
    } catch {
      return;
    }
    assert.equal(await readConfinedUtf8File(linkPath, vaultRoot), null);
  });
});

test("the nominal case: a correctly tagged, non-excluded note is allowed", async () => {
  await withVault(async (vaultRoot) => {
    const rel = "30 Methodes/Protocole Zero.md";
    const content =
      "---\nbuild-tier: fondations\nstatus: living\nauthority: synthesis\ntitle: Protocole Zero\n---\nCeci est ma synthese personnelle.\n";
    const abs = await writeNote(vaultRoot, rel, content);
    const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
    assert.equal(result.allowed, true);
    if (result.allowed) {
      assert.equal(result.tier, "beginner");
      assert.equal(result.title, "Protocole Zero");
    }
  });
});

test("build-tier maps coffre to full and preview to preview", async () => {
  await withVault(async (vaultRoot) => {
    const relCoffre = "a.md";
    const contentCoffre = "---\nbuild-tier: coffre\nauthority: synthesis\n---\nx\n";
    const absCoffre = await writeNote(vaultRoot, relCoffre, contentCoffre);
    const resultCoffre = await evaluateObsidianNote(relCoffre, absCoffre, vaultRoot, contentCoffre);
    assert.equal(resultCoffre.allowed, true);
    if (resultCoffre.allowed) assert.equal(resultCoffre.tier, "full");

    const relPreview = "b.md";
    const contentPreview = "---\nbuild-tier: preview\nauthority: synthesis\n---\nx\n";
    const absPreview = await writeNote(vaultRoot, relPreview, contentPreview);
    const resultPreview = await evaluateObsidianNote(relPreview, absPreview, vaultRoot, contentPreview);
    assert.equal(resultPreview.allowed, true);
    if (resultPreview.allowed) assert.equal(resultPreview.tier, "preview");
  });
});

test("hasHardExcludedSegment catches dotfiles and known-sensitive folder names", () => {
  assert.equal(hasHardExcludedSegment(path.join(".obsidian", "config")), true);
  assert.equal(hasHardExcludedSegment(path.join("40 Projets", "private", "x.md")), true);
  assert.equal(hasHardExcludedSegment(path.join("40 Projets", "journal", "x.md")), true);
  assert.equal(hasHardExcludedSegment(path.join("30 Methodes", "x.md")), false);
});

test("containsSecret flags common secret shapes", () => {
  assert.equal(containsSecret("sk_live_51AbCdEfGhIjKlMn"), true);
  assert.equal(containsSecret("whsec_abcdefghijklmnop"), true);
  assert.equal(
    containsSecret(
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    ),
    true
  );
  assert.equal(containsSecret("-----BEGIN RSA PRIVATE KEY-----"), true);
  assert.equal(containsSecret(`${"sk-or-v1-"}${"a".repeat(40)}`), true);
  assert.equal(containsSecret(`${"AIza"}${"A".repeat(35)}`), true);
  assert.equal(containsSecret(`${"ghp_"}${"a".repeat(36)}`), true);
  assert.equal(containsSecret(`${"AKIA"}${"A".repeat(16)}`), true);
  assert.equal(containsSecret(`API_KEY=${"a".repeat(24)}`), true);
  assert.equal(containsSecret(`MCP_REQUEST_RATE_LIMIT_PEPPER=${"a".repeat(32)}`), true);
  assert.equal(containsSecret(`CRON_SECRET=${"a".repeat(32)}`), true);
  assert.equal(containsSecret(`postgresql://user:${"p".repeat(20)}@example.com/database`), true);
  assert.equal(containsSecret(`${"sk_test_"}${"a".repeat(24)}`), true);
  assert.equal(containsSecret(`${"github_pat_"}${"a".repeat(40)}`), true);
  assert.equal(containsSecret(`${"xoxb-"}${"1".repeat(12)}-${"a".repeat(24)}`), true);
  assert.equal(containsSecret(`${"npm_"}${"a".repeat(36)}`), true);
  assert.equal(containsSecret(`https://user:${"p".repeat(20)}@example.com/path`), true);
  assert.equal(
    containsSecret("const INDEXNOW_KEY = process.env.INDEXNOW_KEY!"),
    false,
    "an environment reference is not itself a persisted secret"
  );
  assert.equal(containsSecret("just some ordinary text about the business"), false);
});

test("sensitive metadata is normalized and unknown values fail closed", async () => {
  await withVault(async (vaultRoot) => {
    for (const field of [
      "sensitivity: Private",
      "sensitivity: secret",
      "status: Archived",
      "authority: confidential",
    ]) {
      const rel = `30 Methodes/${field.replace(/[^a-z]/gi, "-")}.md`;
      const content = `---\nbuild-tier: coffre\n${field}\n---\nSensitive content.\n`;
      const abs = await writeNote(vaultRoot, rel, content);
      const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
      assert.equal(result.allowed, false, `${field} must be rejected`);
    }
  });
});

test("YAML comments cannot bypass private or archived exclusions", async () => {
  await withVault(async (vaultRoot) => {
    for (const field of ["sensitivity: private # never publish", "status: archived # old"]) {
      const suffix = field.startsWith("status") ? "status" : "sensitivity";
      const rel = `30 Methodes/comment-${suffix}.md`;
      const content = `---\nbuild-tier: coffre\n${field}\n---\nSensitive content.\n`;
      const abs = await writeNote(vaultRoot, rel, content);
      const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
      assert.equal(result.allowed, false);
    }
  });
});

test("prototype property names cannot be used as build tiers", async () => {
  await withVault(async (vaultRoot) => {
    for (const value of ["__proto__", "constructor", "toString"]) {
      const rel = `30 Methodes/${value}.md`;
      const content = `---\nbuild-tier: ${value}\n---\nContent.\n`;
      const abs = await writeNote(vaultRoot, rel, content);
      const result = await evaluateObsidianNote(rel, abs, vaultRoot, content);
      assert.equal(result.allowed, false, `${value} must be rejected`);
    }
  });
});

test("duplicate or structured YAML frontmatter is rejected", () => {
  assert.equal(parseFrontmatter("---\nbuild-tier: preview\nbuild-tier: coffre\n---\nBody"), null);
  assert.equal(parseFrontmatter("---\nbuild-tier:\n  nested: preview\n---\nBody"), null);
  assert.equal(parseFrontmatter("---\nbuild-tier: [preview]\n---\nBody"), null);
});

test("frontmatter parser returns the body without metadata", () => {
  const parsed = parseFrontmatter("---\nbuild-tier: preview\ntitle: Demo\n---\nVisible body\n");
  assert.ok(parsed);
  assert.equal(parsed.body, "Visible body\n");
  assert.equal(parsed.body.includes("build-tier"), false);
});

test("a symlinked parent directory is rejected before reading a note", async () => {
  await withVault(async (vaultRoot) => {
    const realDirectory = path.join(vaultRoot, "real-directory");
    await mkdir(realDirectory);
    const note = path.join(realDirectory, "note.md");
    await writeFile(note, "---\nbuild-tier: preview\n---\nBody\n", "utf8");
    const linkedDirectory = path.join(vaultRoot, "linked-directory");
    try {
      await symlink(realDirectory, linkedDirectory, "dir");
    } catch {
      return;
    }
    assert.equal(
      await isPathConfinedToVault(path.join(linkedDirectory, "note.md"), vaultRoot),
      false
    );
  });
});

test("an invalid or symlinked vault is an explicit failed scan", async () => {
  const missing = path.join(tmpdir(), `missing-vault-${Date.now()}`);
  const missingResult = await collectObsidianDocuments(missing);
  assert.equal(missingResult.scan.ok, false);

  await withVault(async (container) => {
    const realVault = path.join(container, "real-vault");
    await mkdir(realVault);
    const linkedVault = path.join(container, "linked-vault");
    try {
      await symlink(realVault, linkedVault, "dir");
    } catch {
      return;
    }
    const result = await collectObsidianDocuments(linkedVault);
    assert.equal(result.scan.ok, false);
  });
});

test("Obsidian is preserved by default and purged only by an explicit revoke flag", () => {
  assert.equal(resolveObsidianSourceMode(undefined, false), "preserve");
  assert.equal(resolveObsidianSourceMode("/vault", false), "scan");
  assert.equal(resolveObsidianSourceMode(undefined, true), "revoke");
  assert.equal(resolveObsidianSourceMode("/vault", true), "revoke");
});
