import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { verifyMcpCleanupAuthorization } from "../lib/mcp/cronAuth";
import { GET as cleanupMcp } from "../app/api/cron/mcp-cleanup/route";
import {
  createMcpCleanupHandler,
  MCP_CLEANUP_SUPABASE_TIMEOUT_MS,
  MCP_OAUTH_CLEANUP_BATCH_SIZE,
  MCP_RATE_LIMIT_CLEANUP_BATCH_SIZE,
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
  const buildSyncCleaned = {
    authorization_requests_deleted: 17,
    authorization_codes_deleted: 19,
    access_tokens_deleted: 23,
    refresh_tokens_deleted: 29,
  };
  const rateLimitsDeleted = 37;
  const rpcCalls: Array<{ name: string; args: unknown }> = [];
  const logRecords: unknown[] = [];
  const handler = createMcpCleanupHandler({
    createAdmin: () => ({
      rpc: async (name: string, args: unknown) => {
        rpcCalls.push({ name, args });
        if (name === "cleanup_member_activity_events") {
          return { data: 31, error: null };
        }
        if (name === "cleanup_mcp_rate_limits") {
          return { data: rateLimitsDeleted, error: null };
        }
        return {
          data: [name === "cleanup_build_sync_oauth_state" ? buildSyncCleaned : cleaned],
          error: null,
        };
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
  assert.deepEqual(await response.json(), {
    cleaned,
    rateLimitsDeleted,
    buildSyncCleaned,
    activityEventsDeleted: 31,
  });
  assert.deepEqual(rpcCalls.sort((a, b) => a.name.localeCompare(b.name)), [
    { name: "cleanup_build_sync_oauth_state", args: { p_batch_size: MCP_OAUTH_CLEANUP_BATCH_SIZE } },
    { name: "cleanup_mcp_oauth_state", args: { p_batch_size: MCP_OAUTH_CLEANUP_BATCH_SIZE } },
    { name: "cleanup_mcp_rate_limits", args: { p_batch_size: MCP_RATE_LIMIT_CLEANUP_BATCH_SIZE } },
    { name: "cleanup_member_activity_events", args: { p_batch_size: 1000, p_retention_days: 90 } },
  ]);
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

test("cleanup runs every minute with bounded capacity above configured window creation", async () => {
  const config = JSON.parse(await readFile("vercel.json", "utf8")) as {
    crons?: Array<{ path?: string; schedule?: string }>;
  };
  assert.deepEqual(config.crons, [
    { path: "/api/cron/mcp-cleanup", schedule: "* * * * *" },
    { path: "/api/cron/youtube-sync", schedule: "23 6 * * *" },
  ]);
  assert.equal(MCP_OAUTH_CLEANUP_BATCH_SIZE, 1_000);
  assert.equal(MCP_RATE_LIMIT_CLEANUP_BATCH_SIZE, 5_000);
  const maximumHourlyRowsAtConfiguredClientCapacity = 500 * 352;
  assert.ok(
    MCP_RATE_LIMIT_CLEANUP_BATCH_SIZE * 60 > maximumHourlyRowsAtConfiguredClientCapacity,
    "the bounded minute cadence must drain more rows than configured quotas can credibly create",
  );
});
