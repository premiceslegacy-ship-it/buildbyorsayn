"use client";

import { NavBar } from "@/components/NavBar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { IllustratedCardGrid } from "@/components/ui/illustrated-card-grid";
import { illustrationSrc } from "@/lib/illustrations";
import { useBeginnerAuth } from "./useBeginnerAuth";
import { SECTIONS, ANGLE_MORT } from "./sections.data";

export default function BeginnerPage() {
  const { tier, displayEmail } = useBeginnerAuth();

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none z-0" />

      {/* Nav */}
      <NavBar
        activeLink="beginner"
        tier={tier}
        displayEmail={displayEmail}
        initials={displayEmail ? displayEmail.substring(0, 2).toUpperCase() : "?"}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-32 relative z-10">
        <div className="pt-6 mb-10 flex flex-col items-center text-center">
          <img
            src="/brand-logos/fondations-tree-mark.png"
            alt=""
            aria-hidden="true"
            className="h-40 w-auto sm:h-56 object-contain mb-6"
            loading="eager"
            decoding="async"
            draggable={false}
          />
          <p className="text-xs uppercase tracking-[0.15em] text-[#e8d5b0]/60 font-semibold">Fondations</p>
          <p className="mt-2 text-sm text-white/40 leading-relaxed max-w-xl">
            Les onze blocs, dans l'ordre d'apprentissage. Ouvre celui dont tu as besoin.
          </p>
        </div>

        <IllustratedCardGrid>
          {SECTIONS.map(({ id, num, label, summary, illustrationId }) => (
            <IllustratedCard
              key={id}
              title={`${num} - ${label}`}
              description={summary}
              imageSrc={illustrationSrc(illustrationId)}
              href={`/beginner/${id}`}
            />
          ))}
          <IllustratedCard
            title={`${ANGLE_MORT.num} - ${ANGLE_MORT.label}`}
            description={ANGLE_MORT.summary}
            imageSrc={illustrationSrc(ANGLE_MORT.illustrationId)}
            href={`/beginner/${ANGLE_MORT.id}`}
          />
        </IllustratedCardGrid>
      </div>

      <ScrollToTop />
    </main>
  );
}
