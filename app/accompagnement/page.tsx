import Link from "next/link";
import { AccompanimentGuidanceAsset } from "@/components/AccompanimentAssets";
import { createClient } from "@/lib/supabase/server";
import {
  ACCOMPANIMENT_ACCESS_STATUSES,
  isAccompanimentAdminUser,
  SITE_WEB_ACCOMPANIMENT_SLUG,
} from "@/lib/accompanimentAccess";
import { ACCOMPAGNEMENTS, ACCOMPANIMENT_CAL_URL } from "@/lib/accompagnements";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { IllustratedCardGrid } from "@/components/ui/illustrated-card-grid";
import { illustrationSrc } from "@/lib/illustrations";
import { NavBar } from "@/components/NavBar";
import { navIdentity } from "@/lib/auth/navIdentity.server";

const CAL_URL = ACCOMPANIMENT_CAL_URL;

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

  const identity = await navIdentity();

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <NavBar
        activeLink="accompagnement"
        tier={identity?.tier ?? null}
        displayName={identity?.displayName}
        displayEmail={identity?.displayEmail}
        initials={identity?.initials}
      />

      {(isAdmin || (user && hasMemberAccess)) && (
        <div className="border-b border-white/[0.08] px-5 py-2.5 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 text-sm">
            {isAdmin ? <Link className="text-[#c9b48a] hover:text-[#f0ede8]" href="/accompagnement/formateur">Formateur</Link> : null}
            {user && hasMemberAccess ? <Link className="text-[#d8d3c8] hover:text-[#c9b48a]" href={memberHref}>Mon espace</Link> : null}
          </div>
        </div>
      )}

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

          <div className="mt-12">
            <IllustratedCardGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {ACCOMPAGNEMENTS.map((item) =>
                item.status === "available" && item.href ? (
                  <IllustratedCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    imageSrc={illustrationSrc(`accompagnement-${item.id}`)}
                    href={item.href}
                    badge={{ label: "Disponible", tone: "success" }}
                  />
                ) : (
                  <IllustratedCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    locked
                    badge={{ label: "Bientôt", tone: "default" }}
                  />
                )
              )}
            </IllustratedCardGrid>
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
