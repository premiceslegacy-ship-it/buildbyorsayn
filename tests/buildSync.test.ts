import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  createBuildSyncAuthorizationSchema,
  isBuildSyncRedirectUri,
  parseBuildSyncTokenRequest,
} from "../lib/buildSync/oauth";
import { artifactUnits, installUnit, readStoredZip } from "../public/build-sync/build.mjs";

const resource = "https://build.example/api/build-sync";

function storedZip(files: Record<string, string>): Buffer {
  const chunks: Buffer[] = [];
  for (const [name, value] of Object.entries(files)) {
    const filename = Buffer.from(name);
    const content = Buffer.from(value);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0, 6);
    header.writeUInt16LE(0, 8);
    header.writeUInt32LE(content.length, 18);
    header.writeUInt32LE(content.length, 22);
    header.writeUInt16LE(filename.length, 26);
    chunks.push(header, filename, content);
  }
  return Buffer.concat(chunks);
}

test("BUILD Sync accepts only an ephemeral 127.0.0.1 callback", () => {
  assert.equal(isBuildSyncRedirectUri("http://127.0.0.1:49152/callback"), true);
  for (const invalid of [
    "http://localhost:49152/callback",
    "http://127.0.0.1:80/callback",
    "http://127.0.0.1:49152/other",
    "http://127.0.0.1:49152/callback?next=x",
    "https://127.0.0.1:49152/callback",
    "http://example.com:49152/callback",
  ]) assert.equal(isBuildSyncRedirectUri(invalid), false, invalid);
});

test("BUILD Sync authorization and token schemas are exact", () => {
  const valid = {
    client_id: "build-sync-cli",
    redirect_uri: "http://127.0.0.1:49152/callback",
    response_type: "code",
    code_challenge: "a".repeat(43),
    code_challenge_method: "S256",
    state: "state-state-state-state",
    resource,
    scope: "skills:read",
  };
  assert.equal(createBuildSyncAuthorizationSchema(resource).safeParse(valid).success, true);
  assert.equal(createBuildSyncAuthorizationSchema(resource).safeParse({ ...valid, scope: "mcp" }).success, false);
  assert.equal(createBuildSyncAuthorizationSchema(resource).safeParse({ ...valid, extra: true }).success, false);

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: "b".repeat(43),
    redirect_uri: valid.redirect_uri,
    client_id: "build-sync-cli",
    code_verifier: "c".repeat(43),
    resource,
  });
  assert.ok(parseBuildSyncTokenRequest(params, resource));
  params.append("resource", resource);
  assert.equal(parseBuildSyncTokenRequest(params, resource), null);
});

test("the zero-dependency ZIP reader rejects traversal and splits multi-skill bundles", () => {
  const archive = storedZip({
    "apple-design-skills/apple-a/SKILL.md": "---\nname: apple-a\n---\n",
    "apple-design-skills/apple-a/references/a.md": "a",
    "apple-design-skills/apple-b/SKILL.md": "---\nname: apple-b\n---\n",
  });
  assert.equal(readStoredZip(archive).size, 3);
  const units = artifactUnits({ slug: "apple", title: "Apple", fileName: "apple.zip" }, archive);
  assert.deepEqual([...units.keys()].sort(), ["apple-a", "apple-b"]);
  assert.equal(units.get("apple-a")?.get("references/a.md")?.toString(), "a");

  assert.throws(() => readStoredZip(storedZip({ "root/../escape.md": "bad" })), /invalide/i);
});

test("the CLI converts a Markdown artifact into a portable skill", () => {
  const body = Buffer.from("---\nname: oracle-site-web\n---\n");
  const units = artifactUnits({ slug: "oracle-site-web", title: "Oracle", fileName: "oracle-site-web.md" }, body);
  assert.equal(units.get("oracle-site-web")?.get("SKILL.md"), body);
  assert.equal(createHash("sha256").update(body).digest("hex").length, 64);
});

