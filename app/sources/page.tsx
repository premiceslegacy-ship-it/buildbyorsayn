"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Search, Terminal, Database, BookOpen,
  Video, PlaySquare, Briefcase, Code, Bot, Brain, Sparkles,
  Wand2, Pen, Smartphone, Palette, Box, GitBranch, Zap, Layers,
  CreditCard, Mail, Bug, BarChart2, FileText, LayoutList, Shield,
  BookMarked, Globe, Monitor, Plug,
} from "lucide-react";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { motion } from "motion/react";

const CATEGORIES = ["Tous", "IA & Automatisation", "Design & UI", "Outils & Infra", "Vente & Business"];

const SOURCES = [
  // IA & Automatisation
  {
    id: 1,
    name: "Perplexity",
    description: "Moteur de recherche IA conversationnel pour des réponses précises et sourcées en temps réel.",
    icon: Search,
    type: "IA & Automatisation",
    url: "https://www.perplexity.ai",
  },
  {
    id: 2,
    name: "Cursor",
    description: "L'IDE pensé pour l'IA. Accélère drastiquement l'écriture et la refactorisation de code.",
    icon: Terminal,
    type: "IA & Automatisation",
    url: "https://www.cursor.com",
  },
  {
    id: 3,
    name: "Antigravity",
    description: "L'alternative gratuite à Cursor. Un environnement de développement avec IA intégrée nativement.",
    icon: Bot,
    type: "IA & Automatisation",
    url: "https://antigravity.ai",
  },
  {
    id: 4,
    name: "Claude (Anthropic)",
    description: "Le LLM principal pour le code et la rédaction. Meilleur niveau de qualité sur le backend et les architectures complexes.",
    icon: Brain,
    type: "IA & Automatisation",
    url: "https://claude.ai",
  },
  {
    id: 5,
    name: "Google AI Studio",
    description: "Pour les sessions longues et complexes. Fenêtre de contexte très large, idéal pour affiner des designs et générer des MVPs.",
    icon: Sparkles,
    type: "IA & Automatisation",
    url: "https://aistudio.google.com",
  },
  {
    id: 6,
    name: "NotebookLM",
    description: "L'outil le plus sous-utilisé de la stack. Construit une base de connaissance interrogeable depuis tes sources hétérogènes.",
    icon: BookOpen,
    type: "IA & Automatisation",
    url: "https://notebooklm.google.com",
  },
  {
    id: 7,
    name: "Jack Roberts",
    description: "Expertise pointue sur l'automatisation de flux de travail et l'intégration de modèles d'IA.",
    icon: PlaySquare,
    type: "IA & Automatisation",
    url: "",
  },
  {
    id: 8,
    name: "Le Dev ULTIME",
    description: "Ressources incontournables pour le développement SaaS, l'architecture et les bonnes pratiques.",
    icon: Code,
    type: "IA & Automatisation",
    url: "",
  },

  // Design & UI
  {
    id: 9,
    name: "Google Stitch",
    description: "Génère des designs d'interface complets à partir d'un brief textuel. Tous les écrans, tous les états. Intégrable dans Figma.",
    icon: Wand2,
    type: "Design & UI",
    url: "https://stitch.withgoogle.com",
  },
  {
    id: 10,
    name: "Figma",
    description: "Pour les specs détaillées et le handoff client. L'outil de référence pour valider visuellement avant le développement.",
    icon: Pen,
    type: "Design & UI",
    url: "https://figma.com",
  },
  {
    id: 11,
    name: "Mobbin",
    description: "Analyse des patterns d'interface qui fonctionnent dans des apps réelles en production. La référence UX.",
    icon: Smartphone,
    type: "Design & UI",
    url: "https://mobbin.com",
  },
  {
    id: 12,
    name: "Dribbble",
    description: "Pour l'inspiration visuelle, les directions esthétiques, les palettes et les traitements typographiques.",
    icon: Palette,
    type: "Design & UI",
    url: "https://dribbble.com",
  },
  {
    id: 13,
    name: "21st.dev",
    description: "Les composants React premium modernes dans l'écosystème Tailwind. Le meilleur endroit pour les UI components.",
    icon: Box,
    type: "Design & UI",
    url: "https://21st.dev",
  },

  // Outils & Infra
  {
    id: 14,
    name: "Supabase",
    description: "L'alternative open-source à Firebase. PostgreSQL avec auth intégrée et Row Level Security native.",
    icon: Database,
    type: "Outils & Infra",
    url: "https://supabase.com",
  },
  {
    id: 15,
    name: "GitHub",
    description: "Le versioning n'est jamais optionnel. Chaque modification tracée, chaque version récupérable.",
    icon: GitBranch,
    type: "Outils & Infra",
    url: "https://github.com",
  },
  {
    id: 16,
    name: "Vercel",
    description: "Connecté à GitHub. Chaque push génère une URL de preview unique. Déploiement en production en un clic.",
    icon: Zap,
    type: "Outils & Infra",
    url: "https://vercel.com",
  },
  {
    id: 17,
    name: "shadcn/ui",
    description: "Des composants que tu copies dans ton projet et que tu possèdes. Accessibles, responsives, stylisables avec Tailwind.",
    icon: Layers,
    type: "Outils & Infra",
    url: "https://ui.shadcn.com",
  },
  {
    id: 18,
    name: "Stripe",
    description: "Le standard mondial pour le paiement. API stable, documentation excellente. Pour les abonnements et les webhooks.",
    icon: CreditCard,
    type: "Outils & Infra",
    url: "https://stripe.com",
  },
  {
    id: 19,
    name: "Resend",
    description: "Pour les emails transactionnels. Intégration Next.js native et délivrabilité excellente.",
    icon: Mail,
    type: "Outils & Infra",
    url: "https://resend.com",
  },
  {
    id: 20,
    name: "Sentry",
    description: "Le monitoring des erreurs en production. Chaque erreur tracée avec son contexte complet.",
    icon: Bug,
    type: "Outils & Infra",
    url: "https://sentry.io",
  },
  {
    id: 21,
    name: "PostHog",
    description: "Analytics comportementales, A/B testing, feature flags et session recordings dans un seul outil open source.",
    icon: BarChart2,
    type: "Outils & Infra",
    url: "https://posthog.com",
  },
  {
    id: 22,
    name: "Notion",
    description: "La base de connaissance centrale : briefs clients, SOPs, documentation des décisions, index des Skills.",
    icon: FileText,
    type: "Outils & Infra",
    url: "https://notion.so",
  },
  {
    id: 23,
    name: "Linear",
    description: "La gestion de projet produit. Issues, bugs, cycles de développement. S'intègre avec GitHub pour lier les issues aux commits.",
    icon: LayoutList,
    type: "Outils & Infra",
    url: "https://linear.app",
  },
  {
    id: 24,
    name: "OWASP",
    description: "La référence sécurité pour le développement web. La checklist incontournable pour tout projet sérieux.",
    icon: Shield,
    type: "Outils & Infra",
    url: "https://owasp.org",
  },

  // Vente & Business
  {
    id: 25,
    name: "Alex Hormozi",
    description: "Frameworks mentaux pour l'acquisition, la création d'offres irrésistibles et la croissance business.",
    icon: Video,
    type: "Vente & Business",
    url: "https://www.youtube.com/@AlexHormozi",
  },
  {
    id: 26,
    name: "Shannen Louiz Boutaleb",
    description: "Stratégies de vente B2B, prospection et closing pour transformer un produit en revenus.",
    icon: Briefcase,
    type: "Vente & Business",
    url: "",
  },
  {
    id: 27,
    name: "Influence & Manipulation",
    description: "Robert Cialdini. Les biais universels : réciprocité, preuve sociale, autorité, rareté. À lire absolument.",
    icon: BookMarked,
    type: "Vente & Business",
    url: "https://www.amazon.fr/s?k=influence+et+manipulation+cialdini",
  },
  {
    id: 28,
    name: "Firecrawl",
    description: "Transforme n'importe quel site web en données structurées prêtes pour l'IA. Scraping et crawling propre en une API.",
    icon: Globe,
    type: "IA & Automatisation",
    url: "https://firecrawl.dev",
  },
  {
    id: 29,
    name: "minimal.gallery",
    description: "Galerie d'inspiration design minimaliste. Les meilleures interfaces épurées pour affiner ton sens esthétique.",
    icon: Monitor,
    type: "Design & UI",
    url: "https://minimal.gallery",
  },
  {
    id: 30,
    name: "RapidAPI",
    description: "Le marketplace des APIs. Trouve, teste et connecte des milliers d'APIs externes en quelques minutes.",
    icon: Plug,
    type: "Outils & Infra",
    url: "https://rapidapi.com",
  },
];

