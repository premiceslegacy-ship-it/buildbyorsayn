import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { getMcpResourceUrl } from "@/lib/mcp/config";
import {
  generateOpaqueToken,
  hashToken,
  isRedirectUriAllowed,
} from "@/lib/mcp/oauth";
import { createAuthorizationRequestSchema } from "@/lib/mcp/oauthSchemas";
import { observeMcpRoute } from "@/lib/mcp/observability";

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
  const entries = [...url.searchParams.entries()];
  if (new Set(entries.map(([key]) => key)).size !== entries.length) {
    return oauthError("The authorization request is invalid.");
  }

  const parsed = createAuthorizationRequestSchema(getMcpResourceUrl()).safeParse(
    Object.fromEntries(entries)
  );
  if (!parsed.success) return oauthError("The authorization request is invalid.");
  const input = parsed.data;

  const admin = createMcpSupabaseAdmin();
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
    return oauthError("Authorization is temporarily unavailable.", 503);
  }

  const consentUrl = new URL("/mcp/consent", request.url);
  consentUrl.searchParams.set("request", requestHandle);
  return NextResponse.redirect(consentUrl, { headers: NO_STORE });
}

export function GET(request: Request) {
  return observeMcpRoute(request, "mcp.oauth.authorize", () => handleGet(request));
}
