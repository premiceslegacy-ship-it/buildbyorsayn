import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { chmod, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
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
import {
  artifactUnits,
  installUnit,
  launchdPlist,
  main as mainCli,
  readStoredZip,
  sameOriginUrl,
  schtasksCommand,
  systemdQuote,
  systemdServiceUnit,
  validateCatalogArtifact,
} from "../public/build-sync/build.mjs";
import {
  BUILD_SYNC_CLI,
  BUILD_SYNC_FALLBACK_ORIGIN,
  buildSyncInstallCommands,
  buildSyncOrigin,
  buildSyncHostsDiffer,
  quotePosixArgument,
  quotePowerShellArgument,
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

const HOSTILE_ORIGINS = [
  "https://build.example/x y",
  "https://build.example;touch /tmp/build-sync-pwned-marker",
  "https://build.example/$(touch /tmp/build-sync-pwned-marker)",
  "https://build.example/`touch /tmp/build-sync-pwned-marker`",
  "https://build.example/a'b",
  "https://build.example/a\"b",
  "https://user:pass@build.example",
  "https://build.example/?q=1",
  "https://build.example/#frag",
  "javascript:alert(1)",
  "file:///etc/passwd",
  "https://build.example\ntouch /tmp/build-sync-pwned-marker",
  "not a url",
];

test("a hostile or malformed origin never reaches the displayed install command", () => {
  for (const hostile of HOSTILE_ORIGINS) {
    assert.equal(buildSyncOrigin(hostile), BUILD_SYNC_FALLBACK_ORIGIN, JSON.stringify(hostile));
  }
  assert.equal(buildSyncOrigin("https://build.example/"), "https://build.example");
  assert.equal(buildSyncOrigin("http://127.0.0.1:3000"), "http://127.0.0.1:3000");
});

test("generated shell commands re-read any origin as one inert argument, even when callers skip buildSyncOrigin", () => {
  const sandbox = path.join(os.tmpdir(), `build-sync-quote-${process.pid}`);
  const marker = "/tmp/build-sync-pwned-marker";
  for (const hostile of [...HOSTILE_ORIGINS, "https://build.example/it's \u2018smart\u2019"]) {
    const [posix, windows] = buildSyncInstallCommands(hostile);
    // curl est remplacé par une fonction qui écrit son argument : si le shell interprétait la valeur, le marqueur apparaîtrait.
    const script = `mkdir -p '${sandbox}'; curl() { for a in "$@"; do printf '%s\\0' "$a"; done; }; ${posix.command.replace(/ \| sh$/, "")}`;
    const run = spawnSync("sh", ["-c", script], { encoding: "utf8" });
    assert.equal(run.status, 0, `${JSON.stringify(hostile)}: ${run.stderr}`);
    const args = run.stdout.split("\0").filter((value) => value !== "");
    assert.deepEqual(args, ["-fsSL", `${hostile.replace(/\/+$/, "")}/build-sync/install.sh`], JSON.stringify(hostile));
    assert.ok(!windows.command.includes("\n") || windows.command.includes("'"), "a multi-line origin must stay inside quotes");
  }
  assert.equal(quotePosixArgument("a'b"), `'a'\\''b'`);
  // PowerShell traite aussi les apostrophes typographiques comme des guillemets simples.
  assert.equal(quotePowerShellArgument("a'b\u2019c"), "'a''b\u2019\u2019c'");
  assert.equal(
    buildSyncInstallCommands("https://build.example")[0].command,
    "curl -fsSL https://build.example/build-sync/install.sh | sh",
    "a plain origin is displayed without noise",
  );
  return rm(sandbox, { recursive: true, force: true }).then(async () => {
    await assert.rejects(lstat(marker));
  });
});

async function runInstallSh(env: Record<string, string>, home: string) {
  const bin = path.join(home, "stub-bin");
  await mkdir(bin, { recursive: true });
  const logFile = path.join(home, "curl-calls.log");
  await writeFile(path.join(bin, "curl"), `#!/bin/sh\nprintf '%s\\n' "$*" >> "$BUILD_SYNC_TEST_CURL_LOG"\nwhile [ $# -gt 0 ]; do if [ "$1" = "-o" ]; then printf '%s\\n' 'process.stdout.write(JSON.stringify({ args: process.argv.slice(2), cli: process.env.BUILD_SYNC_CLI_PATH }));' > "$2"; fi; shift; done\n`);
  await chmod(path.join(bin, "curl"), 0o755);
  const run = spawnSync("sh", [path.resolve("public/build-sync/install.sh")], {
    encoding: "utf8",
    env: { PATH: `${bin}:${path.dirname(process.execPath)}:/usr/bin:/bin`, HOME: home, SHELL: "/bin/sh", BUILD_SYNC_NO_PROFILE: "1", BUILD_SYNC_TEST_CURL_LOG: logFile, ...env } as unknown as NodeJS.ProcessEnv,
  });
  const calls = await readFile(logFile, "utf8").catch(() => "");
  return { run, calls };
}

test("install.sh refuses an origin that is not https or local http before any download", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "build-sync-sh-"));
  try {
    for (const bad of ["http://evil.example", "ftp://x", "https://x.example/a b", "https://x.example/$(id)", "https://x.example;id", "https://x.example/'", "file:///etc/passwd"]) {
      const { run, calls } = await runInstallSh({ BUILD_SYNC_BASE_URL: bad }, home);
      assert.notEqual(run.status, 0, bad);
      assert.equal(calls, "", `${bad} must not trigger a download`);
    }
  } finally {
    await rm(home, { recursive: true, force: true });
  }
});

