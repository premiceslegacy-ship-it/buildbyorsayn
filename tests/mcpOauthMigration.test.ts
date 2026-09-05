import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/migrations/20260904151436_mcp_oauth.sql";

test("the MCP OAuth migration enforces PKCE S256, hashed tokens, and no client-side access", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create table if not exists public\.mcp_oauth_clients/);
  assert.match(sql, /create table if not exists public\.mcp_authorization_codes/);
  assert.match(sql, /create table if not exists public\.mcp_access_tokens/);
  assert.match(sql, /create table if not exists public\.mcp_refresh_tokens/);
  assert.match(sql, /create table if not exists public\.mcp_rate_limits/);

  // PKCE plain is refused at the schema level, not just in application code.
  assert.match(sql, /check \(code_challenge_method = 'S256'\)/);

  // Tokens and codes are never stored in clear text.
  assert.match(sql, /code_hash text primary key/);
  assert.match(sql, /token_hash text primary key/);

  assert.match(sql, /consumed_at timestamptz/);
  assert.match(sql, /rotated_to text/);

  for (const table of [
    "mcp_oauth_clients",
    "mcp_authorization_codes",
    "mcp_access_tokens",
    "mcp_refresh_tokens",
    "mcp_rate_limits",
  ]) {
    const forceRlsPattern = new RegExp(
      `alter table public\\.${table} force row level security`
    );
    assert.match(sql, forceRlsPattern, `${table} must force RLS`);
  }

  assert.match(
    sql,
    /revoke all on table public\.mcp_oauth_clients from anon, authenticated/
  );
  assert.match(
    sql,
    /revoke all on table public\.mcp_authorization_codes from anon, authenticated/
  );
  assert.match(
    sql,
    /revoke all on table public\.mcp_access_tokens from anon, authenticated/
  );
  assert.match(
    sql,
    /revoke all on table public\.mcp_refresh_tokens from anon, authenticated/
  );
  assert.match(
    sql,
    /revoke all on table public\.mcp_rate_limits from anon, authenticated/
  );

  assert.match(sql, /create or replace function public\.consume_mcp_authorization_code/);
  assert.match(sql, /create or replace function public\.check_mcp_rate_limit/);
  assert.match(sql, /security definer/);
  assert.match(sql, /set search_path = ''/);

  // No policy grants any client-side (anon/authenticated) access at all.
  // These tables are only ever touched via the service role key.
  assert.doesNotMatch(sql, /create policy/i);
  assert.doesNotMatch(sql, /using \(true\)/i);
  assert.doesNotMatch(sql, /grant .* to anon/i);
  assert.doesNotMatch(sql, /grant .* to authenticated/i);
});

test("the forward hardening migration makes OAuth issuance and rotation atomic", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  assert.match(sql, /add column if not exists family_id uuid/);
  assert.match(sql, /create or replace function public\.exchange_mcp_authorization_code/);
  assert.match(sql, /create or replace function public\.rotate_mcp_refresh_token/);
  assert.match(sql, /for update/);
  assert.match(sql, /reuse_detected/);
  assert.match(sql, /update public\.mcp_access_tokens[\s\S]*family_id/);
  assert.match(sql, /update public\.mcp_refresh_tokens[\s\S]*family_id/);
  assert.match(sql, /insert into public\.mcp_access_tokens/);
  assert.match(sql, /insert into public\.mcp_refresh_tokens/);
  assert.match(sql, /set search_path = ''/);
});

test("DCR registration is capped atomically and only creates public clients", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  assert.match(sql, /create or replace function public\.register_mcp_oauth_client/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /token_endpoint_auth_method[\s\S]*'none'/);
  assert.match(sql, /registration_closed/);
});

test("consent uses a server-side single-use authorization request", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  assert.match(sql, /create table if not exists public\.mcp_authorization_requests/);
  assert.match(sql, /create or replace function public\.approve_mcp_authorization_request/);
  assert.match(sql, /create or replace function public\.deny_mcp_authorization_request/);
  assert.match(sql, /insert into public\.mcp_authorization_codes/);
  assert.match(sql, /interval '60 seconds'/);
  assert.match(sql, /consumed_at is null/);
  assert.match(sql, /create or replace function public\.create_mcp_authorization_request/);
  assert.match(sql, /redirect_uri = any\(client\.redirect_uris\)/);
  assert.match(sql, /interval '5 minutes'/);
});

