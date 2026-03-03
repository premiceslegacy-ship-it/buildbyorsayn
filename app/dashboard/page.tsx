"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workflow, Layers, LayoutTemplate, FileCode, Briefcase, ArrowRight, Eye } from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { BLOCS_DATA } from "@/lib/mockData";
import { useProgress } from "@/hooks/useProgress";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { motion } from "motion/react";

const ICONS: Record<string, any> = {
  "1": Workflow,
  "2": Layers,
  "3": LayoutTemplate,
  "4": FileCode,
  "5": Briefcase,
  "6": Eye,
};

export default function DashboardHub() {
  const router = useRouter();
  const { globalProgress, getBlocProgress, isLoaded, lastVisitedBloc } = useProgress();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Avoid hydration mismatch by not rendering progress until loaded
  const displayProgress = isLoaded ? globalProgress : 0;

  // Find the bloc to resume: either the last visited, or the first incomplete, or default to bloc 1
  const firstIncompleteBlocId = BLOCS_DATA.find(b => getBlocProgress(b.id) < 100)?.id || "1";
  const resumeBlocId = lastVisitedBloc || firstIncompleteBlocId;
  const resumeBloc = BLOCS_DATA.find(b => b.id === resumeBlocId) || BLOCS_DATA[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans relative overflow-hidden">
      {/* Halos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

      {/* Top Navigation */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-6 md:px-12 relative z-20">
        <Logo layout="horizontal" className="h-6" hideText={false} />
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-[#f0ede8] font-medium">
            Le hub
          </Link>
          <Link href="/sources" className="text-white/40 hover:text-white/80 transition-colors">
            La stack
          </Link>
          
          {/* Dropdown Profil */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium text-[#e8d5b0] border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
            >
              SA
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-[#161618] border border-white/10 shadow-2xl rounded-xl p-2 w-48 z-50 animate-fade-in">
                <div className="px-2 pt-2 text-sm text-[#f0ede8] font-medium">
                  Samuel
                </div>
                <div className="px-2 pb-2 mb-2 text-xs text-white/40 border-b border-white/10">
                  samuel@orsayn.fr
                </div>
                <button className="w-full text-left px-2 py-1.5 text-sm text-[#f87171] hover:bg-white/5 rounded-md transition-colors">
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 relative z-10">
        
        {/* 1. En-tête de page (Welcome & Global Progress) */}
        <header className="flex flex-col gap-4 pt-8 mb-12">
          <h1 className="text-3xl text-[#f0ede8] font-semibold tracking-tight">
            Ravi de te revoir, Builder.
          </h1>
          <p className="text-[rgba(240,237,232,0.60)] text-[16px]">
            Tu en es à {displayProgress}% du système. {displayProgress === 100 ? "Système intégralement implémenté." : displayProgress === 0 ? "Commence le système pour atteindre ta situation désirée." : "Continue sur ta lancée."}
          </p>
          
          {/* Barre de progression globale large */}
          <div className="w-full max-w-2xl mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#e8d5b0]/60 to-[#e8d5b0] h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(232,213,176,0.3)]"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </header>

        {/* 2. Carte "Reprendre" (Resume Action) */}
        <LiquidCard 
          className="p-8 md:p-10 mb-16 animate-reveal flex flex-col h-full min-h-[200px] group cursor-pointer transition-all"
          onClick={() => router.push(`/blocs/${resumeBloc.id}`)}
        >
          <div className="relative z-10">
            <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0] font-medium mb-3">
              Reprendre là où tu t'es arrêté
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">
              {resumeBloc.titre}
            </h2>
          </div>
          
          <div className="relative z-10 mt-auto flex justify-end pt-6">
            <LiquidButton 
              size="xl"
              className="pointer-events-none group-hover:scale-105 transition-transform duration-300"
            >
              Continuer le bloc {resumeBloc.id}
            </LiquidButton>
          </div>
        </LiquidCard>

        {/* 3. La Grille des Blocs (Le Menu) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOCS_DATA.map((bloc) => {
            const Icon = ICONS[bloc.id] || Workflow;
            const progress = isLoaded ? getBlocProgress(bloc.id) : 0;
            
            return (
              <Link
                href={`/blocs/${bloc.id}`}
                key={bloc.id}
                className="group cursor-pointer animate-reveal block h-full"
              >
                <motion.div whileHover="hover" className="h-full">
                  <LiquidCard className="p-6 text-left transition-all duration-500 flex flex-col h-full min-h-[220px]">
                    {/* Glow background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Icône Fintech illuminée */}
                    <div className="relative w-12 h-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.2)] transition-all duration-500 mb-6">
                      <AnimatedIcon icon={Icon} className="w-6 h-6 text-[#e8d5b0] drop-shadow-[0_0_10px_rgba(232,213,176,0.8)]" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="relative text-xl font-semibold text-[#f0ede8] mb-4 tracking-tight">
                      {bloc.titre}
                    </h3>
                    
                    <div className="relative mt-auto pt-4 w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
                          Progression
                        </span>
                        <span className="text-xs text-[#e8d5b0] font-medium">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#e8d5b0]/40 to-[#e8d5b0] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </LiquidCard>
                </motion.div>
              </Link>
            );
          })}
        </div>
        
      </div>
    </main>
  );
}
