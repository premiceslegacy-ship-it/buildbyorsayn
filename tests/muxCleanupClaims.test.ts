/// <reference lib="es2024.promise" />
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after, beforeEach } from "node:test";
import { localPostgres, postgresFetch } from "./fixtures/postgresTransport";

// Install Next's server-only marker hook before loading the server implementation.
import "./fixtures/serverOnlyStub.mjs";
// Module loading intentionally follows the server-only hook.
const { cleanupMuxAsset } = await import("../lib/mux/assetCleanup.server");
const db = await localPostgres();
await db.exec("create table public.video_lessons(id uuid primary key)");
const migration = await readFile("supabase/migrations/20261024110000_block_video_lessons.sql", "utf8");
// Apply the real cleanup DDL, excluding the unrelated video cutover/storage RPCs.
const start = migration.indexOf("create table if not exists public.video_asset_cleanup");
const end = migration.indexOf("do $$", start);
assert.ok(start >= 0 && end > start);
await db.exec(migration.slice(start, end));
const transport = postgresFetch(db);
const previousFetch = globalThis.fetch;
const env = { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:35439", SUPABASE_SERVICE_ROLE_KEY: "synthetic-local-key", MUX_TOKEN_ID: "synthetic-token-id", MUX_TOKEN_SECRET: "synthetic-token-secret" };
const previousEnv = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
Object.assign(process.env, env);
const id = "11111111-1111-4111-8111-111111111111";
const video = "22222222-2222-4222-8222-222222222222";
let deletes = 0;
let onDelete: (() => Promise<void>) | undefined;
let interceptRead: ((response: Response) => Promise<void>) | undefined;
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  if (url.origin === "https://api.mux.com") {
    assert.equal(init?.method, "DELETE");
    assert.equal(url.pathname, "/video/v1/assets/synthetic-asset");
    deletes += 1;
    await onDelete?.();
    return new Response(null, { status: 204 });
  }
  const response = await transport(input, init);
  if ((!init?.method || init.method === "GET") && url.pathname.endsWith("/video_asset_cleanup")) await interceptRead?.(response);
  return response;
};
beforeEach(async () => {
  deletes = 0; onDelete = undefined; interceptRead = undefined;
  await db.exec("truncate public.video_lessons cascade");
  await db.query("insert into public.video_lessons values ($1)", [video]);
  await db.query("insert into public.video_asset_cleanup(id,mux_asset_id,video_id) values ($1,'synthetic-asset',$2)", [id, video]);
});
after(async () => {
  globalThis.fetch = previousFetch;
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
  await db.close();
});

test("two workers reading one pending row produce a single provider delete", async () => {
  const reads = Promise.withResolvers<void>();
  let arrived = 0;
  interceptRead = async () => { if (++arrived === 2) reads.resolve(); await reads.promise; };
  const results = await Promise.all([cleanupMuxAsset("synthetic-asset"), cleanupMuxAsset("synthetic-asset")]);
  assert.equal(deletes, 1);
  assert.deepEqual(results.sort(), [false, true]);
  assert.deepEqual((await db.query("select status,attempts from public.video_asset_cleanup")).rows, [{ status: "completed", attempts: 1 }]);
});

test("an active lease refuses another delete, while a stale lease is reclaimable", async () => {
  await db.query("update public.video_asset_cleanup set status='processing', attempts=1");
  assert.equal(await cleanupMuxAsset("synthetic-asset"), false);
  assert.equal(deletes, 0);
  await db.query("update public.video_asset_cleanup set updated_at=now()-interval '11 minutes'");
  assert.equal(await cleanupMuxAsset("synthetic-asset"), true);
  assert.equal(deletes, 1);
  assert.deepEqual((await db.query("select status,attempts from public.video_asset_cleanup")).rows, [{ status: "completed", attempts: 2 }]);
});

test("a worker that loses its claim cannot overwrite the new owner's queue state", async () => {
  onDelete = async () => {
    await db.query("update public.video_asset_cleanup set attempts=attempts+1,updated_at=now()+interval '1 second'");
  };
  assert.equal(await cleanupMuxAsset("synthetic-asset"), false);
  assert.deepEqual((await db.query("select status,attempts from public.video_asset_cleanup")).rows, [{ status: "processing", attempts: 2 }]);
});
