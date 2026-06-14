"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const PHASES = [
  {
    num: "01",
    titre: "L'Absorption",
    label: "La Greffe",
    desc: "Tu identifies les compétences des meilleurs et tu les greffes. Tu extrais leurs principes, leurs frameworks, leurs erreurs. Tu l'encodes dans des structures qui t'appartiennent. Pas loué. Pas emprunté. Distillé.",
  },
  {
    num: "02",
    titre: "Le Sprint Cash",
    label: "Premiers 10k€",
    desc: "Tu utilises ce que tu as absorbé pour générer du cashflow rapidement. Services, SaaS, automatisations. Peu importe le format. L'objectif : une dignité financière de base. Une fois ce coussin en place, tout le reste devient possible.",
  },
  {
    num: "03",
    titre: "La Grande Distillation",
    label: "Capital organique",
    desc: "Tu encodes ce que tu as vécu. Chaque méthode, chaque process qui a fonctionné devient un actif permanent. Ce qui est distillé ne peut pas être retiré. Becker appelait ça le capital humain. Ici, c'est la version 2.0.",
  },
  {
    num: "∞",
    titre: "L'Antifragile",
    label: "Liberté totale",
    desc: "Tu ne subis plus rien. Taleb avait raison : tu sors renforcé de chaque perturbation. Les outils changent, les plateformes ferment. Ton capital organique reste. Tu choisis : lignes verticales, pierre, équity.",
  },
];

export function ProtocoleSlider() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(PHASES.length - 1, i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) next();
      else prev();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Carousel track */}
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {PHASES.map((phase) => (
            <div key={phase.num} className="w-full flex-shrink-0 p-[1px]">
              <div
                className="relative flex flex-col gap-5 rounded-2xl p-6 sm:p-7 bg-[#161617]/90 backdrop-blur-xl border border-white/[0.08] min-h-[260px]"
                style={{
                  boxShadow:
                    "0 1px 0 rgba(201,180,138,0.18), 0 6px 0 rgba(70,55,30,0.9), 0 14px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.25)",
                }}
              >
                {/* Gradient top shine */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between relative z-10">
                  <span className="font-mono text-[#c9b48a]/30 font-bold text-3xl leading-none select-none">
                    {phase.num}
                  </span>
                  {/* Dots */}
                  <div className="flex gap-1.5 mt-1">
                    {PHASES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Phase ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === current
                            ? "bg-[#c9b48a] w-6"
                            : "bg-white/15 w-1.5 hover:bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f0ede8] leading-tight">
                    {phase.titre}
                  </h3>
                  <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#c9b48a]">
                    {phase.label}
                  </p>
                  <p className="text-sm text-[#8a8070] leading-relaxed mt-1">
                    {phase.desc}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between relative z-10 pt-3 border-t border-white/[0.05]">
                  <button
                    onClick={prev}
                    disabled={current === 0}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-[80ms] ${
                      current === 0
                        ? "text-white/15 cursor-not-allowed"
                        : "text-[#c9b48a] hover:bg-[#c9b48a]/10 active:translate-y-[1px]"
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Précédent
                  </button>
                  <span className="text-[11px] text-white/20 tabular-nums select-none">
                    {current + 1} / {PHASES.length}
                  </span>
                  <button
                    onClick={next}
                    disabled={current === PHASES.length - 1}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-[80ms] ${
                      current === PHASES.length - 1
                        ? "text-white/15 cursor-not-allowed"
                        : "text-[#c9b48a] hover:bg-[#c9b48a]/10 active:translate-y-[1px]"
                    }`}
                  >
                    Suivant
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA vers page complète */}
      <Link
        href="/protocole"
        className="group inline-flex items-center gap-2 self-start text-sm text-[#8a8070] hover:text-[#c9b48a] transition-colors duration-200"
      >
        Lire le Protocole Zéro complet
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
