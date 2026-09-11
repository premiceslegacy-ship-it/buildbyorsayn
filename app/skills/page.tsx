"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, FileText, FolderSearch, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { SKILLS_CATALOG, SKILL_CATEGORY_LABELS, type SkillCategory } from "@/lib/skillsCatalog";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { SkillsFreshness } from "@/components/SkillsFreshness";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_PRICE } from "@/lib/pricing";

const SKILL_USAGE_STEPS = [
  {
    title: "1. Donne ton contexte",
    body: "Explique ton marché, ton client, ton offre, ta stack, ton niveau et ton objectif. Un skill devient puissant quand il comprend ton terrain.",
  },
  {
    title: "2. Remplace les références",
    body: "Les références Orsayn sont une base. Tu peux demander à l'IA de les remplacer par tes marques, screenshots, assets, couleurs et contraintes.",
  },
  {
    title: "3. Fais-le évoluer",
    body: "Après chaque projet, ajoute tes règles, erreurs fréquentes, prompts utiles et standards. Ton skill devient ton système de travail.",
  },
];

const SKILL_USAGE_TOOLS = [
  {
    name: "Claude Code",
    logo: "/brand-logos/claude-code.svg",
    body: "CLI agentique, accès terminal et navigation web - le plus complet pour enchaîner les skills.",
  },
  {
    name: "Hermes Agent (Nous Research)",
    logo: "/brand-logos/hermes-agent.png",
    body: "Agent capable de naviguer le web pour enrichir la recherche marché et la veille concurrentielle.",
  },
  {
    name: "ChatGPT",
    logo: "/brand-logos/chatgpt.svg",
    body: "Fonctionne bien pour cadrer et rédiger, moins pour l'exécution technique en autonomie.",
  },
  {
    name: "Codex",
    logo: "/brand-logos/codex.svg",
    body: "CLI, application desktop et extension IDE - même session, même configuration partout, solide pour la partie build des skills techniques.",
  },
];

const SKILL_METHOD_STEPS = [
  {
    step: "01",
    title: "Décompose",
    body: "Prends le résultat visé (site qui vend, SaaS, campagne ads) et liste les sous-métiers qui y contribuent. Un site qui vend = copywriter + UI + UX + CRO + SEO + performance + sécurité. Sept métiers, pas un.",
  },
  {
    step: "02",
    title: "Chasse l'expertise",
    body: "Sous-domaine par sous-domaine : ta propre pratique et ta data, ou celle des meilleurs praticiens mesurés (Protocole Zéro appliqué aux skills). Benchmarks chiffrés, frameworks prouvés, jamais de généralités.",
  },
  {
    step: "03",
    title: "Formalise",
    body: "Chaque sous-domaine devient des règles, des chiffres qui tranchent, des critères de décision et des interdits. Pas \"sois un bon copywriter\" - mais \"CTA 4 mots max, orienté bénéfice, première personne\".",
  },
  {
    step: "04",
    title: "Chaîne",
    body: "Les skills s'articulent dans l'ordre de production réel : la recherche nourrit le cadrage, le cadrage nourrit le design, le design nourrit la landing page. Un système, pas une collection.",
  },
];

const SKILL_METHOD_EXAMPLES = [
  {
    skill: "Deep Research Verticale",
    body: "Décomposition du métier d'analyste marché : Schwartz (conscience), Hormozi (offre), Wiebe (langage client), ad libraries publiques (angles prouvés par l'argent dépensé).",
  },
  {
    skill: "ORACLE by Orsayn",
    body: "Décomposition du métier de product manager : positionnement (Dunford), JTBD, PRD des meilleures équipes produit, benchmarks d'activation et de monétisation.",
  },
  {
    skill: "UX/UI Design",
    body: "Décomposition du métier de directeur artistique : taxonomie des styles, extraction de pattern mesurée, protocole anti AI-slop, systèmes d'icônes et tokens.",
  },
  {
    skill: "Backend Orsayn",
    body: "Décomposition de la sécurité et de l'infra en 7 sous-métiers (RLS, API, agents IA, webhooks, perf, conformité, migration) : un sous-skill chacun, mapping OWASP.",
  },
  {
    skill: "ORACLE Site Web",
    body: "Décomposition du site qui vend en 10 sous-domaines : copy et CTA, arborescence, preuve sociale, psychologie de conversion, formulaires, SEO/GEO, performance, mesure.",
  },
];

