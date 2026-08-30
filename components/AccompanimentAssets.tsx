import Link from "next/link";
import type { ReactNode } from "react";
import type { AccompanimentTheme } from "@/lib/siteWebAccompagnement";

const softButton =
  "inline-flex min-h-10 items-center justify-center rounded-[3px] border border-[#9a7d49] bg-[#e8d5b0] px-4 text-xs font-bold text-[#15120e] shadow-[0_3px_0_#8b6b38,0_8px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] transition-[transform,box-shadow,background-color] duration-100 hover:bg-[#f0dfc0] active:translate-y-[2px] active:shadow-[0_1px_0_#8b6b38,0_4px_10px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)]";

function SurfaceLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
        dark ? "text-[#746a5a]" : "text-[#e8d5b0]"
      }`}
    >
      {children}
    </span>
  );
}

function ToolLogoRail({ compact = false }: { compact?: boolean }) {
  const tools = [
    { name: "ChatGPT", src: "/brand-logos/openai.svg" },
    { name: "Codex", src: "/brand-logos/openai.svg" },
    { name: "Claude Code", src: "/brand-logos/anthropic.svg" },
    { name: "Stripe", src: "/brand-logos/stripe.svg" },
    { name: "Vercel", src: "/brand-logos/vercel.svg" },
    { name: "Supabase", src: "/brand-logos/supabase.svg" },
  ];

  return (
    <div className={compact ? "mt-6 border-t border-white/[0.1] pt-5" : "border-t border-white/[0.1] px-5 py-5 sm:px-6"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SurfaceLabel>Outils familiers</SurfaceLabel>
          <p className="mt-2 text-xs leading-5 text-[#777169]">Les outils changent. La méthode te reste.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Outils utilisés">
          {tools.map((tool) => (
            <div key={tool.name} className="inline-flex items-center gap-2 border border-white/[0.12] px-2.5 py-2 text-[10px] font-semibold text-[#c2bbae]" role="listitem">
              <span className="flex h-4 w-4 items-center justify-center bg-[#f0ede8] p-0.5">
                <img src={tool.src} alt="" className="h-full w-full object-contain" />
              </span>
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniSitePreview() {
  return (
    <div className="overflow-hidden border border-white/20 bg-[#f0ede8] text-[#1a1713] shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#756d62]">
        <span>atelier / site</span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#c9a86d]" />
      </div>
      <div className="grid gap-5 p-4 sm:grid-cols-[1.1fr_0.9fr] sm:p-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8a7b65]">Une page claire</p>
          <p className="mt-3 max-w-[220px] text-xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-2xl">
            Ton activité mérite mieux qu&apos;une vitrine muette.
          </p>
          <p className="mt-3 max-w-[210px] text-[10px] leading-5 text-[#655f56]">
            Comprendre. Se projeter. Faire le prochain pas.
          </p>
          <span className={`${softButton} mt-5`}>Voir comment</span>
        </div>
        <div className="hidden items-end justify-end sm:flex">
          <div className="h-28 w-24 border border-[#bdab8d] bg-[#d9c8a8] p-2 shadow-[8px_8px_0_#b8a17a]">
            <div className="h-full border border-black/10 bg-[#eee5d4] p-2">
              <div className="h-1 w-8 bg-[#1a1713]/70" />
              <div className="mt-3 h-1 w-12 bg-[#1a1713]/20" />
              <div className="mt-1 h-1 w-9 bg-[#1a1713]/20" />
              <div className="mt-7 h-7 w-full border border-[#8d744e]/50 bg-[#c9a86d]/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuildCreationAsset() {
  const stages = [
    { label: "Cadrer", text: "L'IA reçoit le bon contexte." },
    { label: "Construire", text: "Tu produis un site livrable." },
    { label: "Monétiser", text: "Tu le vends ou tu l'utilises pour ton activité." },
  ];

  return (
    <div className="relative overflow-hidden border border-white/[0.12] bg-[#121213] shadow-[0_22px_50px_rgba(0,0,0,0.32)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.1] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#e8d5b0] shadow-[0_0_0_3px_rgba(232,213,176,0.1)]" />
          <SurfaceLabel>Atelier de construction</SurfaceLabel>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#777169]">Projet réel / version 04</span>
      </div>

      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-white/[0.1] p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <SurfaceLabel>Brief de départ</SurfaceLabel>
            <span className="text-[10px] text-[#8ed39f]">compris</span>
          </div>
          <p className="mt-6 max-w-sm text-2xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8]">
            Créer un site que tu peux vendre à un client ou utiliser pour ta propre activité.
          </p>
          <div className="mt-7 border-l border-[#e8d5b0]/50 pl-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f887d]">Contexte gardé</p>
            <p className="mt-2 text-sm leading-6 text-[#aaa59c]">
              Activité, client, offre, message, contraintes et action attendue.
            </p>
          </div>
          <div className="mt-7 flex items-center justify-between border-t border-white/[0.1] pt-4 text-xs text-[#777169]">
            <span>Ce que l&apos;IA doit savoir</span>
            <span className="text-[#e8d5b0]">5 éléments</span>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <SurfaceLabel>Page construite</SurfaceLabel>
            <span className="border border-[#e8d5b0]/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]">à relire</span>
          </div>
          <div className="mt-6">
            <MiniSitePreview />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.13em] text-[#777169]">
            <div className="border-t border-[#e8d5b0]/60 pt-2">Message</div>
            <div className="border-t border-white/15 pt-2">Page</div>
            <div className="border-t border-white/15 pt-2">Action</div>
          </div>
        </div>
      </div>

      <div className="grid border-t border-white/[0.1] sm:grid-cols-3 sm:divide-x sm:divide-white/[0.1]">
        {stages.map((stage) => (
          <div key={stage.label} className="border-b border-white/[0.1] px-5 py-4 last:border-0 sm:border-b-0 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e8d5b0]">{stage.label}</p>
            <p className="mt-2 text-xs leading-5 text-[#8f887d]">{stage.text}</p>
          </div>
        ))}
      </div>
      <ToolLogoRail />
    </div>
  );
}

export function SiteWebOutcomeAsset() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
      <div className="border border-black/15 bg-[#e8e2d6] p-4 text-[#171513] shadow-[10px_10px_0_rgba(195,179,149,0.45)] sm:p-6">
        <div className="flex items-center justify-between border-b border-black/15 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#786e60]">Version construite</span>
          <span className="text-[10px] text-[#786e60]">site / accueil</span>
        </div>
        <div className="mt-6 grid gap-7 sm:grid-cols-[1fr_0.6fr] sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#90734b]">Le bon message, au bon endroit</p>
            <h3 className="mt-3 max-w-md text-3xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-4xl">
              Un site à vendre ou à utiliser.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#655f56]">
              L&apos;IA accélère la production. Toi, tu construis une prestation claire ou un site utile à ta propre activité.
            </p>
            <span className={`${softButton} mt-6`}>Faire le prochain pas</span>
          </div>
          <div className="border-l border-black/15 pl-4 text-xs leading-6 text-[#655f56]">
            <div className="flex items-center justify-between border-b border-black/10 pb-2">
              <span>Offre</span><span className="text-[#171513]">vendable</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/10 py-2">
              <span>Site</span><span className="text-[#171513]">livrable</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span>Suite</span><span className="text-[#171513]">mesurable</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-white/[0.12] bg-[#121213] p-5 shadow-[0_18px_35px_rgba(0,0,0,0.24)] sm:p-6">
        <SurfaceLabel>Ce que tu gardes</SurfaceLabel>
        <div className="mt-7 space-y-5">
          <div className="flex gap-3 border-b border-white/[0.1] pb-5">
            <span className="mt-1 h-2 w-2 flex-none rounded-full border border-[#e8d5b0]" />
            <div>
              <p className="text-sm font-semibold text-[#f0ede8]">Produire</p>
              <p className="mt-1 text-xs leading-5 text-[#8f887d]">Tu sais construire un site sans dépendre d&apos;un copier-coller aveugle.</p>
            </div>
          </div>
          <div className="flex gap-3 border-b border-white/[0.1] pb-5">
            <span className="mt-1 h-2 w-2 flex-none rounded-full border border-[#e8d5b0]" />
            <div>
              <p className="text-sm font-semibold text-[#f0ede8]">Vendre</p>
              <p className="mt-1 text-xs leading-5 text-[#8f887d]">Tu peux présenter le site comme une prestation claire.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-1 h-2 w-2 flex-none rounded-full border border-[#e8d5b0]" />
            <div>
              <p className="text-sm font-semibold text-[#f0ede8]">Développer</p>
              <p className="mt-1 text-xs leading-5 text-[#8f887d]">Tu peux améliorer ta production, ton agence ou ta propre activité.</p>
            </div>
          </div>
        </div>
        <ToolLogoRail compact />
      </div>
    </div>
  );
}

export function WorkCycleAsset() {
  const stages = [
    { label: "Cadrer", text: "Donner le contexte, l'objectif et les limites." },
    { label: "Construire", text: "Faire produire une vraie partie du site." },
    { label: "Relire", text: "Corriger, tester et garder ce qui sert." },
  ];

  return (
    <div className="border border-white/[0.12] bg-[#121213] shadow-[0_18px_35px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.1] px-5 py-5 sm:px-7">
        <div>
          <SurfaceLabel>Le cycle</SurfaceLabel>
          <h3 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-[#f0ede8] sm:text-3xl">
            L&apos;IA produit. Tu décides.
          </h3>
        </div>
        <p className="max-w-xs text-xs leading-5 text-[#777169]">Chaque passage rend le site plus utile, pas seulement plus rempli.</p>
      </div>
      <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-white/[0.1]">
        {stages.map((stage, index) => (
          <div key={stage.label} className="relative border-b border-white/[0.1] px-5 py-6 last:border-0 sm:border-b-0 sm:px-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full border border-[#e8d5b0] bg-[#e8d5b0]/20" />
              {index < stages.length - 1 && <span className="hidden h-px flex-1 bg-white/[0.12] sm:block" />}
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#e8d5b0]">{stage.label}</p>
            <p className="mt-4 max-w-[210px] text-sm leading-6 text-[#aaa59c]">{stage.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AudienceRoutesAsset() {
  const routes = [
    {
      label: "Je démarre",
      title: "Passer de zéro à un site livrable",
      text: "Comprendre les bases, construire une première page et apprendre à la proposer.",
      outcome: "Une première prestation à vendre",
    },
    {
      label: "J'ai déjà de l'expérience",
      title: "Gagner en vitesse sans perdre la qualité",
      text: "Structurer ta façon de travailler pour produire mieux et plus régulièrement.",
      outcome: "Une production plus fiable",
    },
    {
      label: "Je lance mon activité",
      title: "Créer le site qui porte ton offre",
      text: "Transformer ton savoir-faire en présence claire et en support pour tes premières ventes.",
      outcome: "Un actif pour présenter ton offre",
    },
    {
      label: "Je développe une agence",
      title: "Faire produire une équipe",
      text: "Partager les règles, les rôles et les méthodes qui permettent de livrer sans tout garder dans ta tête.",
      outcome: "Un système transmissible",
    },
    {
      label: "Je me reconvertis",
      title: "Construire un nouveau métier",
      text: "Apprendre par un projet réel et repartir avec une offre que tu peux expliquer et montrer.",
      outcome: "Une base pour changer d'activité",
    },
  ];

  return (
    <div className="overflow-hidden border border-white/[0.12] bg-[#121213] shadow-[0_22px_50px_rgba(0,0,0,0.32)]">
      <div className="border-b border-white/[0.1] px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <SurfaceLabel>Les points de départ</SurfaceLabel>
            <h3 className="mt-3 max-w-2xl text-2xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-4xl">
              Même savoir-faire. Départ différent.
            </h3>
          </div>
          <p className="max-w-sm text-xs leading-5 text-[#777169]">
            Le but ne change pas : produire des sites avec l&apos;IA et en tirer des revenus.
          </p>
        </div>
      </div>
      <div className="grid gap-px bg-white/[0.1] md:grid-cols-2">
        {routes.map((route, index) => (
          <div
            key={route.label}
            className={`bg-[#121213] p-5 sm:p-7 ${index === routes.length - 1 ? "md:col-span-2" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full border border-[#e8d5b0] bg-[#e8d5b0]/20" />
              <SurfaceLabel>{route.label}</SurfaceLabel>
            </div>
            <h4 className="mt-7 max-w-md text-xl font-medium tracking-[-0.03em] text-[#f0ede8]">{route.title}</h4>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#aaa59c]">{route.text}</p>
            <p className="mt-6 border-t border-white/[0.1] pt-4 text-xs font-semibold uppercase tracking-[0.13em] text-[#e8d5b0]">
              Sortie : <span className="text-[#c2bbae]">{route.outcome}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeAtlas({ themes, user }: { themes: AccompanimentTheme[]; user: boolean }) {
  return (
    <div className="relative overflow-hidden border border-black/15 bg-[#e8e2d6] text-[#171513] shadow-[10px_10px_0_rgba(195,179,149,0.45)]">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-black/15 px-5 py-6 sm:px-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#786e60]">Le fil du projet</p>
          <h3 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
            De l&apos;idée à un site qui travaille.
          </h3>
        </div>
        <p className="max-w-xs text-xs leading-5 text-[#655f56]">Les thèmes se suivent selon le projet, pas selon un calendrier imposé.</p>
      </div>

      <div className="grid gap-px bg-black/15 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme, index) => {
          const href = user
            ? `/accompagnement/espace#${theme.id}`
            : `/login?next=${encodeURIComponent("/accompagnement/espace")}&phase=${encodeURIComponent(theme.id)}`;
          return (
            <Link
              key={theme.id}
              href={href}
              className="group relative min-h-[205px] bg-[#e8e2d6] p-5 transition-colors hover:bg-[#f1ece3] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b6b38] focus-visible:ring-inset sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="h-2.5 w-2.5 rounded-full border border-[#9a7d49] bg-[#c9a86d] shadow-[0_0_0_3px_rgba(154,125,73,0.12)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#786e60]">{index === 0 ? "Départ" : index === themes.length - 1 ? "Suite" : "À travailler"}</span>
              </div>
              <h4 className="mt-8 max-w-[250px] text-xl font-semibold leading-tight tracking-[-0.035em]">{theme.title}</h4>
              <p className="mt-3 max-w-[280px] text-sm leading-6 text-[#655f56]">{theme.promise}</p>
              <span className="absolute bottom-5 left-5 text-xs font-bold underline decoration-black/25 underline-offset-4 transition-colors group-hover:decoration-black sm:bottom-6 sm:left-6">
                Ouvrir le thème
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
