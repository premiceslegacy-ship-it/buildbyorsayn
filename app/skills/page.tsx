"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { SKILLS_CATALOG, SKILL_CATEGORY_LABELS, type SkillCategory } from "@/lib/skillsCatalog";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { SkillsFreshness } from "@/components/SkillsFreshness";
import { BuildSyncInstall } from "@/components/BuildSyncInstall";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { illustrationSrc } from "@/lib/illustrations";
import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_PRICE, withClientReferenceId } from "@/lib/pricing";
import { normalizeProfileTier } from "@/lib/mcpAccess";

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
    logo: "/brand-logos/hermes-agent-mark.png",
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
    body: "Décomposition du métier d'analyste marché : conscience du problème, construction de l'offre, langage client et angles publicitaires soutenus par des données publiques.",
  },
  {
    skill: "ORACLE by Orsayn",
    body: "Décomposition du métier de product manager : positionnement, JTBD, PRD des meilleures équipes produit, benchmarks d'activation et de monétisation.",
  },
  {
    skill: "UX/UI Design",
    body: "Décomposition du métier de directeur artistique : taxonomie des styles, extraction de pattern mesurée, protocole anti AI-slop, systèmes d'icônes et tokens.",
  },
  {
    skill: "Apple Design Skills",
    body: "Décomposition de la discipline Apple en 15 sous-skills : mindset, fondations, branding, composants, patterns, états, layout, matériaux, mouvement, accessibilité, contenu, web et quality gates.",
  },
  {
    skill: "Backend Orsayn",
    body: "Décomposition de la sécurité et de l'infra en 7 sous-métiers (RLS, API, agents IA, webhooks, perf, conformité, migration) : un sous-skill chacun, mapping OWASP.",
  },
  {
    skill: "ORACLE Site Web",
    body: "Décomposition du site qui vend en 10 sous-domaines : copy et CTA, arborescence, preuve sociale, psychologie de conversion, formulaires, SEO/GEO, performance, mesure.",
  },
  {
    skill: "Product Film Factory",
    body: "Décomposition d'un film produit de motion design : interview, direction artistique, narration, caméra, voix, musique, bruitages, rendu et contrôle de livraison.",
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
    title: "Apple Design Skills",
    body: "En complément du design system, ce bundle de 15 skills approfondit la discipline Apple quand ton projet vise ce niveau de finition : composants, patterns, matériaux, mouvement et accessibilité, jusqu'aux quality gates avant livraison.",
  },
  {
    step: "05",
    title: "Backend Orsayn",
    body: "Le skill qui empêche ton produit d'exposer les données de tes clients. RLS, validation, sécurité des agents IA, webhooks, performance : il audite l'existant ou construit le neuf, un plan validé avant chaque bloc de code.",
  },
  {
    step: "06",
    title: "ORACLE Site Web",
    body: "Une fois le produit prêt, ce skill écrit la landing page à partir de la recherche marché et du design system du produit : même famille visuelle, copy qui vient des vraies objections du marché, pas de l'imagination.",
  },
  {
    step: "07",
    title: "Product Film Factory",
    body: "Pour finir, ce skill transforme une landing page, un produit ou une scène métier en film complet : brief, direction artistique, narration, caméra, son, export et contrôle de livraison. Il assemble les savoir-faire précédents dans un résultat prêt à montrer.",
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
    skill: "Apple Design Skills",
    role: "Pousse une interface au niveau de finition Apple : composants, patterns, matériaux, mouvement, accessibilité et quality gates, sur les 15 sous-skills du bundle.",
    prompt: "Voici mon design system actuel [description/captures]. Passe-le au niveau Apple Design Skills : composants, matériaux, mouvement et accessibilité, avec un quality gate avant chaque livraison.",
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
  {
    skill: "Product Film Factory",
    role: "Crée un film produit de motion design avec HyperFrames : interview, narration, direction artistique, caméra, son et rendu vérifié.",
    prompt: "Voici ma landing page, mon produit ou ma scène métier [description/lien]. Construis un film produit avec Product Film Factory : brief, storyboard, direction visuelle, voix, mouvement, son, CTA et export vérifié.",
  },
];

const SKILL_GLOSSARY = [
  ["Skill", "Un ensemble versionné d’instructions, de ressources, de contrôles et de limites pour une tâche. Ce n’est pas seulement un prompt."],
  ["LLM", "Un modèle de langage qui génère ou transforme du texte à partir du contexte reçu. Il ne vérifie pas automatiquement que ce contexte est vrai."],
  ["RLS", "La sécurité au niveau des lignes : une règle de base de données qui limite les enregistrements qu’un utilisateur peut lire ou modifier."],
  ["GEO", "L’optimisation d’un contenu pour qu’il soit compris et cité par des moteurs de réponse générative. Elle complète le SEO, elle ne le remplace pas."],
  ["CRO", "L’optimisation d’un parcours pour faciliter une action mesurable, comme demander un diagnostic ou remplir un formulaire."],
  ["JTBD", "Jobs To Be Done : décrire le progrès qu’une personne cherche à accomplir, plutôt que de la réduire à un profil démographique."],
  ["GTM", "Go-To-Market : le chemin prévu pour atteindre un marché, proposer une offre, vendre puis livrer."],
  ["Lighthouse 100", "Un score de contrôle sur certaines dimensions web. Ce n’est ni une garantie de conversion, ni une preuve que le produit est bon pour son marché."],
] as const;

