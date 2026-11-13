import "@/app/landing.css";
import "@/app/ui3.css";
import "./ressources.css";
import type { Metadata } from "next";
import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import { DaNav } from "@/components/da/DaNav";
import { DaFooter } from "@/components/da/DaFooter";
import { DaIcon } from "@/components/da/DaIcon";
import { PricingSection } from "@/components/da/PricingSection";
import { NavBar } from "@/components/NavBar";
import { ResourceCatalog } from "@/components/ressources/ResourceCatalog";
import { SkillSchema } from "@/components/ressources/SkillSchema";
import { UpgradeLadder } from "@/components/ressources/UpgradeLadder";
import { createClient } from "@/lib/supabase/server";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { getCheckoutLinks } from "@/lib/checkoutLinks";
import { getSiteOrigin } from "@/lib/siteOrigin";
import {
  FREE_RESOURCES,
  freeResourceSignupHref,
  getFreeResource,
  normalizeFreeResourceSource,
  type FreeResourceSlug,
} from "@/lib/freeResources";

export const dynamic = "force-dynamic";

const NB = "\u00a0";
const TITLE = "Ressources gratuites pour ton IA | BUILD";
const DESCRIPTION = "Des skills gratuits à copier dans ton IA pour lui donner un nouveau savoir-faire. Tu vois ce qu'ils font avant de t'inscrire.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ressources" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getSiteOrigin()}/ressources`,
    siteName: "BUILD",
    images: [{ url: "/open-graph-build.png", width: 1200, height: 630, alt: "BUILD by Orsayn" }],
    locale: "fr_FR",
    type: "website",
  },
};

const STEPS = [
  ["Télécharge", "Un clic, une fois connecté. Le dossier arrive en .zip."],
  ["Installe", "Copie le dossier dans le dossier de skills de ton IA. Pas de commande à retenir."],
  ["Demande", `Écris « Utilise le skill${NB}SLOP », puis ta demande. Il fait le reste.`],
] as const;

const FAQ = [
  [`C'est vraiment gratuit${NB}?`, "Oui. Le compte est gratuit, les ressources aussi. Pour le workflow vidéo, les générateurs d'images et de vidéos se paient chez leurs fournisseurs, après que ton IA t'a annoncé le prix."],
  [`Avec quelle IA ça marche${NB}?`, "Les skills sont écrits pour Claude. SLOP existe aussi en version à coller dans les instructions de n'importe quelle IA."],
  [`Pourquoi un compte${NB}?`, "Tu retrouves tes téléchargements au même endroit, et le bloc 1 de BUILD est ouvert pour toi. Rien d'autre n'est demandé."],
  [`Puis-je proposer ça à d'autres${NB}?`, "Oui, les skills sont à toi. Faire parler un avatar pour un coach, une marque ou un artisan qui n'a pas le temps de filmer se propose comme un service. L'avatar d'une personne se fait avec son accord écrit."],
  [`Qu'est-ce qui change avec BUILD${NB}?`, "Ces ressources sont des exemples. BUILD t'apprend à construire les tiennes, te donne les skills de l'agence et un parcours en plusieurs blocs, avec un projet réel à la fin."],
] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RessourcesPage({ searchParams }: { searchParams: Promise<{ r?: string | string[]; s?: string | string[] }> }) {
  const params = await searchParams;
  const source = normalizeFreeResourceSource(params.s);
  const highlighted = getFreeResource(first(params.r) ?? "")?.slug ?? null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier: string | null = null;
  let accessUnverified = false;
  const downloaded = new Set<FreeResourceSlug>();
  if (user?.id) {
    const { data: profile, error } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
    accessUnverified = Boolean(error);
    tier = normalizeProfileTier(profile?.tier ?? null);
    // La liste des téléchargements est un confort : si la lecture échoue, la page reste complète.
    const { data: rows } = await supabase.from("free_resource_downloads").select("slug").eq("user_id", user.id);
    for (const row of rows ?? []) {
      const resource = getFreeResource(String(row.slug));
      if (resource) downloaded.add(resource.slug);
    }
  }

  const identity = user ? await navIdentity(user) : null;
  const links = getCheckoutLinks(user?.id);
  const loggedIn = Boolean(user);
  const heroAction = loggedIn
    ? { href: "#ressources", label: "Voir mes ressources" }
    : { href: freeResourceSignupHref(highlighted, source), label: "Créer mon compte gratuit" };

  const content = (
    <main className="rs">
      {loggedIn ? (
        <header className="ui3-page-head">
          <div>
            <h1 className="t-1">Ressources <span className="mot">gratuites.</span></h1>
            <p className="t-lede">Des skills à télécharger. Tout est débloqué avec ton compte.</p>
          </div>
        </header>
      ) : (
        <section className="hero">
          <div className="wrap hero__txt">
            <span className="pastille"><b aria-hidden="true" />Ressources gratuites</span>
            <h1 className="t-aff t-center">
              Donne un nouveau savoir-faire à ton IA, <span className="mot">en copiant un dossier.</span>
            </h1>
            <p className="t-lede t-center">
              Chaque skill est un dossier gratuit. Tu vois ce qu'il fait avant de créer ton compte.
            </p>
            <div className="hero__act">
              <Link className="btn btn--p" href={heroAction.href}>{heroAction.label}</Link>
            </div>
            <SkillSchema />
          </div>
        </section>
      )}

      <section className="sec" id="ressources" aria-labelledby="rs-titre">
        <div className="wrap">
          {!loggedIn ? (
            <div className="sec__tete">
              <h2 className="t-1" id="rs-titre">Tout le catalogue, <span className="mot">gratuit avec un compte.</span></h2>
              <p className="t-lede">Le rendu de chaque skill est visible avant de t'inscrire.</p>
            </div>
          ) : <h2 className="sr" id="rs-titre">Le catalogue</h2>}
          <ResourceCatalog loggedIn={loggedIn} source={source} highlighted={highlighted} downloaded={downloaded} />
        </div>
      </section>

      <section className="sec" aria-labelledby="rs-how">
        <div className="wrap">
          <div className="sec__tete"><h2 className="t-1" id="rs-how">Trois gestes, <span className="mot">pas un de plus.</span></h2></div>
          <ol className="rs-etapes">
            {STEPS.map(([title, text], index) => (
              <li key={title}><span className="rs-num" aria-hidden="true">{index + 1}</span><h3 className="t-3">{title}</h3><p className="t-meta">{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <UpgradeLadder freeCount={FREE_RESOURCES.length} />

      <PricingSection tier={tier} links={links} id="prix" unverified={accessUnverified} lede="Paiement unique, accès à vie. Tu peux commencer par Fondations et passer à LE COFFRE plus tard." />

      <section className="sec" id="faq" aria-labelledby="rs-faq">
        <div className="wrap">
          <div className="sec__tete"><h2 className="t-1" id="rs-faq">Les <span className="mot">questions</span> qu&apos;on nous pose.</h2></div>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}<DaIcon name="plus" /></summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );

  if (loggedIn && identity) {
    return (
      <DaRoot className="da-app has-tabbar">
        <NavBar tier={identity.tier} isAdmin={identity.isAdmin} displayName={identity.displayName} displayEmail={identity.displayEmail} initials={identity.initials} />
        {content}
      </DaRoot>
    );
  }
  return (
    <DaRoot>
      <DaNav loggedIn={loggedIn} homeBase="/" />
      {content}
      <DaFooter loggedIn={loggedIn} />
    </DaRoot>
  );
}
