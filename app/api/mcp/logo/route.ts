import { readFile } from "node:fs/promises";
import path from "node:path";

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

export async function GET() {
  let logo: Buffer;
  try {
    logo = await readFile(path.join(process.cwd(), BUILD_LOGO_RELATIVE_PATH));
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
      "Cache-Control": "public, max-age=300",
      "Content-Type": "image/png",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
