import "@/app/landing.css";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import { DaNav } from "@/components/da/DaNav";
import { DaFooter } from "@/components/da/DaFooter";
import { DaIcon } from "@/components/da/DaIcon";
import { Tile, type TileLogo } from "@/components/da/Tile";
import { LandingBento } from "@/components/da/LandingBento";
import { PricingSection } from "@/components/da/PricingSection";
import { Faq } from "@/components/da/Faq";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { getCheckoutLinks } from "@/lib/checkoutLinks";
import { MEMBERS_COUNT } from "@/lib/siteFacts";

const PAGE_TITLE = "Ton business avec l'IA, sans prise de tête | BUILD by Orsayn";
const PAGE_DESCRIPTION = "Trouve quoi vendre, construis-le avec les skills d'une agence, puis vends-le. Sans être ingénieur.";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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

const FACES = ["femme", "homme", "mamie", "souriant"] as const;

type SceneTile = { logo: TileLogo; size: "xl" | "l" | "m" | "s"; x: string; y: string; dur: string; del?: string; ent: string };
const SCENE_TILES: SceneTile[] = [
  { logo: "build", size: "xl", x: "50%", y: "50%", dur: "8s", ent: ".1s" },
  { logo: "claude", size: "l", x: "21%", y: "26%", dur: "7s", del: "-1s", ent: ".25s" },
  { logo: "openai", size: "l", x: "80%", y: "24%", dur: "9s", del: "-3s", ent: ".35s" },
  { logo: "hermes", size: "l", x: "13%", y: "72%", dur: "8s", del: "-2s", ent: ".45s" },
  { logo: "stripe", size: "m", x: "85%", y: "70%", dur: "7.5s", del: "-4s", ent: ".55s" },
  { logo: "cursor", size: "s", x: "34%", y: "88%", dur: "6.5s", del: "-2.5s", ent: ".65s" },
  { logo: "supabase", size: "s", x: "66%", y: "90%", dur: "7s", del: "-5s", ent: ".75s" },
];

const SCENE_CHIPS = [
  { label: "Offre trouvée", x: "36%", y: "11%", dur: "8s", del: "-2s", ent: ".9s" },
  { label: "Site livré", x: "67%", y: "9%", dur: "9s", del: "-4s", ent: "1s" },
  { label: "Premier client", x: "50%", y: "80%", dur: "8.5s", del: "-1s", ent: "1.1s" },
];

function motion(t: { x: string; y: string; dur: string; del?: string; ent: string }): CSSProperties {
  return { "--x": t.x, "--y": t.y, "--dur": t.dur, "--del": t.del, "--ent": t.ent } as CSSProperties;
}

const BEFORE = [
  "Tu testes des outils d'IA sans savoir quoi en vendre.",
  "Tu vois d'autres en vivre, sans savoir par où commencer.",
  "Tu repars de zéro à chaque projet.",
];
const AFTER = [
  "Tu sais quoi vendre, à qui et à quel prix.",
  "Tu construis avec les skills d'une agence.",
  "Tu as un projet réel à montrer et une méthode pour le refaire.",
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier: string | null = null;
  if (user?.id) {
    const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user.id).single();
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
              Trouve quoi vendre, <span className="whitespace-nowrap">construis-le</span> avec les skills d&apos;une agence, puis <span className="whitespace-nowrap">vends-le</span>. Sans&nbsp;être&nbsp;ingénieur.
            </p>
            <div className="hero__act">
              <Link className="btn btn--p" href={start.href}>{start.label}</Link>
              <a className="btn btn--g" href="#prix">Voir les prix</a>
            </div>
            <p className="preuve">
              + de <b>{MEMBERS_COUNT}</b>
              <span className="visages" aria-hidden="true">
                {FACES.map((face) => (
                  <span className="visage" key={face}>
                    <Image src={`/da/memoji/${face}.png`} alt="" width={120} height={120} sizes="34px" loading="eager" />
                  </span>
                ))}
              </span>
              builders
            </p>
          </div>

          <div className="scene" aria-hidden="true">
            <span className="halo" /><span className="anneau" /><span className="anneau anneau--2" />
            {SCENE_TILES.map((t) => (
              <Tile key={t.logo} logo={t.logo} className={`tuile--${t.size}`} style={motion(t)} />
            ))}
            {SCENE_CHIPS.map((c) => (
              <span className="puce verre" style={motion(c)} key={c.label}>
                <i><DaIcon name="check" /></i>{c.label}
              </span>
            ))}
          </div>
        </section>

        <section className="sec" id="pourquoi" aria-labelledby="pourquoi-titre">
          <div className="wrap">
            <div className="sec__tete">
              <h2 className="t-1" id="pourquoi-titre">Tu utilises l&apos;IA. Elle ne te rapporte pas encore.</h2>
              <p className="t-lede">Il manque le business autour.</p>
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

        <PricingSection tier={tier} links={links} id="prix" />

        <Faq />

        <section className="final">
          <div className="wrap">
            <h2 className="t-1 t-center">Prêt à <span className="mot">t&apos;y mettre ?</span></h2>
            <p className="t-lede t-center">Le bloc 1 est gratuit.</p>
            <Link className="btn btn--p" href={start.href}>{start.label}</Link>
          </div>
        </section>
      </main>

      <DaFooter />
    </DaRoot>
  );
}
