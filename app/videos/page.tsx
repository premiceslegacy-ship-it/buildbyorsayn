"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Play } from "lucide-react";
import Link from "next/link";
import { BLOCS_DATA } from "@/lib/mockData";
import { VideoCard } from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";

const FONDATIONS_VIDEOS: { title: string; youtubeId: string; description?: string }[] = [
  // { title: "...", youtubeId: "...", description: "..." },
];

function PaywallBanner({
  label,
  description,
  ctaLabel,
  ctaHref,
}: {
  label: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 w-fit">
      <div className="w-10 h-10 rounded-xl bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center flex-shrink-0">
        <Lock className="w-4 h-4 text-[#e8d5b0]" />
      </div>
      <div>
        <p className="text-[15px] font-medium text-white/70">{label}</p>
        <p className="text-[13px] text-white/35 mt-0.5">
          {description}{" "}
          <a href={ctaHref} className="text-[#e8d5b0] hover:underline">
            {ctaLabel} →
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [tier, setTier] = useState<string | null | "loading">("loading");
  const [beginnerUrl, setBeginnerUrl] = useState<string>("#");
  const [upgradeUrl, setUpgradeUrl] = useState<string>("#");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setTier(null); return; }
      setUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", user.id)
        .single();
      setTier(profile?.tier ?? null);
      const urls = await getCheckoutUrls();
      if (urls.beginner) setBeginnerUrl(`${urls.beginner}?client_reference_id=${user.id}`);
      if (urls.upgrade) setUpgradeUrl(`${urls.upgrade}?client_reference_id=${user.id}`);
    };
    fetchData();
  }, []);

  const isLoading = tier === "loading";
  const isFull = tier === "full";
  const isBeginner = tier === "beginner";

  const bloc1 = BLOCS_DATA.find((b) => b.id === "1");
  const bloc1Videos = (bloc1 as any)?.videos as { title: string; youtubeId: string; description?: string }[] ?? [];
  const blocsWithVideos = BLOCS_DATA.filter((b) => b.id !== "1" && (b as any).videos?.length > 0);
  const hasFondationsVideos = FONDATIONS_VIDEOS.length > 0;

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans relative selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
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

        <div className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
            Bibliothèque
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0ede8]">
            Vidéos
          </h1>
          <p className="text-white/50 text-[17px] mt-4 max-w-xl leading-relaxed">
            Une vidéo par section pour aller plus loin. Retrouve chaque concept expliqué en détail.
          </p>
        </div>

        <div className="space-y-20">

          {/* Section Fondations */}
          <section id="fondations" className="scroll-mt-8">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-1">
                Fondations : 97€
              </p>
              <h2 className="text-2xl font-semibold text-[#f0ede8] tracking-tight">
                Le flow : de l'idée à l'URL en ligne
              </h2>
            </div>

            {isLoading ? (
              <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
            ) : (isBeginner || isFull) ? (
              hasFondationsVideos ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {FONDATIONS_VIDEOS.map((video) => (
                    <VideoCard key={video.youtubeId} {...video} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 w-fit">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-white/30" />
                  </div>
                  <p className="text-[15px] text-white/40">Les vidéos fondations arrivent bientôt.</p>
                </div>
              )
            ) : (
              <PaywallBanner
                label="Accès Fondations requis"
                description="Ces vidéos font partie des Fondations (97€)."
                ctaLabel="Accéder aux Fondations"
                ctaHref={beginnerUrl}
              />
            )}

            <div className="mt-16 border-t border-white/5" />
          </section>

          {/* Bloc 1 : gratuit, visible par tous */}
          {bloc1Videos.length > 0 && (
            <section id="bloc-1" className="scroll-mt-8">
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-1">
                  Gratuit : Bloc 1
                </p>
                <h2 className="text-2xl font-semibold text-[#f0ede8] tracking-tight">
                  La logique du système
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bloc1Videos.map((video) => (
                  <VideoCard key={video.youtubeId} {...video} />
                ))}
              </div>
              <div className="mt-16 border-t border-white/5" />
            </section>
          )}

          {/* Section Système complet */}
          <section id="systeme" className="scroll-mt-8">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-1">
                Système complet : 497€
              </p>
              <h2 className="text-2xl font-semibold text-[#f0ede8] tracking-tight">
                Les blocs
              </h2>
            </div>

            {isLoading ? (
              <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
            ) : isFull ? (
              blocsWithVideos.length > 0 ? (
                <div className="space-y-10">
                  {blocsWithVideos.map((bloc) => {
                    const videos = (bloc as any).videos as { title: string; youtubeId: string; description?: string }[];
                    return (
                      <div key={bloc.id} id={`bloc-${bloc.id}`} className="scroll-mt-8">
                        {/* Bloc header */}
                        <div className="flex items-center gap-3 mb-5">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-[#e8d5b0]/60 font-semibold">
                            Bloc {bloc.id}
                          </span>
                          <span className="text-white/20">›</span>
                          <span className="text-[13px] text-white/50 font-medium">
                            {bloc.titre.replace(/^Bloc \d+ : /, "")}
                          </span>
                        </div>

                        {/* Videos indented under the bloc */}
                        <div className="pl-4 border-l border-white/[0.07]">
                          <div className={videos.length === 1
                            ? "max-w-lg"
                            : "grid grid-cols-1 md:grid-cols-2 gap-6"
                          }>
                            {videos.map((video) => (
                              <VideoCard key={video.youtubeId} {...video} />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 w-fit">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-white/30" />
                  </div>
                  <p className="text-[15px] text-white/40">Les vidéos du système arrivent bientôt.</p>
                </div>
              )
            ) : isBeginner ? (
              <PaywallBanner
                label="Accès système complet requis"
                description="Ces vidéos font partie du système complet (400€ de complément)."
                ctaLabel="Passer au système complet"
                ctaHref={upgradeUrl}
              />
            ) : (
              <PaywallBanner
                label="Accès système complet requis"
                description="Ces vidéos font partie du système complet (497€)."
                ctaLabel="Accéder au système complet"
                ctaHref={`https://buy.stripe.com/dRm8wQ8JMgSd7taaqc5AQ0a${userId ? `?client_reference_id=${userId}` : ""}`}
              />
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
