import { randomUUID } from "node:crypto";

const SAFE_REQUEST_ID = /^[A-Za-z0-9._-]{1,64}$/;

export type McpOperationalEvent =
  | "mcp.request"
  | "mcp.oauth.register"
  | "mcp.oauth.authorize"
  | "mcp.oauth.token"
  | "mcp.oauth.consent"
  | "mcp.oauth.revoke"
  | "mcp.cleanup";

export type McpOperationalOutcome =
  | "allowed"
  | "denied"
  | "rate_limited"
  | "invalid"
  | "failed";

type McpLogInput = {
  event: McpOperationalEvent;
  requestId: string;
  outcome: McpOperationalOutcome;
  status: number;
  durationMs: number;
};

export type McpLogRecord = {
  level: "info" | "warn" | "error";
  event: McpOperationalEvent;
  requestId: string;
  outcome: McpOperationalOutcome;
  status: number;
  durationMs: number;
  timestamp: string;
};

export function resolveMcpRequestId(headerValue: string | null): string {
  return headerValue && SAFE_REQUEST_ID.test(headerValue) ? headerValue : randomUUID();
}

export function buildMcpLogRecord(input: McpLogInput): McpLogRecord {
  const status = Number.isInteger(input.status) && input.status >= 100 && input.status <= 599
    ? input.status
    : 500;
  const durationMs = Number.isFinite(input.durationMs) && input.durationMs >= 0
    ? Math.round(input.durationMs * 10) / 10
    : 0;
  return {
    level: status >= 500 ? "error" : status >= 400 ? "warn" : "info",
    event: input.event,
    requestId: SAFE_REQUEST_ID.test(input.requestId) ? input.requestId : randomUUID(),
    outcome: input.outcome,
    status,
    durationMs,
    timestamp: new Date().toISOString(),
  };
}

export function serializeMcpLogRecord(record: McpLogRecord): string {
  return JSON.stringify(record);
}

export function logMcpEvent(input: McpLogInput): void {
  const record = buildMcpLogRecord(input);
  console.log(serializeMcpLogRecord(record));
}

function outcomeForStatus(status: number): McpOperationalOutcome {
  if (status < 400) return "allowed";
  if (status === 401 || status === 403) return "denied";
  if (status === 429) return "rate_limited";
  return status < 500 ? "invalid" : "failed";
}

export async function observeMcpRoute(
  request: Request,
  event: McpOperationalEvent,
  handler: () => Promise<Response>
): Promise<Response> {
  const startedAt = performance.now();
  const requestId = resolveMcpRequestId(request.headers.get("x-request-id"));
  try {
    const response = await handler();
    response.headers.set("X-Request-Id", requestId);
    logMcpEvent({
      event,
      requestId,
      outcome: outcomeForStatus(response.status),
      status: response.status,
      durationMs: performance.now() - startedAt,
    });
    return response;
  } catch (error) {
    logMcpEvent({
      event,
      requestId,
      outcome: "failed",
      status: 500,
      durationMs: performance.now() - startedAt,
    });
    throw error;
  }
}
