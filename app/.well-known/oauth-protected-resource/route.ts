import { NextResponse } from "next/server";
import {
  getMcpAllowedOrigins,
  getMcpIssuer,
  getMcpResourceUrl,
} from "@/lib/mcp/config";
import { corsHeadersForRequest } from "@/lib/mcp/security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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
