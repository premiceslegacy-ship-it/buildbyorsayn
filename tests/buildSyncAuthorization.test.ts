import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test, { after, beforeEach } from "node:test";
import { localPostgres, postgresFetch } from "./fixtures/postgresTransport";
import { DELETE as disconnect } from "../app/api/build-sync/session/route";
import { POST as refresh } from "../app/api/build-sync/oauth/token/route";
import { resolveBuildSyncAuth } from "../lib/buildSync/auth";

const previousFetch = globalThis.fetch;
const env = {
  MCP_CONNECTOR_LAUNCHED: "true", BUILD_SYNC_OAUTH_ISSUER: "http://127.0.0.1:35430",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:35439", SUPABASE_SERVICE_ROLE_KEY: "synthetic-local-key",
  BUILD_SYNC_TOKEN_RATE_LIMIT_PEPPER: "synthetic-pepper-for-local-test", VERCEL_ENV: undefined,
};
const previousEnv = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
for (const [key, value] of Object.entries(env)) {
  if (value === undefined) delete process.env[key]; else process.env[key] = value;
}
const db = await localPostgres();
await db.exec(await readFile("supabase/migrations/20261010130000_build_sync_oauth.sql", "utf8"));
globalThis.fetch = postgresFetch(db);
const user = "11111111-1111-4111-8111-111111111111";
const family = "22222222-2222-4222-8222-222222222222";
const resource = "http://127.0.0.1:35430/api/build-sync";
const rawAccess = "a".repeat(43);
const rawRefresh = "r".repeat(43);
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const request = (token = rawAccess) => new Request(`${resource}/session`, { method: "DELETE", headers: { authorization: `Bearer ${token}` } });
const refreshRequest = (token: string) => new Request(`${resource}/oauth/token`, {
  method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: token, client_id: "build-sync-cli", resource }),
});
beforeEach(async () => {
  await db.exec("truncate auth.users cascade");
  await db.query("insert into auth.users values ($1)", [user]);
  await db.query("insert into public.profiles values ($1, 'full')", [user]);
  await db.query(`insert into public.build_sync_access_tokens(token_hash,user_id,client_id,scope,resource,family_id,expires_at)
    values ($1,$2,'build-sync-cli','skills:read',$3,$4,now()+interval '15 minutes')`, [hash(rawAccess), user, resource, family]);
  await db.query(`insert into public.build_sync_refresh_tokens(token_hash,user_id,client_id,scope,resource,family_id,expires_at,family_expires_at)
    values ($1,$2,'build-sync-cli','skills:read',$3,$4,now()+interval '30 days',now()+interval '90 days')`, [hash(rawRefresh), user, resource, family]);
});
after(async () => {
  globalThis.fetch = previousFetch;
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
  await db.close();
});

test("an expired bearer cannot invoke session revocation; a live bearer revokes its family", async () => {
  await db.query("update public.build_sync_access_tokens set expires_at=now()-interval '1 second'");
  const expired = await disconnect(request());
  assert.equal(expired.status, 401);
  assert.deepEqual((await db.query("select revoked_at from public.build_sync_refresh_tokens")).rows, [{ revoked_at: null }]);
  await db.query("update public.build_sync_access_tokens set expires_at=now()+interval '15 minutes'");
  assert.equal((await disconnect(request())).status, 204);
  assert.equal((await db.query<{ active: number }>("select count(*)::int as active from public.build_sync_refresh_tokens where revoked_at is null")).rows[0].active, 0);
});

test("refresh replay revokes the newly issued family, not only the already consumed token", async () => {
  const first = await refresh(refreshRequest(rawRefresh));
  assert.equal(first.status, 200);
  const issued = await first.json() as { access_token: string; refresh_token: string };
  assert.equal((await resolveBuildSyncAuth(request(issued.access_token)))?.userId, user);
  const replay = await refresh(refreshRequest(rawRefresh));
  assert.equal(replay.status, 400);
  assert.equal((await replay.json()).error, "invalid_grant");
  assert.equal(await resolveBuildSyncAuth(request(issued.access_token)), null);
  assert.equal((await db.query<{ active: number }>("select count(*)::int as active from public.build_sync_refresh_tokens where revoked_at is null")).rows[0].active, 0);
  assert.equal((await refresh(refreshRequest(issued.refresh_token))).status, 400);
});

test("browser roles cannot read token hashes or execute the privileged rotation RPC", async () => {
  for (const role of ["anon", "authenticated"]) {
    await assert.rejects(db.transaction(async (tx) => {
      await tx.exec(`set local role ${role}`);
      await tx.query("select token_hash from public.build_sync_refresh_tokens");
    }), /permission denied/);
    await assert.rejects(db.transaction(async (tx) => {
      await tx.exec(`set local role ${role}`);
      await tx.query("select * from public.rotate_build_sync_refresh_token($1,'build-sync-cli',$2,$3,$4)", [hash(rawRefresh), resource, "b".repeat(64), "c".repeat(64)]);
    }), /permission denied/);
  }
  assert.equal((await refresh(refreshRequest(rawRefresh))).status, 200);
});
