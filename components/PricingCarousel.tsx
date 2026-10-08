"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CheckGlyph, CoffreGlyph, FondationsGlyph, LockGlyph } from "@/components/ui/pricing-glyphs";

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
    outcome: "À la fin : tu sais transformer une intention en premier résultat utile et le proposer.",
    items: [
      { label: "Ton premier résultat utile, de l'idée à la livraison" },
      { label: "4 compétences prêtes à l'emploi : site, design, étude de marché et motion design" },
      { label: "Présenter et livrer un résultat propre" },
      { label: "Ton assistant retrouve les contenus Fondations utiles au moment où tu en as besoin", mcp: true },
      { label: "Framework ORACLE + 7 blocs système", locked: true },
      { label: "3 compétences en plus : cadrage produit, Apple Design et backend & sécurité", locked: true },
      { label: "Méthode agentique : organiser une activité autour de l'IA", locked: true },
    ],
    buyers: "Point de départ pour construire et tester",
    cta: `Commencer pour ${FONDATIONS_PRICE}€`,
    highlighted: false,
  },
  {
    id: "systeme",
    badge: COFFRE_LABEL,
    icon: CoffreGlyph,
    price: String(COFFRE_PRICE),
    outcome: "À la fin : tu sais ce que tu peux vendre, à qui, et comment le reconstruire sans repartir de zéro.",
    items: [
      { label: "Tout Fondations inclus" },
      { label: "La méthode complète pour construire un produit ou un service autour de l'IA" },
      { label: "7 blocs : de l'idée à une offre que le marché peut payer" },
      { label: "7 compétences complètes : recherche, cadrage, design, backend, site web et motion design" },
      { label: "Choisir une niche, vendre d'abord, construire ensuite" },
      { label: "Méthode agentique : organiser une activité autour de l'IA" },
      { label: "Ton assistant retrouve tout le contenu BUILD inclus dans ton accès", mcp: true },
    ],
    buyers: "Parcours complet pour structurer et répéter",
    cta: `Prendre ${COFFRE_LABEL} - ${COFFRE_PRICE}€`,
    highlighted: true,
  },
];

const MCP_CONNECTOR_LAUNCHED = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
const MCP_CONNECTOR_BETA_VISIBLE = process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true";
const MCP_CONNECTOR_VISIBLE = MCP_CONNECTOR_BETA_VISIBLE || MCP_CONNECTOR_LAUNCHED;

