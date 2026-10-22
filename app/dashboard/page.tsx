"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { ArrowRight, PhoneCall } from "lucide-react";
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
import { BuildChangedBanner } from "@/components/BuildChangedBanner";
import { McpDashboardEntry } from "@/components/McpDashboardEntry";
import { EcosystemMap } from "@/components/EcosystemMap";
import { DaRoot } from "@/components/da/DaRoot";
import { DaIcon } from "@/components/da/DaIcon";
import { PricingSection } from "@/components/da/PricingSection";
import { COFFRE_LABEL, STRIPE_FULL_CHECKOUT_LINK, UPGRADE_PRICE, resolveCheckoutLinks, type CheckoutBaseLinks } from "@/lib/pricing";
import { normalizeProfileTier } from "@/lib/mcpAccess";

export default function DashboardHub() {
  const router = useRouter();
  const { getBlocProgress, globalProgress, isLoaded, lastVisitedBloc } = useProgress();

  const [displayName, setDisplayName] = useState("...");
  const [displayEmail, setDisplayEmail] = useState("");
  const [initials, setInitials] = useState("?");
  const [tier, setTier] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [accessUnverified, setAccessUnverified] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [sessionAdvances, setSessionAdvances] = useState(0);
  const [checkoutUrls, setCheckoutUrls] = useState<CheckoutBaseLinks>({
    beginner: null,
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
      setIsAdmin(user.app_metadata?.role === "admin");
      setInitials(firstName.substring(0, 2).toUpperCase());
      setUserId(user.id);

      // Récupérer tier depuis la table profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("tier, completed_blocks")
        .eq("id", user.id)
        .single();
      // PGRST116 = aucune ligne : profil absent, pas une panne. Toute autre erreur ne doit jamais ouvrir de carte d'achat.
      setAccessUnverified(Boolean(profileError && profileError.code !== "PGRST116"));
      const userTier = normalizeProfileTier(profile?.tier ?? null);
      setTier(userTier);
      setProfileReady(true);

      // Liens Stripe : après le niveau, pour ne jamais retarder l'accès aux cartes (le niveau pilote les cartes verrouillées)
      setCheckoutUrls(await getCheckoutUrls());
    };
    fetchUser();
  }, [router]);

  // Fenêtre des offres : le focus entre sur Fermer, la tabulation reste dans la fenêtre, Échap ferme, le focus revient au bouton d'origine
  useEffect(() => {
    if (!pricingOpen) return;
    const origin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setPricingOpen(false); return; }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      origin?.focus();
    };
  }, [pricingOpen]);

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
        isAdmin={isAdmin}
        displayName={displayName}
        displayEmail={displayEmail}
        initials={initials}
        onFondationsClick={() => setPricingOpen(true)}
        onStackClick={() => setPricingOpen(true)}
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

          <BuildChangedBanner className="w-full max-w-2xl" />

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
                onClick={() => setPricingOpen(true)}
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
                onClick={() => setPricingOpen(true)}
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

        {/* 3. La Grille des Blocs */}
        <IllustratedCardGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {BLOCS_DATA.map((bloc) => {
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
                visualTone="black-gallery"
                locked={isLocked}
                badge={badge}
                onClick={() => (isLocked ? setPricingOpen(true) : router.push(`/blocs/${bloc.id}`))}
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

        {/* 4. Écosystème Orsayn */}
        <div className="mt-6">
          <EcosystemMap variant="dashboard" tier={tier ?? null} />
        </div>


      </div>

      {/* Fenêtre des offres : la même zone que l'accueil et /checkout, adaptée à l'accès de la personne connectée */}
      {pricingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setPricingOpen(false)}
        >
          <div
            className="relative w-full max-w-[1040px]"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Les offres BUILD"
            onClick={(e) => e.stopPropagation()}
          >
            <DaRoot className="px-modal">
              <button type="button" ref={closeRef} className="px-fermer verre" aria-label="Fermer" onClick={() => setPricingOpen(false)}>
                <DaIcon name="x" />
              </button>
              <PricingSection tier={tier} links={resolveCheckoutLinks(checkoutUrls, userId)} compact unverified={accessUnverified} />
              <div className="wrap px-bas">
                <p className="t-meta">Tu préfères qu&apos;on construise ça ensemble, en direct ?</p>
                <Link href="/accompagnement" onClick={() => setPricingOpen(false)} className="px-lien">
                  Découvrir l&apos;accompagnement
                </Link>
              </div>
            </DaRoot>
          </div>
        </div>
      )}
    </main>
  );
}
