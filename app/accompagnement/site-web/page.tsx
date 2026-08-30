import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { AudienceRoutesAsset, SiteWebOutcomeAsset, ThemeAtlas, WorkCycleAsset } from "@/components/AccompanimentAssets";
import { THEMES, TRACKS } from "@/lib/siteWebAccompagnement";

export const metadata = {
  title: "Site Web | Accompagnement BUILD",
  description:
    "Un accompagnement 1:1 pour créer un site web utile avec l'IA, le mettre en ligne et savoir l'améliorer.",
};

const CAL_URL = "https://cal.com/samuel-mbeboura/15min";
const ADMIN_EMAIL = "mbebourasam@gmail.com";

function PrimaryLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-11 items-center justify-center rounded-[4px] border border-[#9a7d49] bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] shadow-[0_3px_0_#8b6b38,0_8px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] transition-[transform,box-shadow,background-color] duration-100 hover:bg-[#f0dfc0] hover:shadow-[0_4px_0_#8b6b38,0_11px_22px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.65)] active:translate-y-[2px] active:shadow-[0_1px_0_#8b6b38,0_4px_10px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f]";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-white/25 px-5 py-3 text-sm font-semibold text-[#f0ede8] shadow-[0_2px_0_rgba(255,255,255,0.12),0_7px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] transition-[transform,box-shadow,background-color,border-color] duration-100 hover:border-white/45 hover:bg-white/[0.04] hover:shadow-[0_3px_0_rgba(255,255,255,0.14),0_9px_18px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.07)] active:translate-y-[1px] active:shadow-[0_1px_0_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f]"
    >
      {children}
    </Link>
  );
}

