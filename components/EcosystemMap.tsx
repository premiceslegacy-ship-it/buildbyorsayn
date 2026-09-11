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
      <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-2xl">
        {isDashboard
          ? "Le marché est saturé de contenu sur l'IA. Peu de gens buildent vraiment. Voici ce qui est construit, en production, avec les mêmes méthodes que tu apprends ici."
          : "Pas une formation de plus. Des systèmes IA réels, construits en production, sur des marchés précis."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ORSAYN */}
        <div className="relative flex flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-8 min-h-[220px]">
          <div className="flex items-start justify-between gap-3">
            <span className="text-[10px] font-bold text-white/40 border border-white/15 px-2.5 py-1 leading-none tracking-wide">
              ORSAYN
            </span>
          </div>

          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-orsayn.svg" alt="Orsayn" className="w-9 h-9 object-contain mb-3 drop-shadow-[0_0_8px_rgba(255,250,241,0.15)]" />
            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              La structure derrière BUILD et Atelier - même méthode, appliquée à plusieurs marchés.
            </p>
          </div>
        </div>

        {/* ATELIER */}
        <a
          href="https://www.atelier-btp.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br from-[#c9b48a]/[0.06] to-transparent p-6 sm:p-8 min-h-[220px] transition-colors duration-200 hover:border-[#c9b48a]/40"
        >
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-atelier-blanc.svg" alt="Atelier" className="h-4 sm:h-5 object-contain opacity-90 mb-3" />
            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              ERP BTP nouvelle génération - devis intelligents, suivi de chantiers, rentabilité en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-6 text-xs text-[#e8d5b0]/70 group-hover:text-[#e8d5b0] transition-colors">
            <span className="whitespace-nowrap">Voir le produit</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </div>
        </a>

        {/* BUILD */}
        <div
          className={`relative flex flex-col justify-between overflow-hidden border p-6 sm:p-8 min-h-[220px] ${
            isDashboard && isMember ? "border-[#e8d5b0]/35 bg-gradient-to-br from-[#e8d5b0]/[0.06] to-transparent" : "border-white/10"
          }`}
        >
          {isDashboard && isMember && (
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#0e0e0f] bg-[#e8d5b0] px-2.5 py-1 leading-none tracking-wide">
                TU ES ICI
              </span>
            </div>
          )}

          <div>
            <Logo hideText layout="vertical" className="!gap-0 w-9 h-9 mb-3" />
            <p className={`font-extrabold uppercase leading-none mb-3 ${isDashboard && isMember ? "text-[#f0ede8]" : "text-[#f0ede8]/60"}`} style={{ fontSize: "13px", letterSpacing: "2px" }}>
              BUILD
            </p>
            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              {isDashboard && isMember
                ? "La méthode, les skills, les frameworks. Tu en fais partie."
                : "Méthode, skills et frameworks pour construire des lignes IA vendables."}
            </p>
          </div>

          {!isDashboard && (
            <a
              href="#pricing"
              className="flex items-center gap-1.5 mt-6 text-xs text-[#e8d5b0]/60 hover:text-[#e8d5b0] transition-colors"
            >
              <span className="whitespace-nowrap">Rejoindre BUILD</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </a>
          )}
          {isDashboard && isMember && (
            <Link href="/dashboard" className="flex items-center gap-1.5 mt-6 text-xs text-[#e8d5b0]/50 hover:text-[#e8d5b0] transition-colors">
              <span className="whitespace-nowrap">Mon espace</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          )}
        </div>

        {/* Bientôt */}
        <div className="relative flex flex-col justify-between overflow-hidden border border-dashed border-white/[0.08] p-6 sm:p-8 min-h-[220px] select-none">
          <span className="text-[10px] font-bold text-white/20 border border-white/[0.08] px-2.5 py-1 leading-none tracking-wide w-fit">
            BIENTÔT
          </span>
          <p className="text-sm text-white/20 leading-relaxed max-w-xs">
            Une prochaine ligne verticale, construite avec les mêmes méthodes.
          </p>
        </div>

        {/* Bientôt 2 */}
        <div className="relative flex flex-col justify-between overflow-hidden border border-dashed border-white/[0.05] p-6 sm:p-8 min-h-[220px] select-none">
          <span className="text-[10px] font-bold text-white/12 border border-white/[0.05] px-2.5 py-1 leading-none tracking-wide w-fit">
            BIENTÔT
          </span>
          <p className="text-sm text-white/12 leading-relaxed max-w-xs">
            D&apos;autres verticales arrivent au fil de l&apos;eau.
          </p>
        </div>
      </div>
    </div>
  );
}
