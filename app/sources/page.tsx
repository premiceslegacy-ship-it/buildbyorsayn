"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Search, Terminal, Database, BookOpen, Youtube, PlaySquare, Briefcase, Code } from "lucide-react";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { motion } from "motion/react";

const CATEGORIES = ["Tous", "Vente & Business", "IA & Automatisation", "Outils & Infra"];

const SOURCES = [
  {
    id: 1,
    name: "Perplexity",
    description: "Moteur de recherche IA conversationnel pour des réponses précises et sourcées.",
    icon: Search,
    type: "IA & Automatisation",
  },
  {
    id: 2,
    name: "Cursor",
    description: "L'IDE pensé pour l'IA. Accélère drastiquement l'écriture et la refactorisation de code.",
    icon: Terminal,
    type: "IA & Automatisation",
  },
  {
    id: 3,
    name: "Supabase",
    description: "L'alternative open-source à Firebase. Base de données PostgreSQL, Auth et Edge Functions.",
    icon: Database,
    type: "Outils & Infra",
  },
  {
    id: 4,
    name: "NotebookLM",
    description: "Assistant de recherche personnalisé par Google. Idéal pour synthétiser des documents complexes.",
    icon: BookOpen,
    type: "Outils & Infra",
  },
  {
    id: 5,
    name: "Alex Hormozi",
    description: "Frameworks mentaux pour l'acquisition, la création d'offres irrésistibles et la croissance business.",
    icon: Youtube,
    type: "Vente & Business",
  },
  {
    id: 6,
    name: "Jack Roberts",
    description: "Expertise pointue sur l'automatisation de flux de travail et l'intégration de modèles d'IA.",
    icon: PlaySquare,
    type: "IA & Automatisation",
  },
  {
    id: 7,
    name: "Shannen Louiz Boutaleb",
    description: "Stratégies de vente B2B, prospection et closing pour transformer un produit en revenus.",
    icon: Briefcase,
    type: "Vente & Business",
  },
  {
    id: 8,
    name: "Le Dev ULTIME",
    description: "Ressources incontournables pour le développement SaaS, l'architecture et les bonnes pratiques.",
    icon: Code,
    type: "IA & Automatisation",
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
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
              return (
              <div
                key={source.id}
                className="group cursor-pointer animate-reveal h-full"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
              >
                <motion.div whileHover="hover" className="h-full">
                  <LiquidCard className="p-6 transition-all duration-500 flex flex-col justify-between h-full min-h-[200px]">
                    {/* Glow background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Top Section */}
                    <div className="flex justify-between items-start relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#e8d5b0] shadow-[0_4px_16px_rgba(0,0,0,0.2)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_16px_rgba(232,213,176,0.15)] transition-all duration-500">
                        <AnimatedIcon icon={Icon} className="w-6 h-6 drop-shadow-[0_0_8px_rgba(232,213,176,0.5)]" strokeWidth={1.5} />
                      </div>
                      <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-white/70 transition-colors duration-300" />
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
              </div>
            );
          })}
          </div>
        )}
      </div>
    </main>
  );
}