export default async function SiteWebOfferPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const spaceHref = user
    ? "/accompagnement/espace"
    : `/login?next=${encodeURIComponent("/accompagnement/espace")}`;

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] selection:bg-[#e8d5b0]/30">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/accompagnement" aria-label="Retour aux accompagnements">
            <Logo layout="horizontal" />
          </Link>
          <nav className="flex items-center gap-5 text-sm" aria-label="Navigation Site Web">
            <Link
              href="/accompagnement"
              className="hidden min-h-11 items-center text-[#a8a39a] transition-colors hover:text-[#f0ede8] sm:inline-flex"
            >
              Tous les accompagnements
            </Link>
            {user?.email === ADMIN_EMAIL && (
              <Link
                href="/accompagnement/formateur"
                className="hidden min-h-11 items-center text-[#e8d5b0] transition-colors hover:text-[#f0dfc0] sm:inline-flex"
              >
                Vue formateur
              </Link>
            )}
            <Link
              href={spaceHref}
              className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-white/25 px-4 text-sm font-semibold text-[#f0ede8] shadow-[0_2px_0_rgba(255,255,255,0.1),0_6px_14px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,box-shadow,background-color,border-color] duration-100 hover:border-white/45 hover:bg-white/[0.04] hover:shadow-[0_3px_0_rgba(255,255,255,0.13),0_8px_16px_rgba(0,0,0,0.22)] active:translate-y-[1px] active:shadow-[0_1px_0_rgba(255,255,255,0.08),0_4px_8px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
            >
              {user ? "Ouvrir l'espace" : "Se connecter"}
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-white/[0.08] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e8d5b0]">
            Accompagnement Site Web
          </p>
          <h1 className="mx-auto mt-7 max-w-5xl text-balance text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-[#f0ede8] sm:text-7xl lg:text-8xl">
            Crée des sites web avec l&apos;IA. Vends ton savoir-faire.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-8 text-[#aaa59c] sm:text-lg">
            Pour une première prestation, une agence à développer, ta propre activité ou une reconversion, tu apprends à produire des sites et à en tirer des revenus.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryLink href={CAL_URL} external>
              Parler du projet
            </PrimaryLink>
            <SecondaryLink href={spaceHref}>Ouvrir l'espace</SecondaryLink>
          </div>
          <p className="mt-5 text-xs text-[#777169]">
            Premier échange de 15 min pour voir si le projet est pertinent.
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#161618] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <AudienceRoutesAsset />
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#161618] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f887d]">Le résultat</p>
              <h2 className="mt-5 max-w-md text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-5xl">
                Tu ne repars pas avec une maquette.
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-[#aaa59c]">
                Le but est simple : utiliser l&apos;IA pour produire des sites et en tirer des revenus.
              </p>
            </div>
            <SiteWebOutcomeAsset />
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f887d]">La façon de travailler</p>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-5xl">
              On choisit, on construit, on regarde.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#aaa59c]">
              Chaque sujet part du projet réel. Si une étape est déjà maîtrisée, on ne la rejoue pas. Si elle bloque le résultat, on la traite ensemble.
            </p>
          </div>
          <div className="mt-14">
            <WorkCycleAsset />
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#f0ede8] px-5 py-20 text-[#0e0e0f] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6e665c]">
                Les sujets
              </p>
              <h2 className="mt-5 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">
                Les thèmes qui font la différence.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#665f56]">
              Pas de calendrier figé. On avance selon le projet et le point de départ.
            </p>
          </div>

          <div className="mt-14">
            <ThemeAtlas themes={THEMES} user={Boolean(user)} />
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f887d]">
              Ton point de départ
            </p>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-5xl">
              Le même objectif. Un chemin adapté.
            </h2>
          </div>
          <div className="mt-14 grid gap-px border border-white/[0.1] bg-white/[0.1] md:grid-cols-3">
            {TRACKS.map((track) => (
              <div key={track.id} className="bg-[#0e0e0f] p-6 sm:p-8">
                <div className="mb-8 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full border border-[#e8d5b0] bg-[#e8d5b0]/20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#777169]">Point de départ</span>
                </div>
                <h3 className="text-xl font-medium tracking-[-0.03em] text-[#f0ede8]">{track.label}</h3>
                <p className="mt-4 text-sm leading-7 text-[#c0bbb1]">{track.description}</p>
                <p className="mt-6 border-t border-white/[0.1] pt-5 text-sm leading-7 text-[#8f887d]">{track.adjustment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#161618] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f887d]">
              Ce qu'on ne fera pas
            </p>
            <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-5xl">
              Pas de technique pour la technique.
            </h2>
          </div>
          <div className="divide-y divide-white/[0.1] border-y border-white/[0.1]">
            {[
              ["Pas de page à remplir", "Chaque partie doit aider à comprendre, décider ou agir."],
              ["Pas d'outil imposé", "On choisit ce qui sert le projet, puis on sait pourquoi."],
              ["Pas de promesse magique", "Le site est relié à des actions et à des mesures que l'on peut regarder."],
            ].map(([title, text]) => (
              <div key={title} className="grid gap-3 py-6 sm:grid-cols-[0.7fr_1.3fr] sm:gap-8">
                <h3 className="text-base font-semibold text-[#f0ede8]">{title}</h3>
                <p className="text-sm leading-7 text-[#9c978e]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <Logo layout="horizontal" className="mx-auto mb-10" />
          <h2 className="text-balance text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-[#f0ede8] sm:text-6xl">
            Crée des sites web avec l&apos;IA. Vends ton savoir-faire.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#aaa59c]">
            Le premier échange sert à comprendre le projet et à vérifier que cet accompagnement est le bon. Si ce n'est pas le cas, on le dira.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryLink href={CAL_URL} external>
              Parler du projet
            </PrimaryLink>
            <SecondaryLink href="/accompagnement">Voir les accompagnements</SecondaryLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-[#777169] sm:flex-row sm:items-center sm:justify-between">
          <span>BUILD</span>
          <span>Accompagnement Site Web</span>
        </div>
      </footer>
    </main>
  );
}
