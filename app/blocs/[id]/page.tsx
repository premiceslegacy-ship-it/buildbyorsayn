"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, Copy, Lock, ArrowRight, Play, Download, FileText } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BLOCS_DATA } from "@/lib/mockData";
import { useProgress } from "@/hooks/useProgress";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { createClient } from "@/lib/supabase/client";
import { toggleBlocCompletion } from "@/app/actions/progress";
import { COFFRE_LABEL, COFFRE_PRICE, STRIPE_FULL_CHECKOUT_LINK } from "@/lib/pricing";
import { McpStudyCallout } from "@/components/McpStudyCallout";
import { getMcpConnectionStatus } from "@/app/actions/mcpConnections";
import type { McpConnectionStatus } from "@/lib/mcp/connectionStatus";

const MCP_CONNECTOR_LAUNCHED = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
const MCP_CONNECTOR_BETA_VISIBLE = process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true";
const MCP_CONNECTOR_VISIBLE = MCP_CONNECTOR_BETA_VISIBLE || MCP_CONNECTOR_LAUNCHED;

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
  const [tier, setTier] = useState<string | null>(null);
  const hasMcpAccess = tier === "beginner" || tier === "full" || tier === "admin";
  const [checkoutUserId, setCheckoutUserId] = useState<string | null>(null);
  const [mcpConnectionStatus, setMcpConnectionStatus] = useState<McpConnectionStatus>("unknown");

  useEffect(() => {
    if (blocId) {
      setLastVisitedBloc(blocId);
    }
  }, [blocId, setLastVisitedBloc]);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCheckoutUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", user.id)
        .single();
      setTier(profile?.tier ?? null);
    };
    fetchProfile();
  }, [blocId]);

  useEffect(() => {
    if (!MCP_CONNECTOR_VISIBLE || !hasMcpAccess) return;
    getMcpConnectionStatus()
      .then(setMcpConnectionStatus)
      .catch(() => setMcpConnectionStatus("unknown"));
  }, [hasMcpAccess]);

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

  const currentBlocIndex = BLOCS_DATA.findIndex((item) => item.id === blocId);
  const nextBloc = currentBlocIndex >= 0 ? BLOCS_DATA[currentBlocIndex + 1] : undefined;
  const nextBlocId = nextBloc?.id;
  const hasNextBloc = Boolean(nextBlocId);

  const checkoutUrl = checkoutUserId
    ? `${STRIPE_FULL_CHECKOUT_LINK}?client_reference_id=${checkoutUserId}`
    : STRIPE_FULL_CHECKOUT_LINK;
  const showPaywall = tier !== "full" && tier !== null && currentBlocIndex > 0;
  const showContent = tier === "full" || currentBlocIndex === 0;
  const markSessionAdvance = () => {
    const current = Number(sessionStorage.getItem("build_session_advances") ?? "0");
    sessionStorage.setItem("build_session_advances", String(current + 1));
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans relative selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      {/* Background Halos */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 relative z-10">
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
          <div className={showPaywall ? "w-full max-w-3xl mx-auto" : "flex-1 w-full max-w-3xl"}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-16 tracking-tight text-[#f0ede8]">
              {bloc.titre}
            </h1>

            {MCP_CONNECTOR_VISIBLE && hasMcpAccess && showContent && mcpConnectionStatus === "disconnected" ? (
              <McpStudyCallout />
            ) : null}

            {/* Skeleton : chargement en cours pour blocs > 1 */}
            {tier === null && currentBlocIndex > 0 && (
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

            {/* Paywall : blocs 2-7 pour non-payants */}
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
                  <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 text-center shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                    <div className="w-16 h-16 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(232,213,176,0.1)]">
                      <Lock className="w-7 h-7 text-[#e8d5b0]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#f0ede8] mb-3 tracking-tight">
                      Le système pour construire ton business
                    </h2>
                    <p className="text-white/50 text-sm mb-6 leading-relaxed">
                      6 méthodes complètes pour créer, vendre et scaler. Communauté privée de builders actifs + toutes les mises à jour à vie incluses.
                    </p>
                    <div className="flex items-baseline justify-center gap-2 mb-8">
                      <span className="text-3xl font-bold text-[#e8d5b0]">{COFFRE_PRICE}€</span>
                      <span className="text-white/40 text-sm">· accès à vie</span>
                    </div>
                    <a
                      href={checkoutUrl}
                      className="group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] hover:shadow-[0_0_32px_rgba(232,213,176,0.4)]"
                    >
                      Je veux {COFFRE_LABEL}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                    <p className="text-center text-xs text-white/25 mt-4">
                      Paiement sécurisé via Stripe · Satisfait ou remboursé 30 jours
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
                  {"skillFiles" in section && Array.isArray((section as { skillFiles?: { slug: string; title: string; description: string }[] }).skillFiles) &&
                    (section as { skillFiles: { slug: string; title: string; description: string }[] }).skillFiles.map((skill) => (
                      <div key={skill.slug} className="pt-2">
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/5 to-transparent pointer-events-none" />
                          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                              <FileText className="w-6 h-6 text-[#e8d5b0]" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-semibold tracking-tight text-[#f0ede8]">
                                {skill.title}
                              </p>
                              <p className="text-sm text-white/45 leading-relaxed mt-1">
                                {skill.description}
                              </p>
                            </div>
                            <a
                              href={`/api/skills/${skill.slug}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] transition-all duration-200 hover:bg-[#f0dfc0] shadow-[0_0_24px_rgba(232,213,176,0.18)]"
                            >
                              <Download className="w-4 h-4" />
                              Télécharger
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  }

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

            {/* Encart vidéos liées */}
            {(bloc as any).videos?.length > 0 && (
              <div className="mt-16 pt-8 border-t border-white/5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-4">
                  Vidéos liées à ce bloc
                </p>
                <Link
                  href={`/videos#bloc-${blocId}`}
                  className="inline-flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.15)] transition-all duration-300">
                    <Play className="w-4 h-4 text-[#e8d5b0]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#f0ede8] group-hover:text-[#e8d5b0] transition-colors duration-300">
                      {(bloc as any).videos.length} vidéo{(bloc as any).videos.length > 1 ? "s" : ""} disponible{(bloc as any).videos.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-[13px] text-white/40">Voir dans la bibliothèque →</p>
                  </div>
                </Link>
              </div>
            )}

            <LiquidCard className="p-6 md:p-10 mt-16 sm:mt-24 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
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
                  <LiquidButton
                    className="w-full sm:w-auto"
                    size="xl"
                    onClick={async () => {
                      markSessionAdvance();
                      await toggleBlocCompletion(Number(blocId));
                      router.refresh();
                      router.push(`/blocs/${nextBlocId}`);
                    }}
                  >
                    Valider le bloc et passer à la suite
                  </LiquidButton>
                ) : (
                  <LiquidButton
                    disabled={globalProgress === 100}
                    className="w-full sm:w-auto"
                    size="xl"
                    onClick={async () => {
                      if (globalProgress !== 100) {
                        markSessionAdvance();
                        await toggleBlocCompletion(Number(blocId));
                        router.refresh();
                      }
                    }}
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
