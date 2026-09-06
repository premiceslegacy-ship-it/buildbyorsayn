"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CheckGlyph, CoffreGlyph, FondationsGlyph, LockGlyph, MarkGlyph } from "@/components/ui/pricing-glyphs";

import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_PRICE } from "@/lib/pricing";

type Plan = {
  id: string;
  badge: string;
  icon: typeof CoffreGlyph;
  price: string;
  outcome: string;
  items: { label: string; locked?: boolean; mcp?: boolean }[];
  buyers: string;
  cta: string;
  highlighted: boolean;
};

const PLANS: Plan[] = [
  {
    id: "fondations",
    badge: "Fondations",
    icon: FondationsGlyph,
    price: String(FONDATIONS_PRICE),
    outcome: "À la fin : tu sais transformer une intention en premier asset vendable et le proposer.",
    items: [
      { label: "Ton premier asset utile, de l'idée à la livraison" },
      { label: "3 skills prêts à l'emploi : site, design, étude de marché" },
      { label: "Présenter et livrer un résultat propre" },
      { label: "BUILD dans Claude et ChatGPT, avec les contenus Fondations", mcp: true },
      { label: "Framework ORACLE + 7 blocs système", locked: true },
      { label: "3 skills en plus : SaaS, backend, design Apple", locked: true },
    ],
    buyers: "121 personnes ont commencé ici",
    cta: `Commencer pour ${FONDATIONS_PRICE}€`,
    highlighted: false,
  },
  {
    id: "systeme",
    badge: COFFRE_LABEL,
    icon: CoffreGlyph,
    price: String(COFFRE_PRICE),
    outcome: "À la fin : tu sais ce que tu vends, à qui, et tu peux le refaire à volonté.",
    items: [
      { label: "Tout Fondations inclus" },
      { label: "Framework ORACLE : l'IA exécute comme un employé senior" },
      { label: "7 blocs : de l'idée au client qui paye" },
      { label: "6 skills complets : sites, SaaS, backend sécurisé, design Apple" },
      { label: "Choisir une niche, vendre d'abord, construire ensuite" },
      { label: "BUILD dans Claude et ChatGPT, avec tout ton accès BUILD", mcp: true },
    ],
    buyers: "71 personnes construisent avec",
    cta: `Prendre ${COFFRE_LABEL} - ${COFFRE_PRICE}€`,
    highlighted: true,
  },
];

const MCP_CONNECTOR_LAUNCHED = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
const MCP_CONNECTOR_BETA_VISIBLE = process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true";
const MCP_CONNECTOR_VISIBLE = MCP_CONNECTOR_BETA_VISIBLE || MCP_CONNECTOR_LAUNCHED;

function Marks() {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <MarkGlyph key={i} className="w-3.5 h-3.5 text-[#e8d5b0] fill-[#e8d5b0]" />
      ))}
    </span>
  );
}

export function PricingCarousel({
  beginnerUrl,
  fullUrl,
}: {
  beginnerUrl: string;
  fullUrl: string;
}) {
  const [index, setIndex] = useState(1);
  const urls: Record<string, string> = { fondations: beginnerUrl, systeme: fullUrl };

  const prev = () => setIndex((i) => (i === 0 ? PLANS.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === PLANS.length - 1 ? 0 : i + 1));

  return (
    <div>
      {/* Sélecteur d'offre */}
      <div className="flex justify-center gap-2 mb-8">
        {PLANS.map((plan, i) => (
          <button
            key={plan.id}
            onClick={() => setIndex(i)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer border ${
              i === index
                ? "bg-[#e8d5b0] text-[#0a0908] border-[#e8d5b0] shadow-[0_2px_0_rgba(100,76,36,0.8),0_4px_12px_rgba(232,213,176,0.2)]"
                : "bg-white/[0.03] text-white/45 border-white/[0.08] hover:text-white/70"
            }`}
          >
            {plan.badge} - {plan.price}€
          </button>
        ))}
      </div>

      <div className="relative">
        {/* Flèches */}
        <button
          onClick={prev}
          aria-label="Offre précédente"
          className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-[#e8d5b0] hover:bg-white/[0.1] transition-colors cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={next}
          aria-label="Offre suivante"
          className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-[#e8d5b0] hover:bg-white/[0.1] transition-colors cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          <ArrowRight className="w-4.5 h-4.5" />
        </button>

        {/* Piste du carousel */}
        <div className="overflow-hidden px-2 sm:px-10">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <div key={plan.id} className="w-full flex-shrink-0 px-1 sm:px-2 pt-4">
                  <div
                    className={`relative overflow-visible rounded-2xl p-6 sm:p-8 flex flex-col backdrop-blur-xl ${
                      plan.highlighted
                        ? "bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-[#e8d5b0]/25 shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_40px_rgba(232,213,176,0.06),inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.09] shadow-[0_16px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="relative overflow-hidden inline-flex text-xs font-bold text-[#0a0908] bg-[#e8d5b0] rounded-full px-4 py-1.5 shadow-[0_2px_0_rgba(100,76,36,0.8),0_4px_12px_rgba(232,213,176,0.25),inset_0_1px_0_rgba(255,255,255,0.5)] whitespace-nowrap">
                          <span className="relative z-10">Recommandé</span>
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8d5b0] bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        <Icon className="w-3.5 h-3.5" /> {plan.badge}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-5xl font-bold text-[#f0ede8]">{plan.price}</span>
                      <span className="text-2xl font-bold text-[#f0ede8]">€</span>
                      <span className="text-white/35 text-sm ml-1">TTC</span>
                    </div>
                    <p className="text-white/35 text-xs mb-4">Accès à vie - paiement unique</p>

                    {/* Note et répartition des membres */}
                    <div className="flex items-center gap-2.5 mb-6">
                      <Marks />
                      <span className="text-xs text-[#c4b89a]">{plan.buyers}</span>
                    </div>

                    <p className="text-sm text-[#e8d5b0] font-medium mb-5 leading-snug">
                      {plan.outcome}
                    </p>

                    <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                      {plan.items.filter((item) => !item.mcp || MCP_CONNECTOR_VISIBLE).map((item) => (
                        <li
                          key={item.label}
                          className={`flex items-center gap-2.5 ${item.locked ? "opacity-30" : ""}`}
                        >
                          {item.locked ? (
                            <LockGlyph className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                          ) : (
                            <CheckGlyph className="w-3.5 h-3.5 text-[#e8d5b0] flex-shrink-0" />
                          )}
                          <span className={`text-[13px] ${item.locked ? "text-white/40" : "text-[rgba(240,237,232,0.75)]"}`}>
                            {item.label}
                            {item.locked ? " (non inclus)" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={urls[plan.id]}
                      className={`relative overflow-hidden group flex items-center justify-center gap-2 w-full py-4 px-5 rounded-xl font-bold text-[#0a0908] transition-all duration-[80ms] text-sm ${
                        plan.highlighted
                          ? "bg-[#e8d5b0] hover:bg-[#f0dfc0] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_20px_rgba(0,0,0,0.35),0_0_28px_rgba(232,213,176,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                          : "bg-[#e8d5b0]/85 hover:bg-[#e8d5b0] shadow-[0_3px_0_rgba(100,76,36,0.85),0_6px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]"
                      } active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {plan.cta}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </span>
                    </a>
                    <p className="text-center text-xs text-white/25 mt-3">
                      Paiement sécurisé Stripe - Satisfait ou remboursé 30 jours
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points de navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {PLANS.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => setIndex(i)}
              aria-label={`Voir ${plan.badge}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                i === index ? "w-6 bg-[#e8d5b0]" : "w-1.5 bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
