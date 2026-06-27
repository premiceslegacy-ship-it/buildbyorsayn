"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workflow, Layers, LayoutTemplate, FileCode, Briefcase, ArrowRight, Eye, Flag, Lock, X } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { BLOCS_DATA } from "@/lib/mockData";
import { useProgress } from "@/hooks/useProgress";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { Suspense } from "react";
import { UpgradedBanner } from "@/components/UpgradedBanner";

const ICONS: Record<string, any> = {
  "1": Workflow,
  "2": Layers,
  "3": LayoutTemplate,
  "4": FileCode,
  "5": Briefcase,
  "6": Eye,
  "7": Flag,
};

export default function DashboardHub() {
  const router = useRouter();
  const { getBlocProgress, globalProgress, isLoaded, lastVisitedBloc } = useProgress();

  const [displayName, setDisplayName] = useState("...");
  const [displayEmail, setDisplayEmail] = useState("");
  const [initials, setInitials] = useState("?");
  const [tier, setTier] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "foundations" | "both">(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [sessionAdvances, setSessionAdvances] = useState(0);
  const [checkoutUrls, setCheckoutUrls] = useState<{ beginner: string | null; upgrade: string | null; full: string }>({
    beginner: null,
    upgrade: null,
    full: "https://buy.stripe.com/dRm8wQ8JMgSd7taaqc5AQ0a",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Session invalide:", error?.message);
        router.push("/login");
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
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans relative overflow-hidden">
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
              <a href={`${checkoutUrls.full}${userId ? `?client_reference_id=${userId}` : ""}`} className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-[80ms] px-4 py-2.5 rounded-lg shadow-[0_3px_0_rgba(140,110,65,0.8)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(140,110,65,0.8)] whitespace-nowrap">
                Prendre le système complet <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          ) : null}

          {/* CTA upgrade pour les beginners */}
          {tier === "beginner" && (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#e8d5b0]">Les fondations, c&apos;est le départ. Le système complet, c&apos;est ce qui construit.</p>
                <p className="text-xs text-white/40 mt-0.5">Débloque les 7 blocs, les sources et les méthodes complètes. 400€ de complément - une seule fois.</p>
              </div>
              <a href={`${checkoutUrls.upgrade ?? checkoutUrls.full}${userId ? `?client_reference_id=${userId}` : ""}`} className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-[80ms] px-4 py-2.5 rounded-lg shadow-[0_3px_0_rgba(140,110,65,0.8)] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(140,110,65,0.8)] whitespace-nowrap">
                Passer au complet <ArrowRight className="w-3 h-3" />
              </a>
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

        {/* 3. La Grille des Blocs (Le Menu), blocs 1 à 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOCS_DATA.filter((b) => b.id !== "7").map((bloc) => {
            const Icon = ICONS[bloc.id] || Workflow;
            const progress = isLoaded ? getBlocProgress(bloc.id) : 0;
            const isLocked = tier !== "full" && bloc.id !== "1";
            const isCompleted = progress === 100;
            const isNextUp = isLoaded && bloc.id === firstIncompleteBlocId && !isLocked;

            return (
              <div
                key={bloc.id}
                className="group cursor-pointer animate-reveal block h-full"
                onClick={() => isLocked ? setModal("both") : router.push(`/blocs/${bloc.id}`)}
              >
                <motion.div whileHover="hover" className="h-full">
                  <LiquidCard className={`p-6 text-left transition-all duration-500 flex flex-col h-full min-h-[220px] ${isNextUp ? "animate-pulse shadow-[0_0_0_1px_rgba(232,213,176,0.18),0_0_30px_rgba(232,213,176,0.12)]" : ""}`}>
                    {/* Glow background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Glow pulsant pour le prochain bloc */}
                    {isNextUp && (
                      <div className="absolute inset-0 rounded-lg opacity-100 bg-[#e8d5b0]/[0.035] pointer-events-none" />
                    )}

                    {/* Badge accès */}
                    {!isCompleted && tier !== "full" && bloc.id !== "1" && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                        <Lock className="w-3 h-3 text-white/30" />
                        <span className="text-[11px] text-white/30 font-medium">Premium</span>
                      </div>
                    )}
                    {!isCompleted && tier !== "full" && bloc.id === "1" && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                        <span className="text-[11px] text-emerald-400 font-medium">Gratuit</span>
                      </div>
                    )}
                    {/* Badge XP si complété */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 rounded-full px-2.5 py-1">
                        <span className="text-[11px] text-[#e8d5b0] font-semibold">+250 XP</span>
                      </div>
                    )}
                    {isCompleted && (
                      <motion.div
                        initial={{ opacity: 0.45, scale: 0.98 }}
                        animate={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                        className="absolute inset-0 rounded-lg bg-[#e8d5b0]/15 pointer-events-none"
                      />
                    )}

                    {/* Icône Fintech illuminée */}
                    <div className={`relative w-12 h-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.2)] transition-all duration-500 mb-6 ${isNextUp ? "border-[#e8d5b0]/20 shadow-[0_0_16px_rgba(232,213,176,0.15)]" : ""}`}>
                      <AnimatedIcon icon={Icon} className="w-6 h-6 text-[#e8d5b0] drop-shadow-[0_0_10px_rgba(232,213,176,0.8)]" strokeWidth={1.5} />
                    </div>

                    <h3 className="relative text-xl font-semibold text-[#f0ede8] mb-4 tracking-tight">
                      {bloc.titre}
                    </h3>

                    <div className="relative mt-auto pt-4 w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
                          Progression
                        </span>
                        <span className={`text-xs font-medium ${isCompleted ? "text-[#e8d5b0]" : "text-[#e8d5b0]"}`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#e8d5b0]/40 to-[#e8d5b0] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </LiquidCard>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* 3b. Bloc 7 Récapitulatif, pleine largeur, layout horizontal */}
        {(() => {
          const recap = BLOCS_DATA.find((b) => b.id === "7");
          if (!recap) return null;
          const Icon = ICONS["7"] || Flag;
          const progress = isLoaded ? getBlocProgress("7") : 0;
          return (
            <div className="mt-6">
              <div
                className="group block cursor-pointer"
                onClick={() => tier === "full" ? router.push("/blocs/7") : setModal("both")}
              >
                <motion.div whileHover="hover">
                  <LiquidCard className="p-8 md:p-10 transition-all duration-500 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    {tier !== "full" && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                        <Lock className="w-3 h-3 text-white/30" />
                        <span className="text-[11px] text-white/30 font-medium">Premium</span>
                      </div>
                    )}

                    <div className="relative flex flex-col sm:flex-row items-start gap-10">
                      {/* Icône */}
                      <div className="flex-shrink-0 w-14 h-14 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.2)] transition-all duration-500">
                        <AnimatedIcon icon={Icon} className="w-7 h-7 text-[#e8d5b0] drop-shadow-[0_0_10px_rgba(232,213,176,0.8)]" strokeWidth={1.5} />
                      </div>

                      {/* Texte */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0] font-medium mb-2">
                          Synthèse finale
                        </p>
                        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#f0ede8] mb-3">
                          {recap.titre}
                        </h2>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex-1 max-w-xs h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#e8d5b0]/40 to-[#e8d5b0] rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#e8d5b0] font-medium flex-shrink-0">{progress}%</span>
                        </div>
                      </div>
                    </div>
                  </LiquidCard>
                </motion.div>
              </div>
            </div>
          );
        })()}

        {/* 4. Verticale en prod, preuve concrète visible par tous */}
        <div className="mt-6">
          <a
            href="https://www.atelier-btp.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <LiquidCard className="p-8 md:p-10 transition-all duration-300 cursor-pointer">
              <div className="relative flex flex-col sm:flex-row items-start gap-10">
                {/* Icône */}
                <div className="flex-shrink-0 w-14 h-14 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.2)] transition-all duration-500">
                  <Eye className="w-7 h-7 text-[#e8d5b0] drop-shadow-[0_0_10px_rgba(232,213,176,0.8)]" strokeWidth={1.5} />
                </div>

                {/* Texte + Flèche */}
                <div className="flex flex-1 min-w-0 items-start justify-between">
                  <div>
                    <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0] font-medium mb-2">
                      Verticale terminée
                    </p>
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#f0ede8] mb-1">
                      Atelier BTP - voir une ligne verticale réelle
                    </h2>
                    <p className="text-sm text-white/50 mt-2">
                      Un exemple concret de ce que le système produit. Construit avec les mêmes frameworks que tu utilises ici.
                    </p>
                  </div>
                  <ArrowRight className="flex-shrink-0 w-5 h-5 text-[#e8d5b0] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 hidden sm:block ml-4 mt-1" />
                </div>
              </div>
            </LiquidCard>
          </a>
        </div>


      </div>

      {/* Pricing Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setModal(null)}
        >
          <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setModal(null)}
              className="absolute -top-10 right-0 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={tier !== "beginner" && modal === "both" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "max-w-sm mx-auto"}>
              {/* Fondations card - uniquement si pas encore beginner */}
              {tier !== "beginner" && (
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col backdrop-blur-xl">
                  <div className="mb-5">
                    <span className="text-xs font-medium text-[#e8d5b0] uppercase tracking-wider">Fondations</span>
                    <div className="flex items-baseline gap-1 mt-2 mb-1">
                      <span className="text-3xl font-bold text-[#f0ede8]">97€</span>
                      <span className="text-white/40 text-sm">TTC</span>
                    </div>
                    <p className="text-white/40 text-xs">Accès à vie aux fondations</p>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {["5 modules pour construire", "De zéro à un site en ligne", "Skills Deep Research + UX/UI", "Stack complète + Protocole Zéro"].map((f) => (
                      <li key={f} className="text-xs text-white/55 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#e8d5b0]/50 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={checkoutUrls.beginner
                      ? `${checkoutUrls.beginner}${userId ? `?client_reference_id=${userId}` : ""}`
                      : "/checkout"
                    }
                    className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0]/80 hover:bg-[#e8d5b0] transition-all duration-200 text-sm"
                  >
                    Démarrer pour 97€
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Accès complet - toujours affiché dans modal "both", ou si beginner */}
              {(modal === "both" || tier === "beginner") && (
                <div className="bg-white/[0.04] border border-[#e8d5b0]/25 rounded-2xl p-6 flex flex-col relative backdrop-blur-xl">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] rounded-full px-3 py-1">Le vrai choix</span>
                  </div>
                  <div className="mb-5">
                    <span className="text-xs font-medium text-[#e8d5b0] uppercase tracking-wider">Système Complet</span>
                    <div className="flex items-baseline gap-1 mt-2 mb-1">
                      <span className="text-3xl font-bold text-[#f0ede8]">{tier === "beginner" ? "400€" : "497€"}</span>
                      <span className="text-white/40 text-sm">TTC</span>
                    </div>
                    <p className="text-white/40 text-xs">{tier === "beginner" ? "Complément - accès à vie au système complet" : "Accès à vie - tout le système, une seule fois"}</p>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {["7 blocs de système complets", "Méthodes actionnables", "Sources et ressources", "Fondations incluses", "Skills Deep Research + UX/UI", "Stack + Protocole Zéro"].map((f) => (
                      <li key={f} className="text-xs text-white/55 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#e8d5b0]/50 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tier === "beginner"
                      ? `${checkoutUrls.upgrade ?? checkoutUrls.full}${userId ? `?client_reference_id=${userId}` : ""}`
                      : `${checkoutUrls.full}${userId ? `?client_reference_id=${userId}` : ""}`
                    }
                    className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] text-sm"
                  >
                    {tier === "beginner" ? "Passer au complet - 400€" : "Prendre le système complet - 497€"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
