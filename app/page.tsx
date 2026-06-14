import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] flex flex-col relative overflow-hidden">
      {/* Halo ambiant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.06),transparent_70%)] blur-[60px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-12 sm:py-8 relative z-10">
        <Logo layout="horizontal" />
        {user ? (
          <Link
            href="/dashboard"
            className="text-sm text-[#c9b48a] hover:text-[#f0ede8] transition-colors"
          >
            Mon espace
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm text-[#c9b48a] hover:text-[#f0ede8] transition-colors"
          >
            J&apos;ai déjà un compte
          </Link>
        )}
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-28 relative z-10">
        <div className="w-full max-w-xl flex flex-col gap-10">

          {/* Label */}
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#c9b48a]">
            BUILD BY ORSAYN
          </p>

          {/* Manifeste */}
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#f0ede8]">
              Tu utilises l&apos;IA depuis des mois.<br />
              Tu n&apos;as toujours rien à toi.
            </h1>
            <p className="text-[#8a8070] text-base leading-relaxed">
              Build, c&apos;est la méthode pour arrêter de louer et commencer à posséder. Les fichiers, frameworks, skills et systèmes que j&apos;utilise pour construire mes lignes verticales IA. Tu repars avec du capital organique, pas des prompts jetables.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0e0e0f] font-bold text-sm px-8 py-4 rounded-xl w-full sm:w-fit transition-all duration-[80ms] shadow-[0_4px_0_rgba(140,110,65,0.9),0_6px_16px_rgba(0,0,0,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(140,110,65,0.9),0_2px_6px_rgba(0,0,0,0.2)]"
              >
                Accéder au système
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 bg-[#c9b48a] hover:bg-[#e8d5b0] text-[#0e0e0f] font-bold text-sm px-8 py-4 rounded-xl w-full sm:w-fit transition-all duration-[80ms] shadow-[0_4px_0_rgba(140,110,65,0.9),0_6px_16px_rgba(0,0,0,0.35)] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(140,110,65,0.9),0_2px_6px_rgba(0,0,0,0.2)]"
                >
                  Accéder à BUILD
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-[#8a8070]">
                  Accès à vie - Paiement sécurisé via Stripe
                </p>
              </>
            )}
          </div>

          {/* Séparateur */}
          <div className="h-px bg-[#2a2520]" />

          {/* Preuve sociale minimale */}
          <blockquote className="flex flex-col gap-2 border-l-2 border-[#c9b48a]/30 pl-4">
            <p className="text-sm text-[#c4b89a] italic leading-relaxed">
              &ldquo;Je suis passé de savoir faire à montrer que je sais faire. Premières ventes en 2 semaines.&rdquo;
            </p>
            <footer className="text-xs text-[#8a8070]">
              Membre BUILD
            </footer>
          </blockquote>

        </div>
      </div>
    </main>
  );
}