test("consent requests are bound to the authenticated user that initiated them", async () => {
  const sql = await readFile(
    "supabase/migrations/20260905002000_mcp_consent_user_binding.sql",
    "utf8"
  );
  const authorize = await readFile("app/api/mcp/oauth/authorize/route.ts", "utf8");
  const actions = await readFile("app/actions/mcpConsent.ts", "utf8");
  const page = await readFile("app/mcp/consent/page.tsx", "utf8");

  assert.match(sql, /add column if not exists user_id uuid/);
  assert.match(sql, /request\.user_id = p_user_id/);
  assert.match(sql, /create function public\.deny_mcp_authorization_request\(\s*p_request_hash text,\s*p_user_id uuid/);
  assert.match(authorize, /p_user_id: user\.id/);
  assert.match(actions, /export async function denyMcpConsent[\s\S]*auth\.getUser\(\)[\s\S]*p_user_id: user\.id/);
  assert.match(page, /\.eq\("user_id", user\.id\)/);
});

test("database time owns access and refresh token lifetimes", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  assert.match(sql, /now\(\) \+ interval '15 minutes'/);
  assert.match(sql, /now\(\) \+ interval '30 days'/);
  assert.doesNotMatch(sql, /p_access_expires_at/);
  assert.doesNotMatch(sql, /p_refresh_expires_at/);
});

test("OAuth state has bounded cleanup and indexes for hot expiry paths", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  for (const index of [
    "mcp_authorization_requests_expiry_idx",
    "idx_mcp_authorization_codes_expires",
    "idx_mcp_access_tokens_expires",
    "idx_mcp_refresh_tokens_expires",
    "idx_mcp_rate_limits_window_start",
  ]) assert.match(sql, new RegExp(`create index if not exists ${index}`));
  assert.match(sql, /create or replace function public\.cleanup_mcp_oauth_state/);
  assert.match(sql, /delete from public\.mcp_authorization_requests/);
  assert.match(sql, /delete from public\.mcp_authorization_codes/);
  assert.match(sql, /delete from public\.mcp_access_tokens/);
  assert.match(sql, /delete from public\.mcp_refresh_tokens/);
  assert.match(sql, /delete from public\.mcp_rate_limits/);
});

test("hardening removes the obsolete non-PKCE code-consumption RPC", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904180000_mcp_security_hardening.sql",
    "utf8"
  );
  assert.match(
    sql,
    /drop function if exists public\.consume_mcp_authorization_code\(text, text, text\)/i
  );
});

test("dynamic OAuth clients are disclosed as unverified with their exact redirect destination", async () => {
  const consent = await readFile("app/mcp/consent/page.tsx", "utf8");
  assert.match(consent, /Application non verifiee/);
  assert.match(consent, /authorizationRequest\.redirect_uri/);
  assert.match(consent, /Destination exacte/);
  assert.doesNotMatch(consent, /<h1[^>]*>Connecter \{clientName\}<\/h1>/);
});

test("final hardening rejects SQL NULL snapshots and bounds refresh families", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904190000_mcp_final_hardening.sql",
    "utf8"
  );
  assert.match(sql, /if p_rows is null[\s\S]*or p_inventory is null/);
  assert.match(sql, /add column if not exists family_expires_at timestamptz/);
  assert.match(sql, /v_token\.family_expires_at <= now\(\)/);
  assert.match(sql, /least\(now\(\) \+ interval '30 days', v_token\.family_expires_at\)/);
});

test("final hardening provides server-only user revocation", async () => {
  const sql = await readFile(
    "supabase/migrations/20260904190000_mcp_final_hardening.sql",
    "utf8"
  );
  assert.match(sql, /create or replace function public\.revoke_mcp_user_connections/);
  assert.match(sql, /update public\.mcp_authorization_codes/);
  assert.match(sql, /update public\.mcp_access_tokens/);
  assert.match(sql, /update public\.mcp_refresh_tokens/);
  assert.match(sql, /revoke all on function public\.revoke_mcp_user_connections\(uuid\)/);
  assert.match(sql, /grant execute on function public\.revoke_mcp_user_connections\(uuid\)[\s\S]*to service_role/);
});

test("the dashboard revokes connections only for the authenticated server-derived user", async () => {
  const action = await readFile("app/actions/mcpConnections.ts", "utf8");
  const dashboard = await readFile("app/dashboard/mcp/page.tsx", "utf8");
  assert.match(action, /supabase\.auth\.getUser\(\)/);
  assert.match(action, /revoke_mcp_user_connections/);
  assert.match(action, /p_user_id:\s*user\.id/);
  assert.doesNotMatch(action, /formData|searchParams|p_user_id:\s*[a-zA-Z]+Id/);
  assert.match(dashboard, /action=\{revokeMcpConnections\}/);
  assert.match(dashboard, /Couper toutes les connexions/);
});