type SkillsPublicationMetadata = {
  publishedAt: string;
  releaseId: string;
  artifacts: Array<{ fileName: string; sha256: string }>;
};

type SkillDownloadRecord = {
  sha256: string;
  downloadedAt: string;
  publishedAt: string;
};

type SkillDownloadRecords = Record<string, SkillDownloadRecord>;

const SKILL_DOWNLOADS_STORAGE_KEY = "build-skill-downloads";

function isSkillsPublicationMetadata(value: unknown): value is SkillsPublicationMetadata {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.publishedAt === "string" &&
    !Number.isNaN(Date.parse(candidate.publishedAt)) &&
    typeof candidate.releaseId === "string" &&
    Array.isArray(candidate.artifacts) &&
    candidate.artifacts.every(
      (artifact) =>
        artifact &&
        typeof artifact === "object" &&
        typeof (artifact as Record<string, unknown>).fileName === "string" &&
        typeof (artifact as Record<string, unknown>).sha256 === "string"
    )
  );
}

function readSkillDownloadRecords(): SkillDownloadRecords {
  try {
    const value = JSON.parse(window.localStorage.getItem(SKILL_DOWNLOADS_STORAGE_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};

    return Object.fromEntries(
      Object.entries(value).flatMap(([slug, record]) => {
        if (!record || typeof record !== "object") return [];
        const candidate = record as Record<string, unknown>;
        if (
          typeof candidate.sha256 !== "string" ||
          typeof candidate.downloadedAt !== "string" ||
          typeof candidate.publishedAt !== "string"
        ) {
          return [];
        }
        return [[slug, candidate as SkillDownloadRecord]];
      })
    );
  } catch {
    return {};
  }
}

export default function SkillsPage() {
  const [tier, setTier] = useState<string | null | "loading">("loading");
  const [checkoutHref, setCheckoutHref] = useState<string | null>(null);
  const [beginnerHref, setBeginnerHref] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "all">("all");
  const [publication, setPublication] = useState<SkillsPublicationMetadata | null>(null);
  const [downloadRecords, setDownloadRecords] = useState<SkillDownloadRecords>(() =>
    typeof window === "undefined" ? {} : readSkillDownloadRecords()
  );

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

      const userTier = normalizeProfileTier(profile?.tier ?? null);
      const targetUrl = userTier === "beginner" ? urls.upgrade : urls.full;

      setTier(userTier);
      setCheckoutHref(withClientReferenceId(targetUrl, user.id));
      setBeginnerHref(withClientReferenceId(urls.beginner, user.id));
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPublication() {
      try {
        const response = await fetch("/api/skills/metadata", {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload: unknown = await response.json();
        if (isSkillsPublicationMetadata(payload)) setPublication(payload);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    void loadPublication();
    return () => controller.abort();
  }, []);

  function rememberDownload(slug: string, fileName: string) {
    const artifact = publication?.artifacts.find((item) => item.fileName === fileName);
    if (!publication || !artifact) return;

    const nextRecords = {
      ...downloadRecords,
      [slug]: {
        sha256: artifact.sha256,
        downloadedAt: new Date().toISOString(),
        publishedAt: publication.publishedAt,
      },
    };
    window.localStorage.setItem(SKILL_DOWNLOADS_STORAGE_KEY, JSON.stringify(nextRecords));
    setDownloadRecords(nextRecords);
  }

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

        <header className="mb-8 sm:mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
            Bibliothèque
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0ede8]">
            Skills
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/55 sm:hidden">
            Choisis une capacité à renforcer, télécharge-la puis adapte-la à ton projet.
          </p>
          <p className="hidden sm:block text-white/50 text-[17px] mt-4 max-w-2xl leading-relaxed">
            Ce sont les skills que j'ai configurés pour moi et pour mon écosystème. Je les utilise au quotidien pour cadrer, construire et auditer mes projets. Tu peux bien évidemment les adapter à ta manière de travailler, à ton marché et à tes propres projets.
          </p>
          <a
            href="#catalogue"
            className="mt-5 inline-flex items-center gap-2 rounded-[4px] border border-[#e8d5b0]/75 bg-[#e8d5b0] px-4 py-2.5 text-sm font-semibold text-[#0e0e0f] shadow-[0_3px_0_rgba(147,123,80,0.9)] transition-all active:translate-y-px active:shadow-none sm:hidden"
          >
            Voir les skills
            <ArrowRight className="h-4 w-4" />
          </a>
          <div className="hidden sm:block">
            <SkillsFreshness />
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/45">BUILD Sync maintient automatiquement les installations gérées et n'écrase jamais tes adaptations placées dans CUSTOM.md. Les téléchargements manuels restent disponibles comme solution de secours.</p>
          </div>
        </header>

        {!isLoading && (tier === "beginner" || tier === "full") ? <BuildSyncInstall /> : null}

        <section id="methode" className="mb-10 scroll-mt-24 hidden md:block">
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
                  Chaque skill vient du même framework : prendre un métier ou un résultat business, le décomposer en sous-métiers et sous-compétences, puis mettre dans chaque sous-domaine la meilleure expertise disponible - la nôtre quand on a la data, celle des meilleurs praticiens mesurés sinon. C’est le 80/20 de l’IA : le modèle, tout le monde a le même ; le contexte, non. C’est ce qui sépare un actif d’un pack de prompts génériques vendu sur Insta. Le détail complet est dans le Bloc 4.
                </p>
              </div>

              <div className="mt-6 border-y border-white/[0.08] py-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-3">Repères de vocabulaire</p>
                <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {SKILL_GLOSSARY.map(([term, definition]) => (
                    <div key={term}>
                      <dt className="text-sm font-semibold text-[#e8d5b0]">{term}</dt>
                      <dd className="mt-1 text-xs leading-relaxed text-white/50">{definition}</dd>
                    </div>
                  ))}
                </dl>
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

        <section id="workflow" className="mb-10 scroll-mt-24 hidden md:block">
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

        <section id="mode-emploi" className="mb-10 scroll-mt-24 hidden md:block">
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
                      <Image src={tool.logo} alt="" aria-hidden="true" width={20} height={20} className="mt-0.5 h-5 w-5 shrink-0" />
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
              const currentArtifact = publication?.artifacts.find((artifact) => artifact.fileName === skill.fileName);
              const downloadedRecord = downloadRecords[skill.slug];
              const hasUpdate = Boolean(
                currentArtifact &&
                downloadedRecord &&
                currentArtifact.sha256 !== downloadedRecord.sha256
              );

              return (
                <motion.div
                  id={`skill-${skill.slug}`}
                  key={skill.slug}
                  whileHover="hover"
                  className="animate-reveal flex h-full scroll-mt-24 flex-col"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
                >
                  <IllustratedCard
                    title={skill.title}
                    description={skill.description}
                    imageSrc={illustrationSrc(`skills-${skill.slug}`)}
                    visualTone="black-gallery"
                    locked={!canDownload}
                  />
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-white/35">
                      {SKILL_CATEGORY_LABELS[skill.category]}
                    </span>
                    <span
                      className={`border px-2.5 py-1 text-[11px] font-medium ${badgeClasses}`}
                    >
                      {badgeLabel}
                    </span>
                  </div>
                  <div className="mt-3">
                    {canDownload ? (
                      <a
                        href={`/api/skills/${skill.slug}`}
                        onClick={() => rememberDownload(skill.slug, skill.fileName)}
                        className="inline-flex items-center justify-center gap-2 w-full bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] transition-all duration-200 hover:bg-[#f0dfc0] shadow-[0_0_24px_rgba(232,213,176,0.18)]"
                      >
                        <Download className="w-4 h-4" />
                        {hasUpdate ? "Mettre à jour" : "Télécharger"}
                      </a>
                    ) : lockedHref ? (
                      <a
                        href={lockedHref}
                        className="inline-flex items-center justify-center gap-2 w-full bg-white/[0.06] border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition-all duration-200 hover:bg-white/[0.1] hover:text-white"
                      >
                        {lockedLabel}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <p
                        role="status"
                        className="w-full border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm text-white/45"
                      >
                        Paiement momentanément indisponible.
                      </p>
                    )}
                    {canDownload && hasUpdate ? (
                      <p role="status" className="mt-2 text-xs leading-relaxed text-[#e8d5b0]/85">Une nouvelle version est disponible. Télécharge-la, puis compare-la à ta copie locale avant de remplacer tes propres adaptations.</p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <section className="mt-10 md:hidden">
          <details className="group border border-white/[0.1] bg-white/[0.025] px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#f0ede8]">
              Comprendre comment les adapter
              <span className="text-lg leading-none text-[#e8d5b0]/70 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="pt-3 text-sm leading-relaxed text-white/55">
              <p>Un skill est une base de travail, pas une recette à copier. Donne-lui ton marché, tes références et tes contraintes, puis garde les règles qui fonctionnent sur tes projets.</p>
              <p className="mt-3">La méthode détaillée reste disponible sur ordinateur quand tu veux aller plus loin.</p>
            </div>
          </details>
        </section>
      </div>

      <ScrollProgress
        className="hidden md:block"
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
