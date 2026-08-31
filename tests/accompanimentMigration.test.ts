import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/migrations/20260830110000_accompaniment_assignments.sql";

test("the accompaniment migration keeps the member access boundary fail-closed", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create table if not exists public\.accompaniment_assignments/);
  assert.match(sql, /unique index if not exists accompaniment_assignments_user_slug_unique/);
  assert.match(sql, /check \(ends_on is null or ends_on >= starts_on\)/);
  assert.match(sql, /alter table public\.accompaniment_assignments force row level security/);
  assert.match(sql, /create policy accompaniment_assignments_select_own_current/);
  assert.match(sql, /auth\.uid\(\) = user_id/);
  assert.match(sql, /status in \('active', 'completed'\)/);
  assert.match(sql, /revoke all on table public\.accompaniment_assignments from anon/);
  assert.match(sql, /create or replace function public\.has_current_accompaniment/);
  assert.match(sql, /assignment\.user_id = auth\.uid\(\)/);
  assert.match(sql, /create policy progress_insert_own_with_assignment/);
  assert.match(sql, /public\.has_current_accompaniment\(user_id, 'site-web'\)/);
  assert.doesNotMatch(sql, /grant .* to anon/i);
  assert.doesNotMatch(sql, /using \(true\)/i);
});
