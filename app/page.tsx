import "@/app/landing.css";
import type { Metadata } from "next";
import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import { DaNav } from "@/components/da/DaNav";
import { DaFooter } from "@/components/da/DaFooter";
import { DaIcon } from "@/components/da/DaIcon";
import { HeroScene } from "@/components/da/HeroScene";
import { LandingBento } from "@/components/da/LandingBento";
import { PricingSection } from "@/components/da/PricingSection";
import { Faq } from "@/components/da/Faq";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { getCheckoutLinks } from "@/lib/checkoutLinks";
import { getSiteOrigin } from "@/lib/siteOrigin";

const PAGE_TITLE = "Ton business avec l'IA, sans prise de tête | BUILD";
const PAGE_DESCRIPTION = "Choisis une piste, construis le dossier et le site qui la présentent avec les skills d'une agence. Sans être ingénieur.";
const SITE_URL = getSiteOrigin();

// Une `openGraph` définie ici remplace celle du layout en entier : on remet donc le site, l'image et la langue.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
    siteName: "BUILD",
    images: [{ url: "/open-graph-build.png", width: 1200, height: 630, alt: "BUILD by Orsayn" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/open-graph-build.png"],
  },
};


const BEFORE = [
  "Tu testes des outils d'IA sans savoir quoi en faire.",
  "Tu vois des projets bien présentés, sans savoir par où commencer.",
  "Tu repars de zéro à chaque projet.",
];
const AFTER = [
  "Tu cadres une offre et le dossier qui l'explique.",
  "Tu construis le site qui la présente avec les skills d'une agence.",
  "Tu as un projet réel à montrer et une méthode pour le refaire.",
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier: string | null = null;
  let accessUnverified = false;
  if (user?.id) {
    // maybeSingle : un profil absent n'est pas une erreur ; une vraie erreur de lecture ne doit jamais ouvrir de carte d'achat.
    const { data: profile, error } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
    accessUnverified = Boolean(error);
    tier = normalizeProfileTier(profile?.tier ?? null);
  }

  const links = getCheckoutLinks(user?.id);
  const loggedIn = Boolean(user);
  const start = loggedIn
    ? { href: "/dashboard", label: "Ouvrir mon espace" }
    : { href: "/login?mode=signup", label: "Commencer gratuitement" };

  return (
    <DaRoot>
      <DaNav loggedIn={loggedIn} />

      <main>
        <section className="hero">
          <div className="wrap hero__txt">
            <h1 className="t-aff t-center">
              Ton business avec l&apos;IA, <span className="mot">sans prise de tête.</span>
            </h1>
            <p className="t-lede t-center">
              Choisis une piste, <span className="whitespace-nowrap">construis le dossier</span> et le site qui la présentent avec les skills d&apos;une agence. Sans&nbsp;être&nbsp;ingénieur.
            </p>
            <div className="hero__act">
              <Link className="btn btn--p" href={start.href}>{start.label}</Link>
              <a className="btn btn--g" href="#prix">Voir les prix</a>
            </div>
          </div>

          <HeroScene />
        </section>

        <section className="sec" id="pourquoi" aria-labelledby="pourquoi-titre">
          <div className="wrap">
            <div className="sec__tete">
              <h2 className="t-1" id="pourquoi-titre">Tu utilises l&apos;IA. Il te manque encore un projet concret.</h2>
              <p className="t-lede">Donne-lui un cadre pour passer de l&apos;idée au livrable.</p>
            </div>
            <div className="cmp">
              <article className="cmp__col">
                <div className="cmp__tete"><span className="pastille">Aujourd&apos;hui</span></div>
                <ul className="cmp__lignes">
                  {BEFORE.map((line) => (
                    <li key={line}><i><DaIcon name="x" /></i><span>{line}</span></li>
                  ))}
                </ul>
              </article>
              <article className="cmp__col cmp__col--apres">
                <div className="cmp__tete"><span className="pastille">Avec BUILD</span></div>
                <ul className="cmp__lignes">
                  {AFTER.map((line) => (
                    <li key={line}><i><DaIcon name="check" /></i><span>{line}</span></li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <LandingBento />

        <PricingSection tier={tier} links={links} id="prix" unverified={accessUnverified} />

        <Faq />

        <section className="final">
          <div className="wrap">
            <h2 className="t-1 t-center">Prêt à <span className="mot">t&apos;y mettre ?</span></h2>
            <p className="t-lede t-center">Le bloc 1 est gratuit.</p>
            <Link className="btn btn--p" href={start.href}>{start.label}</Link>
          </div>
        </section>
      </main>

      <DaFooter loggedIn={loggedIn} />
    </DaRoot>
  );
}
