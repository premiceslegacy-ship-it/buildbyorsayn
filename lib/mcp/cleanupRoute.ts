import { z } from "zod";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { verifyMcpCleanupAuthorization } from "@/lib/mcp/cronAuth";
import { logMcpEvent, resolveMcpRequestId } from "@/lib/mcp/observability";

export const MCP_CLEANUP_SUPABASE_TIMEOUT_MS = 6_000;
export const MCP_OAUTH_CLEANUP_BATCH_SIZE = 1_000;
export const MCP_RATE_LIMIT_CLEANUP_BATCH_SIZE = 5_000;


const CLEANUP_RESULT_SCHEMA = z.array(z.object({
  authorization_requests_deleted: z.number().int().nonnegative(),
  authorization_codes_deleted: z.number().int().nonnegative(),
  access_tokens_deleted: z.number().int().nonnegative(),
  refresh_tokens_deleted: z.number().int().nonnegative(),
  rate_limits_deleted: z.number().int().nonnegative(),
  clients_deleted: z.number().int().nonnegative(),
}).strict()).length(1);

const BUILD_SYNC_CLEANUP_RESULT_SCHEMA = z.array(z.object({
  authorization_requests_deleted: z.number().int().nonnegative(),
  authorization_codes_deleted: z.number().int().nonnegative(),
  access_tokens_deleted: z.number().int().nonnegative(),
  refresh_tokens_deleted: z.number().int().nonnegative(),
}).strict()).length(1);

const ACTIVITY_CLEANUP_RESULT_SCHEMA = z.number().int().nonnegative();
const RATE_LIMIT_CLEANUP_RESULT_SCHEMA = z.number().int().nonnegative();


type CleanupRpcResult = {
  data: unknown;
  error: unknown;
};

type CleanupAdmin = {
  rpc: (
    name: string,
    args: Record<string, unknown>
  ) => PromiseLike<CleanupRpcResult>;
};

type CleanupHandlerDependencies = {
  createAdmin?: () => CleanupAdmin;
  getCronSecret?: () => string;
  logEvent?: typeof logMcpEvent;
};

export function createMcpCleanupHandler(
  dependencies: CleanupHandlerDependencies = {}
): (request: Request) => Promise<Response> {
  const createAdmin = dependencies.createAdmin
    ?? (() => createMcpSupabaseAdmin({ timeoutMs: MCP_CLEANUP_SUPABASE_TIMEOUT_MS }));
  const getCronSecret = dependencies.getCronSecret
    ?? (() => process.env.CRON_SECRET ?? "");
  const logEvent = dependencies.logEvent ?? logMcpEvent;

  return async function cleanupMcp(request: Request): Promise<Response> {
    const startedAt = performance.now();
    const requestId = resolveMcpRequestId(request.headers.get("x-request-id"));
    const respond = (
      body: Record<string, unknown>,
      status: number,
      outcome: "allowed" | "denied" | "failed"
    ) => {
      const response = Response.json(body, {
        status,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "X-Request-Id": requestId,
        },
      });
      logEvent({
        event: "mcp.cleanup",
        requestId,
        outcome,
        status,
        durationMs: performance.now() - startedAt,
      });
      return response;
    };

    if (!verifyMcpCleanupAuthorization(
      request.headers.get("authorization"),
      getCronSecret()
    )) {
      return respond({ error: "unauthorized" }, 401, "denied");
    }

    try {
      const admin = createAdmin();
      const [mcpResult, rateLimitResult, buildSyncResult, activityResult] = await Promise.all([
        admin.rpc("cleanup_mcp_oauth_state", { p_batch_size: MCP_OAUTH_CLEANUP_BATCH_SIZE }),
        admin.rpc("cleanup_mcp_rate_limits", { p_batch_size: MCP_RATE_LIMIT_CLEANUP_BATCH_SIZE }),
        admin.rpc("cleanup_build_sync_oauth_state", { p_batch_size: MCP_OAUTH_CLEANUP_BATCH_SIZE }),
        admin.rpc("cleanup_member_activity_events", { p_batch_size: 1000, p_retention_days: 90 }),
      ]);
      if (mcpResult.error || rateLimitResult.error || buildSyncResult.error || activityResult.error) {
        return respond({ error: "cleanup_failed" }, 500, "failed");
      }

      const parsed = CLEANUP_RESULT_SCHEMA.safeParse(mcpResult.data);
      const buildSyncParsed = BUILD_SYNC_CLEANUP_RESULT_SCHEMA.safeParse(buildSyncResult.data);
      const rateLimitParsed = RATE_LIMIT_CLEANUP_RESULT_SCHEMA.safeParse(rateLimitResult.data);
      const activityParsed = ACTIVITY_CLEANUP_RESULT_SCHEMA.safeParse(activityResult.data);
      if (!parsed.success || !rateLimitParsed.success || !buildSyncParsed.success || !activityParsed.success) {
        return respond({ error: "cleanup_failed" }, 500, "failed");
      }

      return respond({
        cleaned: parsed.data[0],
        rateLimitsDeleted: rateLimitParsed.data,
        buildSyncCleaned: buildSyncParsed.data[0],
        activityEventsDeleted: activityParsed.data,
      }, 200, "allowed");
    } catch {
      return respond({ error: "cleanup_failed" }, 500, "failed");
    }
  };
}
