"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LiquidCard } from "@/components/ui/liquid-glass-card";

export default function FinPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans relative overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      
      {/* Halo central doré */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none" />

      {/* Conteneur principal avec animation Reveal lente */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl animate-reveal [animation-duration:1000ms] ease-out">
        
        {/* Symbole cubique en Or patiné */}
        <div className="text-[#e8d5b0] mb-10">
          <Logo layout="vertical" className="h-16 w-auto" hideText={true} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#f0ede8] mb-12 text-center">
          Le système est en place.
        </h1>

        {/* Carte Centrale (Liquid Glass Niveau 3) */}
        <LiquidCard className="pt-16 pb-10 px-10 md:pt-24 md:pb-14 md:px-14 w-full text-center shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
          <p className="text-[rgba(240,237,232,0.8)] leading-relaxed text-lg md:text-xl relative z-10">
            Tu as maintenant un système, des frameworks, des templates. Une stack. Une logique business. Ce qui va faire la différence entre toi et quelqu'un qui a lu le même document sans agir, c'est une seule chose. L'exécution. L'exécution imparfaite aujourd'hui bat la perfection théorique indéfiniment.
          </p>

          {/* Signature visuelle */}
          <span className="block mt-12 text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold relative z-10">
            BUILD by Orsayn
          </span>
        </LiquidCard>

        {/* L'Action (Ghost Button) */}
        <Link 
          href="/dashboard"
          className="mt-12 text-white/50 hover:text-white/90 transition-colors text-sm font-medium tracking-wide"
        >
          Retourner au Dashboard
        </Link>

      </div>
    </main>
  );
}
