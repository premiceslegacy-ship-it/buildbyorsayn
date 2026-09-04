import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { getMcpAllowedOrigins } from "@/lib/mcp/config";
import {
  applyOAuthCors,
  isJsonMediaType,
  oauthPreflightResponse,
  readBoundedBody,
  requestOriginAllowed,
} from "@/lib/mcp/http";
import { sanitizeClientName } from "@/lib/mcp/oauth";
import { dcrMetadataSchema } from "@/lib/mcp/oauthSchemas";
import { observeMcpRoute } from "@/lib/mcp/observability";
import { hashRateLimitSubject, trustedClientAddress } from "@/lib/mcp/security";

export const dynamic = "force-dynamic";
const MAX_TOTAL_CLIENTS = 500;
const NO_STORE = { "Cache-Control": "no-store" };


function errorResponse(error: string, description: string, status: number) {
  return NextResponse.json(
    { error, error_description: description },
    { status, headers: NO_STORE }
  );
}

async function handlePost(request: Request) {
  if (!requestOriginAllowed(request.headers.get("origin"), new Set(getMcpAllowedOrigins()))) {
    return errorResponse("access_denied", "Request origin is not allowed.", 403);
  }
  if (!isJsonMediaType(request.headers.get("content-type"))) {
    return errorResponse("invalid_client_metadata", "A JSON body is required.", 415);
  }

  const bounded = await readBoundedBody(request, 32_768);
  if (bounded.ok === false) {
    if (bounded.reason === "too_large") {
      return errorResponse("invalid_client_metadata", "Registration metadata is too large.", 413);
    }
    return errorResponse("invalid_client_metadata", "Malformed JSON body.", 400);
  }

  let body: unknown;
  try {
    body = JSON.parse(bounded.text);
  } catch {
    return errorResponse("invalid_client_metadata", "Malformed JSON body.", 400);
  }

  const parsed = dcrMetadataSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("invalid_client_metadata", "Client metadata is invalid.", 400);
  }

  const networkIdentity = trustedClientAddress(request.headers);
  const pepper = process.env.MCP_DCR_RATE_LIMIT_PEPPER ?? "";
  if (!networkIdentity || pepper.length < 16) {
    return errorResponse("temporarily_unavailable", "Registration is temporarily unavailable.", 503);
  }

  const admin = createMcpSupabaseAdmin();
  const clientId = randomUUID();
  const clientName = sanitizeClientName(parsed.data.client_name);
  const { data: registrationStatus, error } = await admin.rpc("register_mcp_oauth_client", {
    p_client_id: clientId,
    p_client_name: clientName,
    p_redirect_uris: parsed.data.redirect_uris,
    p_rate_subject: hashRateLimitSubject("mcp-dcr", networkIdentity, pepper),
    p_max_per_window: 5,
    p_window_seconds: 3600,
    p_max_clients: MAX_TOTAL_CLIENTS,
  });

  if (error) return errorResponse("server_error", "Could not register client.", 500);
  if (registrationStatus === "rate_limited") {
    return errorResponse("temporarily_unavailable", "Too many registration attempts.", 429);
  }
  if (registrationStatus === "registration_closed") {
    return errorResponse("temporarily_unavailable", "Registration is temporarily closed.", 503);
  }
  if (registrationStatus !== "registered") {
    return errorResponse("invalid_client_metadata", "Client registration was refused.", 400);
  }

  return NextResponse.json(
    {
      client_id: clientId,
      client_name: clientName,
      redirect_uris: parsed.data.redirect_uris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    },
    { status: 201, headers: NO_STORE }
  );
}

export async function POST(request: Request) {
  const allowedOrigins = new Set(getMcpAllowedOrigins());
  const response = await observeMcpRoute(request, "mcp.oauth.register", () => handlePost(request));
  return applyOAuthCors(response, request.headers.get("origin"), allowedOrigins);
}

export function OPTIONS(request: Request) {
  return oauthPreflightResponse(
    request.headers.get("origin"),
    new Set(getMcpAllowedOrigins())
  );
}
