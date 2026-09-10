import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

// A real FIFO must not hang the test runner even if the regression returns.
// Detached POSIX group cleanup also covers descendants; never Promise.race an open.
async function runRace(mode: string, phase: string, count: number) {
  const root = await mkdtemp(join(tmpdir(), "doctrine-source-race-"));
  const source = join(root, "source"), log = join(root, "calls.json"), evidence = join(root, "race.json");
  let child: ReturnType<typeof spawn> | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  const killGroup = () => {
    if (!child?.pid) return;
    try { process.kill(-child.pid, "SIGKILL"); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error; }
  };
  try {
    await mkdir(source);
    const names: string[] = JSON.parse(await readFile(new URL("./fixtures/doctrine-inventory.json", import.meta.url), "utf8"));
    for (const name of names.slice(0, count)) await writeFile(join(source, name), "# Synthetic\n\nSafe public fixture.\n");
    child = spawn(process.execPath, ["--import", import.meta.resolve("tsx"), "--import", fileURLToPath(new URL("./fixtures/doctrine-publisher-source-race.mjs", import.meta.url)), fileURLToPath(new URL("../scripts/publish-doctrine.ts", import.meta.url)), `--source=${source}`, ...(phase === "locked" ? ["--apply"] : [])], {
      cwd: root, detached: true, stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, TSX_TSCONFIG_PATH: fileURLToPath(new URL("../tsconfig.json", import.meta.url)), NEXT_PUBLIC_SUPABASE_URL: "https://publisher.invalid", SUPABASE_SERVICE_ROLE_KEY: "synthetic-not-a-secret", PUBLISH_TEST_MODE: "success", PUBLISH_TEST_LOG: log, PUBLISH_RACE_TARGET: join(source, names[0]), PUBLISH_RACE_LINK: join(source, names[1]), PUBLISH_RACE_LOG: evidence, PUBLISH_RACE_MODE: mode, PUBLISH_RACE_PHASE: phase },
    });
    let stdout = "", stderr = "", timedOut = false;
    child.stdout!.on("data", bytes => { stdout += bytes; });
    child.stderr!.on("data", bytes => { stderr += bytes; });
    const done = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve, reject) => {
      child!.once("error", reject);
      child!.once("close", (code, signal) => resolve({ code, signal }));
    });
    watchdog = setTimeout(() => { timedOut = true; killGroup(); }, 3500);
    const result = await done;
    clearTimeout(watchdog);
    assert.match(stderr, new RegExp(`RACE_INSTALLED:${mode}:${phase}`));
    assert.equal(timedOut, false, `publisher blocked after real ${mode} replacement; supervisor killed group: ${JSON.stringify(result)}; ${stderr}`);
    return { ...result, stdout, stderr, log: JSON.parse(await readFile(log, "utf8")), evidence: JSON.parse(await readFile(evidence, "utf8")) };
  } finally {
    clearTimeout(watchdog);
    killGroup();
    await rm(root, { recursive: true, force: true });
  }
}

for (const count of [9, 18]) for (const phase of ["preflight", "locked"]) {
  for (const mode of ["fifo", "symlink", "grow-before-open", "grow-during-read", "truncate-during-read", "regular"]) {
    test(`corpus${count} ${phase} ${mode} replacement uses bounded real filesystem IO`, { skip: process.platform === "win32" }, async () => {
      const result = await runRace(mode, phase, count);
      assert.equal(result.code, mode === "regular" ? 0 : 1, result.stderr);
      assert.equal(result.signal, null);
      assert.equal(result.evidence.installed, true);
      if (mode === "fifo") {
        assert.equal(result.evidence.fifo, true);
        assert.equal(result.evidence.stats, 1);
        assert.equal(result.evidence.reads, 0, "special handle must be rejected before reading");
        assert.equal(result.evidence.closes, 1, "rejected FIFO handle must close");
      }
      if (phase === "preflight") assert.deepEqual(result.log.calls, []);
      else {
        const calls: { method: string; path: string }[] = result.log.calls;
        assert.ok(calls.some(c => c.path.includes("acquire_skill_publication_lock")));
        assert.equal(calls.filter(c => c.method === "GET" && c.path.includes("/doctrine/releases/")).length, count * (mode === "regular" ? 3 : 2));
        assert.equal(calls.some(c => c.method !== "GET" && c.path.endsWith("/manifest.json")), mode === "regular");
        assert.equal(calls.some(c => c.path.includes("release_skill_publication_lock")), mode === "regular");
      }
      if (mode !== "regular") assert.doesNotMatch(result.stdout, /Published doctrine/);
    });
  }
}
