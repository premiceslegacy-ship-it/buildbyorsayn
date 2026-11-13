import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after } from "node:test";
import { localPostgres } from "./fixtures/postgresTransport";

const db = await localPostgres();
await db.exec(`
  grant usage on schema public,auth to authenticated,anon;
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
  $$;
`);
await db.exec(await readFile("supabase/migrations/20261113120000_free_resources.sql", "utf8"));
const alice = "11111111-1111-4111-8111-111111111111";
const bob = "22222222-2222-4222-8222-222222222222";
await db.query("insert into auth.users values ($1),($2)", [alice, bob]);
await db.transaction(async (tx) => {
  await tx.exec("set local role service_role");
  await tx.query("insert into public.free_resource_downloads(user_id,slug,source) values ($1,'slop','instagram'),($2,'skill','direct')", [alice, bob]);
});
after(async () => db.close());

test("each browser identity reads only its own download history", async () => {
  for (const [user, slug] of [[alice, "slop"], [bob, "skill"]]) {
    const rows = await db.transaction(async (tx) => {
      await tx.exec("set local role authenticated");
      await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [user]);
      return tx.query("select user_id,slug from public.free_resource_downloads order by slug");
    });
    assert.deepEqual(rows.rows, [{ user_id: user, slug }]);
  }
});

test("browser callers cannot forge, rewrite or delete download events", async () => {
  for (const statement of [
    "insert into public.free_resource_downloads(user_id,slug) values ($1,'slop')",
    "update public.free_resource_downloads set source='tiktok' where user_id=$1",
    "delete from public.free_resource_downloads where user_id=$1",
  ]) {
    await assert.rejects(db.transaction(async (tx) => {
      await tx.exec("set local role authenticated");
      await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [alice]);
      await tx.query(statement, [bob]);
    }), /permission denied/);
  }
  await assert.rejects(db.transaction(async (tx) => {
    await tx.exec("set local role anon");
    await tx.query("select * from public.free_resource_downloads");
  }), /permission denied/);
  assert.deepEqual((await db.query("select user_id,source from public.free_resource_downloads order by user_id")).rows,
    [{ user_id: alice, source: "instagram" }, { user_id: bob, source: "direct" }]);
});

test("removing one local account erases its resource logs and preserves the other account", async () => {
  await db.query("delete from auth.users where id=$1", [alice]);
  assert.deepEqual((await db.query("select user_id,slug from public.free_resource_downloads")).rows,
    [{ user_id: bob, slug: "skill" }]);
});
