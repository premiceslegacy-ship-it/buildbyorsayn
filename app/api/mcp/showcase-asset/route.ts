import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONNECTOR_ASSET_PATH = path.join(
  process.cwd(),
  "private",
  "brand-assets",
  "build-mcp-connector-characters.webp",
);

export async function GET() {
  if (process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED !== "true") {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const asset = await readFile(CONNECTOR_ASSET_PATH);
  return new Response(asset, {
    status: 200,
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "image/webp",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
