import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  BUILD_SYNC_CLIENT_ID,
  getBuildSyncResourceUrl,
} from "@/lib/buildSync/config";
import {
  parseBuildSyncTokenRequest,
  type BuildSyncTokenRequest,
} from "@/lib/buildSync/oauth";
import { readBoundedBody } from "@/lib/mcp/http";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  generateOpaqueToken,
  hashToken,
  verifyCodeChallenge,
} from "@/lib/mcp/oauth";
import {
  buildNetworkRateLimitInput,
  resolveRateLimitDecision,
} from "@/lib/mcp/security";

export const dynamic = "force-dynamic";
const MAX_FORM_BYTES = 32_768;

type ExchangeResult = {
  status: "issued" | "invalid_grant";
  user_id: string | null;
  scope: string | null;
  resource: string | null;
};

type RefreshResult = ExchangeResult | {
  status: "reuse_detected";
  user_id: null;
  scope: null;
  resource: null;
};

function oauthError(error: string, description: string, status = 400) {
  return NextResponse.json(
    { error, error_description: description },
    { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } }
  );
}

async function exchangeAuthorizationCode(
  params: Extract<BuildSyncTokenRequest, { grant_type: "authorization_code" }>
) {
  const admin = createAdminSupabase();
  const codeHash = hashToken(params.code);
  const { data: candidate, error: candidateError } = await admin
    .from("build_sync_authorization_codes")
    .select("code_challenge")
    .eq("code_hash", codeHash)
    .eq("client_id", BUILD_SYNC_CLIENT_ID)
    .eq("redirect_uri", params.redirect_uri)
    .eq("resource", params.resource)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (candidateError) {
    return oauthError("temporarily_unavailable", "Authorization is temporarily unavailable.", 503);
  }
  if (!candidate || !verifyCodeChallenge(params.code_verifier, candidate.code_challenge)) {
    return oauthError("invalid_grant", "The authorization code is invalid or expired.");
  }

  const accessToken = generateOpaqueToken();
  const refreshToken = generateOpaqueToken();
  const { data, error } = (await admin
    .rpc("exchange_build_sync_authorization_code", {
      p_code_hash: codeHash,
      p_redirect_uri: params.redirect_uri,
      p_client_id: BUILD_SYNC_CLIENT_ID,
      p_expected_code_challenge: candidate.code_challenge,
      p_resource: params.resource,
      p_access_token_hash: hashToken(accessToken),
      p_refresh_token_hash: hashToken(refreshToken),
      p_family_id: randomUUID(),
    })
    .maybeSingle()) as { data: ExchangeResult | null; error: unknown };

  if (error) return oauthError("server_error", "Could not issue tokens.", 500);
  if (!data || data.status !== "issued") {
    return oauthError("invalid_grant", "The authorization code is invalid or expired.");
  }

  return NextResponse.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken,
    scope: data.scope,
  }, { headers: { "Cache-Control": "no-store" } });
}

async function rotateRefreshToken(
  params: Extract<BuildSyncTokenRequest, { grant_type: "refresh_token" }>
) {
  const accessToken = generateOpaqueToken();
  const refreshToken = generateOpaqueToken();
  const admin = createAdminSupabase();
  const { data, error } = (await admin
    .rpc("rotate_build_sync_refresh_token", {
      p_refresh_token_hash: hashToken(params.refresh_token),
      p_client_id: BUILD_SYNC_CLIENT_ID,
      p_resource: params.resource,
      p_new_access_token_hash: hashToken(accessToken),
      p_new_refresh_token_hash: hashToken(refreshToken),
    })
    .maybeSingle()) as { data: RefreshResult | null; error: unknown };

  if (error) return oauthError("server_error", "Could not rotate refresh token.", 500);
  if (!data || data.status !== "issued") {
    return oauthError(
      "invalid_grant",
      data?.status === "reuse_detected"
        ? "This refresh token has already been used."
        : "The refresh token is invalid or expired."
    );
  }

  return NextResponse.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken,
    scope: data.scope,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.has("authorization")) {
    return oauthError("invalid_client", "BUILD Sync uses a public PKCE client.", 401);
  }
  const mediaType = (request.headers.get("content-type") ?? "").split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/x-www-form-urlencoded") {
    return oauthError("invalid_request", "A form-encoded body is required.", 415);
  }

  const bounded = await readBoundedBody(request, MAX_FORM_BYTES);
  if (bounded.ok === false) {
    return oauthError(
      "invalid_request",
      bounded.reason === "too_large" ? "The request body is too large." : "The request body is invalid.",
      bounded.reason === "too_large" ? 413 : 400
    );
  }

  const requestUrl = new URL(request.url);
  const localDevelopment = process.env.NODE_ENV !== "production" &&
    (requestUrl.hostname === "127.0.0.1" || requestUrl.hostname === "localhost");
  if (!localDevelopment) {
    const rateInput = buildNetworkRateLimitInput(
      "build-sync-token",
      request.headers,
      process.env.BUILD_SYNC_TOKEN_RATE_LIMIT_PEPPER ?? process.env.MCP_TOKEN_RATE_LIMIT_PEPPER ?? "",
      30,
      60
    );
    if (!rateInput) {
      return oauthError("temporarily_unavailable", "Token issuance is temporarily unavailable.", 503);
    }
    const admin = createAdminSupabase();
    const { data: allowed, error } = await admin.rpc("check_mcp_rate_limit", rateInput);
    const decision = resolveRateLimitDecision(allowed, error);
    if (decision !== "allowed") {
      return oauthError(
        "temporarily_unavailable",
        decision === "denied" ? "Too many token requests." : "Token issuance is temporarily unavailable.",
        decision === "denied" ? 429 : 503
      );
    }
  }

  const params = parseBuildSyncTokenRequest(
    new URLSearchParams(bounded.text),
    getBuildSyncResourceUrl()
  );
  if (!params) return oauthError("invalid_request", "The token request is invalid.");
  return params.grant_type === "authorization_code"
    ? exchangeAuthorizationCode(params)
    : rotateRefreshToken(params);
}