export default function SourcesPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredSources = SOURCES.filter((source) =>
    activeCategory === "Tous" ? true : source.type === activeCategory
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      {/* Navigation */}
      <div className="pt-8 pl-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mt-12 mb-12 px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center text-[#f0ede8]">
          La Stack du Builder.
        </h1>
        <p className="text-white/50 text-center text-lg max-w-2xl mx-auto mb-12">
          Les outils et les cerveaux qui font tourner le système.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                  ? "bg-[#e8d5b0] text-[#0e0e0f] shadow-[0_0_15px_rgba(232,213,176,0.4)]"
                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/90"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        {filteredSources.length === 0 ? (
          <div className="text-center text-white/40 py-12">
            Aucune ressource trouvée pour cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSources.map((source, index) => {
              const Icon = source.icon;
              const CardWrapper = source.url
                ? ({ children }: { children: React.ReactNode }) => (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group cursor-pointer animate-reveal h-full block"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                    >
                      {children}
                    </a>
                  )
                : ({ children }: { children: React.ReactNode }) => (
                    <div
                      className="group animate-reveal h-full"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                    >
                      {children}
                    </div>
                  );

              return (
                <CardWrapper key={source.id}>
                  <motion.div whileHover="hover" className="h-full">
                    <LiquidCard className="p-6 transition-all duration-500 flex flex-col justify-between h-full min-h-[200px]">
                      {/* Glow background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                      {/* Top Section */}
                      <div className="flex justify-between items-start relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#e8d5b0] shadow-[0_4px_16px_rgba(0,0,0,0.2)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_16px_rgba(232,213,176,0.15)] transition-all duration-500">
                          <AnimatedIcon icon={Icon} className="w-6 h-6 drop-shadow-[0_0_8px_rgba(232,213,176,0.5)]" strokeWidth={1.5} />
                        </div>
                        {source.url && (
                          <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-white/70 transition-colors duration-300" />
                        )}
                      </div>

                      {/* Bottom Section */}
                      <div className="mt-8 relative z-10">
                        <h3 className="text-lg font-semibold text-[#f0ede8] mb-2 tracking-tight">
                          {source.name}
                        </h3>
                        <p className="text-sm text-[rgba(240,237,232,0.45)] leading-relaxed line-clamp-2">
                          {source.description}
                        </p>
                      </div>
                    </LiquidCard>
                  </motion.div>
                </CardWrapper>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
