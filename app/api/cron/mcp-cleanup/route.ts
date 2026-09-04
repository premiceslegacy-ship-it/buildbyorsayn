import { createMcpCleanupHandler } from "@/lib/mcp/cleanupRoute";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

const cleanupMcp = createMcpCleanupHandler();

export async function GET(request: Request): Promise<Response> {
  return cleanupMcp(request);
}
