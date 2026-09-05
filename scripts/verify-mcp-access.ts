import { createClient, type User } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { embeddingFingerprint, resolveEmbeddingConfig } from "../lib/knowledge/embeddings";

loadEnv({ path: ".env.local", quiet: true });

const outputPath = path.join(
  process.cwd(),
  "product/accompagnement-site-web/visual-qa/mcp-access-runtime-verification.json"
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceKey) {
  throw new Error("Supabase verification environment is incomplete.");
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const FIXTURE_PREFIX = "hermes-mcp-";
const DIMENSIONS = 768;
const EMBEDDING_FINGERPRINT = embeddingFingerprint(resolveEmbeddingConfig(process.env));

function fakeEmbedding(seed: number): number[] {
  // Deterministic pseudo-embedding: cosine distance to itself is 0, and
  // distances between different seeds are stable across runs.
  const values = Array.from({ length: DIMENSIONS }, (_, i) =>
    Math.sin(seed * 12.9898 + i * 78.233)
  );
  const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  return values.map((v) => v / norm);
}

async function listFixtures(): Promise<User[]> {
  const fixtures: User[] = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const pagination = data as {
      users: User[];
      lastPage?: number;
      nextPage?: number | null;
    };
    fixtures.push(
      ...pagination.users.filter((user) => user.email?.startsWith(FIXTURE_PREFIX))
    );
    totalPages = pagination.lastPage ?? (pagination.nextPage ? page + 1 : page);
    page += 1;
  }
  return fixtures;
}

async function cleanupUsers(users: User[]) {
  if (!users.length) return;
  const ids = users.map((user) => user.id);
  const profileByUserId = await admin.from("profiles").delete().in("id", ids);
  if (profileByUserId.error) {
    throw new Error(`profiles: ${profileByUserId.error.message}`);
  }
  const deletions = await Promise.allSettled(
    users.map(async (user) => {
      const { error } = await admin.auth.admin.deleteUser(user.id);
      if (error) throw new Error("auth cleanup failed");
    })
  );
  if (deletions.some((result) => result.status === "rejected")) {
    throw new Error("auth cleanup failed");
  }
}

async function deleteFixtureRows(table: string, column: string, prefix: string) {
  const { error } = await admin
    .from(table)
    .delete()
    .like(column, `${prefix}%`);
  if (error) throw new Error(`${table} cleanup failed`);
}

async function cleanupAllFixtures(): Promise<boolean> {
  const results = await Promise.allSettled([
    (async () => cleanupUsers(await listFixtures()))(),
    deleteFixtureRows("mcp_authorization_requests", "client_id", FIXTURE_PREFIX),
    deleteFixtureRows("mcp_authorization_codes", "client_id", FIXTURE_PREFIX),
    deleteFixtureRows("mcp_access_tokens", "client_id", FIXTURE_PREFIX),
    deleteFixtureRows("mcp_refresh_tokens", "client_id", FIXTURE_PREFIX),
    deleteFixtureRows("mcp_oauth_clients", "client_id", FIXTURE_PREFIX),
    deleteFixtureRows("knowledge_chunks", "source", `${FIXTURE_PREFIX}test-`),
  ]);
  return results.every((result) => result.status === "fulfilled");
}

async function countFixtureRows(table: string, column: string, prefix: string): Promise<number> {
  const { count, error } = await admin
    .from(table)
    .select("*", { count: "exact", head: true })
    .like(column, `${prefix}%`);
  if (error || count === null) throw new Error(`${table} verification failed`);
  return count;
}

