import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MethodToolsAsset, StartingPointAsset, ThemeAtlas } from "@/components/AccompanimentAssets";
import { createClient } from "@/lib/supabase/server";
import {
  ACCOMPANIMENT_ACCESS_STATUSES,
  isAccompanimentAdminUser,
  SITE_WEB_ACCOMPANIMENT_SLUG,
} from "@/lib/accompanimentAccess";
import { THEMES } from "@/lib/siteWebAccompagnement";
import { ACCOMPANIMENT_CAL_URL } from "@/lib/accompagnements";

const CAL_URL = ACCOMPANIMENT_CAL_URL;

export const metadata = {
  title: "Vendre des sites web avec l&apos;IA | BUILD",
  description: "Vendre des sites web créés avec l&apos;IA et structurer une activité qui peut grandir.",
};

export default async function SiteWebAccompagnementPage() {
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

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <header className="border-b border-white/[0.08] px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="/accompagnement" aria-label="Retour aux accompagnements"><Logo layout="horizontal" hideText={false} /></Link>
          <nav className="flex items-center gap-4 text-sm">
            {isAdmin ? <Link className="text-[#c9b48a] hover:text-[#f0ede8]" href="/accompagnement/formateur">Formateur</Link> : null}
            {hasMemberAccess ? <Link className="border border-[#3a3a3e] px-3 py-2 text-[#d8d3c8] hover:border-[#c9b48a]" href="/accompagnement/espace">Espace membre</Link> : null}
          </nav>
        </div>
      </header>

      <section className="border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9b48a]">BUILD · accompagnement sites web</p>
            <h1 className="mt-5 text-4xl font-medium tracking-[-0.04em] sm:text-6xl lg:text-7xl">Produis et vends plus de sites web avec l&apos;IA.</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#bdb9b0]">L&apos;accompagnement t&apos;apprend à utiliser l&apos;IA comme une équipe de développeurs à portée de main : cadrer une offre, produire avec la bonne méthode, livrer plus vite et structurer une activité web qui peut grandir.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a className="build-cta build-cta-primary" href={CAL_URL} target="_blank" rel="noreferrer">Faire le point gratuitement</a>
              <a className="build-cta build-cta-secondary" href="#themes">Voir les thèmes</a>
            </div>
            <p className="mt-3 text-sm text-[#8f8b84]">Un premier échange pour trouver le prochain levier : offre, production ou vente.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#161618] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9b48a]">Un accompagnement vraiment 1:1</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Je pars de ton niveau, pas d&apos;un programme figé.</h2>
            <p className="mt-5 text-base leading-7 text-[#bdb9b0]">Que tu partes d&apos;une idée, que tu produises déjà des assets ou que tu veuilles professionnaliser ta façon de vendre et de livrer, l&apos;accompagnement s&apos;adapte à ce que tu sais déjà.</p>
            <p className="mt-4 text-base leading-7 text-[#bdb9b0]">On travaille sur ce qu&apos;il te manque pour passer de ton niveau actuel à une offre claire, un livrable utile et une activité capable de progresser.</p>
          </div>
          <div className="mt-10 max-w-6xl"><StartingPointAsset /></div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9b48a]">Une méthode, plusieurs outils</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Les outils changent. La méthode reste.</h2>
            <p className="mt-5 text-base leading-7 text-[#bdb9b0]">Les outils sont des briques. BUILD t&apos;apprend à les orchestrer pour vendre des sites web, produire plus vite, livrer proprement et faire grandir l&apos;activité sans dépendre d&apos;un seul outil.</p>
          </div>
          <div className="mt-10 max-w-6xl"><MethodToolsAsset /></div>
          <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-white/[0.08] pt-8">
            <p className="max-w-xl text-base leading-7 text-[#d8d3c8]">Tu veux savoir quel levier débloquer en premier ?</p>
            <a className="build-cta build-cta-secondary" href={CAL_URL} target="_blank" rel="noreferrer">Trouver le bon point de départ</a>
          </div>
        </div>
      </section>

      <section id="themes" className="bg-[#eee8dc] px-5 py-16 text-[#171719] sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#80652f]">Ce que tu apprends</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Les thèmes qui font la différence.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#5f594e]">Pas une liste de tâches. Les compétences qui te permettent de continuer seul.</p>
          </div>
          <div className="mt-10"><ThemeAtlas themes={THEMES} user={Boolean(user)} memberAccess={hasMemberAccess} /></div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 border-t border-white/[0.08] pt-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9b48a]">Passer à l'action</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Ne reste pas seul devant le prochain cap de ton activité.</h2>
            <p className="mt-5 text-base leading-7 text-[#bdb9b0]">On regarde ton niveau, les sites web que tu veux vendre, ton système actuel et le prochain levier utile pour progresser.</p>
          </div>
          <a className="build-cta build-cta-primary" href={CAL_URL} target="_blank" rel="noreferrer">Faire le point gratuitement</a>
        </div>
      </section>
    </main>
  );
}
