import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("les pages privées refusent une session absente et un palier insuffisant côté serveur", () => {
  const result = spawnSync(process.execPath, [
    "--import", "./tests/fixtures/serverOnlyStub.mjs",
    "--import", "tsx",
    "--experimental-test-module-mocks",
    "--test",
    "tests/fixtures/paidPageAccessHarness.inner.ts",
  ], { encoding: "utf8", env: { ...process.env, NODE_ENV: "test" } });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
