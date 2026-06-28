"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

type EcosystemVariant = "dashboard" | "homepage";

export function EcosystemMap({ variant, tier }: { variant: EcosystemVariant; tier?: string | null }) {
  const isDashboard = variant === "dashboard";
  const isMember = tier === "beginner" || tier === "full";

  return (
    <div className="w-full">
      {/* Header */}
      <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0]/60 font-medium mb-2">
        L&apos;écosystème Orsayn
      </p>
      <p className="text-sm text-white/40 leading-relaxed mb-8">
        {isDashboard
          ? "Le marché est saturé de contenu sur l'IA. Peu de gens buildent vraiment. Voici ce qui est construit, en production, avec les mêmes méthodes que tu apprends ici."
          : "Pas une formation de plus. Une maison qui construit des systèmes IA réels, en production, sur des marchés précis."}
      </p>

      {/* Noeud Orsayn */}
      <div className="flex justify-center mb-0">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-[#e8d5b0]/8 blur-xl scale-110 pointer-events-none" />
          <div className="relative flex flex-col items-center gap-2.5 px-8 py-5 rounded-2xl bg-gradient-to-b from-white/[0.10] to-white/[0.04] border border-[#e8d5b0]/22 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(232,213,176,0.06),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.18)] backdrop-blur-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-orsayn.svg" alt="Orsayn" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,250,241,0.2)]" />
            <p className="text-[11px] text-[#8a8070] leading-none">Maison-mère</p>
          </div>
        </div>
      </div>

      {/* Connecteur central */}
      <div className="flex justify-center">
        <div className="w-px h-7 bg-gradient-to-b from-[#e8d5b0]/22 to-[#e8d5b0]/6" />
      </div>

      {/* Ligne horizontale + 4 branches */}
      <div className="relative mb-0">
        <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/15 to-transparent" />
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex justify-center">
              <div className="w-px h-7 bg-gradient-to-b from-[#e8d5b0]/15 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* 4 cartes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

        {/* ATELIER */}
        <a href="https://www.atelier-btp.fr" target="_blank" rel="noopener noreferrer" className="group col-span-1 block">
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-[#c9b48a]/20 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.09),inset_0_-1px_0_rgba(0,0,0,0.12)] backdrop-blur-xl overflow-hidden transition-all duration-300 group-hover:border-[#c9b48a]/40 group-hover:shadow-[0_12px_40px_rgba(201,180,138,0.12),inset_0_1px_0_rgba(255,255,255,0.12)] group-hover:-translate-y-1 h-full min-h-[210px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-[#c9b48a]/6 blur-2xl rounded-full pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9b48a]/18 to-transparent" />
            <div className="relative z-10 p-4 sm:p-6 flex flex-col items-center h-full">
              <div className="self-end mb-3">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0e0e0f] bg-[#c9b48a] rounded-full px-2 py-0.5 leading-none tracking-wide">
                  <span className="w-1 h-1 rounded-full bg-[#0e0e0f]/60 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center p-2.5 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/monogramme-atelier.svg" alt="Atelier" className="w-full h-full object-contain" />
              </div>
              <div className="mb-2 w-full flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-atelier-blanc.svg" alt="Atelier" className="h-3 sm:h-3.5 object-contain opacity-80 max-w-[80px]" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/38 text-center leading-relaxed mt-auto px-1">
                ERP BTP nouvelle génération - devis intelligents, chantiers, rentabilité
              </p>
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[9px] text-[#e8d5b0]/60">atelier-btp.fr</span>
                <ArrowRight className="w-2.5 h-2.5 text-[#e8d5b0]/60" />
              </div>
            </div>
          </div>
        </a>

        {/* BUILD */}
        <div className="col-span-1">
          <div className={`relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.09),inset_0_-1px_0_rgba(0,0,0,0.12)] backdrop-blur-xl overflow-hidden h-full min-h-[210px] ${
            isDashboard && isMember
              ? "border-[#e8d5b0]/22"
              : "border-white/[0.07]"
          }`}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/12 to-transparent" />
            {isDashboard && isMember && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-[#e8d5b0]/5 blur-2xl rounded-full pointer-events-none" />
            )}
            <div className="relative z-10 p-4 sm:p-6 flex flex-col items-center h-full">
              {/* Badge */}
              <div className="self-end mb-3">
                {isDashboard && isMember ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0e0e0f] bg-[#e8d5b0] rounded-full px-2 py-0.5 leading-none tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-[#0e0e0f]/50" />
                    TU ES ICI
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-[#e8d5b0]/45 border border-[#e8d5b0]/15 rounded-full px-2 py-0.5 leading-none tracking-wide">
                    LIVE
                  </span>
                )}
              </div>
              {/* Logo BUILD — icône cubes 3D identique au header */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#e8d5b0]/10 to-[#e8d5b0]/3 border border-[#e8d5b0]/15 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(232,213,176,0.12)] flex items-center justify-center mb-3 p-2">
                <Logo hideText layout="vertical" className="!gap-0 w-8 h-8" />
              </div>
              <p className={`text-xs font-semibold mb-2 ${isDashboard && isMember ? "text-[#e8d5b0]/80" : "text-[#e8d5b0]/40"}`}>BUILD</p>
              <p className="text-[10px] sm:text-[11px] text-white/35 text-center leading-relaxed mt-auto px-1">
                {isDashboard && isMember
                  ? "La méthode, les skills, les frameworks. Tu en fais partie."
                  : "Méthode, skills, frameworks. La bibliothèque pour construire des lignes IA."}
              </p>
              {/* CTA homepage si pas membre */}
              {!isDashboard && (
                <a
                  href="#pricing"
                  className="flex items-center gap-1 mt-3 text-[9px] text-[#e8d5b0]/50 hover:text-[#e8d5b0]/80 transition-colors border border-[#e8d5b0]/15 hover:border-[#e8d5b0]/30 rounded-full px-2.5 py-1"
                >
                  Tu n&apos;es pas encore à l&apos;intérieur.
                  <ArrowRight className="w-2.5 h-2.5" />
                </a>
              )}
              {isDashboard && isMember && (
                <Link href="/dashboard" className="flex items-center gap-1 mt-3 text-[9px] text-[#e8d5b0]/40 hover:text-[#e8d5b0]/70 transition-colors">
                  Mon espace <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mystère 1 */}
        <div className="col-span-1 select-none">
          <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl overflow-hidden opacity-28 h-full min-h-[210px]">
            <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="text-white/20 text-2xl font-extralight">?</span>
              </div>
              <span className="text-[10px] text-white/18 font-medium">Bientôt</span>
            </div>
          </div>
        </div>

        {/* Mystère 2 */}
        <div className="col-span-1 select-none">
          <div className="relative rounded-2xl bg-white/[0.01] border border-white/[0.02] backdrop-blur-xl overflow-hidden opacity-14 h-full min-h-[210px]">
            <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.03] flex items-center justify-center">
                <span className="text-white/12 text-2xl font-extralight">?</span>
              </div>
              <span className="text-[10px] text-white/10 font-medium">Bientôt</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
