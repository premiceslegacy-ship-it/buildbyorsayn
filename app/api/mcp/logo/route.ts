import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUILD_LOGO_PATH = path.join(
  process.cwd(),
  "private",
  "brand-assets",
  "build-logo.png",
);

export async function GET() {
  const logo = await readFile(BUILD_LOGO_PATH);

  return new Response(logo, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "image/png",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