test("install.sh writes a wrapper that survives quotes, spaces and shell syntax in the install paths", async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "build-sync-sh-"));
  const home = path.join(parent, `we ird'$(touch ${path.join(parent, "pwned")})"h`);
  await mkdir(home, { recursive: true });
  try {
    const { run, calls } = await runInstallSh({ BUILD_SYNC_BASE_URL: "https://build.example" }, home);
    assert.equal(run.status, 0, run.stderr + run.stdout);
    assert.match(calls, /--proto-redir =https https:\/\/build\.example\/build-sync\/build\.mjs/, "redirects may only stay on https");
    const wrapper = path.join(home, ".local", "bin", "build-skills");
    const wrapped = spawnSync(wrapper, ["status", "a b"], { encoding: "utf8" });
    assert.equal(wrapped.status, 0, wrapped.stderr);
    const seen = JSON.parse(wrapped.stdout) as { args: string[]; cli: string };
    assert.deepEqual(seen.args, ["status", "a b"]);
    assert.equal(seen.cli, path.join(home, ".local", "share", "build-sync", "build.mjs"));
    await assert.rejects(lstat(path.join(parent, "pwned")), "the \\$(…) in HOME must never run");
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test("scheduler entries keep hostile install paths inert (launchd, systemd, schtasks)", () => {
  const script = "/Users/a b/.local/share/build-sync/build.mjs";
  const node = "/opt/node 22/bin/node";
  const plist = launchdPlist({ execPath: node, script: `${script}</string><string>--evil`, logDir: "/tmp/l&o<g" });
  assert.ok(!plist.includes("</string><string>--evil"), "XML metacharacters are escaped");
  assert.ok(plist.includes("&lt;/string&gt;&lt;string&gt;--evil") && plist.includes("l&amp;o&lt;g"));

  assert.equal(systemdQuote('/a/b"c\\d%h$HOME'), '"/a/b\\"c\\\\d%%h$$HOME"');
  const unit = systemdServiceUnit({ execPath: node, script });
  assert.ok(unit.includes(`ExecStart="${node}" "${script}" skills update --quiet`));
  for (const control of ["/x\ny", "/x\ry", "/x\u0000y"]) {
    assert.throws(() => systemdQuote(control), /invalide/);
    assert.throws(() => launchdPlist({ execPath: control, script, logDir: "/l" }), /invalide/);
    assert.throws(() => schtasksCommand({ execPath: node, script: control }), /invalide/);
  }
  assert.equal(schtasksCommand({ execPath: "C:\\Program Files\\nodejs\\node.exe", script: "C:\\Users\\a b\\build.mjs" }), '"C:\\Program Files\\nodejs\\node.exe" "C:\\Users\\a b\\build.mjs" skills update --quiet');
  assert.throws(() => schtasksCommand({ execPath: 'C:\\x" /RU SYSTEM "', script }), /invalide/);
});

test("catalog entries from the network are bounded before use, and the token never leaves the configured origin", () => {
  const good = { slug: "oracle-site-web", title: "Oracle", fileName: "oracle-site-web.md", sha256: "a".repeat(64), downloadUrl: "/api/build-sync/artifacts/oracle-site-web" };
  assert.equal(validateCatalogArtifact(good), good);
  for (const patch of [
    { slug: "../../.ssh" },
    { slug: "Upper" },
    { slug: "a/b" },
    { fileName: "../x.md" },
    { fileName: "x.sh" },
    { sha256: "A".repeat(64) },
    { sha256: "a".repeat(63) },
    { downloadUrl: "https://evil.example/steal" },
    { downloadUrl: "//evil.example/steal" },
    { downloadUrl: "/api/build-sync/artifacts/other" },
    { title: 7 },
  ]) assert.throws(() => validateCatalogArtifact({ ...good, ...patch }), /invalide/i, JSON.stringify(patch));
  assert.throws(() => validateCatalogArtifact(null), /invalide/i);

  const base = "https://build.example";
  assert.equal(sameOriginUrl("/api/build-sync/catalog", base).href, "https://build.example/api/build-sync/catalog");
  for (const input of ["https://evil.example/x", "//evil.example/x", "http://build.example/x", "https://build.example:8443/x", "https://u:p@build.example/x"]) {
    assert.throws(() => sameOriginUrl(input, base), /origine/i, input);
  }
});

function zipEntry(name: string, content: string, options: { flags?: number; method?: number; sizeOverride?: number } = {}): Buffer {
  const filename = Buffer.from(name);
  const data = Buffer.from(content);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(options.flags ?? 0, 6);
  header.writeUInt16LE(options.method ?? 0, 8);
  header.writeUInt32LE(options.sizeOverride ?? data.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(filename.length, 26);
  return Buffer.concat([header, filename, data]);
}

test("malformed archives are rejected, extracted only inside a throwaway home, and never produce a symlink", async () => {
  const fakeHome = await mkdtemp(path.join(os.tmpdir(), "fakehome-sec-"));
  const outside = path.join(fakeHome, "outside-target");
  const artifact = { slug: "evil", title: "Evil", fileName: "evil.zip", sha256: "b".repeat(64) };
  try {
    const rejected: Array<[string, Buffer]> = [
      ["absolute path", zipEntry("/etc/cron.d/x", "x")],
      ["dot-dot segment", zipEntry("skill/../../x", "x")],
      ["leading dot-dot", zipEntry("../x", "x")],
      ["backslash separator", zipEntry("skill\\..\\x", "x")],
      ["windows drive", zipEntry("C:\\Windows\\x", "x")],
      ["null byte", zipEntry("skill/SKILL.md\0.png", "x")],
      ["empty name", zipEntry("", "x")],
      ["data descriptor", zipEntry("a/SKILL.md", "x", { flags: 0x08 })],
      ["deflated entry", zipEntry("a/SKILL.md", "x", { method: 8 })],
      ["size mismatch", zipEntry("a/SKILL.md", "xx", { sizeOverride: 9 })],
      ["duplicate entry", Buffer.concat([zipEntry("a/SKILL.md", "1"), zipEntry("a/SKILL.md", "2")])],
      ["not a zip", Buffer.from("PK nothing")],
      ["truncated entry", zipEntry("a/SKILL.md", "x").subarray(0, 33)],
    ];
    for (const [label, bytes] of rejected) {
      assert.throws(() => artifactUnits(artifact, bytes), /invalide|pris en charge|tronqu|hors limites|doublon|vide/i, label);
    }

    // Une entrée de lien symbolique n'est qu'un fichier ordinaire contenant le texte de la cible : rien n'est lié.
    const linkEntry = Buffer.concat([zipEntry("evil/SKILL.md", "---\nname: evil\n---\n"), zipEntry("evil/link", outside)]);
    const units = artifactUnits(artifact, linkEntry);
    const root = path.join(fakeHome, "skills");
    await mkdir(root, { recursive: true });
    const paths = { backups: path.join(fakeHome, "backups"), rollbacks: path.join(fakeHome, "rollbacks") };
    for (const [unitName, files] of units) {
      await installUnit({ agentId: "codex", root, unitName, files, artifact, releaseId: "r1", paths });
    }
    const link = await lstat(path.join(root, "evil", "link"));
    assert.equal(link.isSymbolicLink(), false);
    assert.equal(link.isFile(), true);
    await assert.rejects(lstat(outside), "nothing is created at the symlink target");

    // Un nom d'unité piégé ne sort jamais de la racine des skills.
    for (const unitName of ["..", "../x", "/abs", "a/b"]) {
      await assert.rejects(
        installUnit({ agentId: "codex", root, unitName, files: new Map([["SKILL.md", Buffer.from("x")]]), artifact, releaseId: "r1", paths }),
        undefined,
        `unit name ${unitName}`,
      );
    }
    const top = (await readdir(fakeHome)).sort();
    assert.ok(top.every((name) => ["skills", "backups", "rollbacks"].includes(name)), `unexpected entries in the throwaway home: ${top.join(", ")}`);
  } finally {
    await rm(fakeHome, { recursive: true, force: true });
  }
});
