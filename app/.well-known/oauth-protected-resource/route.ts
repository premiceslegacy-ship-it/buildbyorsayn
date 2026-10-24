import { NextResponse } from "next/server";
import {
  getMcpAllowedOrigins,
  getMcpIssuer,
  getMcpResourceUrl,
} from "@/lib/mcp/config";
import { isMcpConnectorLaunched } from "@/lib/mcp/launch";
import { corsHeadersForRequest } from "@/lib/mcp/security";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isMcpConnectorLaunched()) {
    return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const issuer = getMcpIssuer();
  return NextResponse.json(
    {
      resource: getMcpResourceUrl(),
      authorization_servers: [issuer],
      bearer_methods_supported: ["header"],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        ...corsHeadersForRequest(request, getMcpAllowedOrigins()),
      },
    }
  );
}
