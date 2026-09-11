import "server-only";
import { Suspense } from "react";
import { chapterTitle } from "../../doctrine/markdown";
import { COFFRE_LABEL } from "@/lib/pricing";
import { CHAPTER_META, GROUP_LABELS, chapterSlug } from "./chapters";
import { hermesGate } from "./gate.server";
import { NavBar } from "@/components/NavBar";
import { HermesInstall } from "@/components/HermesInstall";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { IllustratedCardGrid } from "@/components/ui/illustrated-card-grid";
import { illustrationSrc } from "@/lib/illustrations";
import { navIdentity } from "@/lib/auth/navIdentity.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

function ChaptersSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      {[0, 1].map((group) => (
        <div key={group}>
          <div className="h-3 w-40 bg-white/[0.06] rounded mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square border border-white/[0.06] bg-white/[0.02]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Auth + doctrine fetch happen only inside this async subtree, so NavBar and
 * the static header can paint immediately while this streams in behind a
 * Suspense boundary - the access check itself still runs on every request.
 */
async function HermesChapters() {
  const gate = await hermesGate();
  if (gate.files === null) return gate.render;
  const { files } = gate;

  const socle = files.filter((f) => (CHAPTER_META[f.path]?.group ?? "socle") === "socle");
  const entreprise = files.filter((f) => CHAPTER_META[f.path]?.group === "entreprise");
  const groups = (
    [
      { key: "socle", files: socle },
      { key: "entreprise", files: entreprise },
    ] as const
  ).filter((g) => g.files.length > 0);

  return (
    <>
      <div className="mb-10">
        <HermesInstall />
      </div>

      {files.length === 0 ? (
        <p className="text-white/50">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.key}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#e8d5b0]/75 font-semibold mb-1.5">
                {GROUP_LABELS[group.key].title}
              </p>
              <p className="text-xs text-white/40 leading-relaxed mb-4 max-w-xl">
                {GROUP_LABELS[group.key].intro}
              </p>
              <IllustratedCardGrid>
                {group.files.map((file) => {
                  const meta = CHAPTER_META[file.path];
                  return (
                    <IllustratedCard
                      key={file.path}
                      title={chapterTitle(file)}
                      description={meta?.summary}
                      imageSrc={meta ? illustrationSrc(meta.illustrationId) : undefined}
                      href={`/videos/tutos/${chapterSlug(file.path)}`}
                    />
                  );
                })}
              </IllustratedCardGrid>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

export default async function HermesAgentPage() {
  const identity = await navIdentity();

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0] relative overflow-x-clip">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />

      <NavBar
        activeLink="videos-tutos"
        tier={identity?.tier ?? null}
        displayName={identity?.displayName}
        displayEmail={identity?.displayEmail}
        initials={identity?.initials}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 relative z-10">
        <header className="mb-10 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
              Réservé à {COFFRE_LABEL}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hermes Agent</h1>
            <p className="text-white/50 text-base sm:text-[17px] mt-4 leading-relaxed max-w-2xl">
              La doctrine agentique de BUILD : comment décomposer un métier en agents, borner leur autorité et rendre une entreprise entière AI-first, en capitalisant sur sa connaissance et ses process pour les rendre accessibles à des agents IA. Ce même contenu est aussi consultable par ton assistant via le MCP BUILD.
            </p>
          </div>
          <img
            src="/brand-logos/hermes-agent-mark.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block h-28 w-28 md:h-36 md:w-36 shrink-0 opacity-90"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </header>

        <Suspense fallback={<ChaptersSkeleton />}>
          <HermesChapters />
        </Suspense>
      </div>
    </main>
  );
}
