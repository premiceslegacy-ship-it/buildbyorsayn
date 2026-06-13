"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workflow, Layers, LayoutTemplate, FileCode, Briefcase, ArrowRight, Eye, Users, Flag, Lock, X } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { BLOCS_DATA } from "@/lib/mockData";
import { useProgress } from "@/hooks/useProgress";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { getCommunityLink } from "@/app/actions/getCommunityLink";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";

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
  const [communityLink, setCommunityLink] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "foundations" | "both">(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkoutUrls, setCheckoutUrls] = useState<{ beginner: string | null; full: string }>({
    beginner: null,
    full: "https://buy.stripe.com/aFa28saRUgSdaFm69W5AQ02",
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
      if (userTier === "full") {
        const link = await getCommunityLink();
        setCommunityLink(link);
      }
    };
    fetchUser();
  }, [router]);

  // Avoid hydration mismatch by not rendering progress until loaded
  const displayProgress = isLoaded ? globalProgress : 0;

  // Find the bloc to resume: either the last visited, or the first incomplete, or default to bloc 1
  const firstIncompleteBlocId = BLOCS_DATA.find(b => getBlocProgress(b.id) < 100)?.id || "1";
  const resumeBlocId = lastVisitedBloc || firstIncompleteBlocId;
  const resumeBloc = BLOCS_DATA.find(b => b.id === resumeBlocId) || BLOCS_DATA[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans relative overflow-hidden">
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
            Ravi de te revoir, Builder.
          </h1>
          <p className="text-[rgba(240,237,232,0.60)] text-[16px]">
            Tu en es à {displayProgress}% du système. {displayProgress === 100 ? "Système intégralement implémenté." : displayProgress === 0 ? "Commence le système pour atteindre ta situation désirée." : "Continue sur ta lancée."}
          </p>

          {/* Barre de progression globale large */}
          <div className="w-full max-w-2xl mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#e8d5b0]/60 to-[#e8d5b0] h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(232,213,176,0.3)]"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          {/* CTA upgrade pour les beginners */}
          {tier === "beginner" && (
            <div className="mt-2 flex items-center justify-between bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-medium text-[#e8d5b0]">Passe au système complet</p>
                <p className="text-xs text-white/40 mt-0.5">Débloque les 7 blocs, les sources et la communauté pour 70€.</p>
              </div>
              <Link href="/checkout" className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all px-4 py-2 rounded-lg ml-4">
                Upgrader <ArrowRight className="w-3 h-3" />
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

        {/* 3. La Grille des Blocs (Le Menu) — blocs 1 à 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOCS_DATA.filter((b) => b.id !== "7").map((bloc) => {
            const Icon = ICONS[bloc.id] || Workflow;
            const progress = isLoaded ? getBlocProgress(bloc.id) : 0;
            const isLocked = tier !== "full" && bloc.id !== "1";

            return (
              <div
                key={bloc.id}
                className="group cursor-pointer animate-reveal block h-full"
                onClick={() => isLocked ? setModal("both") : router.push(`/blocs/${bloc.id}`)}
              >
                <motion.div whileHover="hover" className="h-full">
                  <LiquidCard className="p-6 text-left transition-all duration-500 flex flex-col h-full min-h-[220px]">
                    {/* Glow background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Badge accès */}
                    {tier !== "full" && bloc.id !== "1" && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                        <Lock className="w-3 h-3 text-white/30" />
                        <span className="text-[11px] text-white/30 font-medium">Premium</span>
                      </div>
                    )}
                    {tier !== "full" && bloc.id === "1" && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                        <span className="text-[11px] text-emerald-400 font-medium">Gratuit</span>
                      </div>
                    )}

                    {/* Icône Fintech illuminée */}
                    <div className="relative w-12 h-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.2)] transition-all duration-500 mb-6">
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
                        <span className="text-xs text-[#e8d5b0] font-medium">
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

        {/* 3b. Bloc 7 Récapitulatif — pleine largeur, layout horizontal */}
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

        {/* 4. Verticale en prod — preuve concrète visible par tous */}
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
                      Verticale en production
                    </p>
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#f0ede8] mb-1">
                      Atelier BTP — voir une ligne verticale réelle
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

        {/* 5. Bloc Communauté — affiché uniquement pour tier = 'full' */}
        {tier === "full" && (
          <div className="mt-6">
            <a
              href={communityLink ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <LiquidCard className="p-8 md:p-10 transition-all duration-300 cursor-pointer">
                <div className="relative flex flex-col sm:flex-row items-start gap-10">
                  {/* Icône */}
                  <div className="flex-shrink-0 w-14 h-14 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_20px_rgba(232,213,176,0.2)] transition-all duration-500">
                    <Users className="w-7 h-7 text-[#e8d5b0] drop-shadow-[0_0_10px_rgba(232,213,176,0.8)]" strokeWidth={1.5} />
                  </div>

                  {/* Texte + Flèche */}
                  <div className="flex flex-1 min-w-0 items-start justify-between">
                    <div>
                      <p className="text-[13px] uppercase tracking-[0.08em] text-[#e8d5b0] font-medium mb-2">
                        Espace membres
                      </p>
                      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#f0ede8] mb-1">
                        Rejoindre la communauté privée
                      </h2>
                      <p className="text-sm text-white/50 mt-2">
                        Accède au groupe réservé aux builders qui ont le système.
                      </p>
                    </div>
                    <ArrowRight className="flex-shrink-0 w-5 h-5 text-[#e8d5b0] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 hidden sm:block ml-4 mt-1" />
                  </div>
                </div>
              </LiquidCard>
            </a>
          </div>
        )}

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

            <div className={modal === "both" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "max-w-sm mx-auto"}>
              {/* Fondations card - toujours affichée */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col backdrop-blur-xl">
                <div className="mb-5">
                  <span className="text-xs font-medium text-[#e8d5b0] uppercase tracking-wider">Fondations</span>
                  <div className="flex items-baseline gap-1 mt-2 mb-1">
                    <span className="text-3xl font-bold text-[#f0ede8]">30€</span>
                    <span className="text-white/40 text-sm">TTC</span>
                  </div>
                  <p className="text-white/40 text-xs">Accès à vie aux fondations</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {["5 modules pour construire", "De zéro à un site en ligne", "IA, GitHub, IDE, Vercel"].map((f) => (
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
                  Démarrer pour 30€
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Accès complet - uniquement modal "both" */}
              {modal === "both" && (
                <div className="bg-white/[0.04] border border-[#e8d5b0]/25 rounded-2xl p-6 flex flex-col relative backdrop-blur-xl">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-semibold text-[#0e0e0f] bg-[#e8d5b0] rounded-full px-3 py-1">Recommandé</span>
                  </div>
                  <div className="mb-5">
                    <span className="text-xs font-medium text-[#e8d5b0] uppercase tracking-wider">Complet</span>
                    <div className="flex items-baseline gap-1 mt-2 mb-1">
                      <span className="text-3xl font-bold text-[#f0ede8]">100€</span>
                      <span className="text-white/40 text-sm">TTC</span>
                    </div>
                    <p className="text-white/40 text-xs">Accès à vie à tout le système</p>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {["7 blocs de système complets", "Méthodes actionnables", "Communauté privée", "Fondations incluses"].map((f) => (
                      <li key={f} className="text-xs text-white/55 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#e8d5b0]/50 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`${checkoutUrls.full}${userId ? `?client_reference_id=${userId}` : ""}`}
                    className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-[#0e0e0f] bg-[#e8d5b0] hover:bg-[#f0dfc0] transition-all duration-200 shadow-[0_0_24px_rgba(232,213,176,0.25)] text-sm"
                  >
                    Débloquer l&apos;accès complet
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
