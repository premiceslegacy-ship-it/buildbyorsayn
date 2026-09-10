import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

async function cli(mode: string, apply = true) {
  const dir = await mkdtemp(join(tmpdir(), "doctrine-publisher-"));
  const log = join(dir, "../", `${dir.split("/").pop()}.json`);
  try {
    for (let i = 0; i < 9; i++) await writeFile(join(dir, `file${i}.md`), `# Synthetic ${i}\n\nPublic fixture only.\n`);
    const result = spawnSync(process.execPath, ["--import", import.meta.resolve("tsx"), "--import", fileURLToPath(new URL("./fixtures/doctrine-publisher-fetch.mjs", import.meta.url)), fileURLToPath(new URL("../scripts/publish-doctrine.ts", import.meta.url)), `--source=${dir}`, ...(apply ? ["--apply"] : [])], {
      cwd: dir, encoding: "utf8", timeout: 15_000,
      env: { ...process.env, TSX_TSCONFIG_PATH: fileURLToPath(new URL("../tsconfig.json", import.meta.url)), NEXT_PUBLIC_SUPABASE_URL: "https://publisher.invalid", SUPABASE_SERVICE_ROLE_KEY: "synthetic-not-a-secret", PUBLISH_TEST_LOG: log, PUBLISH_TEST_MODE: mode },
    });
    assert.equal(result.error, undefined);
    return { ...result, log: JSON.parse(await readFile(log, "utf8")) };
  } finally { await rm(dir, { recursive: true, force: true }); await rm(log, { force: true }); }
}

test("real CLI publishes nine files with three exact readback passes then releases", async () => {
  const result = await cli("success");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Published doctrine\/v1\/manifest.json/);
  assert.equal(result.log.calls.filter((c: { path: string; method: string }) => c.method === "GET" && c.path.includes("/doctrine/releases/")).length, 27);
  assert.match(result.log.calls.at(-1).path, /release_skill_publication_lock/);
  for (const call of result.log.calls) { assert.equal(call.cache, "no-store"); assert.equal(call.redirect, "error"); }
});
test("real CLI dry run performs no requests", async () => {
  const result = await cli("success", false);
  assert.equal(result.status, 0, result.stderr); assert.deepEqual(result.log.calls, []);
});
for (const mode of ["manifest-overflow", "bad-length", "deadline-after-pointer"]) test(`real CLI ${mode} retains lock and reports no success`, async () => {
  const result = await cli(mode);
  assert.equal(result.status, 1); if (mode !== "deadline-after-pointer") assert.equal(result.log.cancelled, true);
  assert.doesNotMatch(result.stdout, /Published doctrine/);
  assert.ok(!result.log.calls.some((c: { path: string }) => c.path.includes("release_skill_publication_lock")));
});

test("real CLI cancels oversized artifact immediately and retains acquired lock", async () => {
  const result = await cli("overflow");
  assert.equal(result.status, 1);
  assert.equal(result.log.cancelled, true, JSON.stringify({ log: result.log, stdout: result.stdout, stderr: result.stderr }));
  assert.equal(result.log.pulls, 1);
  assert.ok(result.log.calls.some((c: { path: string }) => c.path.includes("acquire_skill_publication_lock")));
  assert.ok(!result.log.calls.some((c: { path: string }) => /release_skill_publication_lock|manifest.json/.test(c.path)));
});
