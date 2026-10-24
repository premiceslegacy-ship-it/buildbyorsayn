import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const image = process.env.STRIPE_UPGRADE_PG_IMAGE ?? "pgvector/pgvector:pg17";
const container = `stripe-upgrade-qa-${randomUUID()}`;
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

function sql(statement, app = "stripe_upgrade_qa") {
  return runDocker([
    "exec", "-i", "-e", `PGAPPNAME=${app}`,
    "-e", "PGOPTIONS=-c statement_timeout=10000 -c lock_timeout=8000 -c idle_in_transaction_session_timeout=15000",
    container, "psql", "-X", "-qAt", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", "postgres",
  ], { input: statement });
}

function assertRoleFunctionPrivilege(signature, expected) {
  for (const [role, value] of Object.entries(expected)) {
    const observed = sql(
      `set role ${role}; select has_function_privilege(current_user,'public.${signature}','execute')::int; reset role;`,
      `stripe_upgrade_role_${role}`,
    );
    assert.equal(observed, String(value), `${role} privilege for ${signature}`);
  }
}

function sqlAsync(statement, app) {
  return new Promise((resolve, reject) => {
    const child = spawn("docker", [
      "exec", "-i", "-e", `PGAPPNAME=${app}`,
      "-e", "PGOPTIONS=-c statement_timeout=10000 -c lock_timeout=8000 -c idle_in_transaction_session_timeout=15000",
      container, "psql", "-X", "-qAt", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", "postgres",
    ], { cwd: root });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`parallel psql failed (${code}): ${stderr || stdout}`));
    });
    child.stdin.end(statement);
  });
}

async function waitFor(statement, expected = "t") {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if (sql(statement, "stripe_upgrade_observer") === expected) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`PostgreSQL concurrency barrier was not observed: ${statement}`);
}

function createUser(id, tier = "beginner") {
  sql(`insert into auth.users(id) values ('${id}'); insert into public.profiles(id,tier) values ('${id}','${tier}');`);
}

