import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AccompanimentGuidanceAsset } from "@/components/AccompanimentAssets";
import { createClient } from "@/lib/supabase/server";
import {
  ACCOMPANIMENT_ACCESS_STATUSES,
  isAccompanimentAdminUser,
  SITE_WEB_ACCOMPANIMENT_SLUG,
} from "@/lib/accompanimentAccess";

const CAL_URL = "https://cal.com/samuel-mbeboura/point-sur-ton-projet-de-site-web";

export const metadata = {
  title: "Accompagnements | BUILD",
  description: "Des accompagnements 1:1 pour avancer sur un projet, une compétence ou un objectif précis.",
};

type Props = {
  searchParams?: Promise<{ access?: string }>;
};

export default async function AccompagnementPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = isAccompanimentAdminUser(user);
  let hasMemberAccess = false;

  if (user) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: assignment, error } = await supabase
      .from("accompaniment_assignments")
      .select("id")
      .eq("user_id", user.id)
      .eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG)
      .in("status", ACCOMPANIMENT_ACCESS_STATUSES)
      .lte("starts_on", today)
      .or(`ends_on.is.null,ends_on.gte.${today}`)
      .limit(1)
      .maybeSingle();
    hasMemberAccess = Boolean(assignment && !error);
  }

  const memberHref = hasMemberAccess
    ? "/accompagnement/espace"
    : `/login?next=${encodeURIComponent("/accompagnement/espace")}`;

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <header className="border-b border-white/[0.08] px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="/" aria-label="Retour à l'accueil BUILD"><Logo layout="horizontal" hideText={false} /></Link>
          <nav className="flex items-center gap-3 text-sm">
            {isAdmin ? <Link className="text-[#c9b48a] hover:text-[#f0ede8]" href="/accompagnement/formateur">Formateur</Link> : null}
            {user ? <Link className="border border-[#3a3a3e] px-3 py-2 text-[#d8d3c8] hover:border-[#c9b48a]" href={memberHref}>{hasMemberAccess ? "Mon espace" : "Se connecter"}</Link> : null}
          </nav>
        </div>
      </header>

      <section className="border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          {resolvedSearchParams?.access === "restricted" ? (
            <div className="mx-auto mb-10 max-w-2xl border-l-2 border-[#c9b48a] pl-4 text-left text-sm leading-6 text-[#d8d3c8]" role="status">
              Cet espace est réservé aux personnes inscrites. Le formateur ouvre l'accès et définit les thèmes à travailler.
            </div>
          ) : null}
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9b48a]">BUILD · accompagnements</p>
            <h1 className="mt-5 text-4xl font-medium tracking-[-0.04em] sm:text-6xl lg:text-7xl">Un accompagnement 1:1 pour avancer sur ce qui compte.</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#bdb9b0]">
              On part de ta situation pour clarifier l&apos;essentiel et avancer vers une prochaine étape concrète.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a className="build-cta build-cta-primary" href={CAL_URL} target="_blank" rel="noreferrer">Faire le point gratuitement</a>
              <a className="build-cta build-cta-secondary" href="#accompagnements">Choisir un accompagnement</a>
            </div>
            <p className="mt-3 text-sm text-[#8f8b84]">Un appel gratuit pour clarifier le bon point de départ.</p>
          </div>
          <div className="mx-auto mt-14 max-w-6xl"><AccompanimentGuidanceAsset /></div>
        </div>
      </section>

      <section id="accompagnements" className="border-b border-white/[0.08] bg-[#161618] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9b48a]">Choisir</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Choisis l'accompagnement qui correspond à ton projet.</h2>
            <p className="mt-5 text-base leading-7 text-[#bdb9b0]">Chaque accompagnement part d'une situation réelle, avance avec toi et vise une sortie que tu peux utiliser ou vendre.</p>
          </div>

          <div className="mt-12 divide-y divide-white/[0.1] border-y border-white/[0.1]">
            <Link href="/accompagnement/site-web" className="group grid gap-5 py-7 transition hover:bg-white/[0.03] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-10 sm:px-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f8b84]">Disponible</p>
                <h3 className="mt-3 text-2xl font-medium text-[#f0ede8]">Construire et vendre des sites web avec l&apos;IA</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bdb9b0]">Pour passer d'un premier site web réalisé avec l'IA à une offre vendable, un processus de livraison et une activité web qui peut grandir.</p>
              </div>
              <span className="text-sm text-[#e8d5b0] underline decoration-[#c9b48a] underline-offset-4">Voir cet accompagnement <span aria-hidden="true">→</span></span>
            </Link>
            <div className="py-7 text-[#8f8b84] sm:px-4">
              <p className="text-sm text-[#d8d3c8]">D'autres accompagnements arrivent.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start gap-5 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-7 text-[#d8d3c8]">Tu ne sais pas encore lequel choisir ? On part de ta situation, pas d'un parcours imposé.</p>
            <a className="build-cta build-cta-secondary sm:shrink-0" href={CAL_URL} target="_blank" rel="noreferrer">Trouver le bon point de départ</a>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 border-t border-white/[0.08] pt-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9b48a]">Le but</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Ne plus rester seul devant le prochain problème.</h2>
            <p className="mt-5 text-base leading-7 text-[#bdb9b0]">Tu comprends ce qui compte, tu exécutes ce qui a été décidé et tu repars avec une méthode que tu peux continuer à utiliser.</p>
          </div>
          <a className="build-cta build-cta-primary" href={CAL_URL} target="_blank" rel="noreferrer">Faire le point gratuitement</a>
        </div>
      </section>
    </main>
  );
}
