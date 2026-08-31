import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/migrations/20260831193000_accompaniment_workspace_context.sql";
const postgrestGrantMigrationPath = "supabase/migrations/20260831204500_accompaniment_workspace_postgrest_grants.sql";

test("the shared accompaniment context remains assignment-scoped and fail-closed", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create table if not exists public\.accompaniment_workspace_context/);
  assert.match(sql, /assignment_id uuid primary key references public\.accompaniment_assignments\(id\) on delete cascade/);
  assert.match(sql, /alter table public\.accompaniment_workspace_context force row level security/);
  assert.match(sql, /create policy accompaniment_workspace_select_own_current/);
  assert.match(sql, /create policy accompaniment_workspace_insert_own_current/);
  assert.match(sql, /create policy accompaniment_workspace_update_own_current/);
  assert.match(sql, /assignment\.user_id = auth\.uid\(\)/);
  assert.match(sql, /assignment\.status in \('active', 'completed'\)/);
  assert.match(sql, /updated_by = auth\.uid\(\)/);
  assert.match(sql, /revoke all on table public\.accompaniment_workspace_context from anon/);
  assert.match(sql, /grant select on table public\.accompaniment_workspace_context to authenticated/);
  assert.match(
    sql,
    /grant insert \(assignment_id, company, project, site_url, shared_notes, updated_by\)/
  );
  assert.match(sql, /grant update \(company, project, site_url, shared_notes, updated_by\)/);
  assert.doesNotMatch(sql, /create policy .*delete/i);
  assert.doesNotMatch(sql, /grant delete/i);
  assert.doesNotMatch(sql, /using \(true\)/i);
  assert.doesNotMatch(sql, /grant .* to anon/i);
});

test("the PostgREST grant fix preserves immutable workspace columns", async () => {
  const sql = await readFile(postgrestGrantMigrationPath, "utf8");

  assert.match(sql, /before insert or update on public\.accompaniment_workspace_context/);
  assert.match(sql, /new\.assignment_id = old\.assignment_id/);
  assert.match(sql, /new\.created_at = old\.created_at/);
  assert.match(sql, /new\.updated_at = now\(\)/);
  assert.match(
    sql,
    /grant select, insert, update on table public\.accompaniment_workspace_context to authenticated/
  );
  assert.match(sql, /revoke delete on table public\.accompaniment_workspace_context from authenticated/);
  assert.doesNotMatch(sql, /grant delete/i);
  assert.doesNotMatch(sql, /grant .* to anon/i);
});
