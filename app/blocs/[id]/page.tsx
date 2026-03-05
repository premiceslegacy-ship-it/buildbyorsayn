"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Copy, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BLOCS_DATA } from "@/lib/mockData";
import { useProgress } from "@/hooks/useProgress";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { createClient } from "@/lib/supabase/client";
import { toggleBlocCompletion } from "@/app/actions/progress";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <pre className="bg-black/40 border border-white/10 rounded-xl p-5 text-[13px] font-mono text-[rgba(240,237,232,0.75)] overflow-x-auto whitespace-pre-wrap leading-relaxed">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg p-1.5 text-white/60 hover:text-[#e8d5b0] cursor-pointer"
        title="Copier"
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-[#e8d5b0]" strokeWidth={2.5} />
          : <Copy className="w-3.5 h-3.5" />
        }
      </button>
    </div>
  );
}

export default function BlocPage() {
  const params = useParams();
  const router = useRouter();
  const blocId = params.id as string;
  const bloc = BLOCS_DATA.find((b) => b.id === blocId);

  const { checkedItems, toggleItem, globalProgress, isLoaded, setLastVisitedBloc } = useProgress();
  const [activeSection, setActiveSection] = useState<string>("");
  const [isBlocMarked, setIsBlocMarked] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const [checkoutUserId, setCheckoutUserId] = useState<string | null>(null);

  useEffect(() => {
    if (blocId) {
      setLastVisitedBloc(blocId);
    }
  }, [blocId, setLastVisitedBloc]);

  useEffect(() => {
    const fetchCompletedBlocs = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCheckoutUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("completed_blocks, has_paid")
        .eq("id", user.id)
        .single();
      const blocks: number[] = profile?.completed_blocks ?? [];
      setIsBlocMarked(blocks.includes(Number(blocId)));
      setHasPaid(profile?.has_paid === true);
    };
    fetchCompletedBlocs();
  }, [blocId]);

  const handleToggleBloc = async () => {
    setIsToggling(true);
    const optimistic = !isBlocMarked;
    setIsBlocMarked(optimistic);
    const result = await toggleBlocCompletion(Number(blocId));
    if (result.success) {
      setIsBlocMarked(result.completedBlocks.includes(Number(blocId)));
    } else {
      setIsBlocMarked(!optimistic);
    }
    setIsToggling(false);
  };

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

  const LEMON_URL = "https://buildbyorsayn.lemonsqueezy.com/checkout/buy/a314765a-b572-4f72-a1a7-19aeb93899c0";
  const checkoutUrl = checkoutUserId
    ? `${LEMON_URL}?checkout[custom][user_id]=${checkoutUserId}`
    : LEMON_URL;
  const blocIdNum = Number(blocId);
  const showPaywall = hasPaid === false && blocIdNum > 1;
  const showContent = hasPaid === true || blocIdNum === 1;

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

            {/* Skeleton — chargement en cours pour blocs > 1 */}
            {hasPaid === null && blocIdNum > 1 && (
              <div className="mt-16 space-y-8 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-5 bg-white/[0.08] rounded-lg w-2/5" />
                    <div className="h-4 bg-white/[0.05] rounded w-full" />
                    <div className="h-4 bg-white/[0.05] rounded w-5/6" />
                    <div className="h-4 bg-white/[0.05] rounded w-4/5" />
                  </div>
                ))}
              </div>
            )}

            {/* Paywall — blocs 2-7 pour non-payants */}
            {showPaywall && (
              <div className="mt-8">
                {/* Aperçu flouté */}
                <div className="relative overflow-hidden rounded-2xl max-h-[300px]">
                  <div className="blur-sm opacity-30 pointer-events-none select-none space-y-10 p-2">
                    {bloc.sections.slice(0, 3).map((section) => (
                      <div key={section.id} className="space-y-3">
                        <h2 className="text-xl font-semibold text-[#f0ede8]">{section.title}</h2>
                        <p className="text-[rgba(240,237,232,0.7)] text-[17px] leading-relaxed">
                          {section.content.split("\n\n")[0]?.substring(0, 280)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0e0e0f]/60 to-[#0e0e0f]" />
                </div>

                {/* CTA */}
                <div className="mt-10 max-w-md mx-auto">
                  <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                    <div className="w-16 h-16 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(232,213,176,0.1)]">
                      <Lock className="w-7 h-7 text-[#e8d5b0]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#f0ede8] mb-3 tracking-tight">
                      Méthode complète
                    </h2>
                    <p className="text-white/50 text-sm mb-6 leading-relaxed">
                      Débloque les 6 blocs de la méthode, la communauté privée, et toutes les mises à jour à vie.
                    </p>
                    <div className="flex items-baseline justify-center gap-2 mb-8">
                      <span className="text-3xl font-bold text-[#e8d5b0]">67€</span>
                      <span className="text-white/40 text-sm">· accès à vie</span>
                    </div>
                    <a
                      href={checkoutUrl}
                      className="group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] hover:shadow-[0_0_32px_rgba(232,213,176,0.4)]"
                    >
                      Débloquer la méthode complète
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                    <p className="text-center text-xs text-white/25 mt-4">
                      Paiement sécurisé via Lemon Squeezy · Satisfait ou remboursé 30 jours
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contenu normal */}
            {showContent && (
            <>
            <div className="space-y-20 text-[rgba(240,237,232,0.7)] leading-relaxed text-[17px]">
              {bloc.sections.map((section) => (
                <section key={section.id} id={section.id} className="space-y-6 scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-[#f0ede8] tracking-tight">
                    {section.title}
                  </h2>
                  {(() => {
                    const segments = section.content.split(/(```[\s\S]*?```)/g);
                    return segments.map((segment, segIdx) => {
                      if (segment.startsWith("```") && segment.endsWith("```")) {
                        const inner = segment.slice(3, -3);
                        const firstNewline = inner.indexOf("\n");
                        const code = firstNewline === -1 ? inner.trim() : inner.slice(firstNewline + 1);
                        return <CodeBlock key={segIdx} code={code} />;
                      }
                      return segment.trim().split("\n\n").filter(Boolean).map((para, paraIdx) => (
                        <p key={`${segIdx}-${paraIdx}`}>
                          <LinkifiedText text={para} />
                        </p>
                      ));
                    });
                  })()}

                  <div className="pt-6 mt-6 border-t border-white/5">
                    <button
                      onClick={() => toggleItem(section.id)}
                      className="group flex items-center gap-4 text-left cursor-pointer w-fit"
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all duration-300 ${checkedItems.includes(section.id)
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
                        className={`text-[15px] transition-colors duration-300 font-medium ${checkedItems.includes(section.id)
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
                    width: `${(completedSectionsInBloc.length / bloc.sections.length) *
                      100
                      }%`,
                  }}
                />
              </div>

              <div
                className={`transition-all duration-500 ease-out relative z-10 ${isBlocCompleted
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
            {/* Bouton Marquer le bloc comme terminé */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleToggleBloc}
                disabled={isToggling}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-[15px] transition-all duration-300 backdrop-blur-md border shadow-[0_8px_32px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isBlocMarked
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                    : "bg-white/5 border-white/10 text-[#e8d5b0] hover:bg-[#e8d5b0]/10 hover:border-[#e8d5b0]/30 hover:shadow-[0_0_20px_rgba(232,213,176,0.15)]"
                }`}
              >
                {isBlocMarked ? (
                  <>
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                    <span>Bloc terminé · Annuler</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" strokeWidth={2} />
                    <span>Marquer ce bloc comme terminé</span>
                  </>
                )}
              </button>
            </div>
            </>)}
          </div>

          {showContent && (
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
                    className={`text-[14px] leading-snug transition-all duration-300 ${isActive
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
          )}
        </div>
      </div>
    </main>
  );
}
