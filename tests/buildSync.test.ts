import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  canUseBuildSync,
} from "../lib/buildSync/config";
import {
  createBuildSyncAuthorizationSchema,
  isBuildSyncRedirectUri,
  parseBuildSyncTokenRequest,
} from "../lib/buildSync/oauth";
import { artifactUnits, installUnit, main as mainCli, readStoredZip } from "../public/build-sync/build.mjs";
import {
  BUILD_SYNC_CLI,
  BUILD_SYNC_FALLBACK_ORIGIN,
  buildSyncInstallCommands,
  buildSyncOrigin,
  buildSyncHostsDiffer,
  BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN,
} from "../lib/buildSync/installCommands";

const resource = "https://build.example/api/build-sync";

test("BUILD Sync is paid-only for Beginner and Full", () => {
  assert.equal(canUseBuildSync("beginner"), true);
  assert.equal(canUseBuildSync("full"), true);
  assert.equal(canUseBuildSync("free"), false);
  assert.equal(canUseBuildSync("preview"), false);
  assert.equal(canUseBuildSync(null), false);
});

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

test("a legacy multi-unit marker is migrated once before unchanged checks skip artifact egress", async () => {
  const temporary = await realpath(await mkdtemp(path.join(os.tmpdir(), "build-sync-current-")));
  const stateHome = path.join(temporary, "state");
  const artifactBody = storedZip({
    "bundle/sample-a/SKILL.md": "---\nname: sample-a\n---\nProcédure stable A\n",
    "bundle/sample-b/SKILL.md": "---\nname: sample-b\n---\nProcédure stable B\n",
  });
  const artifactSha256 = createHash("sha256").update(artifactBody).digest("hex");
  let artifactRequests = 0;
  let cliRequests = 0;
  const server = createServer((request, response) => {
    if (request.url === "/build-sync/build.mjs") {
      cliRequests += 1;
      response.writeHead(500).end();
      return;
    }
    if (request.url === "/api/build-sync/catalog") {
      response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({
        releaseId: "release-stable",
        artifacts: [{
          slug: "sample",
          title: "Sample",
          fileName: "sample.zip",
          sha256: artifactSha256,
          downloadUrl: "/api/build-sync/artifacts/sample",
        }],
      }));
      return;
    }
    if (request.url === "/api/build-sync/artifacts/sample") {
      artifactRequests += 1;
      response.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Length": String(artifactBody.length),
      }).end(artifactBody);
      return;
    }
    response.writeHead(404).end();
  });
  const previous = {
    home: process.env.HOME,
    syncHome: process.env.BUILD_SYNC_HOME,
  };
  try {
    await mkdir(stateHome, { recursive: true });
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const baseUrl = `http://127.0.0.1:${address.port}`;
    process.env.HOME = temporary;
    process.env.BUILD_SYNC_HOME = stateHome;
    await writeFile(path.join(stateHome, "config.json"), JSON.stringify({
      schemaVersion: 1,
      baseUrl,
      agents: ["codex"],
      schedulerEnabled: false,
    }));
    await writeFile(path.join(stateHome, "credentials.json"), JSON.stringify({
      baseUrl,
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      accessExpiresAt: Date.now() + 10 * 60_000,
    }));

    await mainCli(["update", "--quiet"]);
    assert.equal(artifactRequests, 1);

    const skillRoot = path.join(temporary, ".codex", "skills");
    for (const unitName of ["sample-a", "sample-b"]) {
      const markerFile = path.join(skillRoot, unitName, ".build-sync.json");
      const marker = JSON.parse(await readFile(markerFile, "utf8"));
      delete marker.artifactUnits;
      await writeFile(markerFile, `${JSON.stringify(marker, null, 2)}\n`);
    }

    await mainCli(["update", "--quiet"]);
    assert.equal(artifactRequests, 2, "the first legacy-marker check must verify the artifact");
    for (const unitName of ["sample-a", "sample-b"]) {
      const marker = JSON.parse(await readFile(path.join(skillRoot, unitName, ".build-sync.json"), "utf8"));
      assert.deepEqual(marker.artifactUnits, ["sample-a", "sample-b"]);
    }

    await mainCli(["update", "--quiet"]);
    assert.equal(artifactRequests, 2, "migrated unchanged markers must skip later artifact egress");

    await writeFile(path.join(skillRoot, "sample-b", "SKILL.md"), "local drift\n");
    await mainCli(["update", "--quiet"]);
    assert.equal(artifactRequests, 3, "local drift must force a verified artifact download");
    assert.equal(cliRequests, 0, "skill updates must not attempt to replace the CLI");
  } finally {
    if (previous.home === undefined) delete process.env.HOME;
    else process.env.HOME = previous.home;
    if (previous.syncHome === undefined) delete process.env.BUILD_SYNC_HOME;
    else process.env.BUILD_SYNC_HOME = previous.syncHome;
    await new Promise((resolve) => server.close(resolve));
    await rm(temporary, { recursive: true, force: true });
  }
});




test("the install card and the assistant share one source for commands, folders and subcommands", async () => {
  const [posix, windows] = buildSyncInstallCommands("https://build.example/");
  assert.equal(posix.command, "curl -fsSL https://build.example/build-sync/install.sh | sh");
  assert.equal(windows.command, "irm https://build.example/build-sync/install.ps1 | iex");
  assert.equal(buildSyncOrigin(undefined), BUILD_SYNC_FALLBACK_ORIGIN);
  assert.equal(buildSyncOrigin("  https://build.example//  "), "https://build.example");


  let printed = "";
  const originalWrite = process.stdout.write;
  process.stdout.write = ((chunk: string | Uint8Array) => {
    printed += String(chunk);
    return true;
  }) as typeof process.stdout.write;
  try {
    await mainCli(["help"]);
  } finally {
    process.stdout.write = originalWrite;
  }
  for (const subcommand of Object.values(BUILD_SYNC_CLI)) {
    assert.ok(printed.includes(subcommand), `${subcommand} must be listed by build-skills help`);
  }
});

test("the scripts' default host stays in step with the displayed command and the exported constant", () => {

  assert.equal(buildSyncHostsDiffer("https://build.example", "https://build.example/"), false);
  assert.equal(buildSyncHostsDiffer("https://www.example.com", "https://example.com"), true);

  // En production, la commande affichée vient de NEXT_PUBLIC_APP_URL : elle doit viser le même hôte que le défaut des scripts.
  if (process.env.VERCEL_ENV === "production" || process.env.BUILD_SYNC_CHECK_PRODUCTION_HOST === "1") {
    const displayed = buildSyncOrigin(process.env.NEXT_PUBLIC_APP_URL);
    assert.equal(
      buildSyncHostsDiffer(displayed),
      false,
      `the displayed command points to ${new URL(displayed).host} but the scripts default to ${new URL(BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN).host}`,
    );
  }
});
