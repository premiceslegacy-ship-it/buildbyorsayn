import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { spawnSync } from "node:child_process";

const container = process.env.MCP_PG_CONTAINER ?? "build-mcp-pgtest";
const root = process.cwd();
const database = `mcp_gate_${process.pid}_${Date.now()}`;
let databaseCreated = false;

function runDocker(args, options = {}) {
  const result = spawnSync("docker", args, {
    cwd: root,
    encoding: "utf8",
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`docker command failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function applyFile(path) {
  const sql = readFileSync(resolve(root, path), "utf8");
  runDocker(["exec", "-i", container, "psql", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", database], { input: sql });
}

function sql(statement) {
  return runDocker([
    "exec", container, "psql", "-X", "-qAt", "-v", "ON_ERROR_STOP=1",
    "-U", "postgres", "-d", database, "-c", statement,
  ]);
}

function assertSqlFails(statement, message) {
  assert.throws(() => sql(statement), message);
}

function sqlAsync(statement) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("docker", [
      "exec", container, "psql", "-X", "-qAt", "-v", "ON_ERROR_STOP=1",
      "-U", "postgres", "-d", database, "-c", statement,
    ], { cwd: root });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(`parallel psql failed (${code}): ${stderr || stdout}`));
      else resolvePromise(stdout.trim());
    });
  });
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function challenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}

const H = {
  request1: "1".repeat(64), request2: "2".repeat(64), request3: "3".repeat(64),
  code1: "a".repeat(64), code2: "b".repeat(64), code3: "c".repeat(64),
  access1: "d".repeat(64), refresh1: "e".repeat(64),
  access2a: "4".repeat(64), access2b: "5".repeat(64),
  refresh2a: "6".repeat(64), refresh2b: "7".repeat(64),
  failedAccess: "f".repeat(64), failedRefresh: "8".repeat(64),
  rotatedAccessA: "9".repeat(64), rotatedAccessB: "0".repeat(64),
  rotatedRefreshA: sha256("rotated-refresh-a"), rotatedRefreshB: sha256("rotated-refresh-b"),
};
const verifier = "A".repeat(43);
const wrongVerifier = "B".repeat(43);
const clientId = "mcp_test_client_00000000000000000001";
const userId = "11111111-1111-4111-8111-111111111111";
const redirectUri = "http://127.0.0.1:4567/callback";
const resource = "http://127.0.0.1:3100/api/mcp";

runDocker(["exec", container, "createdb", "-U", "postgres", database]);
databaseCreated = true;
process.on("exit", () => {
  if (!databaseCreated) return;
  spawnSync("docker", ["exec", container, "dropdb", "-U", "postgres", "--if-exists", database], {
    cwd: root,
    stdio: "ignore",
  });
});

applyFile("tests/fixtures/mcp-postgres-bootstrap.sql");
applyFile("supabase/migrations/20260904151355_mcp_knowledge_base.sql");
applyFile("supabase/migrations/20260904151436_mcp_oauth.sql");
applyFile("supabase/migrations/20260904180000_mcp_security_hardening.sql");
applyFile("supabase/migrations/20260904190000_mcp_final_hardening.sql");
applyFile("supabase/migrations/20260904230000_mcp_bounded_cleanup.sql");
applyFile("supabase/migrations/20260904233000_mcp_dcr_capacity_recovery.sql");

assert.equal(sql("select relrowsecurity::int || ':' || relforcerowsecurity::int from pg_class where oid='public.knowledge_chunks'::regclass"), "1:1");
assert.equal(sql("select has_table_privilege('anon','public.knowledge_chunks','select')::int || ':' || has_table_privilege('authenticated','public.knowledge_chunks','select')::int"), "0:0");
assert.equal(sql("select (to_regprocedure('public.consume_mcp_authorization_code(text,text,text)') is null)::int || ':' || (to_regprocedure('public.match_knowledge_chunks(extensions.vector,text,integer,text)') is null)::int"), "1:1");
assert.equal(sql("select count(*) from pg_proc where pronamespace='public'::regnamespace and proname like '%mcp%' and prosecdef and not (coalesce(proconfig,'{}') @> array['search_path=\"\"'])"), "0");

sql(`insert into auth.users(id,email) values ('${userId}','mcp-test@example.invalid');
insert into public.mcp_oauth_clients(client_id,client_name,redirect_uris,grant_types,token_endpoint_auth_method)
values ('${clientId}','MCP test client',array['${redirectUri}'],array['authorization_code','refresh_token'],'none');`);

function createRequest(requestHash) {
  const status = sql(`select public.create_mcp_authorization_request('${requestHash}','${clientId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}','state')`);
  assert.equal(status, "created");
}

createRequest(H.request1);
const ttlSeconds = Number(sql(`select extract(epoch from expires_at-now())::int from public.mcp_authorization_requests where request_hash='${H.request1}'`));
assert(ttlSeconds >= 295 && ttlSeconds <= 300, `unexpected authorization request TTL: ${ttlSeconds}`);
const approvalResults = await Promise.all([
  sqlAsync(`select status from public.approve_mcp_authorization_request('${H.request1}','${userId}','${H.code1}')`),
  sqlAsync(`select status from public.approve_mcp_authorization_request('${H.request1}','${userId}','${H.code2}')`),
]);
assert.deepEqual(approvalResults.sort(), ["approved", "invalid_request"]);
assert.equal(sql(`select count(*) from public.mcp_authorization_codes where code_hash in ('${H.code1}','${H.code2}')`), "1");
const issuedCode1 = sql(`select code_hash from public.mcp_authorization_codes where code_hash in ('${H.code1}','${H.code2}')`);

createRequest(H.request2);
assert.equal(sql(`select status from public.deny_mcp_authorization_request('${H.request2}')`), "denied");
assert.equal(sql(`select status from public.deny_mcp_authorization_request('${H.request2}')`), "invalid_request");

assert.equal(sql(`select status from public.exchange_mcp_authorization_code('${issuedCode1}','${redirectUri}','${clientId}','${challenge(wrongVerifier)}','${resource}','${H.access1}','${H.refresh1}','22222222-2222-4222-8222-222222222222')`), "invalid_grant");
assert.equal(sql(`select (consumed_at is null)::int from public.mcp_authorization_codes where code_hash='${issuedCode1}'`), "1");
assert.equal(sql(`select status from public.exchange_mcp_authorization_code('${issuedCode1}','${redirectUri}','${clientId}','${challenge(verifier)}','${resource}','${H.access1}','${H.refresh1}','22222222-2222-4222-8222-222222222222')`), "issued");
assert.equal(sql(`select round(extract(epoch from expires_at-now()))::int from public.mcp_access_tokens where token_hash='${H.access1}'`), "900");

createRequest(H.request3);
assert.equal(sql(`select status from public.approve_mcp_authorization_request('${H.request3}','${userId}','${H.code3}')`), "approved");
const exchangeResults = await Promise.all([
  sqlAsync(`select status from public.exchange_mcp_authorization_code('${H.code3}','${redirectUri}','${clientId}','${challenge(verifier)}','${resource}','${H.access2a}','${H.refresh2a}','33333333-3333-4333-8333-333333333333')`),
  sqlAsync(`select status from public.exchange_mcp_authorization_code('${H.code3}','${redirectUri}','${clientId}','${challenge(verifier)}','${resource}','${H.access2b}','${H.refresh2b}','44444444-4444-4444-8444-444444444444')`),
]);
assert.deepEqual(exchangeResults.sort(), ["invalid_grant", "issued"]);
assert.equal(sql(`select count(*) from public.mcp_access_tokens where token_hash in ('${H.access2a}','${H.access2b}')`), "1");
assert.equal(sql(`select count(*) from public.mcp_refresh_tokens where token_hash in ('${H.refresh2a}','${H.refresh2b}')`), "1");

sql(`create or replace function public.mcp_test_fail_access_insert() returns trigger language plpgsql as $$ begin if new.token_hash='${H.failedAccess}' then raise exception 'synthetic insert failure'; end if; return new; end $$;
create trigger mcp_test_fail_access before insert on public.mcp_access_tokens for each row execute function public.mcp_test_fail_access_insert();
insert into public.mcp_authorization_codes(code_hash,client_id,user_id,redirect_uri,code_challenge,code_challenge_method,scope,resource,expires_at)
values ('${sha256("rollback-code")}','${clientId}','${userId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}',now()+interval '1 minute');
do $$ begin
  begin
    perform * from public.exchange_mcp_authorization_code('${sha256("rollback-code")}','${redirectUri}','${clientId}','${challenge(verifier)}','${resource}','${H.failedAccess}','${H.failedRefresh}','55555555-5555-4555-8555-555555555555');
  exception when others then null;
  end;
end $$;
drop trigger mcp_test_fail_access on public.mcp_access_tokens;
drop function public.mcp_test_fail_access_insert();`);
assert.equal(sql(`select (consumed_at is null)::int from public.mcp_authorization_codes where code_hash='${sha256("rollback-code")}'`), "1");
assert.equal(sql(`select count(*) from public.mcp_access_tokens where token_hash='${H.failedAccess}'`), "0");
assert.equal(sql(`select count(*) from public.mcp_refresh_tokens where token_hash='${H.failedRefresh}'`), "0");

const rotationResults = await Promise.all([
  sqlAsync(`select status from public.rotate_mcp_refresh_token('${H.refresh1}','${clientId}','${resource}','${H.rotatedAccessA}','${H.rotatedRefreshA}')`),
  sqlAsync(`select status from public.rotate_mcp_refresh_token('${H.refresh1}','${clientId}','${resource}','${H.rotatedAccessB}','${H.rotatedRefreshB}')`),
]);
assert.deepEqual(rotationResults.sort(), ["issued", "reuse_detected"]);
assert.equal(sql("select count(*) from public.mcp_refresh_tokens where family_id='22222222-2222-4222-8222-222222222222' and revoked_at is null"), "0");
assert.equal(sql("select count(*) from public.mcp_access_tokens where family_id='22222222-2222-4222-8222-222222222222' and revoked_at is null"), "0");
assert.equal(sql(`select status from public.rotate_mcp_refresh_token('${H.refresh1}','${clientId}','${resource}','${sha256("after-replay-access")}','${sha256("after-replay-refresh")}')`), "reuse_detected");
assert.equal(sql("select count(*) from public.mcp_refresh_tokens where family_expires_at > created_at + interval '30 days'"), "0");

const zeroVector = `[${Array(768).fill(0).join(",")}]`;
const fpA = "a".repeat(64);
const fpB = "b".repeat(64);
function row(source, sourceId, index, hash = "c".repeat(64)) {
  return { source, source_id: sourceId, chunk_index: index, title: `${source}-${sourceId}`, content: "synthetic content", content_hash: hash, tier_required: "preview", embedding: zeroVector, metadata: { embeddingFingerprint: fpA } };
}
function literal(value) {
  return `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
}
const initialRows = [row("obsidian", "note-a", 0), row("blocs", "block-a", 0)];
assert.equal(sql(`select upserted_count || ':' || deleted_count from public.apply_mcp_knowledge_snapshot(${literal(initialRows)},${literal(initialRows.map(({source,source_id,chunk_index}) => ({source,source_id,chunk_index})))},array['obsidian','blocs'],true)`), "2:0");
assert.equal(sql(`select upserted_count || ':' || deleted_count from public.apply_mcp_knowledge_snapshot(${literal([row("obsidian","note-a",0,"d".repeat(64))])},${literal([{source:"obsidian",source_id:"note-a",chunk_index:0}])},array['obsidian'],false)`), "1:0");
assert.equal(sql("select count(*) from public.knowledge_chunks where source='blocs'"), "1");
sql(`do $$ begin begin perform * from public.apply_mcp_knowledge_snapshot('[{"source":"obsidian"}]'::jsonb,'[]'::jsonb,array['obsidian'],true); exception when others then null; end; end $$;`);
assert.equal(sql("select count(*) from public.knowledge_chunks"), "2");
for (const payload of ["null,'[]'::jsonb", "'[]'::jsonb,null"]) {
  let nullSnapshotFailed = false;
  try {
    sql(`select * from public.apply_mcp_knowledge_snapshot(${payload},array['obsidian'],true)`);
  } catch {
    nullSnapshotFailed = true;
  }
  assert.equal(nullSnapshotFailed, true);
}
assert.equal(sql(`select upserted_count || ':' || deleted_count from public.apply_mcp_knowledge_snapshot('[]'::jsonb,'[]'::jsonb,array['obsidian'],true)`), "0:1");
assert.equal(sql("select count(*) from public.knowledge_chunks where source='obsidian'"), "0");
let mismatchFailed = false;
try {
  sql(`select count(*) from public.match_mcp_knowledge_chunks('${zeroVector}'::extensions.vector,'full',8,null,'${fpB}')`);
} catch {
  mismatchFailed = true;
}
assert.equal(mismatchFailed, true);

const revocation = sql(`select authorization_codes_revoked || ':' || access_tokens_revoked || ':' || refresh_tokens_revoked from public.revoke_mcp_user_connections('${userId}')`);
assert.match(revocation, /^\d+:\d+:\d+$/);
assert.equal(sql(`select count(*) from public.mcp_access_tokens where user_id='${userId}' and revoked_at is null`), "0");
assert.equal(sql(`select count(*) from public.mcp_refresh_tokens where user_id='${userId}' and revoked_at is null`), "0");

const cleanupHashes = {
  requestExpired1: sha256("cleanup-request-expired-1"),
  requestExpired2: sha256("cleanup-request-expired-2"),
  requestExpired3: sha256("cleanup-request-expired-3"),
  requestFresh: sha256("cleanup-request-fresh"),
  codeExpired: sha256("cleanup-code-expired"),
  codeFresh: sha256("cleanup-code-fresh"),
  accessExpired: sha256("cleanup-access-expired"),
  accessFresh: sha256("cleanup-access-fresh"),
  refreshExpired: sha256("cleanup-refresh-expired"),
  refreshFresh: sha256("cleanup-refresh-fresh"),
};
const staleClientId = "mcp_cleanup_stale_client";
const freshClientId = "mcp_cleanup_fresh_client";
sql(`insert into public.mcp_oauth_clients(client_id,client_name,redirect_uris,grant_types,token_endpoint_auth_method,created_at)
values ('${staleClientId}','stale cleanup client',array['${redirectUri}'],array['authorization_code','refresh_token'],'none',now()-interval '8 days'),
       ('${freshClientId}','fresh cleanup client',array['${redirectUri}'],array['authorization_code','refresh_token'],'none',now());
insert into public.mcp_authorization_requests(request_hash,client_id,redirect_uri,code_challenge,code_challenge_method,scope,resource,state,expires_at)
values ('${cleanupHashes.requestExpired1}','${clientId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}','',now()-interval '2 days'),
       ('${cleanupHashes.requestExpired2}','${clientId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}','',now()-interval '2 days'),
       ('${cleanupHashes.requestExpired3}','${clientId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}','',now()-interval '2 days'),
       ('${cleanupHashes.requestFresh}','${clientId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}','',now()+interval '5 minutes');
insert into public.mcp_authorization_codes(code_hash,client_id,user_id,redirect_uri,code_challenge,code_challenge_method,scope,resource,expires_at)
values ('${cleanupHashes.codeExpired}','${clientId}','${userId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}',now()-interval '2 days'),
       ('${cleanupHashes.codeFresh}','${clientId}','${userId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}',now()+interval '1 minute');
insert into public.mcp_access_tokens(token_hash,client_id,user_id,scope,resource,expires_at)
values ('${cleanupHashes.accessExpired}','${clientId}','${userId}','mcp','${resource}',now()-interval '2 days'),
       ('${cleanupHashes.accessFresh}','${clientId}','${userId}','mcp','${resource}',now()+interval '15 minutes');
insert into public.mcp_refresh_tokens(token_hash,client_id,user_id,scope,resource,expires_at)
values ('${cleanupHashes.refreshExpired}','${clientId}','${userId}','mcp','${resource}',now()-interval '8 days'),
       ('${cleanupHashes.refreshFresh}','${clientId}','${userId}','mcp','${resource}',now()+interval '30 days');
insert into public.mcp_rate_limits(subject,window_start,count)
values ('cleanup-expired',date_trunc('minute',now()-interval '2 days'),1),
       ('cleanup-fresh',date_trunc('minute',now()),1);`);

assertSqlFails("select * from public.cleanup_mcp_oauth_state(0)", "invalid batch size must fail");
const firstCleanup = sql("select * from public.cleanup_mcp_oauth_state(2)");
assert.equal(firstCleanup, "2|1|1|1|1|1", "first cleanup batch must report exact bounded deletions");
assert.equal(sql(`select count(*) from public.mcp_authorization_requests where request_hash in ('${cleanupHashes.requestExpired1}','${cleanupHashes.requestExpired2}','${cleanupHashes.requestExpired3}')`), "1");
assert.equal(sql(`select count(*) from public.mcp_authorization_requests where request_hash='${cleanupHashes.requestFresh}'`), "1");
assert.equal(sql(`select count(*) from public.mcp_authorization_codes where code_hash='${cleanupHashes.codeFresh}'`), "1");
assert.equal(sql(`select count(*) from public.mcp_access_tokens where token_hash='${cleanupHashes.accessFresh}'`), "1");
assert.equal(sql(`select count(*) from public.mcp_refresh_tokens where token_hash='${cleanupHashes.refreshFresh}'`), "1");
assert.equal(sql("select count(*) from public.mcp_rate_limits where subject='cleanup-fresh'"), "1");
assert.equal(sql(`select count(*) from public.mcp_oauth_clients where client_id='${freshClientId}'`), "1");
assert.equal(sql(`select count(*) from public.mcp_oauth_clients where client_id='${staleClientId}'`), "0");
const secondCleanup = sql("select * from public.cleanup_mcp_oauth_state(2)");
assert.equal(secondCleanup, "1|0|0|0|0|0", "second cleanup batch must resume the backlog");
assert.equal(sql(`select count(*) from public.mcp_authorization_requests where request_hash in ('${cleanupHashes.requestExpired1}','${cleanupHashes.requestExpired2}','${cleanupHashes.requestExpired3}')`), "0");

const staleUsedClientId = "mcp_cleanup_stale_used_client";
sql(`insert into public.mcp_oauth_clients(client_id,client_name,redirect_uris,grant_types,token_endpoint_auth_method,created_at,last_used_at)
values ('${staleUsedClientId}','stale used cleanup client',array['${redirectUri}'],array['authorization_code','refresh_token'],'none',now()-interval '30 days',now()-interval '8 days');`);
assert.equal(sql("select clients_deleted from public.cleanup_mcp_oauth_state(1)"), "1");
assert.equal(sql(`select count(*) from public.mcp_oauth_clients where client_id='${staleUsedClientId}'`), "0");

sql(`truncate public.mcp_oauth_clients cascade;
insert into public.mcp_oauth_clients(client_id,client_name,redirect_uris,grant_types,token_endpoint_auth_method,created_at,last_used_at)
select 'mcp_capacity_' || lpad(series::text, 4, '0'), 'capacity client', array['${redirectUri}'], array['authorization_code','refresh_token'], 'none', now()-interval '30 days', now()-interval '8 days'
from generate_series(1,500) series;
insert into public.mcp_authorization_requests(request_hash,client_id,redirect_uri,code_challenge,code_challenge_method,scope,resource,state,expires_at)
values ('${sha256("capacity-pending-request")}','mcp_capacity_0001','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}','',now()+interval '5 minutes');
insert into public.mcp_authorization_codes(code_hash,client_id,user_id,redirect_uri,code_challenge,code_challenge_method,scope,resource,expires_at)
values ('${sha256("capacity-active-code")}','mcp_capacity_0002','${userId}','${redirectUri}','${challenge(verifier)}','S256','mcp','${resource}',now()+interval '1 minute');
insert into public.mcp_access_tokens(token_hash,client_id,user_id,scope,resource,expires_at)
values ('${sha256("capacity-active-access")}','mcp_capacity_0003','${userId}','mcp','${resource}',now()+interval '15 minutes');
insert into public.mcp_refresh_tokens(token_hash,client_id,user_id,scope,resource,expires_at)
values ('${sha256("capacity-active-refresh")}','mcp_capacity_0004','${userId}','mcp','${resource}',now()+interval '30 days');`);
assert.equal(sql("select count(*) from public.mcp_oauth_clients"), "500");
assert.equal(sql(`select public.register_mcp_oauth_client('mcp_capacity_recovered','capacity recovered',array['${redirectUri}'],'capacity-recovery-subject',5,3600,500)`), "registered");
assert.equal(sql("select count(*) from public.mcp_oauth_clients where client_id='mcp_capacity_recovered'"), "1");
for (const protectedClientId of ["mcp_capacity_0001", "mcp_capacity_0002", "mcp_capacity_0003", "mcp_capacity_0004"]) {
  assert.equal(sql(`select count(*) from public.mcp_oauth_clients where client_id='${protectedClientId}'`), "1");
}
assert.equal(sql(`select count(*) from public.mcp_authorization_requests where request_hash='${sha256("capacity-pending-request")}'`), "1");
console.log(JSON.stringify({
  migration_apply: "passed",
  rls: "passed",
  authorization_request_single_use: "passed",
  authorization_code_concurrency: "passed",
  pkce_non_consumption: "passed",
  token_rollback: "passed",
  refresh_replay_family_revocation: "passed",
  refresh_family_absolute_expiry: "passed",
  user_revocation: "passed",
  cleanup_bounded_and_resumable: "passed",
  stale_used_client_reclaimed: "passed",
  pending_request_preserved: "passed",
  active_client_relationships_preserved: "passed",
  dcr_capacity_recovered: "passed",
  isolated_database: database,
  knowledge_snapshot_atomicity: "passed",
  knowledge_null_rejection: "passed",
  knowledge_partial_apply: "passed",
  knowledge_opt_out_deletion: "passed",
  embedding_fingerprint_rejection: "passed",
}));
