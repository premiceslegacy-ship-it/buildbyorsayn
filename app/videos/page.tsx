"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Play } from "lucide-react";
import Link from "next/link";
import { BLOCS_DATA } from "@/lib/mockData";
import { VideoCard } from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/client";

export default function VideosPage() {
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    const fetchTier = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", user.id)
        .single();
      setTier(profile?.tier ?? null);
    };
    fetchTier();
  }, []);

  const blocsWithVideos = BLOCS_DATA.filter((b) => (b as any).videos?.length);

  const canSeeBloc = (blocId: string) =>
    tier === "full" || blocId === "1";

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans relative selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      {/* Background halos */}
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

        {/* En-tête */}
        <div className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
            Bibliothèque
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0ede8]">
            Vidéos
          </h1>
          <p className="text-white/50 text-[17px] mt-4 max-w-xl leading-relaxed">
            Une vidéo par bloc pour aller plus loin. Retrouve chaque concept expliqué en détail.
          </p>
        </div>

        {/* Sections par bloc */}
        <div className="space-y-20">
          {blocsWithVideos.map((bloc) => {
            const videos = (bloc as any).videos as { title: string; youtubeId: string; description?: string }[];
            const canSee = canSeeBloc(bloc.id);

            return (
              <section key={bloc.id} id={`bloc-${bloc.id}`} className="scroll-mt-8">
                {/* Label + titre */}
                <div className="mb-8">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-1">
                    Bloc {bloc.id}
                  </p>
                  <h2 className="text-2xl font-semibold text-[#f0ede8] tracking-tight">
                    {bloc.titre.replace(/^Bloc \d+ : /, "")}
                  </h2>
                </div>

                {/* Vidéos ou paywall */}
                {canSee ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {videos.map((video) => (
                      <VideoCard key={video.youtubeId} {...video} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-white/[0.03] border border-white/8 rounded-xl p-5 w-fit">
                    <div className="w-10 h-10 rounded-xl bg-[#e8d5b0]/10 border border-[#e8d5b0]/20 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-[#e8d5b0]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-white/70">Accès complet requis</p>
                      <p className="text-[13px] text-white/35 mt-0.5">
                        Ces vidéos font partie du système complet.{" "}
                        <Link href="/dashboard" className="text-[#e8d5b0] hover:underline">
                          Débloquer →
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-16 border-t border-white/5" />
              </section>
            );
          })}

          {blocsWithVideos.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Play className="w-7 h-7 text-white/30" />
              </div>
              <p className="text-white/40 text-[17px]">Les vidéos arrivent bientôt.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
