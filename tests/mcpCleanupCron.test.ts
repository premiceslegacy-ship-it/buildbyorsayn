import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { verifyMcpCleanupAuthorization } from "../lib/mcp/cronAuth";
import { GET as cleanupMcp } from "../app/api/cron/mcp-cleanup/route";
import {
  createMcpCleanupHandler,
  MCP_CLEANUP_SUPABASE_TIMEOUT_MS,
} from "../lib/mcp/cleanupRoute";
import {
  createMcpSupabaseAdmin,
  DEFAULT_MCP_SUPABASE_TIMEOUT_MS,
} from "../lib/mcp/supabaseAdmin";

test("cleanup authorization is fail-closed and accepts only the exact Bearer secret", () => {
  assert.equal(verifyMcpCleanupAuthorization(null, "a".repeat(32)), false);
  assert.equal(verifyMcpCleanupAuthorization(`Bearer ${"a".repeat(32)}`, ""), false);
  assert.equal(verifyMcpCleanupAuthorization(`Bearer ${"b".repeat(32)}`, "a".repeat(32)), false);
  assert.equal(verifyMcpCleanupAuthorization(`Bearer ${"a".repeat(32)}`, "a".repeat(32)), true);
});

test("cleanup route denies requests before database work", async () => {
  const previous = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "a".repeat(32);
  try {
    const response = await cleanupMcp(new Request("https://buildbyorsayn.com/api/cron/mcp-cleanup"));
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    if (previous === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previous;
  }
});

test("Supabase admin aborts a stalled fetch at its configured deadline", async () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  let observedSignal: AbortSignal | null = null;
  const stalledFetch = ((_input: RequestInfo | URL, init?: RequestInit) => {
    observedSignal = init?.signal ?? null;
    return new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal;
      if (!signal) return;
      if (signal.aborted) reject(signal.reason);
      else signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    });
  }) as typeof fetch;

  try {
    const admin = createMcpSupabaseAdmin({ fetch: stalledFetch, timeoutMs: 20 });
    const result = await admin.rpc("cleanup_mcp_oauth_state", { p_batch_size: 1 });
    assert.ok(result.error, "the aborted request must fail closed");
    assert.equal(observedSignal?.aborted, true);
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
  }
});

test("Supabase admin composes caller cancellation with its own deadline", async () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  const caller = new AbortController();
  let observedSignal: AbortSignal | null = null;
  const stalledFetch = ((_input: RequestInfo | URL, init?: RequestInit) => {
    observedSignal = init?.signal ?? null;
    return new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal;
      if (!signal) return;
      if (signal.aborted) reject(signal.reason);
      else signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    });
  }) as typeof fetch;

  try {
    const admin = createMcpSupabaseAdmin({ fetch: stalledFetch, timeoutMs: 5_000 });
    const pending = admin
      .rpc("cleanup_mcp_oauth_state", { p_batch_size: 1 })
      .abortSignal(caller.signal);
    caller.abort(new DOMException("caller cancelled", "AbortError"));
    const result = await pending;
    assert.ok(result.error, "caller cancellation must fail closed");
    assert.equal(observedSignal?.aborted, true);
    assert.equal((observedSignal?.reason as Error | undefined)?.message, "caller cancelled");
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
  }
});

test("cleanup route accepts a valid secret and returns the validated structured result", async () => {
  const secret = "c".repeat(32);
  const cleaned = {
    authorization_requests_deleted: 2,
    authorization_codes_deleted: 3,
    access_tokens_deleted: 5,
    refresh_tokens_deleted: 7,
    rate_limits_deleted: 11,
    clients_deleted: 13,
  };
  const rpcCalls: Array<{ name: string; args: unknown }> = [];
  const logRecords: unknown[] = [];
  const handler = createMcpCleanupHandler({
    createAdmin: () => ({
      rpc: async (name: string, args: unknown) => {
        rpcCalls.push({ name, args });
        return { data: [cleaned], error: null };
      },
    }),
    getCronSecret: () => secret,
    logEvent: (record) => logRecords.push(record),
  });

  const response = await handler(new Request("https://buildbyorsayn.com/api/cron/mcp-cleanup", {
    headers: {
      Authorization: `Bearer ${secret}`,
      "X-Request-Id": "cleanup-regression-1",
    },
  }));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-request-id"), "cleanup-regression-1");
  assert.deepEqual(await response.json(), { cleaned });
  assert.deepEqual(rpcCalls, [{
    name: "cleanup_mcp_oauth_state",
    args: { p_batch_size: 500 },
  }]);
  assert.equal(logRecords.length, 1);
  const logRecord = logRecords[0] as Record<string, unknown>;
  assert.equal(logRecord.event, "mcp.cleanup");
  assert.equal(logRecord.requestId, "cleanup-regression-1");
  assert.equal(logRecord.outcome, "allowed");
  assert.equal(logRecord.status, 200);
  assert.equal(typeof logRecord.durationMs, "number");
  assert.equal(JSON.stringify(logRecord).includes(secret), false);
  assert.ok(MCP_CLEANUP_SUPABASE_TIMEOUT_MS < DEFAULT_MCP_SUPABASE_TIMEOUT_MS);
  assert.ok(
    MCP_CLEANUP_SUPABASE_TIMEOUT_MS <= 6_000,
    "a 10 second cron needs at least 4 seconds for parsing, logging, and a controlled response"
  );
});

test("cleanup is scheduled daily and calls only the bounded cleanup RPC", async () => {
  const config = JSON.parse(await readFile("vercel.json", "utf8")) as {
    crons?: Array<{ path?: string; schedule?: string }>;
  };
  assert.deepEqual(config.crons, [{ path: "/api/cron/mcp-cleanup", schedule: "17 3 * * *" }]);
  const route = await readFile("app/api/cron/mcp-cleanup/route.ts", "utf8");
  const handler = await readFile("lib/mcp/cleanupRoute.ts", "utf8");
  assert.match(route, /createMcpCleanupHandler/);
  assert.match(handler, /cleanup_mcp_oauth_state/);
  assert.match(handler, /p_batch_size:\s*500/);
  assert.match(handler, /CLEANUP_RESULT_SCHEMA\.safeParse/);
  assert.doesNotMatch(handler, /refresh_token_hash|access_token_hash|\.select\(\s*["']\*["']\s*\)/i);
});

test("cleanup SQL is batch-bounded, time-bounded, and release-gated", async () => {
  const migration = await readFile(
    "supabase/migrations/20260904230000_mcp_bounded_cleanup.sql",
    "utf8"
  );
  assert.match(migration, /p_batch_size integer default 500/);
  assert.match(migration, /p_batch_size not between 1 and 1000/);
  assert.match(migration, /statement_timeout/);
  assert.match(migration, /lock_timeout/);
  assert.ok((migration.match(/limit p_batch_size/g) ?? []).length >= 6);

  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
    scripts?: Record<string, string>;
  };
  assert.equal(packageJson.scripts?.["test:mcp-postgres"], "node scripts/verify-mcp-postgres-gates.mjs");
});

test("cleanup SQL finishes before the HTTP deadline reserve", async () => {
  const migration = await readFile(
    "supabase/migrations/20260905000000_mcp_cleanup_deadline_reserve.sql",
    "utf8"
  );
  assert.match(
    migration,
    /alter function public\.cleanup_mcp_oauth_state\(integer\)[\s\S]*set statement_timeout = '5s'/i
  );
});
