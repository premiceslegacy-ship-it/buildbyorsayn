import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("webhook Stripe : vraie vérification de signature, tolérance, doublons et refus du complément", () => {
  const result = spawnSync(process.execPath, [
    "--import", "./tests/fixtures/serverOnlyStub.mjs",
    "--import", "tsx",
    "--experimental-test-module-mocks",
    "--test",
    "tests/fixtures/stripeWebhookSignatureHarness.inner.ts",
  ], { encoding: "utf8", env: { ...process.env, NODE_ENV: "test" } });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
