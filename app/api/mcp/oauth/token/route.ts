import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { getMcpAllowedOrigins, getMcpResourceUrl } from "@/lib/mcp/config";
import {
  applyOAuthCors,
  oauthPreflightResponse,
  readBoundedBody,
  requestOriginAllowed,
} from "@/lib/mcp/http";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  generateOpaqueToken,
  hashToken,
  verifyCodeChallenge,
} from "@/lib/mcp/oauth";
import { parseTokenRequest, type TokenRequest } from "@/lib/mcp/oauthSchemas";
import { observeMcpRoute } from "@/lib/mcp/observability";
import { buildNetworkRateLimitInput, resolveRateLimitDecision } from "@/lib/mcp/security";

export const dynamic = "force-dynamic";
const MAX_FORM_BYTES = 32_768;

function oauthError(error: string, description: string, status = 400) {
  return NextResponse.json(
    { error, error_description: description },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

async function readParams(request: Request): Promise<
  | { ok: true; params: URLSearchParams }
  | { ok: false; status: 400 | 413 | 415 }
> {
  const mediaType = (request.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/x-www-form-urlencoded") {
    return { ok: false, status: 415 };
  }
  const bounded = await readBoundedBody(request, MAX_FORM_BYTES);
  if (bounded.ok === false) {
    return { ok: false, status: bounded.reason === "too_large" ? 413 : 400 };
  }
  return { ok: true, params: new URLSearchParams(bounded.text) };
}


type ExchangeResult = {
  status: "issued" | "invalid_grant" | "invalid_request";
  user_id: string | null;
  scope: string | null;
  resource: string | null;
};

type RefreshResult = {
  status: "issued" | "invalid_grant" | "invalid_request" | "reuse_detected";
  user_id: string | null;
  scope: string | null;
  resource: string | null;
};

type AuthorizationCodeRequest = Extract<TokenRequest, { grant_type: "authorization_code" }>;
type RefreshTokenRequest = Extract<TokenRequest, { grant_type: "refresh_token" }>;

async function handleAuthorizationCode(params: AuthorizationCodeRequest) {
  const { code, redirect_uri: redirectUri, client_id: clientId, code_verifier: codeVerifier, resource } = params;

  const admin = createMcpSupabaseAdmin();
  const codeHash = hashToken(code);
  const { data: candidate, error: candidateError } = await admin
    .from("mcp_authorization_codes")
    .select("code_challenge")
    .eq("code_hash", codeHash)
    .eq("client_id", clientId)
    .eq("redirect_uri", redirectUri)
    .eq("resource", resource)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (candidateError) {
    return oauthError("temporarily_unavailable", "Authorization is temporarily unavailable.", 503);
  }
  if (!candidate || !verifyCodeChallenge(codeVerifier, candidate.code_challenge)) {
    return oauthError("invalid_grant", "The authorization code is invalid, expired, or already used.");
  }

  const accessToken = generateOpaqueToken();
  const refreshToken = generateOpaqueToken();
  const { data, error } = (await admin
    .rpc("exchange_mcp_authorization_code", {
      p_code_hash: codeHash,
      p_redirect_uri: redirectUri,
      p_client_id: clientId,
      p_expected_code_challenge: candidate.code_challenge,
      p_resource: resource,
      p_access_token_hash: hashToken(accessToken),
      p_refresh_token_hash: hashToken(refreshToken),
      p_family_id: randomUUID(),
    })
    .maybeSingle()) as { data: ExchangeResult | null; error: unknown };

  if (error) return oauthError("server_error", "Could not issue tokens.", 500);
  if (!data || data.status !== "issued") {
    return oauthError("invalid_grant", "The authorization code is invalid, expired, or already used.");
  }

  return NextResponse.json(
    {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL_SECONDS,
      refresh_token: refreshToken,
      scope: data.scope ?? undefined,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

async function handleRefreshToken(params: RefreshTokenRequest) {
  const { refresh_token: refreshToken, client_id: clientId, resource } = params;

  const newAccessToken = generateOpaqueToken();
  const newRefreshToken = generateOpaqueToken();
  const admin = createMcpSupabaseAdmin();
  const { data, error } = (await admin
    .rpc("rotate_mcp_refresh_token", {
      p_refresh_token_hash: hashToken(refreshToken),
      p_client_id: clientId,
      p_resource: resource,
      p_new_access_token_hash: hashToken(newAccessToken),
      p_new_refresh_token_hash: hashToken(newRefreshToken),
    })
    .maybeSingle()) as { data: RefreshResult | null; error: unknown };

  if (error) return oauthError("server_error", "Could not rotate refresh token.", 500);
  if (!data || data.status !== "issued") {
    const description = data?.status === "reuse_detected"
      ? "This refresh token has already been used."
      : "The refresh token is invalid or expired.";
    return oauthError("invalid_grant", description);
  }

  return NextResponse.json(
    {
      access_token: newAccessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL_SECONDS,
      refresh_token: newRefreshToken,
      scope: data.scope ?? undefined,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

async function handlePost(request: Request) {
  if (!requestOriginAllowed(request.headers.get("origin"), new Set(getMcpAllowedOrigins()))) {
    return oauthError("access_denied", "Request origin is not allowed.", 403);
  }
  if (request.headers.has("authorization")) {
    return oauthError("invalid_client", "Only public PKCE clients are supported.", 401);
  }

  const rawParams = await readParams(request);
  if (rawParams.ok === false) {
    return oauthError(
      "invalid_request",
      rawParams.status === 413 ? "The request body is too large." : "A bounded form-encoded body is required.",
      rawParams.status
    );
  }

  const rateInput = buildNetworkRateLimitInput(
    "mcp-token",
    request.headers,
    process.env.MCP_TOKEN_RATE_LIMIT_PEPPER ?? "",
    30,
    60
  );
  if (!rateInput) {
    return oauthError("temporarily_unavailable", "Token issuance is temporarily unavailable.", 503);
  }
  const rateAdmin = createMcpSupabaseAdmin();
  const { data: allowed, error: rateError } = await rateAdmin.rpc("check_mcp_rate_limit", rateInput);
  const rateDecision = resolveRateLimitDecision(allowed, rateError);
  if (rateDecision !== "allowed") {
    return oauthError(
      "temporarily_unavailable",
      rateDecision === "denied" ? "Too many token requests." : "Token issuance is temporarily unavailable.",
      rateDecision === "denied" ? 429 : 503
    );
  }

  const params = parseTokenRequest(rawParams.params, getMcpResourceUrl());
  if (!params) return oauthError("invalid_request", "The token request is invalid.");
  return params.grant_type === "authorization_code"
    ? handleAuthorizationCode(params)
    : handleRefreshToken(params);
}

export async function POST(request: Request) {
  const allowedOrigins = new Set(getMcpAllowedOrigins());
  const response = await observeMcpRoute(request, "mcp.oauth.token", () => handlePost(request));
  return applyOAuthCors(response, request.headers.get("origin"), allowedOrigins);
}

export function OPTIONS(request: Request) {
  return oauthPreflightResponse(
    request.headers.get("origin"),
    new Set(getMcpAllowedOrigins())
  );
}
