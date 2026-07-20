"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, FileText, FolderSearch, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { SKILLS_CATALOG } from "@/lib/skillsCatalog";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";

const SKILL_USAGE_STEPS = [
  {
    title: "1. Charge le skill",
    body: "Dépose le fichier .md dans /docs ou garde le dossier complet si c'est un zip. Demande ensuite à ton IA de le lire avant de travailler.",
  },
  {
    title: "2. Donne ton contexte",
    body: "Explique ton marché, ton client, ton offre, ta stack, ton niveau et ton objectif. Un skill devient puissant quand il comprend ton terrain.",
  },
  {
    title: "3. Remplace les références",
    body: "Les références Orsayn sont une base. Tu peux demander à l'IA de les remplacer par tes marques, screenshots, assets, couleurs et contraintes.",
  },
  {
    title: "4. Fais-le évoluer",
    body: "Après chaque projet, ajoute tes règles, erreurs fréquentes, prompts utiles et standards. Ton skill devient ton système de travail.",
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
    body: "Choisis un design system prêt à l'emploi dans le catalogue, ou envoie une image et le skill en extrait le pattern exact (couleurs, typo, structure) pour que ton produit transpire vraiment cette direction, pas un à-peu-près.",
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
    role: "Cadre un produit (app, SaaS, outil interne) en langage simple : interview, documents fondateurs, décisions structurantes avant le code.",
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
        </header>

        <section className="mb-10">
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
                  La méthode appliquée : comment chaque skill a été construit
                </p>
                <div className="grid gap-2">
                  {SKILL_METHOD_EXAMPLES.map((item) => (
                    <div key={item.skill} className="rounded-lg bg-black/20 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#e8d5b0]/75">
                        {item.skill}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LiquidCard>
        </section>

        <section className="mb-10">
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

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {SKILL_WORKFLOW.map((item) => (
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
            </div>
          </LiquidCard>
        </section>

        <section className="mb-10">
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

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

              <div className="mt-5 rounded-xl border border-[#e8d5b0]/15 bg-[#e8d5b0]/[0.045] p-4">
                <p className="text-sm font-semibold text-[#e8d5b0] mb-3">
                  Un skill, un rôle, un prompt pour démarrer
                </p>
                <div className="grid gap-2">
                  {SKILL_PROMPTS.map((item) => (
                    <div key={item.skill} className="rounded-lg bg-black/20 px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#e8d5b0]/75">
                        {item.skill}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/70">
                        {item.role}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/50 italic">
                        {item.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LiquidCard>
        </section>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[240px] rounded-2xl bg-white/[0.04] border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS_CATALOG.map((skill, index) => {
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
                  : "Complet";
              const lockedHref = isBeginner ? beginnerHref : checkoutHref;
              const lockedLabel = isBeginner
                ? "Débloquer les fondations - 97€"
                : "Prendre le système complet - 497€";

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
    </main>
  );
}
