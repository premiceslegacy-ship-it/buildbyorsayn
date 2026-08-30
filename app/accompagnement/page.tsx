import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Accompagnements | BUILD",
  description:
    "Des accompagnements 1:1 pour créer un site web utile avec l'IA et le faire avancer avec ton activité.",
};

const ADMIN_EMAIL = "mbebourasam@gmail.com";

export default async function AccompagnementGatewayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] selection:bg-[#e8d5b0]/30">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/dashboard" aria-label="Retour à BUILD">
            <Logo layout="horizontal" />
          </Link>
          <div className="flex items-center gap-5 text-sm">
            {user ? (
              <Link
                href="/dashboard"
                className="hidden min-h-11 items-center text-[#a8a39a] transition-colors hover:text-[#f0ede8] sm:inline-flex"
              >
                Retour à BUILD
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden min-h-11 items-center text-[#a8a39a] transition-colors hover:text-[#f0ede8] sm:inline-flex"
              >
                Se connecter
              </Link>
            )}
            {user?.email === ADMIN_EMAIL && (
              <Link
                href="/accompagnement/formateur"
                className="hidden min-h-11 items-center text-[#e8d5b0] transition-colors hover:text-[#f0dfc0] sm:inline-flex"
              >
                Vue formateur
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="border-b border-white/[0.08] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e8d5b0]">
            Accompagnement 1:1
          </p>
          <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-medium leading-[0.96] tracking-[-0.055em] text-[#f0ede8] sm:text-7xl lg:text-8xl">
            Crée des sites web avec l&apos;IA. Vends ton savoir-faire.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-8 text-[#aaa59c] sm:text-lg">
            Débutant, déjà expérimenté, futur indépendant, agence ou en reconversion : tu pars de ton niveau pour créer des sites et en tirer des revenus.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f887d]">
              Les accompagnements
            </p>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-5xl">
              Quel résultat veux-tu faire avancer ?
            </h2>
          </div>

          <div className="divide-y divide-white/[0.1] border-y border-white/[0.1]">
            <Link
              href="/accompagnement/site-web"
              className="group grid gap-5 px-1 py-8 transition-colors hover:bg-white/[0.03] sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:px-4"
            >
              <span className="text-sm text-[#e8d5b0]">Site Web</span>
              <span>
                <span className="block text-2xl font-medium tracking-[-0.03em] text-[#f0ede8]">
                  Créer des sites web avec l&apos;IA
                </span>
                <span className="mt-2 block max-w-xl text-sm leading-7 text-[#9c978e]">
                  Les vendre comme prestation ou t&apos;en servir pour lancer et développer ta propre activité.
                </span>
              </span>
              <span className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[#9a7d49] bg-[#e8d5b0] px-4 text-sm font-semibold text-[#0e0e0f] shadow-[0_3px_0_#8b6b38,0_8px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] transition-[transform,box-shadow,background-color] duration-100 group-hover:bg-[#f0dfc0] group-hover:shadow-[0_4px_0_#8b6b38,0_11px_22px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.65)] group-active:translate-y-[2px] group-active:shadow-[0_1px_0_#8b6b38,0_4px_10px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f]">
                Voir l&apos;offre
              </span>
            </Link>

            <div className="grid gap-5 px-1 py-8 opacity-55 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:px-4">
              <span className="text-sm text-[#8f887d]">À venir</span>
              <span>
                <span className="block text-2xl font-medium tracking-[-0.03em] text-[#f0ede8]">
                  D'autres projets arrivent
                </span>
                <span className="mt-2 block max-w-xl text-sm leading-7 text-[#9c978e]">
                  Le sas restera ici pour que chaque accompagnement garde son objectif et son espace.
                </span>
              </span>
              <span className="inline-flex min-h-9 items-center border border-white/10 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#9c978e]">
                Bientôt
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#161618] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f887d]">
              La règle
            </p>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-4xl">
              On commence par le résultat.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-[#aaa59c]">
            <p>
              Pas par l'outil. Pas par une liste de fonctionnalités. Pas par une page à remplir.
            </p>
            <p>
              Tu viens avec un projet. On clarifie ce qu'il doit changer, on construit ce qui sert ce changement, puis on regarde ce que le réel nous apprend.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-[#777169] sm:flex-row sm:items-center sm:justify-between">
          <span>BUILD</span>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="transition-colors hover:text-[#f0ede8]">
              Dashboard
            </Link>
            {user?.email === ADMIN_EMAIL && (
              <Link href="/accompagnement/formateur" className="transition-colors hover:text-[#f0ede8]">
                Formateur
              </Link>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
}