test("managed updates preserve CUSTOM.md and back up unexpected edits", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "build-sync-test-"));
  const root = path.join(temporary, "skills");
  const paths = {
    backups: path.join(temporary, "backups"),
    rollbacks: path.join(temporary, "rollbacks"),
  };
  const artifact = { slug: "sample", sha256: "a".repeat(64) };
  try {
    const first = await installUnit({
      agentId: "codex",
      root,
      unitName: "sample",
      files: new Map([["SKILL.md", Buffer.from("---\nname: sample\n---\nfirst")]]),
      artifact,
      releaseId: "release-1",
      paths,
    });
    assert.equal(first.status, "installed");
    await writeFile(path.join(root, "sample", "CUSTOM.md"), "ma règle\n");

    const second = await installUnit({
      agentId: "codex",
      root,
      unitName: "sample",
      files: new Map([["SKILL.md", Buffer.from("---\nname: sample\n---\nsecond")]]),
      artifact: { ...artifact, sha256: "b".repeat(64) },
      releaseId: "release-2",
      paths,
    });
    assert.equal(second.status, "updated");
    assert.equal(second.backupPath, null);
    assert.equal(await readFile(path.join(root, "sample", "CUSTOM.md"), "utf8"), "ma règle\n");

    await writeFile(path.join(root, "sample", "SKILL.md"), "édition personnelle\n");
    const third = await installUnit({
      agentId: "codex",
      root,
      unitName: "sample",
      files: new Map([["SKILL.md", Buffer.from("---\nname: sample\n---\nthird")]]),
      artifact: { ...artifact, sha256: "c".repeat(64) },
      releaseId: "release-3",
      paths,
    });
    assert.ok(third.backupPath);
    assert.equal(await readFile(path.join(third.backupPath!, "SKILL.md"), "utf8"), "édition personnelle\n");
    assert.equal(await readFile(path.join(root, "sample", "CUSTOM.md"), "utf8"), "ma règle\n");
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test("BUILD Sync OAuth storage is private, scoped and rotatable", () => {
  const sql = readFileSync(new URL("../supabase/migrations/20261010130000_build_sync_oauth.sql", import.meta.url), "utf8");
  for (const table of [
    "build_sync_authorization_requests",
    "build_sync_authorization_codes",
    "build_sync_access_tokens",
    "build_sync_refresh_tokens",
  ]) {
    assert.match(sql, new RegExp(`alter table public\\.${table} force row level security`, "i"));
    assert.match(sql, new RegExp(`revoke all on table public\\.${table} from public, anon, authenticated`, "i"));
  }
  assert.match(sql, /scope = 'skills:read'/);
  assert.match(sql, /rotate_build_sync_refresh_token/);
  assert.match(sql, /reuse_detected/);
  assert.match(sql, /family_expires_at/);
  assert.match(sql, /revoke_build_sync_user_connections/);
  assert.match(sql, /cleanup_build_sync_oauth_state/);
  assert.match(sql, /p_batch_size not between 1 and 1000/);
  assert.ok((sql.match(/limit p_batch_size/g) ?? []).length >= 4);
});

test("BUILD Sync is served without browser filesystem APIs", () => {
  const cli = readFileSync(new URL("../public/build-sync/build.mjs", import.meta.url), "utf8");
  const page = readFileSync(new URL("../components/BuildSyncInstall.tsx", import.meta.url), "utf8");
  const proxy = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");
  const catalog = readFileSync(new URL("../app/api/build-sync/catalog/route.ts", import.meta.url), "utf8");
  const artifact = readFileSync(new URL("../app/api/build-sync/artifacts/[slug]/route.ts", import.meta.url), "utf8");
  const session = readFileSync(new URL("../app/api/build-sync/session/route.ts", import.meta.url), "utf8");
  const windowsInstaller = readFileSync(new URL("../public/build-sync/install.ps1", import.meta.url), "utf8");
  assert.doesNotMatch(cli, /showDirectoryPicker|FileSystemDirectoryHandle/);
  assert.match(cli, /CUSTOM\.md/);
  assert.match(cli, /artifact\.sha256/);
  assert.match(cli, /StartInterval/);
  assert.match(page, /install\.sh/);
  assert.match(page, /install\.ps1/);
  assert.doesNotMatch(page, /buildbyorsayn\.com/);
  assert.doesNotMatch(cli, /buildbyorsayn\.com/);
  assert.match(proxy, /\/build-sync\/consent/);
  assert.match(catalog, /resolveBuildSyncAuth/);
  assert.match(catalog, /canDownload/);
  assert.match(artifact, /getStoredSkillContent/);
  assert.match(artifact, /status: 403/);
  assert.match(session, /revoke_build_sync_user_connections/);
  assert.match(windowsInstaller, /BUILD_SYNC_INSTALL_ONLY/);
});
