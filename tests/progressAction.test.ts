import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("l'action de progression valide le catalogue, le palier et appelle la RPC atomique", () => {
  const result = spawnSync(process.execPath, [
    "--import", "./tests/fixtures/serverOnlyStub.mjs",
    "--import", "tsx",
    "--experimental-test-module-mocks",
    "--test",
    "tests/fixtures/progressActionHarness.inner.ts",
  ], { encoding: "utf8", env: { ...process.env, NODE_ENV: "test" } });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("la migration verrouille le profil, dérive l'utilisateur de auth.uid et borne EXECUTE", () => {
  const sql = readFileSync("supabase/migrations/20261023130000_atomic_block_progress.sql", "utf8");
  assert.match(sql, /security definer[\s\S]*set search_path = ''/i);
  assert.match(sql, /v_user_id uuid := auth\.uid\(\)/i);
  assert.match(sql, /from public\.profiles[\s\S]*for update/i);
  assert.match(sql, /v_tier in \('full', 'admin'\)/i);
  assert.match(sql, /v_tier = 'beginner' and p_bloc_id = 1/i);
  assert.match(sql, /revoke all on function public\.toggle_block_progress\(integer\) from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.toggle_block_progress\(integer\) to authenticated/i);
  assert.doesNotMatch(sql, /grant execute[\s\S]*to anon/i);
});
