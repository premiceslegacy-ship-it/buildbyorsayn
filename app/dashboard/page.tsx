"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, X, PhoneCall } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { BLOCS_DATA } from "@/lib/blocCatalog";
import { useProgress } from "@/hooks/useProgress";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { IllustratedCardGrid } from "@/components/ui/illustrated-card-grid";
import { illustrationSrc } from "@/lib/illustrations";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { Suspense } from "react";
import { UpgradedBanner } from "@/components/UpgradedBanner";
import { McpDashboardEntry } from "@/components/McpDashboardEntry";
import { EcosystemMap } from "@/components/EcosystemMap";
import { UpgradeCarousel } from "@/components/UpgradeCarousel";
import { COFFRE_LABEL, COFFRE_PRICE, STRIPE_FULL_CHECKOUT_LINK, UPGRADE_PRICE } from "@/lib/pricing";

export default function DashboardHub() {
  const router = useRouter();
  const { getBlocProgress, globalProgress, isLoaded, lastVisitedBloc } = useProgress();

  const [displayName, setDisplayName] = useState("...");
  const [displayEmail, setDisplayEmail] = useState("");
  const [initials, setInitials] = useState("?");
  const [tier, setTier] = useState<string | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [modal, setModal] = useState<null | "foundations" | "both">(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [sessionAdvances, setSessionAdvances] = useState(0);
  const [checkoutUrls, setCheckoutUrls] = useState<{ beginner: string | null; upgrade: string | null; full: string }>({
    beginner: null,
    upgrade: null,
    full: STRIPE_FULL_CHECKOUT_LINK,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Session invalide:", error?.message);
        router.push("/");
        return;
      }
      const email = user.email ?? "";
      const firstName =
        (user.user_metadata?.first_name as string) ||
        (user.user_metadata?.full_name as string)?.split(" ")[0] ||
        email.split("@")[0];
      setDisplayName(firstName);
      setDisplayEmail(email);
      setInitials(firstName.substring(0, 2).toUpperCase());
      setUserId(user.id);

      // Fetch checkout URLs via server action
      const urls = await getCheckoutUrls();
      setCheckoutUrls(urls);

      // Récupérer tier depuis la table profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("tier, completed_blocks")
        .eq("id", user.id)
        .single();
      const userTier = profile?.tier ?? null;
      setTier(userTier);
      setProfileReady(true);
    };
    fetchUser();
  }, [router]);

  // Animate progress on load
  useEffect(() => {
    if (!isLoaded) return;
    const start = Date.now();
    const duration = 900;
    const end = globalProgress;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedProgress(Math.round(end * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isLoaded, globalProgress]);

  // Dynamic page title
  useEffect(() => {
    if (isLoaded) {
      document.title = `${globalProgress}% : BUILD by Orsayn`;
      return () => { document.title = "BUILD by Orsayn"; };
    }
  }, [isLoaded, globalProgress]);

  useEffect(() => {
    const raw = sessionStorage.getItem("build_session_advances");
    setSessionAdvances(raw ? Number(raw) : 0);
  }, []);

  const displayProgress = isLoaded ? globalProgress : 0;

  const getGreeting = (progress: number) => {
    if (progress === 0) return "Tu viens de démarrer. La plupart s'arrêtent ici.";
    if (progress < 20) return "Les premiers pas. Ne t'arrête pas maintenant.";
    if (progress < 60) return "Tu avances. Les gens qui finissent ça changent de trajectoire.";
    if (progress < 100) return "Presque. Le seul bloqueur restant, c'est toi.";
    return "Capital organique constitué. La suite, c'est le terrain.";
  };

  // Find the bloc to resume: either the last visited, or the first incomplete, or default to bloc 1
  const firstIncompleteBlocId = BLOCS_DATA.find(b => getBlocProgress(b.id) < 100)?.id || null;
  const resumeBlocId = lastVisitedBloc || firstIncompleteBlocId;
  const resumeBloc = BLOCS_DATA.find(b => b.id === resumeBlocId) || BLOCS_DATA[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans relative overflow-x-clip">
      <Suspense>
        <UpgradedBanner />
      </Suspense>

      {/* Halos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

      {/* Top Navigation */}
      <NavBar
        activeLink="dashboard"
        tier={tier}
        displayName={displayName}
        displayEmail={displayEmail}
        initials={initials}
        onFondationsClick={() => setModal("foundations")}
        onStackClick={() => setModal("both")}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-12 pb-24 relative z-10">

        {/* 1. En-tête de page (Welcome & Global Progress) */}
        <header className="flex flex-col gap-4 pt-8 mb-12">
          <h1 className="text-3xl text-[#f0ede8] font-semibold tracking-tight">
            {displayName !== "..." ? `Bienvenue, ${displayName}.` : "Bienvenue."}
          </h1>
          <p className="text-[rgba(240,237,232,0.60)] text-[16px]">
            {isLoaded ? getGreeting(globalProgress) : "Chargement de ta progression..."}
          </p>

          {sessionAdvances >= 2 && (
            <LiquidCard className="w-full max-w-2xl p-4">
              <p className="text-sm font-medium text-[#e8d5b0]">Tu es en zone. Continue.</p>
              <p className="text-xs text-white/45 mt-1">Plusieurs blocs avancés dans cette session. Garde le rythme tant que l'énergie est là.</p>
            </LiquidCard>
          )}

          {/* Barre de progression globale large */}
          <div className="w-full max-w-2xl mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/30 uppercase tracking-wider font-medium">Progression globale</span>
              <span className="text-sm text-[#e8d5b0] font-semibold tabular-nums">{animatedProgress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#e8d5b0]/60 to-[#e8d5b0] h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(232,213,176,0.3)]"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>

          {/* CTA upgrade pour les gratuits */}
          {tier === "free" || tier === null ? (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#e8d5b0]">Tu n&apos;as encore rien à toi.</p>
                <p className="text-xs text-white/40 mt-0.5">Le Bloc 1 est gratuit. Le reste du système te donne les fichiers, skills et méthodes pour construire des lignes verticales IA qui rapportent.</p>
              </div>
              <button
                onClick={() => setModal("both")}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-[80ms] px-4 py-2.5 rounded-lg shadow-[0_3px_0_rgba(140,110,65,0.8)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(140,110,65,0.8)] whitespace-nowrap cursor-pointer"
              >
                Voir les offres <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : null}

          {/* CTA upgrade pour les beginners */}
          {tier === "beginner" && (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#e8d5b0]">Les fondations, c&apos;est le départ. {COFFRE_LABEL}, c&apos;est ce qui construit.</p>
                <p className="text-xs text-white/40 mt-0.5">Débloque les 7 blocs, les sources et les méthodes complètes. {UPGRADE_PRICE}€ de complément - une seule fois.</p>
              </div>
              <button
                onClick={() => setModal("both")}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-[80ms] px-4 py-2.5 rounded-lg shadow-[0_3px_0_rgba(140,110,65,0.8)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(140,110,65,0.8)] whitespace-nowrap cursor-pointer"
              >
                Passer au complet <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Relance contextuelle accompagnement - dès qu'il y a un signal d'engagement réel */}
          {isLoaded && (getBlocProgress("1") >= 100 || tier === "beginner" || tier === "full") && (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.07] rounded-xl px-5 py-4">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 shrink-0 text-[#e8d5b0]" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold text-[#f0ede8]">Tu avances. Tu veux aller plus vite ?</p>
                  <p className="text-xs text-white/40 mt-0.5">3 semaines en 1:1 avec moi jusqu&apos;à ton lancement. Un call gratuit pour voir si ça a du sens.</p>
                </div>
              </div>
              <Link
                href="/accompagnement"
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#e8d5b0] border border-[#e8d5b0]/30 hover:border-[#e8d5b0]/50 hover:bg-[#e8d5b0]/5 transition-all duration-150 px-4 py-2.5 rounded-lg whitespace-nowrap"
              >
                Découvrir l&apos;accompagnement <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </header>

        {/* 2. Carte "Reprendre" (Resume Action) */}
        <LiquidCard
          className="p-8 md:p-10 mb-16 animate-reveal flex flex-col h-full min-h-[200px] group cursor-pointer transition-all"
          onClick={() => router.push(`/blocs/${resumeBloc.id}`)}
        >
          <div className="relative z-10">
            <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0] font-medium mb-3">
              Reprendre là où tu t'es arrêté
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#f0ede8]">
              {resumeBloc.titre}
            </h2>
          </div>

          <div className="relative z-10 mt-auto flex justify-end pt-6">
            <LiquidButton
              size="xl"
              className="pointer-events-none group-hover:scale-105 transition-transform duration-300"
            >
              Continuer le bloc {resumeBloc.id}
            </LiquidButton>
          </div>
        </LiquidCard>

        <McpDashboardEntry tier={tier} profileReady={profileReady} resumeTitle={resumeBloc.titre} />

        {/* 3. La Grille des Blocs (Le Menu), blocs 1 à 6 */}
        <IllustratedCardGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {BLOCS_DATA.filter((b) => b.id !== "7").map((bloc) => {
            const progress = isLoaded ? getBlocProgress(bloc.id) : 0;
            const isLocked = tier !== "full" && bloc.id !== "1";
            const isCompleted = progress === 100;
            const badge = isCompleted
              ? { label: "+250 XP", tone: "accent" as const }
              : tier !== "full" && bloc.id === "1"
                ? { label: "Gratuit", tone: "success" as const }
                : tier !== "full"
                  ? { label: "Premium", tone: "default" as const }
                  : undefined;

            return (
              <IllustratedCard
                key={bloc.id}
                title={bloc.titre}
                imageSrc={illustrationSrc(`blocs-${bloc.id}`)}
                locked={isLocked}
                badge={badge}
                onClick={() => (isLocked ? setModal("both") : router.push(`/blocs/${bloc.id}`))}
                footer={
                  <div className="relative z-10 pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Progression</span>
                      <span className="text-[10px] font-medium text-[#e8d5b0]">{progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#e8d5b0]/40 to-[#e8d5b0] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                }
              />
            );
          })}
        </IllustratedCardGrid>

        {/* 3b. Bloc 7 Récapitulatif, pleine largeur, layout horizontal */}
        {(() => {
          const recap = BLOCS_DATA.find((b) => b.id === "7");
          if (!recap) return null;
          const progress = isLoaded ? getBlocProgress("7") : 0;
          return (
            <div
              className="mt-6 relative border border-white/10 px-6 py-7 sm:px-8 sm:py-8 cursor-pointer transition-colors duration-200 hover:border-[#e8d5b0]/35"
              onClick={() => tier === "full" ? router.push("/blocs/7") : setModal("both")}
            >
              {tier !== "full" && (
                <div className="absolute top-5 right-6 sm:right-8 flex items-center gap-1.5 border border-white/10 px-2.5 py-1">
                  <Lock className="w-3 h-3 text-white/30" />
                  <span className="text-[11px] text-white/30 font-medium">Premium</span>
                </div>
              )}

              <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0] font-medium mb-2">
                Synthèse finale
              </p>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#f0ede8] mb-4">
                {recap.titre}
              </h2>
              <div className="flex items-center gap-4 max-w-xs">
                <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#e8d5b0]/40 to-[#e8d5b0] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-[#e8d5b0] font-medium flex-shrink-0">{progress}%</span>
              </div>
            </div>
          );
        })()}

        {/* 4. Écosystème Orsayn */}
        <div className="mt-6">
          <EcosystemMap variant="dashboard" tier={tier ?? null} />
        </div>


      </div>

      {/* Pricing Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setModal(null)}
        >
          <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setModal(null)}
              className="absolute -top-10 right-0 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <UpgradeCarousel
              showFondations={tier !== "beginner" && modal === "both"}
              fondationsUrl={checkoutUrls.beginner
                ? `${checkoutUrls.beginner}${userId ? `?client_reference_id=${userId}` : ""}`
                : "/checkout"
              }
              systemeUrl={tier === "beginner"
                ? `${checkoutUrls.upgrade ?? checkoutUrls.full}${userId ? `?client_reference_id=${userId}` : ""}`
                : `${checkoutUrls.full}${userId ? `?client_reference_id=${userId}` : ""}`
              }
              systemePrice={tier === "beginner" ? String(UPGRADE_PRICE) : String(COFFRE_PRICE)}
            />

            <div className="mt-6 text-center">
              <p className="text-xs text-white/35 mb-2">
                Tu préfères qu&apos;on construise ça ensemble, en direct ?
              </p>
              <Link
                href="/accompagnement"
                onClick={() => setModal(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8d5b0]/80 hover:text-[#e8d5b0] underline underline-offset-4 transition-colors"
              >
                Découvrir l&apos;accompagnement 1:1
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
