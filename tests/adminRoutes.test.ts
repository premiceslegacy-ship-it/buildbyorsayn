import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

// Les routes sont exécutées pour de vrai avec Supabase, la session et Mux simulés à la frontière
// du module. Le drapeau de mock de modules exige un processus enfant.
test("routes admin vidéo : refus non admin, création, publication et webhook (modules simulés)", () => {
  const result = spawnSync(process.execPath, [
    "--import", "./tests/fixtures/serverOnlyStub.mjs",
    "--import", "tsx",
    "--experimental-test-module-mocks",
    "--test",
    "tests/fixtures/adminRoutesHarness.inner.ts",
  ], { encoding: "utf8", env: { ...process.env, NODE_ENV: "test" } });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
