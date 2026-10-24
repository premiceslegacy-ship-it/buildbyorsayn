import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { hashToken, sanitizeClientName } from "@/lib/mcp/oauth";
import { resolveMcpClientPresentation } from "@/lib/mcp/clientPresentation";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";
import { DaRoot } from "@/components/da/DaRoot";
import { McpConsentCard } from "@/components/da/McpConsentCard";
import { approveMcpConsent, denyMcpConsent } from "@/app/actions/mcpConsent";
import "@/app/da-mcp.css";

export const metadata = { title: "Connecter un assistant | BUILD" };

export default async function McpConsentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requestHandle = typeof params.request === "string" ? params.request : "";
  const errorCode = typeof params.error === "string" ? params.error : "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(requestHandle)) redirect("/dashboard");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/mcp/consent?request=${requestHandle}`)}`);
  }

  const admin = createMcpSupabaseAdmin();
  const { data: authorizationRequest, error: requestError } = await admin
    .from("mcp_authorization_requests")
    .select("client_id, redirect_uri")
    .eq("request_hash", hashToken(requestHandle))
    .eq("user_id", user.id)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (requestError || !authorizationRequest) redirect("/dashboard");

  const { data: client, error: clientError } = await admin
    .from("mcp_oauth_clients")
    .select("client_name, token_endpoint_auth_method")
    .eq("client_id", authorizationRequest.client_id)
    .maybeSingle();
  if (clientError || !client || client.token_endpoint_auth_method !== "none") {
    redirect("/dashboard");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = resolveMcpProfileTier(profile, profileError);
  if (!tier) redirect("/dashboard");

  const clientName = sanitizeClientName(client.client_name);
  const redirectUri = authorizationRequest.redirect_uri;
  const presentation = resolveMcpClientPresentation(clientName, redirectUri);

  return (
    <DaRoot>
      <McpConsentCard
        presentation={presentation}
        tier={tier}
        redirectUri={redirectUri}
        requestHandle={requestHandle}
        errorMessage={errorCode ? `La demande précédente a échoué. Recommence depuis ${presentation.displayName}.` : null}
        approveAction={approveMcpConsent}
        denyAction={denyMcpConsent}
      />
    </DaRoot>
  );
}
