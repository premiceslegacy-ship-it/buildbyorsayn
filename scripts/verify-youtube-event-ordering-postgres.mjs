import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const image = process.env.YOUTUBE_EVENTS_PG_IMAGE ?? "pgvector/pgvector:pg17";
const container = `youtube-events-qa-${randomUUID()}`;
let created = false;

function runDocker(args, options = {}) {
  const result = spawnSync("docker", args, {
    cwd: root,
    encoding: "utf8",
    timeout: 60_000,
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`docker command failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function sql(statement) {
  return runDocker([
    "exec", "-i",
    "-e", "PGOPTIONS=-c statement_timeout=10000 -c lock_timeout=8000",
    container, "psql", "-X", "-qAt", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", "postgres",
  ], { input: statement });
}

const entry = (title, publishedAt, eventAt) => JSON.stringify([
  { video_id: "AAAAAAAAAAA", title, published_at: publishedAt, event_at: eventAt },
]).replaceAll("'", "''");
const tombstone = (deletedAt) => JSON.stringify([
  { video_id: "AAAAAAAAAAA", deleted_at: deletedAt },
]).replaceAll("'", "''");

try {
  runDocker(["info", "--format", "{{.ServerVersion}}"]);
  runDocker(["image", "inspect", image]);
  created = true;
  runDocker([
    "run", "-d", "--pull=never", "--network=none", "--name", container,
    "-e", "POSTGRES_HOST_AUTH_METHOD=trust",
    "--health-cmd", "pg_isready -h 127.0.0.1 -U postgres",
    "--health-interval=1s", "--health-retries=30",
    image,
  ]);

  const readyDeadline = Date.now() + 45_000;
  while (Date.now() < readyDeadline) {
    if (runDocker(["inspect", "--format", "{{.State.Health.Status}}", container]) === "healthy") break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.equal(runDocker(["inspect", "--format", "{{.State.Health.Status}}", container]), "healthy");

  sql(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create table public.youtube_videos (
      video_id text primary key check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
      title text not null,
      published_at timestamptz not null,
      updated_at timestamptz not null default now()
    );
  `);
  sql(readFileSync("supabase/migrations/20261022135000_youtube_event_ordering.sql", "utf8"));
  sql(readFileSync("supabase/migrations/20261024102000_youtube_replay_strict.sql", "utf8"));
  assert.equal(
    sql("select has_function_privilege('anon','public.apply_youtube_feed_events(jsonb,jsonb)','execute')::int || ':' || has_function_privilege('authenticated','public.apply_youtube_feed_events(jsonb,jsonb)','execute')::int || ':' || has_function_privilege('service_role','public.apply_youtube_feed_events(jsonb,jsonb)','execute')::int"),
    "0:0:1",
  );
  assert.equal(
    sql("select (coalesce(proconfig,'{}') @> array['search_path=\"\"'])::int from pg_proc where oid='public.apply_youtube_feed_events(jsonb,jsonb)'::regprocedure"),
    "1",
  );

  assert.equal(sql(`select public.apply_youtube_feed_events('${entry("Première", "2026-10-01T09:00:00Z", "2026-10-10T09:00:00Z")}'::jsonb, '[]'::jsonb)`), "1");
  assert.equal(sql("select title || ':' || (published_at = '2026-10-01T09:00:00Z')::int || ':' || (select (event_at = '2026-10-10T09:00:00Z')::int from public.youtube_video_event_state where video_id='AAAAAAAAAAA') from public.youtube_videos where video_id='AAAAAAAAAAA'"), "Première:1:1");

  assert.equal(sql(`select public.apply_youtube_feed_events('[]'::jsonb, '${tombstone("2026-10-18T10:00:00Z")}'::jsonb)`), "0");
  assert.equal(sql("select count(*) from public.youtube_videos where video_id='AAAAAAAAAAA'"), "0");

  assert.equal(sql(`select public.apply_youtube_feed_events('${entry("Retry ancien", "2026-10-01T09:00:00Z", "2026-10-17T09:00:00Z")}'::jsonb, '[]'::jsonb)`), "0");
  assert.equal(sql("select count(*) from public.youtube_videos where video_id='AAAAAAAAAAA'"), "0");
  assert.equal(sql("select deleted::int from public.youtube_video_event_state where video_id='AAAAAAAAAAA'"), "1");

  assert.equal(sql(`select public.apply_youtube_feed_events('${entry("Restaurée", "2026-10-01T09:00:00Z", "2026-10-19T09:00:00Z")}'::jsonb, '[]'::jsonb)`), "1");
  assert.equal(sql("select title || ':' || (published_at = '2026-10-01T09:00:00Z')::int || ':' || (select deleted::int from public.youtube_video_event_state where video_id='AAAAAAAAAAA') from public.youtube_videos where video_id='AAAAAAAAAAA'"), "Restaurée:1:0");

  assert.equal(sql(`select public.apply_youtube_feed_events('${entry("Replay tardif", "2026-10-01T09:00:00Z", "2026-10-17T09:00:00Z")}'::jsonb, '[]'::jsonb)`), "0");
  assert.equal(sql("select title || ':' || (select (event_at = '2026-10-19T09:00:00Z')::int from public.youtube_video_event_state where video_id='AAAAAAAAAAA') from public.youtube_videos where video_id='AAAAAAAAAAA'"), "Restaurée:1");

  console.log("PASS YouTube WebSub event ordering and durable tombstones");
} finally {
  if (created) runDocker(["rm", "-f", container]);
}