async function main() {
  if (!(await cleanupAllFixtures())) {
    throw new Error("Preflight fixture cleanup failed.");
  }

  const stamp = Date.now();
  const password = `Hermes-${stamp}-Aa9!`;
  const checks: Record<string, boolean | number> = {};
  const clientId = `${FIXTURE_PREFIX}client-${stamp}`;
  const resource = "https://mcp-verification.invalid/api/mcp";
  let verdict: "PASS" | "FAIL" = "FAIL";
  let failure: string | null = null;

  try {
    const tiers = ["preview", "beginner", "full"] as const;
    const userIdByTier: Record<string, string> = {};

    for (const tier of tiers) {
      const { data, error } = await admin.auth.admin.createUser({
        email: `${FIXTURE_PREFIX}${tier}-${stamp}@example.invalid`,
        password,
        email_confirm: true,
      });
      if (error || !data.user) throw error ?? new Error("Fixture creation failed.");
      userIdByTier[tier] = data.user.id;

      const { error: profileError } = await admin
        .from("profiles")
        .upsert({ id: data.user.id, email: data.user.email, tier });
      if (profileError) throw profileError;
    }

    const { error: clientError } = await admin.from("mcp_oauth_clients").insert({
      client_id: clientId,
      client_name: "Hermes MCP entitlement verifier",
      redirect_uris: ["http://127.0.0.1:47123/callback"],
      grant_types: ["authorization_code", "refresh_token"],
      token_endpoint_auth_method: "none",
    });
    if (clientError) throw clientError;

    const source = `hermes-mcp-test-${stamp}`;
    const testChunks = tiers.map((tier, index) => ({
      source,
      source_id: `chunk-${tier}`,
      chunk_index: 0,
      title: `Test chunk for ${tier}`,
      content: `Content only visible at tier ${tier} or above.`,
      content_hash: `${"a".repeat(63)}${index}`,
      tier_required: tier,
      embedding: fakeEmbedding(index + 1),
      metadata: { embeddingFingerprint: EMBEDDING_FINGERPRINT },
    }));

    const { error: insertChunksError } = await admin.from("knowledge_chunks").insert(testChunks);
    if (insertChunksError) throw insertChunksError;

    const queryEmbedding = fakeEmbedding(1);

    for (const tier of tiers) {
      const tokenHash = createHash("sha256")
        .update(`${stamp}:${tier}:mcp-access-verifier`)
        .digest("hex");
      const { error: tokenError } = await admin.from("mcp_access_tokens").insert({
        token_hash: tokenHash,
        client_id: clientId,
        user_id: userIdByTier[tier],
        scope: "mcp",
        resource,
        expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
      });
      if (tokenError) throw tokenError;

      const { data: matches, error } = await admin.rpc("match_mcp_knowledge_chunks", {
        query_embedding: queryEmbedding,
        p_token_hash: tokenHash,
        p_expected_resource: resource,
        match_count: 20,
        source_filter: source,
        embedding_fingerprint: EMBEDDING_FINGERPRINT,
      });
      if (error) throw error;
      checks[`${tier}SeesCount`] = matches?.length ?? -1;
    }

    const anonClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const anonSelect = await anonClient.from("knowledge_chunks").select("id").limit(1);
    checks.anonSelectDenied = Boolean(anonSelect.error);

    const anonRpc = await anonClient.rpc("match_mcp_knowledge_chunks", {
      query_embedding: queryEmbedding,
      p_token_hash: "0".repeat(64),
      p_expected_resource: resource,
      match_count: 5,
      source_filter: source,
      embedding_fingerprint: EMBEDDING_FINGERPRINT,
    });
    checks.anonRpcDenied = Boolean(anonRpc.error);

    verdict =
      checks.previewSeesCount === 1 &&
      checks.beginnerSeesCount === 2 &&
      checks.fullSeesCount === 3 &&
      checks.anonSelectDenied === true &&
      checks.anonRpcDenied === true
        ? "PASS"
        : "FAIL";

  } catch (error) {
    failure =
      error instanceof Error
        ? error.message
        : JSON.stringify(error, Object.getOwnPropertyNames(error as object));
  } finally {
    if (!(await cleanupAllFixtures())) {
      failure = failure ?? "Fixture cleanup failed.";
      verdict = "FAIL";
    }
  }

  const fixtureCleanup = {
    temporaryUsersRemaining: (await listFixtures()).length,
    temporaryClientsRemaining: await countFixtureRows("mcp_oauth_clients", "client_id", FIXTURE_PREFIX),
    temporaryAccessTokensRemaining: await countFixtureRows("mcp_access_tokens", "client_id", FIXTURE_PREFIX),
    temporaryRefreshTokensRemaining: await countFixtureRows("mcp_refresh_tokens", "client_id", FIXTURE_PREFIX),
    temporaryAuthorizationCodesRemaining: await countFixtureRows("mcp_authorization_codes", "client_id", FIXTURE_PREFIX),
    temporaryAuthorizationRequestsRemaining: await countFixtureRows("mcp_authorization_requests", "client_id", FIXTURE_PREFIX),
    temporaryChunksRemaining: await countFixtureRows("knowledge_chunks", "source", `${FIXTURE_PREFIX}test-`),
  };
  if (Object.values(fixtureCleanup).some((count) => count !== 0)) verdict = "FAIL";

  const report = {
    verdict,
    verifiedAt: new Date().toISOString(),
    runtimeEvidenceScope: [
      "tier-filtered knowledge RPC results for preview, beginner, and full profiles",
      "anonymous table and RPC denial",
      "fixture cleanup across all Supabase Auth pages and MCP fixture tables",
    ],
    checks,
    failure,
    fixtureCleanup,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify(report, null, 2));
  if (verdict !== "PASS") process.exit(1);
}

main();