const SKILL_WORKFLOW = [
  {
    step: "01",
    title: "Deep Research Verticale",
    body: "Tu choisis une niche. Le skill sort la vraie data du marché : douleurs à 3 niveaux, personas, concurrents, et les angles publicitaires que le marché paie déjà pour diffuser (Meta, TikTok, Google, LinkedIn). Tu sais si la niche mérite d'être attaquée avant d'écrire une ligne de code.",
  },
  {
    step: "02",
    title: "ORACLE by Orsayn",
    body: "Il prend ta recherche marché comme entrée, cadre le produit avec toi en langage simple, puis délègue automatiquement l'UX/UI et le backend aux bons skills. Tu ressors avec les documents qui bloquent tout code prématuré.",
  },
  {
    step: "03",
    title: "UX/UI Design",
    body: "Envoie des sites, images ou interfaces de référence. Le skill observe leurs choix, distingue les mesures des hypothèses, puis construit une direction adaptée à ton projet : structure, copywriting, tokens, icônes et états réels.",
  },
  {
    step: "04",
    title: "Backend Orsayn",
    body: "Le skill qui empêche ton produit d'exposer les données de tes clients. RLS, validation, sécurité des agents IA, webhooks, performance : il audite l'existant ou construit le neuf, un plan validé avant chaque bloc de code.",
  },
  {
    step: "05",
    title: "ORACLE Site Web",
    body: "Une fois le produit prêt, ce skill écrit la landing page à partir de la recherche marché et du design system du produit : même famille visuelle, copy qui vient des vraies objections du marché, pas de l'imagination.",
  },
];

const SKILL_PROMPTS = [
  {
    skill: "Deep Research Verticale",
    role: "Analyse une niche avec de la vraie data marché - douleurs, personas, concurrents, angles publicitaires prouvés - avant de construire quoi que ce soit.",
    prompt: "Charge le fichier 10_PROMPT_UTILISATION_SIMPLE.md, remplis NICHE = \"[ta niche]\" et lance l'analyse complète : marché, personas, psychologie d'achat, concurrents et angles publicitaires réels.",
  },
  {
    skill: "ORACLE by Orsayn",
    role: "Cadre un produit en langage simple : interview, documents fondateurs, décisions avant le code, puis stratégie GTM et acquisition adaptée au projet.",
    prompt: "Voici ma recherche deep-research-vertical sur [niche] (ou dis-le si tu n'en as pas encore). Cadre mon projet [type de produit] avec ORACLE by Orsayn.",
  },
  {
    skill: "UX/UI Design",
    role: "Construit la direction artistique et le design system de n'importe quel projet, à partir de tes références ou d'un style que tu choisis - zéro rendu générique.",
    prompt: "Voici mes références [captures/sites], ou dis-moi si je n'ai pas de préférence : recommande-moi un style. Construis la DA et le design system de [mon projet].",
  },
  {
    skill: "Backend Orsayn",
    role: "Audite ou construit un backend complet - auth, RLS, API, sécurité, performance - avec un plan validé avant chaque bloc de code.",
    prompt: "Audite la sécurité de mon backend [Supabase/Next.js] : RLS, validation des inputs, webhooks, permissions. Classe chaque écart critique/important/mineur.",
  },
  {
    skill: "ORACLE Site Web",
    role: "Construit une landing page ou un site qui convertit : copy orienté bénéfice, structure, SEO/GEO, performance Lighthouse 100.",
    prompt: "Mon produit est cadré avec ORACLE by Orsayn. Construis la landing page à partir du BRIEF, du DESIGN-SYSTEM et de la recherche marché associée.",
  },
];

