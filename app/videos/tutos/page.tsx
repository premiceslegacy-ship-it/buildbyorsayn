"use client";

import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";

const TUTOS_VIDEOS: { title: string; youtubeId: string; description?: string }[] = [];

export default function VideosTutosPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans relative selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 bg-blue-500 opacity-5 blur-[120px] w-[400px] h-[400px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 relative z-10">
        <div className="mb-12">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux vidéos
          </Link>
        </div>

        <div className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
            Bibliothèque
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0ede8]">
            Vidéos tutos
          </h1>
          <p className="text-white/50 text-[17px] mt-4 max-w-xl leading-relaxed">
            Tutoriels techniques purs : outils, configurations, méthodes pas à pas. Pas de pédagogie de blocs ici, que du concret.
          </p>
        </div>

        {TUTOS_VIDEOS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TUTOS_VIDEOS.map((video) => (
              <VideoCard key={video.youtubeId} {...video} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 w-fit">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Play className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-[15px] text-white/40">Les tutoriels techniques arrivent bientôt.</p>
          </div>
        )}
      </div>
    </main>
  );
}
