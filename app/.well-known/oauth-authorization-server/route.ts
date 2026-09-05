import { NextResponse } from "next/server";
import { getMcpAllowedOrigins, getMcpIssuer } from "@/lib/mcp/config";
import { corsHeadersForRequest } from "@/lib/mcp/security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const issuer = getMcpIssuer();
  return NextResponse.json(
    {
      issuer,
      logo_uri: `${issuer}/api/mcp/logo`,
      authorization_endpoint: `${issuer}/api/mcp/oauth/authorize`,
      token_endpoint: `${issuer}/api/mcp/oauth/token`,
      registration_endpoint: `${issuer}/api/mcp/oauth/register`,
      scopes_supported: ["mcp"],
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        ...corsHeadersForRequest(request, getMcpAllowedOrigins()),
      },
    }
  );
}