export default function SkillsPage() {
  const [tier, setTier] = useState<string | null | "loading">("loading");
  const [checkoutHref, setCheckoutHref] = useState("/checkout");
  const [beginnerHref, setBeginnerHref] = useState("/checkout");
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "all">("all");

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTier(null);
        return;
      }

      const [{ data: profile }, urls] = await Promise.all([
        supabase.from("profiles").select("tier").eq("id", user.id).single(),
        getCheckoutUrls(),
      ]);

      const userTier = profile?.tier ?? null;
      const targetUrl =
        userTier === "beginner"
          ? urls.upgrade ?? urls.full
          : urls.full;
      const targetBeginnerUrl = urls.beginner ?? urls.full;

      setTier(userTier);
      setCheckoutHref(`${targetUrl}?client_reference_id=${user.id}`);
      setBeginnerHref(`${targetBeginnerUrl}?client_reference_id=${user.id}`);
    };

    fetchProfile();
  }, []);

  const isLoading = tier === "loading";

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 relative z-10">
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au système
          </Link>
        </div>

        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
            Bibliothèque
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0ede8]">
            Skills
          </h1>
          <p className="text-white/50 text-[17px] mt-4 max-w-2xl leading-relaxed">
            Ce sont les skills que j'ai configurés pour moi et pour mon écosystème. Je les utilise au quotidien pour cadrer, construire et auditer mes projets. Tu peux bien évidemment les adapter à ta manière de travailler, à ton marché et à tes propres projets.
          </p>
          <SkillsFreshness />
        </header>

        <section id="methode" className="mb-10 scroll-mt-24">
          <LiquidCard className="p-5 sm:p-6">
            <div className="relative z-10">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#e8d5b0] font-semibold mb-2">
                  La méthode
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8]">
                  Comment ces skills ont été pensés - et comment penser les tiens.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-white/50 leading-relaxed">
                  Chaque skill vient du même framework : prendre un métier ou un résultat business, le décomposer en sous-métiers et sous-compétences, puis mettre dans chaque sous-domaine la meilleure expertise disponible - la nôtre quand on a la data, celle des meilleurs praticiens mesurés sinon. C'est le 80/20 de l'IA : le modèle, tout le monde a le même ; le contexte, non. C'est ce qui sépare un actif d'un pack de prompts génériques vendu sur Insta. Le détail complet est dans le Bloc 4.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SKILL_METHOD_STEPS.map((item) => (
                  <div key={item.step} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <p className="text-[11px] font-mono text-[#e8d5b0]/70 mb-1">
                      {item.step}
                    </p>
                    <h3 className="text-sm font-semibold text-[#f0ede8]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/45">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-[#e8d5b0]/15 bg-[#e8d5b0]/[0.045] p-4">
                <p className="text-sm font-semibold text-[#e8d5b0] mb-3">
                  La méthode appliquée, skill par skill
                </p>
                <div className="grid gap-2">
                  {SKILL_METHOD_EXAMPLES.map((item) => (
                    <details key={item.skill} name="method-examples" className="group rounded-lg bg-black/20 px-3 py-2">
                      <summary className="cursor-pointer list-none flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.16em] text-[#e8d5b0]/75">
                        {item.skill}
                        <span className="text-[#e8d5b0]/50 transition-transform group-open:rotate-45 text-sm leading-none">+</span>
                      </summary>
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {item.body}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </LiquidCard>
        </section>

        <section id="workflow" className="mb-10 scroll-mt-24">
          <LiquidCard className="p-5 sm:p-6">
            <div className="relative z-10">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#e8d5b0] font-semibold mb-2">
                  Le workflow
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8]">
                  Ces skills ne sont pas des fichiers isolés. C'est une chaîne.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-white/50 leading-relaxed">
                  Chacun consomme ce que le précédent a produit. Tu peux en utiliser un seul, mais l'enchaînement complet est ce qui te fait gagner le plus de temps : la data marché devient le cadrage produit, le cadrage devient le design, le design devient la landing page.
                </p>
              </div>

              <div className="mt-6 grid gap-2">
                {SKILL_WORKFLOW.map((item) => (
                  <details key={item.step} name="workflow-steps" className="group rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#e8d5b0]/70">{item.step}</span>
                        <span className="text-sm font-semibold text-[#f0ede8]">{item.title}</span>
                      </span>
                      <span className="text-[#e8d5b0]/50 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                    </summary>
                    <p className="mt-2 text-xs leading-relaxed text-white/45">
                      {item.body}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </LiquidCard>
        </section>

        <section id="mode-emploi" className="mb-10 scroll-mt-24">
          <LiquidCard className="p-5 sm:p-6">
            <div className="relative z-10">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#e8d5b0] font-semibold mb-2">
                  Mode d'emploi
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#f0ede8]">
                  Approprie-toi ces skills, ne les copie pas juste.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-white/50 leading-relaxed">
                  Un skill est une base de travail vivante. Tu peux l'utiliser tel quel pour apprendre, puis le faire évoluer avec l'IA pour ton marché, tes clients, tes références, tes assets et tes propres standards.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SKILL_USAGE_STEPS.map((step) => (
                  <div key={step.title} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <h3 className="text-sm font-semibold text-[#f0ede8]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/45">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-sm font-semibold text-[#f0ede8] mb-1">
                  Où les utiliser
                </p>
                <p className="text-xs text-white/45 mb-3 leading-relaxed">
                  Ces skills fonctionnent partout : Claude Code, Hermes Agent, ChatGPT, Codex. Le meilleur résultat vient des outils capables de naviguer le web par eux-mêmes (Hermes Agent, Codex, Claude Code) ou pilotés via une CLI type Playwright pour automatiser la recherche et la vérification.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SKILL_USAGE_TOOLS.map((tool) => (
                    <div key={tool.name} className="flex items-start gap-3">
                      <img src={tool.logo} alt="" className="mt-0.5 w-5 h-5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-white/80">{tool.name}</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-white/45">{tool.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#e8d5b0]/15 bg-[#e8d5b0]/[0.045] p-4">
                <p className="text-sm font-semibold text-[#e8d5b0] mb-1">
                  Un skill, un rôle, un prompt pour démarrer
                </p>
                <p className="text-xs text-white/45 mb-3 leading-relaxed">
                  Ce sont des exemples de départ, pas des scripts figés. Tu es libre de prompter comme tu veux pour tes propres projets.
                </p>
                <div className="grid gap-2">
                  {SKILL_PROMPTS.map((item) => (
                    <details key={item.skill} name="prompt-examples" className="group rounded-lg bg-black/20 px-3 py-2.5">
                      <summary className="cursor-pointer list-none flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#e8d5b0]/75">
                          {item.skill}
                        </span>
                        <span className="text-[#e8d5b0]/50 transition-transform group-open:rotate-45 text-sm leading-none">+</span>
                      </summary>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                        {item.role}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/50 italic">
                        {item.prompt}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </LiquidCard>
        </section>

        <div id="catalogue" className="mb-6 flex flex-wrap gap-2 scroll-mt-24">
          {(["all", ...Object.keys(SKILL_CATEGORY_LABELS)] as (SkillCategory | "all")[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#e8d5b0] text-[#0e0e0f] border-[#e8d5b0]"
                  : "bg-white/[0.03] text-white/50 border-white/[0.08] hover:text-white/80 hover:border-white/20"
              }`}
            >
              {cat === "all" ? "Tous" : SKILL_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[240px] rounded-2xl bg-white/[0.04] border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS_CATALOG.filter((skill) => categoryFilter === "all" || skill.category === categoryFilter).map((skill, index) => {
              const isFree = skill.access === "free";
              const isBeginner = skill.access === "beginner";
              const canDownload =
                isFree ||
                tier === "full" ||
                (isBeginner && tier === "beginner");
              const badgeClasses = isFree
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : isBeginner
                  ? "bg-[#e8d5b0]/10 border-[#e8d5b0]/20 text-[#e8d5b0]"
                  : "bg-white/5 border-white/10 text-white/35";
              const badgeLabel = isFree
                ? "Gratuit"
                : isBeginner
                  ? "Fondations"
                  : COFFRE_LABEL;
              const lockedHref = isBeginner ? beginnerHref : checkoutHref;
              const lockedLabel = isBeginner
                ? `Débloquer les fondations - ${FONDATIONS_PRICE}€`
                : `Prendre ${COFFRE_LABEL} - ${COFFRE_PRICE}€`;

              return (
                <motion.div
                  key={skill.slug}
                  whileHover="hover"
                  className="group animate-reveal h-full"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
                >
                  <LiquidCard className="p-6 transition-all duration-500 flex flex-col h-full min-h-[240px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#e8d5b0] shadow-[0_4px_16px_rgba(0,0,0,0.2)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_16px_rgba(232,213,176,0.15)] transition-all duration-500">
                          <AnimatedIcon icon={isFree ? Sparkles : skill.slug === "deep-research-vertical" ? FolderSearch : FileText} className="w-6 h-6 drop-shadow-[0_0_8px_rgba(232,213,176,0.5)]" strokeWidth={1.5} />
                        </div>
                        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border ${badgeClasses}`}>
                          {!isFree && <Lock className="w-3 h-3" />}
                          <span className="text-[11px] font-medium">
                            {badgeLabel}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#e8d5b0]/60 font-semibold mb-2">
                          {SKILL_CATEGORY_LABELS[skill.category]}
                        </p>
                        <h2 className="text-xl font-semibold tracking-tight text-[#f0ede8] mb-3">
                          {skill.title}
                        </h2>
                        <p className="text-sm text-[rgba(240,237,232,0.48)] leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      <div className="mt-8">
                        {canDownload ? (
                          <a
                            href={`/api/skills/${skill.slug}`}
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] transition-all duration-200 hover:bg-[#f0dfc0] shadow-[0_0_24px_rgba(232,213,176,0.18)]"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        ) : (
                          <a
                            href={lockedHref}
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-white/[0.06] border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition-all duration-200 hover:bg-white/[0.1] hover:text-white"
                          >
                            {lockedLabel}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </LiquidCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ScrollProgress
        sections={[
          { id: "methode", label: "La méthode" },
          { id: "workflow", label: "Le workflow" },
          { id: "mode-emploi", label: "Mode d'emploi" },
          { id: "catalogue", label: "Catalogue" },
        ]}
      />
      <ScrollToTop />
    </main>
  );
}
