import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("accompaniment mutations validate assignment, revocation and shared context with Zod", async () => {
  const source = await readFile("app/actions/accompaniment.ts", "utf8");

  assert.match(source, /const assignmentSchema = z/);
  assert.match(source, /const revokeAssignmentSchema = z/);
  assert.match(source, /const workspaceContextSchema = z/);
  assert.match(source, /assignmentSchema\.safeParse/);
  assert.match(source, /revokeAssignmentSchema\.safeParse/);
  assert.match(source, /workspaceContextSchema\.safeParse/);
  assert.doesNotMatch(source, /UUID_PATTERN/);
});

test("admin tier mutations validate their complete payload with Zod", async () => {
  const source = await readFile("app/actions/setUserTier.ts", "utf8");

  assert.match(source, /const userTierSchema = z/);
  assert.match(source, /userTierSchema\.safeParse\(\{ userId, tier \}\)/);
  assert.doesNotMatch(source, /UUID_PATTERN|ALLOWED_TIERS/);
});
