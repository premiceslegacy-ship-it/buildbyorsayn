import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { getMcpResourceUrl } from "@/lib/mcp/config";
import { hasMcpConnectorAllowlist, isMcpConnectorAccountAllowed, isMcpConnectorLaunched } from "@/lib/mcp/launch";
import {
  buildValidatedAuthorizationErrorCallback,
  generateOpaqueToken,
  hashToken,
  isRedirectUriAllowed,
} from "@/lib/mcp/oauth";
import { createAuthorizationRequestSchema } from "@/lib/mcp/oauthSchemas";
import { observeMcpRoute } from "@/lib/mcp/observability";
import {
  reserveAuthorizationNetworkRequest,
  reserveAuthorizationPrincipal,
} from "@/lib/mcp/authorizationRateLimit";
export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store", Pragma: "no-cache" };

function oauthError(description: string, status = 400) {
  return NextResponse.json(
    { error: status === 503 ? "temporarily_unavailable" : "invalid_request", error_description: description },
    { status, headers: NO_STORE }
  );
}

async function handleGet(request: Request) {
  const url = new URL(request.url);
  const admin = createMcpSupabaseAdmin({ signal: request.signal });
  const networkDecision = await reserveAuthorizationNetworkRequest(admin, {
    headers: request.headers,
    product: "mcp",
  });
  if (networkDecision !== "allowed") {
    return oauthError(
      networkDecision === "denied" ? "Too many authorization attempts." : "Authorization is temporarily unavailable.",
      networkDecision === "denied" ? 429 : 503,
    );
  }
  if (!isMcpConnectorLaunched() && !hasMcpConnectorAllowlist()) {
    return new Response(null, { status: 404, headers: NO_STORE });
  }

  const entries = [...url.searchParams.entries()];
  if (new Set(entries.map(([key]) => key)).size !== entries.length) {
    return oauthError("The authorization request is invalid.");
  }

  const parsed = createAuthorizationRequestSchema(getMcpResourceUrl()).safeParse(
    Object.fromEntries(entries),
  );
  if (!parsed.success) return oauthError("The authorization request is invalid.");
  const input = parsed.data;

  const { data: client, error: clientError } = await admin
    .from("mcp_oauth_clients")
    .select("client_id, redirect_uris, token_endpoint_auth_method")
    .eq("client_id", input.client_id)
    .maybeSingle();
  if (clientError) return oauthError("Authorization is temporarily unavailable.", 503);
  if (
    !client ||
    client.token_endpoint_auth_method !== "none" ||
    !isRedirectUriAllowed(input.redirect_uri, client.redirect_uris)
  ) {
    return oauthError("Unknown client or redirect_uri.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${url.pathname}${url.search}`);
    return NextResponse.redirect(loginUrl, { headers: NO_STORE });
  }
  if (!isMcpConnectorAccountAllowed(user.id)) {
    return new Response(null, { status: 404, headers: NO_STORE });
  }

  const rateDecision = await reserveAuthorizationPrincipal(admin, {
    userId: user.id,
    clientId: input.client_id,
    product: "mcp",
  });
  if (rateDecision !== "allowed") {
    return NextResponse.redirect(
      buildValidatedAuthorizationErrorCallback(
        input.redirect_uri,
        input.state,
        "temporarily_unavailable",
        "Too many authorization requests.",
      ),
      {
        headers: { ...NO_STORE, "Retry-After": rateDecision === "denied" ? "300" : "5" },
      },
    );
  }

  const requestHandle = generateOpaqueToken();
  const { data: requestStatus, error: insertError } = await admin.rpc("create_mcp_authorization_request", {
    p_request_hash: hashToken(requestHandle),
    p_client_id: input.client_id,
    p_redirect_uri: input.redirect_uri,
    p_code_challenge: input.code_challenge,
    p_code_challenge_method: "S256",
    p_scope: input.scope,
    p_resource: input.resource,
    p_state: input.state,
    p_user_id: user.id,
  });
  if (insertError || requestStatus !== "created") {
    if (!insertError && requestStatus === "rate_limited") {
      return NextResponse.redirect(
        buildValidatedAuthorizationErrorCallback(
          input.redirect_uri,
          input.state,
          "temporarily_unavailable",
          "Too many active authorization requests.",
        ),
        { headers: { ...NO_STORE, "Retry-After": "300" } },
      );
    }
    return oauthError("Authorization is temporarily unavailable.", 503);
  }

  const consentUrl = new URL("/mcp/consent", request.url);
  consentUrl.searchParams.set("request", requestHandle);
  return NextResponse.redirect(consentUrl, { headers: NO_STORE });
}

export function GET(request: Request) {
  return observeMcpRoute(request, "mcp.oauth.authorize", () => handleGet(request));
}
