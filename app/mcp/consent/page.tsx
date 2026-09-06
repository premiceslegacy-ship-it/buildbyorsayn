import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { hashToken, sanitizeClientName } from "@/lib/mcp/oauth";
import { resolveMcpClientPresentation } from "@/lib/mcp/clientPresentation";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { approveMcpConsent, denyMcpConsent } from "@/app/actions/mcpConsent";

const TIER_LABEL: Record<string, string> = {
  free: "Public",
  preview: "Démo gratuite",
  beginner: FONDATIONS_LABEL,
  full: COFFRE_LABEL,
};

export const metadata = { title: "Connecter un assistant à BUILD" };

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
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] flex items-center justify-center p-4 sm:p-6">
      <LiquidCard className="w-full max-w-lg p-6 sm:p-8">
        <div className="mb-7 flex items-center justify-center gap-3" aria-label={`Connexion entre BUILD et ${presentation.displayName}`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/api/mcp/logo" alt="BUILD" className="h-11 w-11 rounded-xl object-contain" />
          </div>
          <div className="flex w-10 items-center" aria-hidden="true">
            <span className="h-px flex-1 bg-[#c9b48a]/35" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9b48a]" />
            <span className="h-px flex-1 bg-[#c9b48a]/35" />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] shadow-sm">
            {presentation.logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={presentation.logoSrc} alt={presentation.displayName} className="h-9 w-9 object-contain" />
            ) : (
              <span className="text-xl font-semibold text-[#f0ede8]/80" aria-hidden="true">
                {presentation.displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] mb-2">
            Connecter {presentation.displayName} à BUILD
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-[#f0ede8]/65">
            {presentation.displayName} pourra consulter les ressources BUILD incluses dans ton abonnement pour répondre à tes questions.
          </p>
        </div>

        {!presentation.verified ? (
          <div className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3">
            <p className="text-sm leading-5 text-amber-100/80">
              L’identité de cette application n’a pas pu être confirmée. Vérifie l’adresse de retour avant de continuer.
            </p>
          </div>
        ) : null}

        <div className="border-y border-white/10 py-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[#f0ede8]/45">
            Accès demandé
          </p>
          <ul className="space-y-2.5 text-sm text-[#f0ede8]/78">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9b48a]" aria-hidden="true" />
              Rechercher dans les contenus BUILD
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9b48a]" aria-hidden="true" />
              Consulter uniquement les ressources de ton niveau
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between gap-4 py-5">
          <span className="text-sm text-[#f0ede8]/55">Ton niveau d’accès</span>
          <span className="rounded-full border border-[#c9b48a]/25 bg-[#c9b48a]/10 px-3 py-1 text-sm font-medium text-[#d7c39c]">
            {TIER_LABEL[tier]}
          </span>
        </div>

        {tier === "preview" ? (
          <p className="mb-5 text-sm leading-5 text-[#f0ede8]/50">
            Les contenus {FONDATIONS_LABEL} et {COFFRE_LABEL} resteront protégés.
          </p>
        ) : null}

        <p className="mb-4 text-sm text-[#f0ede8]/60">
          Après autorisation, tu retourneras sur <span className="text-[#f0ede8]/85">{presentation.destinationLabel}</span>.
        </p>

        <details className="group mb-6 text-sm">
          <summary className="cursor-pointer list-none text-[#f0ede8]/45 transition hover:text-[#f0ede8]/70">
            Afficher les détails techniques
          </summary>
          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5">
            <p className="mb-1 text-xs text-[#f0ede8]/40">Adresse de retour</p>
            <p className="break-all text-xs leading-5 text-[#f0ede8]/65">{redirectUri}</p>
          </div>
        </details>

        {errorCode ? (
          <p className="mb-4 text-sm text-red-300">
            La demande précédente a échoué. Recommence depuis {presentation.displayName}.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <form action={approveMcpConsent} className="flex-1">
            <input type="hidden" name="request" value={requestHandle} />
            <button
              type="submit"
              className="w-full rounded-xl border border-[#decda9]/40 bg-[#c9b48a] py-3 font-medium text-[#0e0e0f] shadow-[0_3px_0_#8f7d5d] transition hover:bg-[#d3c09a] active:translate-y-[2px] active:shadow-[0_1px_0_#8f7d5d]"
            >
              Autoriser {presentation.displayName}
            </button>
          </form>
          <form action={denyMcpConsent} className="flex-1 sm:flex-none">
            <input type="hidden" name="request" value={requestHandle} />
            <button
              type="submit"
              className="w-full rounded-xl border border-white/12 px-6 py-3 text-[#f0ede8]/75 transition hover:bg-white/[0.05] hover:text-[#f0ede8] active:translate-y-px"
            >
              Annuler
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-[#f0ede8]/38">
          Tu peux retirer cet accès à tout moment depuis ton espace BUILD.
        </p>
      </LiquidCard>
    </main>
  );
}
