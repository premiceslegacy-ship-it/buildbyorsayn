import { verifyMcpCleanupAuthorization } from "@/lib/mcp/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const NO_STORE = { "cache-control": "no-store" };

export async function GET(request: Request): Promise<Response> {
  if (!verifyMcpCleanupAuthorization(request.headers.get("authorization"), process.env.CRON_SECRET ?? "")) {
    return Response.json({ ok: false }, { status: 401, headers: NO_STORE });
  }
  try {
    const { cleanupPendingMuxAssets } = await import("@/lib/mux/assetCleanup.server");
    const cleanup = await cleanupPendingMuxAssets(request.signal);
    return Response.json({ ok: true, cleanup }, { headers: NO_STORE });
  } catch (error) {
    console.error("mux.cleanup.cron.failed", error instanceof Error ? error.message : error);
    return Response.json({ ok: false }, { status: 500, headers: NO_STORE });
  }
}
