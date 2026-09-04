import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/migrations/20260904151355_mcp_knowledge_base.sql";

test("the knowledge base migration keeps read access fail-closed behind the tier filter", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create table if not exists public\.knowledge_chunks/);
  assert.match(sql, /check \(content_hash ~ '\^\[a-f0-9\]\{64\}\$'\)/);
  assert.match(
    sql,
    /check \(tier_required in \('free', 'preview', 'beginner', 'full'\)\)/
  );
  assert.match(sql, /unique index if not exists knowledge_chunks_source_key_unique/);
  assert.match(sql, /alter table public\.knowledge_chunks force row level security/);
  assert.match(sql, /revoke all on table public\.knowledge_chunks from anon, authenticated/);
  assert.match(sql, /create or replace function public\.mcp_tier_rank/);
  assert.match(sql, /create or replace function public\.match_knowledge_chunks/);
  assert.match(sql, /security definer/);
  assert.match(sql, /set search_path = ''/);
  assert.match(
    sql,
    /limit least\(greatest\(coalesce\(match_count, 8\), 1\), 20\)/
  );
  assert.match(
    sql,
    /grant execute on function public\.match_knowledge_chunks\([^)]*\)\s*\n\s*to service_role/
  );

  assert.doesNotMatch(sql, /using \(true\)/i);
  assert.doesNotMatch(sql, /grant .* to anon/i);
  assert.doesNotMatch(sql, /grant .* to authenticated/i);
  assert.doesNotMatch(sql, /create policy/i);
});

test("a forward migration applies knowledge snapshots atomically", async () => {
  const hardening = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  assert.match(hardening, /create or replace function public\.apply_mcp_knowledge_snapshot/);
  assert.match(hardening, /p_inventory jsonb/);
  assert.match(hardening, /p_scanned_sources text\[\]/);
  assert.match(hardening, /p_delete_stale boolean/);
  assert.match(hardening, /on conflict \(source, source_id, chunk_index\)/);
  assert.match(hardening, /delete from public\.knowledge_chunks/);
  assert.match(hardening, /set search_path = ''/);
  assert.match(
    hardening,
    /grant execute on function public\.apply_mcp_knowledge_snapshot\([^;]+\)\s*\n\s*to service_role/
  );
});

test("hardening removes the obsolete non-fingerprinted search RPC", async () => {
  const hardening = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  assert.match(
    hardening,
    /drop function if exists public\.match_knowledge_chunks\(extensions\.vector, text, integer, text\)/i
  );
});
