import { readBoundedBody, type BoundedBodyResult } from "./http";

export const MAX_MCP_BODY_BYTES = 65_536;
type McpBodyFailureReason = Extract<BoundedBodyResult, { ok: false }>["reason"];

export function mcpBodyFailure(reason: McpBodyFailureReason): {
  status: number;
  error: string;
} {
  switch (reason) {
    case "too_large":
      return { status: 413, error: "payload_too_large" };
    case "invalid_length":
      return { status: 400, error: "invalid_content_length" };
    case "invalid_utf8":
      return { status: 400, error: "invalid_body" };
    case "timeout":
      return { status: 408, error: "request_timeout" };
  }
}

export async function runWithMcpRouteDeadline<T>(
  operation: Promise<T>,
  timeoutMs: number,
  controller: AbortController,
  onTimeout: () => T
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timeoutHandle = setTimeout(() => {
      controller.abort(new Error("MCP route deadline exceeded"));
      resolve(onTimeout());
    }, timeoutMs);
  });
  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

export async function readBoundedMcpRequest(
  request: Request
): Promise<{ ok: true; request: Request } | { ok: false; reason: McpBodyFailureReason }> {
  const bounded = await readBoundedBody(request, MAX_MCP_BODY_BYTES);
  if (bounded.ok === false) return bounded;
  return {
    ok: true,
    request: new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: bounded.text,
      signal: request.signal,
    }),
  };
}
