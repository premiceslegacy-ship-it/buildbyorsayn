import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("remote accompaniment progress replaces local cache and failed mutations roll back", async () => {
  const source = await readFile("components/accompagnement/SiteWebWorkspace.tsx", "utf8");

  assert.match(source, /setUnderstoodThemeIds\(remoteThemeIds\)/);
  assert.doesNotMatch(source, /new Set\(\[\.\.\.current, \.\.\.remoteThemeIds\]\)/);
  assert.match(source, /La modification n'a pas été enregistrée et a été annulée/);
  assert.match(source, /completed\s*\?\s*current\.filter/);
});

test("runtime accompaniment fixtures are isolated to one marked run", async () => {
  const source = await readFile("scripts/verify-accompaniment-access.ts", "utf8");

  assert.match(source, /user\.email\?\.endsWith\("@example\.invalid"\)/);
  assert.match(source, /user\.user_metadata\?\.hermes_fixture === "accompaniment-access"/);
  assert.match(source, /user\.user_metadata\?\.run_id === runId/);
  assert.match(source, /run_id: runId/);
  assert.doesNotMatch(source, /cleanupUsers\(await listFixtures\(\)\)/);
});

test("negative runtime checks distinguish RLS denial from transport failure", async () => {
  const source = await readFile("scripts/verify-accompaniment-access.ts", "utf8");

  assert.match(source, /function isRlsPolicyDenied/);
  assert.match(source, /error\?\.code === "42501"/);
  assert.match(source, /plannedAssignmentB\.error/);
  assert.match(source, /crossContextSelect\.error/);
  assert.match(source, /revokedContextSelect\.error/);
});
