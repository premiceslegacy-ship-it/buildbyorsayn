import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDot,
  Code2,
  Compass,
  ExternalLink,
  Gauge,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import {
  OUTCOMES,
  PHASES,
  TOOL_LAYERS,
  TRACKS,
} from "@/lib/siteWebAccompagnement";

export const metadata = {
  title: "Site Web by AI : accompagnement 1:1 par Orsayn",
  description:
    "Un accompagnement adaptatif pour concevoir, construire, lancer et capitaliser un site web avec l'IA sans produire un template générique.",
};

const CAL_URL = "https://cal.com/samuel-mbeboura/15min";

const PRINCIPLES = [
  {
    icon: Compass,
    title: "Le jugement avant la génération",
    text: "Tu apprends à décider ce qui doit exister, pour qui et pourquoi avant de demander à un modèle de produire.",
  },
  {
    icon: Layers3,
    title: "Le système avant la page",
    text: "Copy, design, composants, assets, SEO, acquisition et mesure sont reliés. Le site n'est jamais traité comme une image isolée.",
  },
  {
    icon: Workflow,
    title: "La preuve avant la recette",
    text: "Une réussite devient d'abord un pattern candidat. Elle est comparée, testée et bornée avant de devenir une SOP ou un skill.",
  },
];

const DELIVERABLE_GROUPS = [
  {
    label: "Stratégie",
    items: ["Brief et ICP", "Carte des objections", "Copy deck", "Plan d'acquisition"],
  },
  {
    label: "Design",
    items: ["Matrice de références", "DA-SYNTHESIS", "Design system", "Famille d'assets"],
  },
  {
    label: "Produit",
    items: ["Repo GitHub", "Preview", "Site en production", "Rapport de QA"],
  },
  {
    label: "Capital",
    items: ["SOPs candidates", "Skills candidats", "Tests de non-régression", "Suivi 30, 60, 90 jours"],
  },
];

function EditorialMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#d8d1c4]/20 bg-[#f0eadf] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <Image
          src="/orsayn-secondary-anthracite.png"
          alt="Orsayn"
          width={1720}
          height={1480}
          className="h-8 w-9 object-contain"
          priority
        />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#aab9c7]">Orsayn</p>
        <p className="text-sm font-medium text-[#f4efe7]">Site Web by AI</p>
      </div>
    </div>
  );
}

function PrimaryLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const className =
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(222,231,235,0.88))] px-6 py-3 text-sm font-semibold text-[#17202a] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_28px_rgba(5,12,18,0.34)] transition duration-150 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcebf2] focus-visible:ring-offset-4 focus-visible:ring-offset-[#101820] active:translate-y-0";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export default async function AccompagnementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b1117] text-[#f4efe7] selection:bg-[#d4e3ec]/25">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[920px] overflow-hidden">
        <div className="absolute left-1/2 top-[-440px] h-[920px] w-[1200px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle_at_42%_72%,rgba(234,228,205,0.72),rgba(133,175,198,0.44)_26%,rgba(63,100,131,0.22)_46%,transparent_70%)] blur-[30px]" />
        <div className="absolute left-[5%] top-[190px] h-[380px] w-[540px] rounded-[45%] bg-[radial-gradient(circle,rgba(197,210,211,0.28),rgba(105,132,153,0.11)_46%,transparent_68%)] blur-[38px]" />
        <div className="absolute right-[-8%] top-[260px] h-[480px] w-[620px] rounded-[50%] bg-[radial-gradient(circle,rgba(178,194,203,0.25),rgba(79,111,138,0.08)_50%,transparent_70%)] blur-[46px]" />
        <div className="absolute inset-0 opacity-[0.11] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_180_180%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.9%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.42%22/%3E%3C/svg%3E')]" />
      </div>

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <EditorialMark />
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="hidden text-sm text-[#c6d1d8] transition hover:text-white sm:inline-flex">
              Retour à BUILD
            </Link>
          ) : (
            <Link href="/login" className="hidden min-h-11 items-center px-2 text-sm text-[#c6d1d8] transition hover:text-white sm:inline-flex">
              Se connecter
            </Link>
          )}
          <Link
            href={user ? "/accompagnement/espace" : "/login"}
            className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/[0.07] px-4 text-sm font-medium text-[#eef3f4] backdrop-blur-xl transition hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {user ? "Voir l'espace" : "Se connecter à l'espace"}
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-12 lg:pb-32 lg:pt-20">
        <div className="max-w-3xl">
          <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#c3d1d9]">
            Accompagnement 1:1 adaptatif
          </p>
          <h1 className="max-w-[920px] text-balance text-[clamp(3.15rem,8vw,7.2rem)] leading-[0.88] tracking-[-0.055em] text-[#f1ede6] [font-family:'Iowan_Old_Style','Baskerville','Times_New_Roman',serif]">
            Construire un site que l&apos;IA n&apos;aurait pas pu inventer seule.
          </h1>
          <p className="mt-9 max-w-2xl text-pretty text-base leading-8 text-[#b8c2c9] sm:text-lg">
            Tu pars de ton expertise, de ton marché et d&apos;une direction réelle. L&apos;IA accélère l&apos;exécution. Elle ne choisit ni la vérité business, ni le goût, ni la preuve à ta place.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryLink href={CAL_URL} external>Réserver l&apos;appel de cadrage de 15 min</PrimaryLink>
            <p className="max-w-xs text-sm leading-6 text-[#8797a3]">
              Cet appel vérifie le fit. Le diagnostic de 90 minutes vient ensuite si l&apos;accompagnement est pertinent.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:translate-y-12">
          <div className="absolute -inset-10 rounded-full bg-[#c7dbe6]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[34px] border border-white/15 bg-[linear-gradient(145deg,rgba(235,241,242,0.12),rgba(43,62,76,0.28))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl sm:p-7">
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#91a4b1]">La chaîne réelle</p>
                <p className="mt-1 text-sm font-medium text-[#edf1f1]">De l&apos;expertise au capital</p>
              </div>
              <Gauge className="h-5 w-5 text-[#d5e1e6]" strokeWidth={1.5} />
            </div>

            <div className="space-y-3">
              {[
                ["01", "Observer", "Le métier, le marché, les références"],
                ["02", "Décider", "La promesse, le système, les règles"],
                ["03", "Construire", "Le site, les assets, les connexions"],
                ["04", "Mesurer", "Le trafic, les réponses, les erreurs"],
                ["05", "Distiller", "Les SOPs, skills, tests et patterns"],
              ].map(([num, label, detail], index) => (
                <div key={num} className="group grid grid-cols-[36px_1fr] gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#dfe8e9]/10 text-[10px] font-semibold text-[#dbe6e9]">
                      {num}
                    </span>
                    {index < 4 && <div className="h-7 w-px bg-gradient-to-b from-white/20 to-white/5" />}
                  </div>
                  <div className="pb-5 pt-1">
                    <p className="text-sm font-semibold text-[#f2eee7]">{label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#8fa0ab]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-[#dbe5e8]/15 bg-[#eef3f2]/[0.07] p-4">
              <p className="text-xs leading-5 text-[#c8d3d7]">
                Le site est le terrain d&apos;apprentissage. La vraie valeur est la capacité à reproduire le niveau de décision sur le projet suivant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.07] bg-[#0d141b]/78 px-5 py-8 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-b border-white/[0.07] py-5 sm:border-b-0 sm:border-r sm:px-6 last:border-0 first:pl-0">
              <Icon className="mb-4 h-5 w-5 text-[#cbd9df]" strokeWidth={1.5} />
              <h2 className="text-base font-semibold text-[#f0ede6]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#8e9da7]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-12 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8fa8b7]">Adaptatif par preuve</p>
            <h2 className="mt-5 text-4xl leading-[0.98] tracking-[-0.04em] text-[#f1ece4] sm:text-5xl [font-family:'Iowan_Old_Style','Baskerville','Times_New_Roman',serif]">
              Même exigence. Pas le même chemin.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-[#8d9aa3]">
              On ne confond pas personnalisation et improvisation. Les gates restent stables. Le temps passé sur chaque palier dépend de ce que tu peux déjà démontrer.
            </p>
          </div>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {TRACKS.map((track, index) => (
              <article key={track.id} className="grid gap-5 py-8 sm:grid-cols-[62px_1fr] sm:py-10">
                <span className="text-sm tabular-nums text-[#708491]">0{index + 1}</span>
                <div>
                  <h3 className="text-2xl text-[#ece8e1] [font-family:'Iowan_Old_Style','Baskerville',serif]">{track.label}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9aa8b0]">{track.description}</p>
                  <p className="mt-4 flex gap-3 text-sm leading-6 text-[#c5d0d4]">
                    <CircleDot className="mt-0.5 h-4 w-4 flex-none text-[#c8d9e1]" strokeWidth={1.5} />
                    {track.adjustment}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.07] bg-[#edf0eb] text-[#171c20]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5b6c73]">La progression</p>
            <h2 className="mt-5 text-4xl leading-[0.98] tracking-[-0.045em] sm:text-6xl [font-family:'Iowan_Old_Style','Baskerville','Times_New_Roman',serif]">
              Huit semaines de construction. Quatre-vingt-dix jours pour transformer le résultat en système.
            </h2>
          </div>

          <div className="mt-16 border-t border-black/15">
            {PHASES.map((phase, index) => (
              <article key={phase.id} className="grid gap-6 border-b border-black/15 py-8 lg:grid-cols-[72px_210px_1fr_auto] lg:items-start lg:py-9">
                <span className="text-xs tabular-nums text-[#4e5d63]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#53636b]">{phase.marker}</p>
                  <p className="mt-2 text-xs text-[#56656b]">{phase.duration}</p>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#182026]">{phase.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#58676e]">{phase.promise}</p>
                </div>
                <Link
                  href={user
                    ? `/accompagnement/espace#${phase.id}`
                    : `/login?next=${encodeURIComponent("/accompagnement/espace")}&phase=${encodeURIComponent(phase.id)}`}
                  className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-semibold text-[#26343b] underline decoration-black/20 underline-offset-4 transition hover:decoration-black/70"
                >
                  Ouvrir le palier <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8fa8b7]">Écosystème compris, pas récité</p>
            <h2 className="mt-5 max-w-xl text-4xl leading-[1.02] tracking-[-0.04em] text-[#f1ece4] sm:text-5xl [font-family:'Iowan_Old_Style','Baskerville',serif]">
              Tu apprends à choisir la couche qui sert le résultat.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#8d9aa3]">
              GitHub, Vercel, Cloudflare, Supabase, Neon ou un VPS ne sont pas des badges de sérieux. Chaque outil entre parce qu'il remplit un rôle, avec un coût et une frontière compris.
            </p>
          </div>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {TOOL_LAYERS.map((layer, index) => (
              <div key={layer.label} className="grid grid-cols-[44px_110px_1fr] gap-4 py-5 text-sm">
                <span className="text-[#8fa2ac]">0{index + 1}</span>
                <span className="font-semibold text-[#dce5e8]">{layer.label}</span>
                <span className="leading-6 text-[#8798a3]">{layer.tools}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.07] bg-[#101920]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8fa8b7]">Ce que tu gardes</p>
              <h2 className="mt-5 text-4xl leading-[1] tracking-[-0.04em] text-[#f1ece4] sm:text-5xl [font-family:'Iowan_Old_Style','Baskerville',serif]">
                Des livrables, puis les rails pour recommencer.
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {DELIVERABLE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#9db0ba]">{group.label}</p>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#c2cdd2]">
                        <Check className="mt-1 h-3.5 w-3.5 flex-none text-[#d8e5e9]" strokeWidth={1.7} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((outcome, index) => (
              <div key={outcome} className="min-h-36 border-l border-white/12 px-5 py-2">
                <span className="text-xs text-[#91a5af]">0{index + 1}</span>
                <p className="mt-5 text-base leading-7 text-[#e3e7e6]">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8fa8b7]">La vérité commerciale</p>
            <h2 className="mt-5 text-4xl leading-[1.02] tracking-[-0.04em] text-[#f1ece4] [font-family:'Iowan_Old_Style','Baskerville',serif]">
              Le site ne remplace pas l'acquisition.
            </h2>
          </div>
          <div className="grid gap-5 lg:col-span-2 sm:grid-cols-3">
            {[
              { icon: Search, title: "SEO et GEO", text: "Un actif qui mûrit. Pas une promesse de trafic immédiat." },
              { icon: Sparkles, title: "Contenu et preuve", text: "Montrer le travail réel crée la confiance avant le rendez-vous." },
              { icon: Code2, title: "Prospection et Loom", text: "L'abondance vient d'un système de contact ciblé, humain et mesuré." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <Icon className="h-5 w-5 text-[#cbdde3]" strokeWidth={1.5} />
                <h3 className="mt-8 text-base font-semibold text-[#f0ede6]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#8e9da7]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/[0.07] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-4xl">
            <Logo layout="horizontal" className="mb-12" />
            <h2 className="text-balance text-5xl leading-[0.94] tracking-[-0.05em] text-[#f1ece4] sm:text-7xl [font-family:'Iowan_Old_Style','Baskerville','Times_New_Roman',serif]">
              On ne vend pas un site. On construit ta capacité à en livrer d'autres, mieux.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#8f9da6]">
              Le premier échange sert à diagnostiquer le niveau, choisir le projet fil rouge et vérifier si le périmètre est réaliste. Si ce n'est pas le bon accompagnement, on le dira.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <PrimaryLink href={CAL_URL} external>Réserver l&apos;appel de cadrage</PrimaryLink>
            <Link href={user ? "/accompagnement/espace" : "/login"} className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-[#c8d4d9] underline decoration-white/20 underline-offset-4 hover:decoration-white/60">
              {user ? "Explorer le document de suivi" : "Se connecter pour ouvrir le suivi"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.07] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-[#8fa0a8] sm:flex-row sm:items-center sm:justify-between">
          <span>BUILD by Orsayn. Accompagnement Site Web by AI.</span>
          <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Décisions traçables, progression par preuves.</span>
        </div>
      </footer>
    </main>
  );
}
