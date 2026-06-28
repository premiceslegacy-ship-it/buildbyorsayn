"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type EcosystemVariant = "dashboard" | "homepage";

export function EcosystemMap({ variant, tier }: { variant: EcosystemVariant; tier?: string | null }) {
  const isDashboard = variant === "dashboard";
  const isHomepage = variant === "homepage";

  const isMember = tier === "beginner" || tier === "full";

  return (
    <div className="w-full">
      {/* Intro text */}
      <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0]/60 font-medium mb-2">
        L&apos;écosystème Orsayn
      </p>
      <p className="text-sm text-white/40 leading-relaxed mb-8">
        {isDashboard
          ? "Le marché est saturé de contenu sur l'IA. Peu de gens buildent vraiment. Voici ce qui est construit, en production, avec les mêmes méthodes que tu apprends ici."
          : "Pas une formation de plus. Une maison qui construit des systèmes IA réels, en production, sur des marchés précis."}
      </p>

      {/* Noeud Orsayn — maison-mère premium */}
      <div className="flex justify-center mb-0">
        <div className="relative group">
          {/* Halo ambiant */}
          <div className="absolute inset-0 rounded-2xl bg-[#e8d5b0]/10 blur-xl scale-110 pointer-events-none" />
          <div className="relative inline-flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-gradient-to-b from-white/[0.10] to-white/[0.04] border border-[#e8d5b0]/25 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(232,213,176,0.08),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)] backdrop-blur-xl">
            {/* Logo Orsayn liquid glass */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-orsayn.svg" alt="Orsayn" className="w-8 h-8 object-contain drop-shadow-[0_0_6px_rgba(255,250,241,0.25)]" />
            </div>
            <div>
              <p className="text-[#e8d5b0] text-sm font-semibold tracking-wide leading-none mb-0.5">Orsayn</p>
              <p className="text-[10px] text-[#8a8070] leading-none">Maison-mère · AaaS vertical</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connecteur central */}
      <div className="flex justify-center">
        <div className="w-px h-7 bg-gradient-to-b from-[#e8d5b0]/25 to-[#e8d5b0]/8" />
      </div>

      {/* Ligne horizontale de distribution */}
      <div className="relative mb-0">
        <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/18 to-transparent" />
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex justify-center">
              <div className="w-px h-7 bg-gradient-to-b from-[#e8d5b0]/15 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* 4 cartes verticales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

        {/* ATELIER — LIVE */}
        <a
          href="https://www.atelier-btp.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="group col-span-1 block"
        >
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-[#c9b48a]/22 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.09),inset_0_-1px_0_rgba(0,0,0,0.15)] backdrop-blur-xl overflow-hidden transition-all duration-300 group-hover:border-[#c9b48a]/45 group-hover:shadow-[0_12px_40px_rgba(201,180,138,0.14),inset_0_1px_0_rgba(255,255,255,0.12)] group-hover:-translate-y-1 h-full min-h-[200px]">
            {/* Halo top doré */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-[#e8d5b0]/8 blur-2xl rounded-full pointer-events-none" />
            {/* Ligne highlight top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/20 to-transparent" />

            <div className="relative z-10 p-4 flex flex-col items-center h-full">
              {/* Badge LIVE */}
              <div className="self-end mb-3">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0e0e0f] bg-[#c9b48a] rounded-full px-2 py-0.5 leading-none tracking-wide">
                  <span className="w-1 h-1 rounded-full bg-[#0e0e0f]/60 animate-pulse" />
                  LIVE
                </span>
              </div>
              {/* Monogramme */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/12 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center p-2.5 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/monogramme-atelier.svg" alt="Atelier" className="w-full h-full object-contain" />
              </div>
              {/* Wordmark */}
              <div className="mb-2 w-full flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-atelier-blanc.svg" alt="Atelier" className="h-3.5 object-contain opacity-85 max-w-[80px]" />
              </div>
              {/* Pitch */}
              <p className="text-[10px] text-white/40 text-center leading-relaxed mt-auto px-1">
                ERP BTP nouvelle génération - devis intelligents, chantiers, rentabilité
              </p>
              {/* URL hover */}
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[9px] text-[#e8d5b0]/60">atelier-btp.fr</span>
                <ArrowRight className="w-2.5 h-2.5 text-[#e8d5b0]/60" />
              </div>
            </div>
          </div>
        </a>

        {/* BUILD — dashboard : appartenance / homepage : pas encore là */}
        {isDashboard ? (
          <div className="col-span-1">
            <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-[#e8d5b0]/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl overflow-hidden h-full min-h-[200px]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/15 to-transparent" />
              <div className="relative z-10 p-4 flex flex-col items-center h-full">
                {/* Badge */}
                <div className="self-end mb-3">
                  {isMember ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0e0e0f] bg-[#e8d5b0] rounded-full px-2 py-0.5 leading-none tracking-wide">
                      <span className="w-1 h-1 rounded-full bg-[#0e0e0f]/50" />
                      TU ES ICI
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-[#e8d5b0]/60 border border-[#e8d5b0]/20 rounded-full px-2 py-0.5 leading-none tracking-wide">
                      LIVE
                    </span>
                  )}
                </div>
                {/* Logo BUILD - lettrage stylisé */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#e8d5b0]/12 to-[#e8d5b0]/4 border border-[#e8d5b0]/20 shadow-[0_4px_16px_rgba(0,0,0,0.35),0_0_12px_rgba(232,213,176,0.06),inset_0_1px_0_rgba(232,213,176,0.15)] flex items-center justify-center mb-3">
                  <span className="text-[#e8d5b0] text-xs font-black tracking-tighter">BLD</span>
                </div>
                <p className="text-[#e8d5b0]/80 text-xs font-semibold mb-1">BUILD</p>
                <p className="text-[10px] text-white/35 text-center leading-relaxed mt-auto px-1">
                  {isMember
                    ? "Tu en fais partie. La méthode, les skills, les frameworks - tout est ici."
                    : "La bibliothèque de systèmes IA pour construire des lignes verticales."}
                </p>
                {isMember && (
                  <Link href="/dashboard" className="flex items-center gap-1 mt-3 text-[9px] text-[#e8d5b0]/50 hover:text-[#e8d5b0]/80 transition-colors">
                    Dashboard <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Homepage - BUILD = pas encore là */
          <div className="col-span-1">
            <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl overflow-hidden h-full min-h-[200px]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
              <div className="relative z-10 p-4 flex flex-col items-center h-full">
                <div className="self-end mb-3">
                  <span className="text-[9px] font-bold text-[#e8d5b0]/50 border border-[#e8d5b0]/15 rounded-full px-2 py-0.5 leading-none tracking-wide">
                    LIVE
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#e8d5b0]/8 to-[#e8d5b0]/2 border border-[#e8d5b0]/12 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(232,213,176,0.08)] flex items-center justify-center mb-3">
                  <span className="text-[#e8d5b0]/50 text-xs font-black tracking-tighter">BLD</span>
                </div>
                <p className="text-[#e8d5b0]/50 text-xs font-semibold mb-1">BUILD</p>
                <p className="text-[10px] text-white/25 text-center leading-relaxed mt-auto px-1">
                  Pas encore à l&apos;intérieur.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mystère 1 */}
        <div className="col-span-1 select-none">
          <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl overflow-hidden opacity-30 h-full min-h-[200px]">
            <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                <span className="text-white/20 text-xl font-extralight">?</span>
              </div>
              <span className="text-[10px] text-white/20 font-medium">Bientôt</span>
            </div>
          </div>
        </div>

        {/* Mystère 2 */}
        <div className="col-span-1 select-none">
          <div className="relative rounded-2xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-xl overflow-hidden opacity-15 h-full min-h-[200px]">
            <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
                <span className="text-white/10 text-xl font-extralight">?</span>
              </div>
              <span className="text-[10px] text-white/10 font-medium">Bientôt</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
