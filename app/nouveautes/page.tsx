import type { Metadata } from "next";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { NavBar } from "@/components/NavBar";
import { VideoCard } from "@/components/VideoCard";
import { NewVideoMarker, NouveautesGrid } from "@/components/nouveautes/NouveautesGrid";
import { NouveautesSeen } from "@/components/nouveautes/NouveautesSeen";
import { loadNouveautesVideos } from "@/lib/nouveautes/loadVideos";

export const metadata: Metadata = {
  title: "Nouveautés | BUILD",
  description: "Les dernières vidéos de la chaîne YouTube BUILD.",
};

export default async function NouveautesPage() {
  const [videos, identity] = await Promise.all([loadNouveautesVideos(), navIdentity()]);
  const [featured, ...others] = videos;

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      <NavBar
        activeLink="nouveautes"
        tier={identity?.tier ?? null}
        isAdmin={identity?.isAdmin}
        displayName={identity?.displayName}
        displayEmail={identity?.displayEmail}
        initials={identity?.initials}
      />
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:px-12">
        <header className="mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e8d5b0]">Chaîne YouTube</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Nouveautés</h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/50">Chaque nouvelle vidéo de la chaîne, dès sa publication.</p>
        </header>

        {!featured ? (
          <p data-testid="nouveautes-empty" className="text-white/50">Les premières vidéos arrivent bientôt.</p>
        ) : (
          <>
            <section data-video-card data-published-at={featured.published_at} className="mb-16 max-w-3xl" aria-label="Dernière vidéo">
              <div className="mb-3"><NewVideoMarker /></div>
              <VideoCard title={featured.title} youtubeId={featured.video_id} />
            </section>
            {others.length > 0 && <NouveautesGrid videos={others} />}
          </>
        )}
      </div>
      <NouveautesSeen />
    </main>
  );
}
