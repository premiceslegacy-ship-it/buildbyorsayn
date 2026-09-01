"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Star, GraduationCap, Zap, Lock } from "lucide-react";
import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_PRICE } from "@/lib/pricing";

type Plan = {
  id: string;
  badge: string;
  icon: typeof Zap;
  price: string;
  eyebrow: string;
  headline: string;
  outcome: string;
  items: { label: string; locked?: boolean }[];
  buyers: string;
  ctaLabel: string;
};

const PLANS: Plan[] = [
  {
    id: "fondations",
    badge: "Fondations",
    icon: GraduationCap,
    price: String(FONDATIONS_PRICE),
    eyebrow: "Pour commencer léger",
    headline: "Tu débutes. Tu veux juste ton premier résultat concret.",
    outcome: "À la fin : une première offre présentable, livrée et proposée à la bonne personne.",
    items: [
      { label: "Ton premier asset utile, de l'idée à la livraison" },
      { label: "Comprendre l'IA assez pour ne plus jamais être perdu" },
      { label: "Des visuels pro sans designer ni budget" },
      { label: "2 skills prêts à l'emploi inclus" },
      { label: "Framework ORACLE + 7 blocs système", locked: true },
      { label: "Skills encodés complets", locked: true },
    ],
    buyers: "121 personnes ont commencé ici",
    ctaLabel: `Rester sur Fondations - ${FONDATIONS_PRICE}€`,
  },
  {
    id: "systeme",
    badge: COFFRE_LABEL,
    icon: Zap,
    price: String(COFFRE_PRICE),
    eyebrow: "Pour ceux qui visent le vrai résultat",
    headline: "Tu es aguerri. Tu veux la méthode entière, pas un aperçu.",
    outcome: "À la fin : tu sais ce que tu vends, à qui, et tu peux le refaire.",
    items: [
      { label: "Tout Fondations inclus" },
      { label: "Framework ORACLE : l'IA exécute comme un employé senior" },
      { label: "7 blocs : de l'idée au client qui paye" },
      { label: "Skills encodés prêts à copier-coller" },
      { label: "Choisir une niche, vendre d'abord, construire ensuite" },
      { label: "Sources et ressources complètes" },
    ],
    buyers: "71 personnes construisent avec",
    ctaLabel: `Prendre ${COFFRE_LABEL}`,
  },
];

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-[#e8d5b0] fill-[#e8d5b0]" strokeWidth={0} />
      ))}
    </span>
  );
}

/**
 * Carousel fondations / LE COFFRE, utilisé dans la modal upgrade du dashboard.
 * Cadrage volontaire en "niveau" (léger vs aguerri) pour challenger l'égo business
 * plutôt que de juxtaposer les deux offres côte à côte.
 */
export function UpgradeCarousel({
  fondationsUrl,
  fondationsPrice,
  systemeUrl,
  systemePrice,
  showFondations = true,
  initialIndex,
}: {
  fondationsUrl: string;
  fondationsPrice?: string;
  systemeUrl: string;
  systemePrice?: string;
  showFondations?: boolean;
  initialIndex?: number;
}) {
  const plans = showFondations ? PLANS : PLANS.filter((p) => p.id === "systeme");
  const urls: Record<string, string> = { fondations: fondationsUrl, systeme: systemeUrl };
  const prices: Record<string, string> = {
    fondations: fondationsPrice ?? PLANS[0].price,
    systeme: systemePrice ?? PLANS[1].price,
  };

  const [index, setIndex] = useState(
    initialIndex !== undefined ? initialIndex : plans.length - 1
  );

  const prev = () => setIndex((i) => (i === 0 ? plans.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === plans.length - 1 ? 0 : i + 1));

  return (
    <div>
      {plans.length > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => setIndex(i)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer border ${
                i === index
                  ? "bg-[#e8d5b0] text-[#0a0908] border-[#e8d5b0]"
                  : "bg-white/[0.03] text-white/45 border-white/[0.08] hover:text-white/70"
              }`}
            >
              {plan.badge}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        {plans.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Offre précédente"
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-[#e8d5b0] hover:bg-white/[0.12] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              aria-label="Offre suivante"
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-[#e8d5b0] hover:bg-white/[0.12] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="overflow-hidden px-1 sm:px-8">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSysteme = plan.id === "systeme";
              return (
                <div key={plan.id} className="w-full flex-shrink-0 px-1">
                  <div
                    className={`relative overflow-hidden rounded-2xl p-6 flex flex-col backdrop-blur-xl ${
                      isSysteme
                        ? "bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-[#e8d5b0]/25 shadow-[0_0_32px_rgba(232,213,176,0.08)]"
                        : "bg-white/[0.04] border border-white/[0.08]"
                    }`}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/35 mb-3">
                      {plan.eyebrow}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8d5b0] bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-3 py-1">
                        <Icon className="w-3 h-3" /> {plan.badge}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#f0ede8]">{prices[plan.id]}</span>
                        <span className="text-sm font-bold text-[#f0ede8]">€</span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-[#f0ede8] mb-2 leading-snug">
                      {plan.headline}
                    </p>
                    <p className="text-[13px] text-[#c4b89a] mb-4 leading-snug">
                      {plan.outcome}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <Stars />
                      <span className="text-xs text-white/45">{plan.buyers}</span>
                    </div>

                    <ul className="flex flex-col gap-2 mb-5 flex-1">
                      {plan.items.map((item) => (
                        <li key={item.label} className={`flex items-start gap-2 ${item.locked ? "opacity-30" : ""}`}>
                          {item.locked ? (
                            <Lock className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-[#e8d5b0] flex-shrink-0 mt-0.5" strokeWidth={2} />
                          )}
                          <span className={`text-[13px] ${item.locked ? "text-white/40" : "text-white/70"}`}>
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={urls[plan.id]}
                      className={`relative overflow-hidden group flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl font-bold text-[#0a0908] transition-all duration-[80ms] text-sm ${
                        isSysteme
                          ? "bg-[#e8d5b0] hover:bg-[#f0dfc0] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_20px_rgba(0,0,0,0.35),0_0_24px_rgba(232,213,176,0.15)]"
                          : "bg-white/10 hover:bg-white/15 text-[#f0ede8]"
                      } active:translate-y-[2px]`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {plan.ctaLabel}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {plans.length > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {plans.map((plan, i) => (
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
        )}
      </div>
    </div>
  );
}