function PricingPlanCard({
  plan,
  url,
}: {
  plan: Plan;
  url: string | null;
}) {
  const Icon = plan.icon;

  return (
    <article
      className={`relative flex h-full flex-col overflow-visible rounded-2xl p-6 backdrop-blur-xl lg:p-8 ${
        plan.highlighted
          ? "border border-[#e8d5b0]/25 bg-gradient-to-b from-white/[0.055] to-white/[0.02] shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_40px_rgba(232,213,176,0.06),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-white/[0.01] shadow-[0_16px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="relative inline-flex whitespace-nowrap rounded-full bg-[#e8d5b0] px-4 py-1.5 text-xs font-bold text-[#0a0908] shadow-[0_2px_0_rgba(100,76,36,0.8),0_4px_12px_rgba(232,213,176,0.25),inset_0_1px_0_rgba(255,255,255,0.5)]">
            Recommandé
          </span>
        </div>
      )}

      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e8d5b0]/20 bg-[#e8d5b0]/10 px-3 py-1 text-xs font-semibold text-[#e8d5b0] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon className="h-3.5 w-3.5" /> {plan.badge}
        </div>
      </div>

      <div className="mb-1 flex items-baseline gap-1.5">
        <span className="text-5xl font-bold text-[#f0ede8]">{plan.price}</span>
        <span className="text-2xl font-bold text-[#f0ede8]">€</span>
        <span className="ml-1 text-sm text-white/35">TTC</span>
      </div>
      <p className="mb-4 text-xs text-white/35">Accès à vie · paiement unique</p>

      <div className="mb-6 flex items-center gap-2.5">
        <CheckGlyph className="h-3.5 w-3.5 shrink-0 text-[#e8d5b0]" />
        <span className="text-xs text-[#c4b89a]">{plan.buyers}</span>
      </div>

      <p className="mb-5 text-sm font-medium leading-snug text-[#e8d5b0]">{plan.outcome}</p>

      <ul className="mb-7 flex flex-1 flex-col gap-2.5">
        {plan.items.filter((item) => !item.mcp || MCP_CONNECTOR_VISIBLE).map((item) => (
          <li key={item.label} className={`flex items-center gap-2.5 ${item.locked ? "opacity-30" : ""}`}>
            {item.locked ? (
              <LockGlyph className="h-3.5 w-3.5 shrink-0 text-white/30" />
            ) : (
              <CheckGlyph className="h-3.5 w-3.5 shrink-0 text-[#e8d5b0]" />
            )}
            <span className={`text-[13px] ${item.locked ? "text-white/40" : "text-[rgba(240,237,232,0.75)]"}`}>
              {item.label}
              {item.locked ? " (non inclus)" : ""}
            </span>
          </li>
        ))}
      </ul>

      {url ? (
        <a
          href={url}
          className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-4 text-sm font-bold text-[#0a0908] transition-all duration-[80ms] ${
            plan.highlighted
              ? "bg-[#e8d5b0] shadow-[0_3px_0_rgba(100,76,36,0.9),0_6px_20px_rgba(0,0,0,0.35),0_0_28px_rgba(232,213,176,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-[#f0dfc0]"
              : "bg-[#e8d5b0]/85 shadow-[0_3px_0_rgba(100,76,36,0.85),0_6px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-[#e8d5b0]"
          } active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0dfc0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f]`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {plan.cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </a>
      ) : (
        <p role="status" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm text-white/45">
          Paiement momentanément indisponible.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-white/25">Paiement sécurisé Stripe · paiement unique · accès à vie</p>
    </article>
  );
}

export function PricingCarousel({
  beginnerUrl,
  fullUrl,
}: {
  beginnerUrl: string | null;
  fullUrl: string;
}) {
  const [index, setIndex] = useState(1);
  const urls: Record<string, string | null> = { fondations: beginnerUrl, systeme: fullUrl };

  const prev = () => setIndex((i) => (i === 0 ? PLANS.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === PLANS.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="mb-8 flex justify-center gap-2 md:hidden">
        {PLANS.map((plan, i) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-150 ${
              i === index
                ? "border-[#e8d5b0] bg-[#e8d5b0] text-[#0a0908] shadow-[0_2px_0_rgba(100,76,36,0.8),0_4px_12px_rgba(232,213,176,0.2)]"
                : "border-white/[0.08] bg-white/[0.03] text-white/45 hover:text-white/70"
            }`}
          >
            {plan.badge} - {plan.price}€
          </button>
        ))}
      </div>

      <div className="relative md:hidden">
        <button
          type="button"
          onClick={prev}
          aria-label="Offre précédente"
          className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-[#e8d5b0] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-colors hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Offre suivante"
          className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-[#e8d5b0] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-colors hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
        >
          <ArrowRight className="h-4.5 w-4.5" />
        </button>

        <div className="overflow-hidden px-2">
          <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
            {PLANS.map((plan) => (
              <div key={plan.id} className="w-full shrink-0 px-1 pt-4">
                <PricingPlanCard plan={plan} url={urls[plan.id]} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {PLANS.map((plan, i) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir ${plan.badge}`}
              aria-pressed={i === index}
              className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
            >
              <span aria-hidden="true" className={`block h-1.5 rounded-full transition-all duration-200 ${i === index ? "w-6 bg-[#e8d5b0]" : "w-3 bg-white/25 hover:bg-white/40"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="hidden items-stretch gap-6 md:grid md:grid-cols-2">
        {PLANS.map((plan) => (
          <PricingPlanCard key={plan.id} plan={plan} url={urls[plan.id]} />
        ))}
      </div>
    </div>
  );
}
