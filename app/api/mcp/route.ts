import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { resolveMcpAuth, wwwAuthenticateHeader } from "@/lib/mcp/auth";
import { createBuildMcpServer } from "@/lib/mcp/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { getMcpAllowedOrigins } from "@/lib/mcp/config";
import { requestOriginAllowed } from "@/lib/mcp/http";
import { MAX_MCP_BODY_BYTES, mcpBodyFailure, readBoundedMcpRequest, runWithMcpRouteDeadline } from "@/lib/mcp/routeRequest";
import {
  logMcpEvent,
  resolveMcpRequestId,
  type McpOperationalOutcome,
} from "@/lib/mcp/observability";
import {
  corsHeadersForRequest,
  hashRateLimitSubject,
  resolveRateLimitDecision,
  trustedClientAddress,
} from "@/lib/mcp/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const MCP_ROUTE_DEADLINE_MS = 27_000;

function responseHeaders(request: Request): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...corsHeadersForRequest(request, getMcpAllowedOrigins()),
  };
}

function jsonError(request: Request, error: string, status: number, retryAfter?: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      ...responseHeaders(request),
    },
  });
}

function originAllowed(request: Request): boolean {
  return requestOriginAllowed(request.headers.get("origin"), new Set(getMcpAllowedOrigins()));
}

export async function OPTIONS(request: Request) {
  if (!originAllowed(request)) return jsonError(request, "origin_not_allowed", 403);
  return new Response(null, { status: 204, headers: responseHeaders(request) });
}

export async function GET(request: Request) {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST, OPTIONS", ...responseHeaders(request) },
  });
}

export async function DELETE(request: Request) {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST, OPTIONS", ...responseHeaders(request) },
  });
}

async function handleMcpPost(request: Request, deadlineAt: number) {
  const startedAt = performance.now();
  const requestId = resolveMcpRequestId(request.headers.get("x-request-id"));
  const finish = (response: Response, outcome: McpOperationalOutcome): Response => {
    response.headers.set("X-Request-Id", requestId);
    logMcpEvent({
      event: "mcp.request",
      requestId,
      outcome,
      status: response.status,
      durationMs: performance.now() - startedAt,
    });
    return response;
  };

  if (!originAllowed(request)) {
    return finish(jsonError(request, "origin_not_allowed", 403), "denied");
  }
  const mediaType = (request.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return finish(jsonError(request, "unsupported_media_type", 415), "invalid");
  }
  const rawLength = request.headers.get("content-length");
  if (rawLength !== null) {
    const declaredLength = Number(rawLength);
    if (!Number.isSafeInteger(declaredLength) || declaredLength < 0) {
      return finish(jsonError(request, "invalid_content_length", 400), "invalid");
    }
    if (declaredLength > MAX_MCP_BODY_BYTES) {
      return finish(jsonError(request, "payload_too_large", 413), "invalid");
    }
  }

  const identity = trustedClientAddress(request.headers);
  const pepper = process.env.MCP_REQUEST_RATE_LIMIT_PEPPER ?? "";
  if (!identity || pepper.length < 16) {
    return finish(jsonError(request, "temporarily_unavailable", 503, "5"), "failed");
  }

  const admin = createMcpSupabaseAdmin({
    signal: request.signal,
    timeoutMs: Math.max(1, Math.min(15_000, deadlineAt - Date.now())),
  });
  const { data: allowed, error: rateLimitError } = await admin.rpc("check_mcp_rate_limit", {
    p_subject: hashRateLimitSubject("mcp-request", identity, pepper),
    p_max_per_window: 120,
    p_window_seconds: 60,
  });

  const rateDecision = resolveRateLimitDecision(allowed, rateLimitError);
  if (rateDecision !== "allowed") {
    return finish(
      jsonError(
        request,
        rateDecision === "denied" ? "rate_limited" : "temporarily_unavailable",
        rateDecision === "denied" ? 429 : 503,
        rateDecision === "denied" ? "60" : "5"
      ),
      rateDecision === "denied" ? "rate_limited" : "failed"
    );
  }

  const auth = await resolveMcpAuth(request);
  if (!auth) {
    const response = jsonError(request, "unauthorized", 401);
    response.headers.set("WWW-Authenticate", wwwAuthenticateHeader());
    return finish(response, "denied");
  }

  const boundedRequest = await readBoundedMcpRequest(request);
  if (boundedRequest.ok === false) {
    const failure = mcpBodyFailure(boundedRequest.reason);
    return finish(jsonError(request, failure.error, failure.status), "invalid");
  }

  const server = createBuildMcpServer(auth, { signal: request.signal, deadlineAt });
  try {
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    const response = await transport.handleRequest(boundedRequest.request);
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(responseHeaders(request))) headers.set(key, value);
    return finish(new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    }), response.status < 400 ? "allowed" : "invalid");
  } catch {
    return finish(jsonError(request, "server_error", 500), "failed");
  } finally {
    await server.close().catch(() => undefined);
  }
}

export async function POST(request: Request) {
  const startedAt = performance.now();
  const requestId = resolveMcpRequestId(request.headers.get("x-request-id"));
  const controller = new AbortController();
  const signal = AbortSignal.any([request.signal, controller.signal]);
  const routeRequest = new Request(request, { signal });
  const deadlineAt = Date.now() + MCP_ROUTE_DEADLINE_MS;

  return runWithMcpRouteDeadline(
    handleMcpPost(routeRequest, deadlineAt),
    MCP_ROUTE_DEADLINE_MS,
    controller,
    () => {
      const response = jsonError(request, "request_timeout", 504);
      response.headers.set("X-Request-Id", requestId);
      logMcpEvent({
        event: "mcp.request",
        requestId,
        outcome: "failed",
        status: 504,
        durationMs: performance.now() - startedAt,
      });
      return response;
    }
  );
}
