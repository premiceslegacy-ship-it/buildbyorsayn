import { z } from "zod";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { verifyMcpCleanupAuthorization } from "@/lib/mcp/cronAuth";
import { logMcpEvent, resolveMcpRequestId } from "@/lib/mcp/observability";

export const MCP_CLEANUP_SUPABASE_TIMEOUT_MS = 6_000;

const CLEANUP_RESULT_SCHEMA = z.array(z.object({
  authorization_requests_deleted: z.number().int().nonnegative(),
  authorization_codes_deleted: z.number().int().nonnegative(),
  access_tokens_deleted: z.number().int().nonnegative(),
  refresh_tokens_deleted: z.number().int().nonnegative(),
  rate_limits_deleted: z.number().int().nonnegative(),
  clients_deleted: z.number().int().nonnegative(),
}).strict()).length(1);

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
      const { data, error } = await admin.rpc("cleanup_mcp_oauth_state", {
        p_batch_size: 500,
      });
      if (error) return respond({ error: "cleanup_failed" }, 500, "failed");

      const parsed = CLEANUP_RESULT_SCHEMA.safeParse(data);
      if (!parsed.success) return respond({ error: "cleanup_failed" }, 500, "failed");

      return respond({ cleaned: parsed.data[0] }, 200, "allowed");
    } catch {
      return respond({ error: "cleanup_failed" }, 500, "failed");
    }
  };
}
