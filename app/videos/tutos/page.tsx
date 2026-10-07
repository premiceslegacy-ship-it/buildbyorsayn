import Image from "next/image";
import Link from "next/link";
import "server-only";
import { Suspense } from "react";
import { CHAPTER_META, CURRICULUM_SECTIONS, chapterSlug, orderCurriculumFiles } from "./chapters";
import { hermesGate } from "./gate.server";
import { NavBar } from "@/components/NavBar";
import { HermesInstall } from "@/components/HermesInstall";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { IllustratedCardGrid } from "@/components/ui/illustrated-card-grid";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { illustrationSrc } from "@/lib/illustrations";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { LEARNING_BLOCKS } from "./learn/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

function ChaptersSkeleton() {
  return (
    <div className="flex flex-col gap-14 animate-pulse">
      {Array.from({ length: 4 }).map((_, group) => (
        <div key={group}>
          <div className="h-3 w-48 bg-white/[0.06] rounded mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square border border-white/[0.06] bg-white/[0.02]" />
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
 * Suspense boundary. The access check itself still runs on every request.
 */
async function HermesChapters() {
  const gate = await hermesGate();
  if (gate.files === null) return gate.render;

  const curriculumFiles = orderCurriculumFiles(gate.files);
  const groups = CURRICULUM_SECTIONS.map((section) => ({
    ...section,
    files: curriculumFiles.filter((file) => CHAPTER_META[file.path]?.section === section.key),
  })).filter((section) => section.files.length > 0);

  return (
    <section id="chapitres" className="scroll-mt-24">
      {gate.files.length === 0 ? (
        <p className="text-white/50">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>
      ) : (
        <div className="flex flex-col gap-16">
          {groups.map((section) => (
            <section key={section.key} id={`chapitres-${section.key}`} className="scroll-mt-24">
              <div className="mb-6 max-w-2xl">
                <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">{section.title.toUpperCase()}</p>
                <p className="text-sm text-white/50 leading-relaxed">{section.intro}</p>
              </div>
              <IllustratedCardGrid>
                {section.files.map((file) => {
                  const meta = CHAPTER_META[file.path];
                  return (
                    <IllustratedCard
                      key={file.path}
                      title={meta.displayTitle}
                      description={meta.summary}
                      imageSrc={illustrationSrc(meta.illustrationId)}
                      href={`/videos/tutos/${chapterSlug(file.path)}`}
                    />
                  );
                })}
              </IllustratedCardGrid>
            </section>
          ))}

          <section id="installer" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12">
            <div className="max-w-2xl mb-7">
              <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">PRÊT À ESSAYER</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Installe Hermes après avoir choisi le premier travail à lui confier.</h2>
              <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">L'installation donne un environnement de travail. Ta mission, les sources que tu autorises et ta règle d'autonomie donnent ensuite une vraie direction au workflow.</p>
            </div>
            <HermesInstall />
          </section>
        </div>
      )}
    </section>
  );
}

export default async function HermesAgentPage() {
  const identity = await navIdentity();

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0] relative overflow-x-clip">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-[0.035] blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />

      <NavBar
        activeLink="videos-tutos"
        tier={identity?.tier ?? null}
        isAdmin={identity?.isAdmin}
        displayName={identity?.displayName}
        displayEmail={identity?.displayEmail}
        initials={identity?.initials}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 relative z-10">
        <header id="introduction" className="scroll-mt-24 mb-16 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)] lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">HERMES AGENT</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Hermes Agent, pour faire avancer un vrai travail.</h1>
            <p className="text-white/60 text-base sm:text-[17px] mt-5 leading-relaxed max-w-2xl">Une mission précise, le bon contexte, une méthode qui tient dans le temps et un niveau d'autonomie choisi par toi. C'est ainsi qu'Hermes devient utile au quotidien.</p>
            <p className="text-white/45 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">Commence par les blocs ci-dessous, puis avance dans les chapitres lorsque tu veux aller plus loin.</p>
          </div>
          <div className="relative aspect-square max-w-sm justify-self-start lg:justify-self-end overflow-hidden border border-white/10 bg-white/[0.02]">
            <Image
              src={illustrationSrc("hermes-agent-unified")}
              alt="Illustration Hermes Agent : une opératrice et des outils physiques pour organiser le travail."
              fill
              sizes="(min-width: 1024px) 25rem, 80vw"
              className="object-cover"
              priority
              draggable={false}
            />
          </div>
        </header>

        <section id="blocs" className="scroll-mt-24 mb-20">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">APPRENDRE PAR BLOCS</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Trois chemins pour passer d'une idée à une méthode qui te reste.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Chaque bloc explique le pourquoi, le déroulé et ce que tu ranges après l'essai. Ouvre celui qui correspond à ton prochain projet.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {LEARNING_BLOCKS.map((block) => (
              <Link
                key={block.slug}
                href={`/videos/tutos/learn/${block.slug}`}
                className="group flex min-h-[17rem] flex-col border border-white/[0.1] bg-white/[0.015] p-6 transition-colors hover:border-[#e8d5b0]/55 hover:bg-[#e8d5b0]/[0.035]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-2xl font-light tabular-nums text-[#c9b48a]/70">{block.number}</p>
                  <p className="text-[10px] tracking-[0.16em] font-semibold text-white/35">{block.duration}</p>
                </div>
                <p className="mt-7 text-[10px] tracking-[0.18em] font-semibold text-[#e8d5b0]/75">{block.eyebrow}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#f0ede8]">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{block.description}</p>
                <span className="mt-auto pt-7 text-sm font-medium text-[#e8d5b0]">Ouvrir le bloc <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section id="bibliotheque" className="scroll-mt-24 mb-8">
          <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">LE PARCOURS</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Un parcours, pas une liste de mots compliqués.</h2>
          <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">Les chapitres sont rangés dans l'ordre où tu en as besoin : comprendre le problème, construire un premier workflow, le rendre fiable, puis le faire grandir dans une équipe.</p>
        </section>

        <Suspense fallback={<ChaptersSkeleton />}>
          <HermesChapters />
        </Suspense>
      </div>

      <ScrollProgress
        sections={[
          { id: "introduction", label: "INTRODUCTION" },
          { id: "blocs", label: "BLOCS" },
          { id: "bibliotheque", label: "PARCOURS" },
          { id: "chapitres", label: "CHAPITRES" },
          { id: "installer", label: "INSTALLER" },
        ]}
      />
      <ScrollToTop />
    </main>
  );
}
