import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createAdminAgentMcpServer } from "@/lib/adminAgent/mcp";
import { AGENT_MAX_BODY_BYTES, AgentAuthError, authenticateAgentRequest } from "@/lib/adminAgent/security";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number, retryAfter?: string) {
  return Response.json({ error }, {
    status,
    headers: { ...headers, ...(retryAfter ? { "Retry-After": retryAfter } : {}) },
  });
}

export async function POST(request: Request) {
  if (!isJsonMediaType(request.headers.get("content-type"))) return jsonError("unsupported_media_type", 415);
  try {
    const context = await authenticateAgentRequest(request);
    const bounded = await readBoundedBody(request, AGENT_MAX_BODY_BYTES);
    if (bounded.ok === false) return jsonError(bounded.reason === "too_large" ? "payload_too_large" : "invalid_request", bounded.reason === "too_large" ? 413 : 400);
    const replayHeaders = new Headers(request.headers);
    replayHeaders.delete("authorization");
    replayHeaders.delete("cookie");
    const replay = new Request(request.url, {
      method: "POST",
      headers: replayHeaders,
      body: bounded.text,
      signal: request.signal,
    });
    const server = createAdminAgentMcpServer(context);
    try {
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      await server.connect(transport);
      const response = await transport.handleRequest(replay);
      const responseHeaders = new Headers(response.headers);
      responseHeaders.delete("authorization");
      responseHeaders.delete("proxy-authenticate");
      responseHeaders.delete("set-cookie");
      for (const [name, value] of Object.entries(headers)) responseHeaders.set(name, value);
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers: responseHeaders });
    } finally {
      await server.close().catch(() => undefined);
    }
  } catch (error) {
    if (error instanceof AgentAuthError) {
      const response = jsonError(error.status === 401 ? "unauthorized" : error.message, error.status, error.status === 429 ? "60" : undefined);
      if (error.status === 401) response.headers.set("WWW-Authenticate", 'Bearer realm="BUILD admin agent"');
      return response;
    }
    console.error("admin_agent.mcp_failed");
    return jsonError("server_error", 500);
  }
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST", ...headers } });
}

export function DELETE() {
  return new Response(null, { status: 405, headers: { Allow: "POST", ...headers } });
}
