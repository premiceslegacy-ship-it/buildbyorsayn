"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, FileText, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";
import { SKILLS_CATALOG } from "@/lib/skillsCatalog";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";

export default function SkillsPage() {
  const [tier, setTier] = useState<string | null | "loading">("loading");
  const [checkoutHref, setCheckoutHref] = useState("/checkout");
  const [beginnerHref, setBeginnerHref] = useState("/checkout");

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTier(null);
        return;
      }

      const [{ data: profile }, urls] = await Promise.all([
        supabase.from("profiles").select("tier").eq("id", user.id).single(),
        getCheckoutUrls(),
      ]);

      const userTier = profile?.tier ?? null;
      const targetUrl =
        userTier === "beginner"
          ? urls.upgrade ?? urls.full
          : urls.full;
      const targetBeginnerUrl = urls.beginner ?? urls.full;

      setTier(userTier);
      setCheckoutHref(`${targetUrl}?client_reference_id=${user.id}`);
      setBeginnerHref(`${targetBeginnerUrl}?client_reference_id=${user.id}`);
    };

    fetchProfile();
  }, []);

  const isLoading = tier === "loading";

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 relative z-10">
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au système
          </Link>
        </div>

        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
            Bibliothèque
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0ede8]">
            Skills
          </h1>
          <p className="text-white/50 text-[17px] mt-4 max-w-2xl leading-relaxed">
            Ce sont les skills que j'ai configurés pour moi et pour mon écosystème. Je les utilise au quotidien pour cadrer, construire et auditer mes projets. Tu peux bien évidemment les adapter à ta manière de travailler, à ton marché et à tes propres projets.
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[240px] rounded-2xl bg-white/[0.04] border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS_CATALOG.map((skill, index) => {
              const isFree = skill.access === "free";
              const isBeginner = skill.access === "beginner";
              const canDownload =
                isFree ||
                tier === "full" ||
                (isBeginner && tier === "beginner");
              const badgeClasses = isFree
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : isBeginner
                  ? "bg-[#e8d5b0]/10 border-[#e8d5b0]/20 text-[#e8d5b0]"
                  : "bg-white/5 border-white/10 text-white/35";
              const badgeLabel = isFree
                ? "Gratuit"
                : isBeginner
                  ? "Fondations"
                  : "Complet";
              const lockedHref = isBeginner ? beginnerHref : checkoutHref;
              const lockedLabel = isBeginner
                ? "Débloquer les fondations"
                : "Débloquer le système";

              return (
                <motion.div
                  key={skill.slug}
                  whileHover="hover"
                  className="group animate-reveal h-full"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
                >
                  <LiquidCard className="p-6 transition-all duration-500 flex flex-col h-full min-h-[240px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5b0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#e8d5b0] shadow-[0_4px_16px_rgba(0,0,0,0.2)] group-hover:border-[#e8d5b0]/30 group-hover:shadow-[0_0_16px_rgba(232,213,176,0.15)] transition-all duration-500">
                          <AnimatedIcon icon={isFree ? Sparkles : FileText} className="w-6 h-6 drop-shadow-[0_0_8px_rgba(232,213,176,0.5)]" strokeWidth={1.5} />
                        </div>
                        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border ${badgeClasses}`}>
                          {!isFree && <Lock className="w-3 h-3" />}
                          <span className="text-[11px] font-medium">
                            {badgeLabel}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8 flex-1">
                        <h2 className="text-xl font-semibold tracking-tight text-[#f0ede8] mb-3">
                          {skill.title}
                        </h2>
                        <p className="text-sm text-[rgba(240,237,232,0.48)] leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      <div className="mt-8">
                        {canDownload ? (
                          <a
                            href={`/api/skills/${skill.slug}`}
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] transition-all duration-200 hover:bg-[#f0dfc0] shadow-[0_0_24px_rgba(232,213,176,0.18)]"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        ) : (
                          <a
                            href={lockedHref}
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-white/[0.06] border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition-all duration-200 hover:bg-white/[0.1] hover:text-white"
                          >
                            {lockedLabel}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </LiquidCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