test("the remote MCP access report describes only runtime evidence it directly observes", async () => {
  const script = await readFile("scripts/verify-mcp-access.ts", "utf8");
  assert.doesNotMatch(script, /migrations:\s*\[/);
  assert.match(script, /runtimeEvidenceScope/);
});

test("the remote verifier attempts every cleanup and proves no fixture type remains", async () => {
  const verifier = await readFile("scripts/verify-mcp-access.ts", "utf8");
  assert.match(verifier, /Promise\.allSettled/);
  assert.match(verifier, /while \(page <= totalPages\)/);
  assert.match(verifier, /perPage:\s*1000/);
  for (const field of [
    "temporaryUsersRemaining",
    "temporaryClientsRemaining",
    "temporaryAccessTokensRemaining",
    "temporaryRefreshTokensRemaining",
    "temporaryAuthorizationCodesRemaining",
    "temporaryAuthorizationRequestsRemaining",
    "temporaryChunksRemaining",
  ]) {
    assert.match(verifier, new RegExp(field));
  }
});

test("the release E2E covers both discovery documents, PKCE denial, user revocation, and three runs", async () => {
  const script = await readFile("scripts/verify-mcp-e2e.ts", "utf8");
  const manifest = JSON.parse(await readFile("package.json", "utf8")) as {
    scripts: Record<string, string>;
  };
  assert.match(script, /oauth-protected-resource/);
  assert.match(script, /wrongPkceVerifierDenied/);
  assert.match(script, /userRevocation/);
  const command = manifest.scripts["test:mcp-e2e"];
  assert.equal((command.match(/tsx scripts\/verify-mcp-e2e\.ts/g) ?? []).length, 3);
  const tierCommand = manifest.scripts["test:mcp-tiers"];
  assert.match(tierCommand, /verify-mcp-tier-evidence\.ts/);
});

test("tier evidence bounds and reaps each E2E child process", async () => {
  const runner = await readFile("scripts/verify-mcp-tier-evidence.ts", "utf8");
  const processTree = await readFile("scripts/mcp-process-tree.ts", "utf8");

  assert.match(runner, /TIER_CHILD_DEADLINE_MS/);
  assert.match(runner, /requestTermination\("deadline"\)/);
  assert.match(runner, /signalProcessTree\(child, "SIGTERM"\)/);
  assert.match(runner, /killTimer = setTimeout\(\(\) => \{[\s\S]*signalProcessTree\(child, "SIGKILL"\)/);
  assert.match(runner, /signalProcessTree\(child, "SIGKILL"\)/);
  assert.match(runner, /detached:\s*true/);
  assert.match(runner, /terminationReason/);
  assert.match(runner, /terminationFailure/);
  assert.match(runner, /terminationWatchdogTimer/);
  assert.match(runner, /failClosed/);
  assert.match(runner, /process\.platform === "win32"/);
  assert.match(runner, /requires POSIX process groups/);
  assert.match(runner, /output-overflow/);
  assert.match(runner, /orphaned-descendant/);
  assert.match(runner, /child-error/);
  assert.match(runner, /PROCESS_GROUP_DRAIN_TIMEOUT_MS/);
  assert.match(runner, /isProcessGroupAlive\(child\.pid\)/);
  assert.match(runner, /drainTimer/);
  assert.match(runner, /clearTimeout/);
  assert.match(runner, /child\.once\("close"/);
  assert.match(processTree, /process\.kill\(-child\.pid, signal\)/);
  assert.match(processTree, /process\.kill\(-pid, 0\)/);
});

test("forward DCR cleanup reclaims stale used clients without cascading active OAuth state", async () => {
  const migration = await readFile(
    "supabase/migrations/20260904233000_mcp_dcr_capacity_recovery.sql",
    "utf8"
  );

  assert.match(migration, /coalesce\(client\.last_used_at, client\.created_at\) < now\(\) - interval '7 days'/);
  assert.match(migration, /from public\.mcp_authorization_requests request[\s\S]*request\.client_id = client\.client_id/);
  assert.match(migration, /from public\.mcp_authorization_codes code[\s\S]*code\.client_id = client\.client_id/);
  assert.match(migration, /from public\.mcp_access_tokens access_token[\s\S]*access_token\.client_id = client\.client_id/);
  assert.match(migration, /from public\.mcp_refresh_tokens refresh_token[\s\S]*refresh_token\.client_id = client\.client_id/);
  assert.match(migration, /limit least\(100, p_max_clients\)/);
  assert.match(migration, /limit p_batch_size/);

  for (const index of [
    "mcp_oauth_clients_cleanup_idx",
    "mcp_authorization_requests_client_idx",
    "mcp_authorization_codes_client_idx",
    "mcp_access_tokens_client_idx",
    "mcp_refresh_tokens_client_idx",
  ]) assert.match(migration, new RegExp(`create index if not exists ${index}`));
});
