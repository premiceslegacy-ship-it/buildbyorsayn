import { z } from "zod";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";
import { AGENT_MAX_BODY_BYTES, AgentAuthError, authenticateAgentRequest } from "@/lib/adminAgent/security";
import { invokeAdminAgentTool } from "@/lib/adminAgent/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  tool: z.string().trim().min(1).max(80),
  input: z.record(z.string(), z.unknown()).default({}),
}).strict();

function json(value: unknown, status = 200, retryAfter?: string) {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(retryAfter ? { "Retry-After": retryAfter } : {}),
    },
  });
}

export async function POST(request: Request) {
  try {
    if (!isJsonMediaType(request.headers.get("content-type"))) return json({ ok: false, error: "Corps JSON requis." }, 415);
    const context = await authenticateAgentRequest(request);
    const bounded = await readBoundedBody(request, AGENT_MAX_BODY_BYTES);
    if (bounded.ok === false) return json({ ok: false, error: "Requête invalide." }, bounded.reason === "too_large" ? 413 : 400);
    let raw: unknown;
    try {
      raw = JSON.parse(bounded.text);
    } catch {
      return json({ ok: false, error: "Requête invalide." }, 400);
    }
    const parsed = requestSchema.safeParse(raw);
    if (!parsed.success) return json({ ok: false, error: "Requête invalide." }, 400);
    const result = await invokeAdminAgentTool(parsed.data.tool, parsed.data.input, context);
    if (result.isError) return json({ ok: false, error: result.content[0]?.text ?? "L'outil a échoué." }, 409);
    return json({ ok: true, result });
  } catch (error) {
    if (error instanceof AgentAuthError) {
      return json({ ok: false, error: error.message }, error.status, error.status === 429 ? "60" : undefined);
    }
    console.error("admin_agent.tool_failed");
    return json({ ok: false, error: "L'outil n'a pas pu terminer cette action." }, 409);
  }
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
}
