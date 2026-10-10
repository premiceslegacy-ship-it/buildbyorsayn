import { redirect } from "next/navigation";
import { Check, Download, HardDrive, RefreshCw, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/mcp/oauth";
import { cn } from "@/lib/utils";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { Button, LiquidButton } from "@/components/ui/liquid-glass-button";
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
      <LiquidCard variant="elevated" className="w-full max-w-xl p-5 sm:p-8">
        <header className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-28 items-center justify-center overflow-hidden rounded-2xl border border-[#e8d5b0]/30 bg-[#e8d5b0] shadow-[0_12px_32px_rgba(0,0,0,0.28)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand-logos/build-logo-compact.png" alt="BUILD" className="h-auto w-24 object-contain" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8d5b0]/70">Étape 2 sur 4 · Autorisation</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Connecter cet ordinateur à BUILD</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#f0ede8]/65">
            Autorise BUILD Sync une seule fois. L’installation reprendra automatiquement dans ton terminal.
          </p>
        </header>

        <ol aria-label="Progression de l’installation" className="my-6 grid grid-cols-4 gap-2">
          {["Commande", "Autorisation", "Installation", "Mises à jour"].map((label, index) => (
            <li key={label} className="min-w-0 text-center">
              <span className={cn(
                "mx-auto flex size-7 items-center justify-center rounded-full border text-[10px] font-semibold",
                index === 0
                  ? "border-[#e8d5b0]/40 bg-[#e8d5b0]/15 text-[#e8d5b0]"
                  : index === 1
                    ? "border-[#e8d5b0] bg-[#e8d5b0] text-[#0e0e0f]"
                    : "border-white/10 text-white/30"
              )}>
                {index === 0 ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span className="mt-1.5 block truncate text-[9px] text-white/40 sm:text-[10px]">{label}</span>
            </li>
          ))}
        </ol>

        <section aria-labelledby="build-sync-access-title" className="border-y border-white/10 py-5">
          <h2 id="build-sync-access-title" className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[#f0ede8]/45">Ce que BUILD va faire</h2>
          <ul className="flex flex-col gap-3 text-sm text-[#f0ede8]/78">
            <li className="flex items-start gap-3"><Download className="mt-0.5 size-4 shrink-0 text-[#e8d5b0]" aria-hidden="true" /><span>Télécharger uniquement les skills inclus dans ton accès.</span></li>
            <li className="flex items-start gap-3"><HardDrive className="mt-0.5 size-4 shrink-0 text-[#e8d5b0]" aria-hidden="true" /><span>Sauvegarder les anciennes installations avant de les remplacer.</span></li>
            <li className="flex items-start gap-3"><RefreshCw className="mt-0.5 size-4 shrink-0 text-[#e8d5b0]" aria-hidden="true" /><span>Vérifier automatiquement les nouvelles versions toutes les six heures.</span></li>
            <li className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#e8d5b0]" aria-hidden="true" /><span>Ne jamais accéder à tes projets, tes conversations ou tes mots de passe.</span></li>
          </ul>
        </section>

        <details className="my-4 text-sm">
          <summary className="cursor-pointer text-[#f0ede8]/45">Afficher l’adresse locale</summary>
          <p className="mt-3 break-all rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-[#f0ede8]/65">
            {authorizationRequest.redirect_uri}
          </p>
        </details>

        {errorCode ? <p className="mb-4 text-sm text-red-300">La demande a expiré. Relance BUILD Sync.</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <form action={approveBuildSyncConsent} className="flex-1">
            <input type="hidden" name="request" value={requestHandle} />
            <LiquidButton type="submit" size="xl" className="w-full">
              Autoriser les mises à jour
            </LiquidButton>
          </form>
          <form action={denyBuildSyncConsent} className="sm:w-32">
            <input type="hidden" name="request" value={requestHandle} />
            <Button type="submit" variant="outline" size="lg" className="h-12 w-full">
              Annuler
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-white/35">Tu peux révoquer cette connexion à tout moment avec <code className="text-[#e8d5b0]/70">build-skills logout</code>.</p>
      </LiquidCard>
    </main>
  );
}
