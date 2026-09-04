import { createClient, type User } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
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

async function listFixtures() {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return (data.users as User[]).filter((user) => user.email?.startsWith(FIXTURE_PREFIX));
}

async function cleanupUsers(users: User[]) {
  if (!users.length) return;
  const ids = users.map((user) => user.id);
  const profileByUserId = await admin.from("profiles").delete().in("id", ids);
  if (profileByUserId.error) {
    throw new Error(`profiles: ${profileByUserId.error.message}`);
  }
  for (const user of users) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw new Error(`auth cleanup: ${error.message}`);
  }
}

async function cleanupChunks(stamp: number) {
  const { error } = await admin
    .from("knowledge_chunks")
    .delete()
    .eq("source", `hermes-mcp-test-${stamp}`);
  if (error) throw new Error(`knowledge_chunks cleanup: ${error.message}`);
}

async function main() {
  await cleanupUsers(await listFixtures());

  const stamp = Date.now();
  const password = `Hermes-${stamp}-Aa9!`;
  const users: User[] = [];
  const checks: Record<string, boolean | number> = {};
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
      users.push(data.user);
      userIdByTier[tier] = data.user.id;

      // "preview" is intentionally left without a profiles row at all, to
      // verify the fail-open-to-lowest-tier default for a bare authenticated
      // account rather than relying on an explicit tier value.
      if (tier !== "preview") {
        const { error: profileError } = await admin
          .from("profiles")
          .upsert({ id: data.user.id, email: data.user.email, tier });
        if (profileError) throw profileError;
      }
    }

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
      const { data: matches, error } = await admin.rpc("match_mcp_knowledge_chunks", {
        query_embedding: queryEmbedding,
        requested_tier: tier,
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
      requested_tier: "full",
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

    await cleanupChunks(stamp);
  } catch (error) {
    failure =
      error instanceof Error
        ? error.message
        : JSON.stringify(error, Object.getOwnPropertyNames(error as object));
  } finally {
    await cleanupUsers(users);
    await cleanupChunks(stamp);
  }

  const remainingFixtures = (await listFixtures()).length;
  if (remainingFixtures !== 0) verdict = "FAIL";

  const report = {
    verdict,
    verifiedAt: new Date().toISOString(),
    migrations: [
      "20260904151355_mcp_knowledge_base.sql",
      "20260904151436_mcp_oauth.sql",
      "20260904180000_mcp_security_hardening.sql",
      "20260904190000_mcp_final_hardening.sql",
      "20260904230000_mcp_bounded_cleanup.sql",
      "20260904233000_mcp_dcr_capacity_recovery.sql",
    ],
    checks,
    failure,
    fixtureCleanup: {
      temporaryUsersRemaining: remainingFixtures,
    },
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify(report, null, 2));
  if (verdict !== "PASS") process.exit(1);
}

main();
