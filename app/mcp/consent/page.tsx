import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { hashToken, sanitizeClientName } from "@/lib/mcp/oauth";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { approveMcpConsent, denyMcpConsent } from "@/app/actions/mcpConsent";

const TIER_LABEL: Record<string, string> = {
  free: "Public",
  preview: "Demo gratuite",
  beginner: FONDATIONS_LABEL,
  full: COFFRE_LABEL,
};

export const metadata = { title: "Connecter un assistant IA : BUILD by Orsayn" };

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

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] flex items-center justify-center p-4 sm:p-6">
      <LiquidCard className="w-full max-w-md p-6 sm:p-8">
        <h1 className="text-xl font-semibold mb-2">Application non verifiee</h1>
        <p className="text-sm text-[#f0ede8]/70 mb-6">
          Le nom « {clientName} » est declare par l&apos;application et n&apos;a pas ete verifie par BUILD.
        </p>
        <div className="rounded-md bg-white/[0.04] border border-[#c9b48a]/15 p-4 mb-4">
          <p className="text-xs uppercase tracking-wide text-[#f0ede8]/50 mb-1">Destination exacte</p>
          <p className="text-sm text-[#f0ede8]/80 break-all">{redirectUri}</p>
        </div>
        <div className="rounded-md bg-white/[0.04] border border-[#c9b48a]/15 p-4 mb-6">
          <p className="text-sm text-[#f0ede8]/70">
            Ton acces actuel : <span className="text-[#c9b48a]">{TIER_LABEL[tier]}</span>
          </p>
          {tier === "preview" ? (
            <p className="text-sm text-[#f0ede8]/50 mt-1">
              Passe a {FONDATIONS_LABEL} ou {COFFRE_LABEL} pour debloquer plus de contenu dans ton assistant IA.
            </p>
          ) : null}
        </div>
        {errorCode ? (
          <p className="text-sm text-red-400 mb-4">
            La demande precedente a echoue, reessaie depuis {clientName}.
          </p>
        ) : null}
        <div className="flex gap-3">
          <form action={approveMcpConsent} className="flex-1">
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="w-full rounded-md bg-[#c9b48a] text-[#0e0e0f] font-medium py-2.5 hover:bg-[#c9b48a]/90 transition">
              Autoriser
            </button>
          </form>
          <form action={denyMcpConsent} className="flex-1">
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="w-full rounded-md border border-[#c9b48a]/20 py-2.5 hover:bg-white/[0.04] transition">
              Refuser
            </button>
          </form>
        </div>
      </LiquidCard>
    </main>
  );
}
