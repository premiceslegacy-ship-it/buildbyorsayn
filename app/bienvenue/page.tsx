import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function BienvenuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#0a0908] text-[#f0ede8] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.07),transparent_65%)] blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center">
        <Logo layout="vertical" className="mx-auto mb-12" />

        {/* Icône succès */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#e8d5b0]/20 to-[#e8d5b0]/8 border border-[#e8d5b0]/25 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)]">
          <svg className="w-7 h-7 text-[#e8d5b0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#f0ede8] mb-4 leading-tight">
          Paiement confirmé.
          <br />
          <span className="text-[#c9b48a]">{user ? "Ton accès est mis à jour." : "Bienvenue dans BUILD."}</span>
        </h1>

        <p className="text-[#8a8070] text-base leading-[1.75] mb-10">
          {user
            ? "Ton nouveau tier est activé. Retourne dans ton espace pour accéder à tout le contenu débloqué."
            : "Tu vas recevoir un email dans les prochaines minutes pour créer ton mot de passe et accéder à ton espace membre. Vérifie aussi tes spams si tu ne le reçois pas."
          }
        </p>

        {/* Étapes - uniquement pour les nouveaux */}
        {!user && (
          <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-6 mb-8 text-left shadow-[0_16px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <p className="text-xs font-bold uppercase tracking-[2px] text-[#c9b48a] mb-5">
              Prochaines étapes
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-b from-[#e8d5b0]/15 to-[#e8d5b0]/8 border border-[#e8d5b0]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Mail className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8] mb-0.5">Ouvre l&apos;email BUILD</p>
                  <p className="text-xs text-[#8a8070] leading-relaxed">
                    Un lien d&apos;activation t&apos;a été envoyé à l&apos;adresse utilisée sur Stripe.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-b from-[#e8d5b0]/15 to-[#e8d5b0]/8 border border-[#e8d5b0]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Lock className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8] mb-0.5">Crée ton mot de passe</p>
                  <p className="text-xs text-[#8a8070] leading-relaxed">
                    Le lien te redirige vers une page pour sécuriser ton compte.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-b from-[#e8d5b0]/15 to-[#e8d5b0]/8 border border-[#e8d5b0]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <ArrowRight className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8] mb-0.5">Accède à BUILD</p>
                  <p className="text-xs text-[#8a8070] leading-relaxed">
                    Ton accès est activé. Tu peux commencer immédiatement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {user ? (
          <Link
            href="/dashboard"
            className="relative overflow-hidden inline-flex items-center gap-2 text-sm font-semibold text-[#0a0908] bg-[#c9b48a] hover:bg-[#e8d5b0] px-6 py-3 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none"
          >
            <span className="relative z-10 flex items-center gap-2">
              Accéder à mon espace
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ) : (
          <>
            <p className="text-xs text-[#8a8070] mb-6">
              Tu as déjà un compte ?
            </p>
            <Link
              href="/login"
              className="relative overflow-hidden inline-flex items-center gap-2 text-sm font-semibold text-[#0a0908] bg-[#c9b48a] hover:bg-[#e8d5b0] px-6 py-3 rounded-xl transition-all duration-[80ms] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
