"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BLOCS_DATA } from "@/lib/mockData";
import { useProgress } from "@/hooks/useProgress";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";

export default function BlocPage() {
  const params = useParams();
  const router = useRouter();
  const blocId = params.id as string;
  const bloc = BLOCS_DATA.find((b) => b.id === blocId);

  const { checkedItems, toggleItem, globalProgress, isLoaded, setLastVisitedBloc } = useProgress();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (blocId) {
      setLastVisitedBloc(blocId);
    }
  }, [blocId, setLastVisitedBloc]);

  useEffect(() => {
    if (bloc && bloc.sections.length > 0) {
      setActiveSection(bloc.sections[0].id);
    }
  }, [bloc]);

  useEffect(() => {
    if (!bloc) return;
    const handleScroll = () => {
      const sectionElements = bloc.sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean);
      if (sectionElements.length === 0) return;

      let currentSectionId = bloc.sections[0].id;

      for (const el of sectionElements) {
        const rect = el!.getBoundingClientRect();
        if (rect.top <= 150) {
          currentSectionId = el!.id;
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10
      ) {
        currentSectionId = bloc.sections[bloc.sections.length - 1].id;
      }

      setActiveSection(currentSectionId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [bloc]);

  const prevProgress = useRef<number | null>(null);

  useEffect(() => {
    if (isLoaded) {
      if (prevProgress.current !== null && prevProgress.current < 100 && globalProgress === 100) {
        const timer = setTimeout(() => {
          router.push("/fin");
        }, 800);
        return () => clearTimeout(timer);
      }
      prevProgress.current = globalProgress;
    }
  }, [globalProgress, isLoaded, router]);

  if (!bloc) {
    return (
      <div className="min-h-screen bg-[#0e0e0f] text-white flex items-center justify-center">
        Bloc introuvable.
      </div>
    );
  }

  const completedSectionsInBloc = bloc.sections.filter((s) =>
    checkedItems.includes(s.id)
  );
  const isBlocCompleted =
    completedSectionsInBloc.length === bloc.sections.length;

  const nextBlocId = String(Number(blocId) + 1);
  const hasNextBloc = BLOCS_DATA.some((b) => b.id === nextBlocId);

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans relative selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      {/* Background Halos */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8 relative z-10">
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au système
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1 w-full max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight text-[#f0ede8]">
              {bloc.titre}
            </h1>

            <div className="space-y-20 text-[rgba(240,237,232,0.7)] leading-relaxed text-[17px]">
              {bloc.sections.map((section) => (
                <section key={section.id} id={section.id} className="space-y-6 scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-[#f0ede8] tracking-tight">
                    {section.title}
                  </h2>
                  {section.content.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}

                  <div className="pt-6 mt-6 border-t border-white/5">
                    <button
                      onClick={() => toggleItem(section.id)}
                      className="group flex items-center gap-4 text-left cursor-pointer w-fit"
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all duration-300 ${
                          checkedItems.includes(section.id)
                            ? "bg-[#e8d5b0] border-[#e8d5b0] shadow-[0_0_12px_rgba(232,213,176,0.3)]"
                            : "border-white/20 bg-black/20 group-hover:border-white/40"
                        }`}
                      >
                        {checkedItems.includes(section.id) && (
                          <Check
                            className="w-3 h-3 text-[#0e0e0f]"
                            strokeWidth={3.5}
                          />
                        )}
                      </div>
                      <span
                        className={`text-[15px] transition-colors duration-300 font-medium ${
                          checkedItems.includes(section.id)
                            ? "text-[#e8d5b0]"
                            : "text-white/50 group-hover:text-white/80"
                        }`}
                      >
                        J'ai assimilé cette partie
                      </span>
                    </button>
                  </div>
                </section>
              ))}
            </div>

            <LiquidCard className="p-8 md:p-10 mt-24 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <p className="text-white/60 text-[15px]">Progression du bloc</p>
                <span className="text-[#e8d5b0] font-medium text-[15px]">
                  {completedSectionsInBloc.length} / {bloc.sections.length}
                </span>
              </div>

              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-8 relative z-10">
                <div
                  className="h-full bg-gradient-to-r from-[#e8d5b0]/40 to-[#e8d5b0] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(232,213,176,0.3)]"
                  style={{
                    width: `${
                      (completedSectionsInBloc.length / bloc.sections.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div
                className={`transition-all duration-500 ease-out relative z-10 ${
                  isBlocCompleted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none absolute"
                }`}
              >
                {hasNextBloc ? (
                  <Link href={`/blocs/${nextBlocId}`} className="w-full sm:w-auto">
                    <LiquidButton
                      className="w-full sm:w-auto"
                      size="xl"
                    >
                      Valider le bloc et passer à la suite
                    </LiquidButton>
                  </Link>
                ) : (
                  <LiquidButton
                    disabled={globalProgress === 100}
                    className="w-full sm:w-auto"
                    size="xl"
                  >
                    {globalProgress === 100 ? "Redirection en cours..." : "Terminer le système"}
                  </LiquidButton>
                )}
              </div>

              {!isBlocCompleted && (
                <p className="text-sm text-white/40 italic relative z-10">
                  Assimilez toutes les parties ci-dessus pour débloquer la suite.
                </p>
              )}
            </LiquidCard>
          </div>

          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
            <h3 className="text-[11px] uppercase tracking-widest text-white/40 mb-6 font-semibold">
              Sur cette page
            </h3>
            <nav className="flex flex-col gap-4">
              {bloc.sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`text-[14px] leading-snug transition-all duration-300 ${
                      isActive
                        ? "text-[#e8d5b0] border-l-2 border-[#e8d5b0] pl-3 font-medium"
                        : "text-white/40 border-l-2 border-white/10 pl-3 hover:text-white/70"
                    }`}
                  >
                    {section.title}
                  </a>
                );
              })}
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
