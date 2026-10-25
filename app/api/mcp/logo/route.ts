import { readFile } from "node:fs/promises";
import path from "node:path";
import { isMcpConnectorLaunched } from "@/lib/mcp/launch";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * L'icône du serveur MCP est servie sous /api/mcp/ et non comme fichier statique :
 * les en-têtes de sécurité du site (Cross-Origin-Resource-Policy: same-origin) excluent
 * ce préfixe pour que les clients MCP distants puissent lire le connecteur.
 * Le fichier vit dans public/mcp pour rester versionné avec les autres marques, et
 * next.config.mjs (outputFileTracingIncludes) l'embarque dans la fonction déployée.
 */
const BUILD_LOGO_RELATIVE_PATH = path.join("public", "mcp", "build-logo.png");
const BUILD_LOGO_192_RELATIVE_PATH = path.join("public", "mcp", "build-logo-192.png");

export async function GET(request: Request) {
  if (!isMcpConnectorLaunched()) {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
  const requestedSize = new URL(request.url).searchParams.get("size");
  const logoPath = requestedSize === "192"
    ? BUILD_LOGO_192_RELATIVE_PATH
    : requestedSize === null || requestedSize === "512"
      ? BUILD_LOGO_RELATIVE_PATH
      : null;
  if (!logoPath) {
    return new Response(null, {
      status: 400,
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }

  let logo: Buffer;
  try {
    logo = await readFile(path.join(process.cwd(), logoPath));
  } catch (error) {
    console.error("[mcp-logo] asset unavailable", (error as NodeJS.ErrnoException).code ?? "unknown");
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }

  return new Response(new Uint8Array(logo), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600, immutable",
      "Content-Type": "image/png",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
