import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/mcp/oauth";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import {
  approveBuildSyncConsent,
  denyBuildSyncConsent,
} from "@/app/actions/buildSyncConsent";

export const metadata = { title: "Installer BUILD Sync" };

export default async function BuildSyncConsentPage({
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
    redirect(`/login?next=${encodeURIComponent(`/build-sync/consent?request=${requestHandle}`)}`);
  }

  const admin = createAdminSupabase();
  const { data: authorizationRequest, error } = await admin
    .from("build_sync_authorization_requests")
    .select("redirect_uri")
    .eq("request_hash", hashToken(requestHandle))
    .eq("user_id", user.id)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error || !authorizationRequest) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0e0e0f] p-4 text-[#f0ede8] sm:p-6">
      <LiquidCard className="w-full max-w-lg p-6 sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e8d5b0]/20 bg-[#e8d5b0]/[0.08]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand-logos/build-logo-compact.png" alt="BUILD" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Activer BUILD Sync</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#f0ede8]/65">
            BUILD Sync pourra télécharger les skills inclus dans ton accès et les maintenir à jour sur cet ordinateur.
          </p>
        </div>

        <div className="border-y border-white/10 py-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[#f0ede8]/45">Accès demandé</p>
          <ul className="space-y-2.5 text-sm text-[#f0ede8]/78">
            <li>• Lire le catalogue correspondant à ton abonnement</li>
            <li>• Télécharger et vérifier les versions officielles</li>
            <li>• Aucun accès à tes projets ou à tes conversations</li>
          </ul>
        </div>

        <details className="my-5 text-sm">
          <summary className="cursor-pointer text-[#f0ede8]/45">Afficher l’adresse locale</summary>
          <p className="mt-3 break-all rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-[#f0ede8]/65">
            {authorizationRequest.redirect_uri}
          </p>
        </details>

        {errorCode ? <p className="mb-4 text-sm text-red-300">La demande a expiré. Relance BUILD Sync.</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <form action={approveBuildSyncConsent} className="flex-1">
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="w-full rounded-xl bg-[#c9b48a] py-3 font-medium text-[#0e0e0f] transition hover:bg-[#d3c09a]">
              Autoriser les mises à jour
            </button>
          </form>
          <form action={denyBuildSyncConsent}>
            <input type="hidden" name="request" value={requestHandle} />
            <button type="submit" className="w-full rounded-xl border border-white/12 px-6 py-3 text-[#f0ede8]/75 transition hover:bg-white/[0.05]">
              Annuler
            </button>
          </form>
        </div>
      </LiquidCard>
    </main>
  );
}