async function assertConcurrentPair({ userId, sessionA, sessionB, expected }) {
  const appA = `stripe_upgrade_a_${sessionA}`;
  const appB = `stripe_upgrade_b_${sessionB}`;
  const first = sqlAsync(
    `begin; select public.apply_stripe_upgrade('${userId}','${sessionA}'); select pg_sleep(2); commit;`,
    appA
  );
  await waitFor(`select exists(select 1 from pg_stat_activity where application_name='${appA}' and wait_event='PgSleep');`);
  const second = sqlAsync(`select public.apply_stripe_upgrade('${userId}','${sessionB}');`, appB);
  await waitFor(`select exists(select 1 from pg_stat_activity where application_name='${appB}' and wait_event_type='Lock');`);
  const results = [await first, await second].map((value) => value.split("\n")[0]).sort();
  assert.deepEqual(results, [...expected].sort());
}

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
    create schema auth;
    create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
    create table public.profiles (id uuid primary key references auth.users(id), tier text);
    create table public.admin_action_audit (
      id bigint generated always as identity primary key,
      actor_user_id uuid,
      action text,
      target_type text,
      target_id uuid,
      result text,
      details jsonb
    );
  `);
  sql(readFileSync("supabase/migrations/20261022130000_stripe_upgrade_idempotency.sql", "utf8"));
  sql(readFileSync("supabase/migrations/20261024101000_stripe_purchase_ledger.sql", "utf8"));

  assert.equal(sql("select relrowsecurity::int from pg_class where oid='public.stripe_upgrade_claims'::regclass;"), "1");
  assert.equal(sql("select has_table_privilege('anon','public.stripe_upgrade_claims','select')::int || ':' || has_table_privilege('authenticated','public.stripe_upgrade_claims','select')::int;"), "0:0");
  assert.equal(sql("select has_function_privilege('anon','public.apply_stripe_upgrade(uuid,text,text)','execute')::int || ':' || has_function_privilege('authenticated','public.apply_stripe_upgrade(uuid,text,text)','execute')::int || ':' || has_function_privilege('service_role','public.apply_stripe_upgrade(uuid,text,text)','execute')::int;"), "0:0:1");
  assertRoleFunctionPrivilege("backfill_stripe_purchase_ledger(jsonb)", { anon: 0, authenticated: 0, service_role: 1 });
  assertRoleFunctionPrivilege("record_stripe_checkout_terminal(text,text,text)", { anon: 0, authenticated: 0, service_role: 1 });
  assert.equal(sql("select coalesce(array_to_string(proconfig, ','), '') from pg_proc where oid='public.apply_stripe_upgrade(uuid,text,text)'::regprocedure;"), "search_path=\"\"");

  const replayUser = "11111111-1111-4111-8111-111111111111";
  const conflictUser = "22222222-2222-4222-8222-222222222222";
  createUser(replayUser);
  createUser(conflictUser);
  assert.equal(sql(`select public.apply_stripe_upgrade('${replayUser}','cs_replay');`), "granted");
  assert.equal(sql(`select public.apply_stripe_upgrade('${replayUser}','cs_replay');`), "duplicate");
  assert.equal(sql(`select status from public.stripe_upgrade_claims where checkout_session_id='cs_replay';`), "granted");
  assert.equal(sql(`select public.apply_stripe_upgrade('${replayUser}','cs_second_payment');`), "refuse");
  assert.equal(sql(`select public.apply_stripe_upgrade('${conflictUser}','cs_replay');`), "conflict");
  assert.equal(sql(`select tier from public.profiles where id='${conflictUser}';`), "beginner");

  const legacyGrantedUser = "55555555-5555-4555-8555-555555555555";
  createUser(legacyGrantedUser);
  sql(`insert into public.stripe_upgrade_claims(checkout_session_id,user_id,status) values ('cs_legacy_granted','${legacyGrantedUser}','granted');`);
  assert.equal(sql(`select public.apply_stripe_upgrade('${legacyGrantedUser}','cs_legacy_granted','pi_legacy_granted');`), "duplicate");
  assert.equal(sql(`select fallback_tier from public.stripe_purchase_ledger where checkout_session_id='cs_legacy_granted';`), "beginner");

  const backfillUser = "66666666-6666-4666-8666-666666666666";
  createUser(backfillUser);
  assert.equal(sql(`select public.backfill_stripe_purchase_ledger('[{"checkout_session_id":"cs_backfill_active","payment_intent_id":"pi_backfill_active","user_id":"${backfillUser}","tier":"beginner","status":"active","amount_total":9700,"currency":"eur","customer_email":"buyer@example.test"},{"checkout_session_id":"cs_backfill_refunded","payment_intent_id":"pi_backfill_refunded","user_id":"${backfillUser}","tier":"full","status":"refunded","amount_total":26700,"currency":"eur","customer_email":"buyer@example.test","revoke_reason":"stripe_backfill"}]'::jsonb);`), "2");
  assert.equal(sql(`select string_agg(status, ',' order by status) from public.stripe_purchase_ledger where user_id='${backfillUser}';`), "active,refunded");
  assert.equal(sql(`select tier from public.profiles where id='${backfillUser}';`), "beginner");

  assert.equal(sql("select public.record_stripe_checkout_terminal('cs_terminal','pi_terminal','unknown_price');"), "recorded");
  assert.equal(sql("select public.revoke_stripe_purchase('pi_terminal','refunded','charge.refunded');"), "terminal");

  const sameSessionUser = "33333333-3333-4333-8333-333333333333";
  createUser(sameSessionUser);
  await assertConcurrentPair({
    userId: sameSessionUser,
    sessionA: "cs_same_concurrent",
    sessionB: "cs_same_concurrent",
    expected: ["granted", "duplicate"],
  });

  const twoPaymentUser = "44444444-4444-4444-8444-444444444444";
  createUser(twoPaymentUser);
  await assertConcurrentPair({
    userId: twoPaymentUser,
    sessionA: "cs_payment_a",
    sessionB: "cs_payment_b",
    expected: ["granted", "refuse"],
  });
  assert.equal(sql(`select tier from public.profiles where id='${twoPaymentUser}';`), "full");
  assert.equal(sql(`select string_agg(status, ',' order by status) from public.stripe_upgrade_claims where user_id='${twoPaymentUser}';`), "granted,refused");

  console.log("PASS Stripe upgrade replay, conflict and concurrent payment gates");
} finally {
  if (created) runDocker(["rm", "-f", "-v", container]);
}
