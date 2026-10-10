import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { canUseBuildSync, getBuildSyncResourceUrl } from "@/lib/buildSync/config";
import { createBuildSyncAuthorizationSchema } from "@/lib/buildSync/oauth";
import { generateOpaqueToken, hashToken } from "@/lib/mcp/oauth";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store", Pragma: "no-cache" };

function oauthError(description: string, status = 400) {
  return NextResponse.json(
    {
      error: status === 503 ? "temporarily_unavailable" : "invalid_request",
      error_description: description,
    },
    { status, headers: NO_STORE }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const entries = [...url.searchParams.entries()];
  if (new Set(entries.map(([key]) => key)).size !== entries.length) {
    return oauthError("The authorization request is invalid.");
  }

  const parsed = createBuildSyncAuthorizationSchema(getBuildSyncResourceUrl()).safeParse(
    Object.fromEntries(entries)
  );
  if (!parsed.success) return oauthError("The authorization request is invalid.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${url.pathname}${url.search}`);
    return NextResponse.redirect(loginUrl, { headers: NO_STORE });
  }

  const admin = createAdminSupabase({ signal: request.signal });
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = resolveMcpProfileTier(profile, profileError);
  const input = parsed.data;
  if (!canUseBuildSync(tier)) {
    const callback = new URL(input.redirect_uri);
    callback.searchParams.set("error", "access_denied");
    callback.searchParams.set("state", input.state);
    return NextResponse.redirect(callback, { headers: NO_STORE });
  }

  const requestHandle = generateOpaqueToken();
  const { data: status, error } = await admin.rpc("create_build_sync_authorization_request", {
    p_request_hash: hashToken(requestHandle),
    p_user_id: user.id,
    p_client_id: input.client_id,
    p_redirect_uri: input.redirect_uri,
    p_code_challenge: input.code_challenge,
    p_scope: input.scope,
    p_resource: input.resource,
    p_state: input.state,
  });

  if (error || status !== "created") {
    return oauthError("Authorization is temporarily unavailable.", 503);
  }

  const consentUrl = new URL("/build-sync/consent", request.url);
  consentUrl.searchParams.set("request", requestHandle);
  return NextResponse.redirect(consentUrl, { headers: NO_STORE });
}
