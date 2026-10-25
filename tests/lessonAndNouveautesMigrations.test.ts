import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (name: string) => readFileSync(`supabase/migrations/${name}`, "utf8");

test("lesson_progress is owner-only with forced RLS and no anonymous access", () => {
  const sql = read("20261019120000_lesson_progress.sql");
  assert.match(sql, /primary key \(user_id, section_id\)/);
  assert.match(sql, /references auth\.users\(id\) on delete cascade/);
  assert.match(sql, /check \(position_seconds >= 0\)/);
  assert.match(sql, /alter table public\.lesson_progress force row level security/);
  for (const operation of ["select", "insert", "update"]) {
    assert.match(sql, new RegExp(`create policy lesson_progress_${operation}_own[\\s\\S]*?for ${operation}[\\s\\S]*?to authenticated`));
  }
  assert.equal((sql.match(/auth\.uid\(\) = user_id/g) ?? []).length, 4, "select using, insert check, update using + check");
  assert.match(sql, /revoke all on table public\.lesson_progress from anon, authenticated/);
  assert.match(sql, /grant select, insert, update on table public\.lesson_progress to authenticated/);
  assert.doesNotMatch(sql, /grant [^;]*\bdelete\b/i);
  assert.doesNotMatch(sql, /using \(true\)/i);
});

test("youtube_videos is world-readable but writable only through the service role", () => {
  const sql = read("20261019121000_youtube_nouveautes.sql");
  assert.match(sql, /video_id text primary key check \(video_id ~ '\^\[A-Za-z0-9_-\]\{11\}\$'\)/);
  assert.match(sql, /create policy youtube_videos_public_read[\s\S]*?for select[\s\S]*?to anon, authenticated[\s\S]*?using \(true\)/);
  assert.match(sql, /grant select on table public\.youtube_videos to anon, authenticated/);
  const youtubeSection = sql.split("create table if not exists public.member_nouveautes_seen")[0];
  assert.doesNotMatch(youtubeSection, /for (insert|update|delete|all)/i);
  assert.doesNotMatch(youtubeSection, /grant [^;]*(insert|update|delete)/i);
});

test("member_nouveautes_seen is owner-only", () => {
  const sql = read("20261019121000_youtube_nouveautes.sql");
  const section = sql.split("create table if not exists public.member_nouveautes_seen")[1];
  assert.match(section, /alter table public\.member_nouveautes_seen force row level security/);
  assert.match(section, /revoke all on table public\.member_nouveautes_seen from anon, authenticated/);
  assert.match(section, /grant select, insert, update on table public\.member_nouveautes_seen to authenticated/);
  assert.equal((section.match(/auth\.uid\(\) = user_id/g) ?? []).length, 4);
  assert.doesNotMatch(section, /using \(true\)/i);
});

