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
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { illustrationSrc } from "@/lib/illustrations";
import { navIdentity } from "@/lib/auth/navIdentity.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

const HERMES_FOUNDATIONS = [
  {
    num: "01",
    title: "Une boussole",
    body: "Les principes, les décisions et la stratégie indiquent pourquoi l'entreprise fait les choses. Sans eux, chaque agent improvise sa propre direction.",
  },
  {
    num: "02",
    title: "Une mémoire commune",
    body: "Les sources, les méthodes et les expériences restent rangées au bon endroit. Comme une bibliothèque, elle aide à retrouver le bon livre sans prétendre que tous les livres disent la même chose.",
  },
  {
    num: "03",
    title: "Un tableau de suivi",
    body: "Les demandes, les blocages, les décisions et la prochaine action restent visibles. Une réponse n'est pas une tâche terminée tant que personne ne sait ce qui vient après.",
  },
  {
    num: "04",
    title: "Un trousseau de clés limité",
    body: "Chaque rôle ouvre seulement les portes dont il a besoin. Lire un dossier, préparer un brouillon et envoyer quelque chose sont trois droits différents.",
  },
];

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
    <section id="chapitres" className="scroll-mt-24">
      <div className="mb-10">
        <HermesInstall />
      </div>

      {files.length === 0 ? (
        <p className="text-white/50">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>
      ) : (
        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <section key={group.key} id={`chapitres-${group.key}`} className="scroll-mt-24">
              <div className="mb-5 max-w-2xl">
                <p className="text-sm font-semibold text-[#e8d5b0] mb-2">
                  {GROUP_LABELS[group.key].title}
                </p>
                <p className="text-sm text-white/45 leading-relaxed">
                  {GROUP_LABELS[group.key].intro}
                </p>
              </div>
              <IllustratedCardGrid>
                {group.files.map((file) => {
                  const meta = CHAPTER_META[file.path];
                  return (
                    <IllustratedCard
                      key={file.path}
                      title={meta?.displayTitle ?? chapterTitle(file)}
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
    </section>
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
        <header id="introduction" className="scroll-mt-24 mb-16 flex items-start justify-between gap-8">
          <div className="min-w-0 max-w-3xl">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">
              Réservé à {COFFRE_LABEL}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">
              Hermes Agent, une IA qui comprend le travail.
            </h1>
            <p className="text-white/55 text-base sm:text-[17px] mt-5 leading-relaxed max-w-2xl">
              Hermes devient utile quand il ne se contente plus de répondre. Il retrouve le bon contexte, prépare une mission, fait passer un dossier d&apos;un métier à l&apos;autre et garde une trace de ce qui s&apos;est réellement passé.
            </p>
            <p className="text-white/45 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
              Cette bibliothèque montre comment construire ce cadre : une direction claire, une mémoire bien rangée, un travail visible et des accès limités. L&apos;objectif n&apos;est pas de donner une baguette magique à l&apos;IA. C&apos;est de lui donner une place utile dans une équipe qui sait encore qui décide.
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

        <section id="fondations" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12 mb-16">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">Les fondations</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Avant de donner des clés à l&apos;IA, donne-lui une carte.</h2>
            <p className="text-white/45 text-sm sm:text-base mt-3 leading-relaxed">
              Une entreprise bien organisée ressemble moins à un cerveau géant qu&apos;à une bonne équipe : chacun sait où trouver l&apos;information, ce qu&apos;il peut décider et quand il doit passer le relais.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.1]">
            {HERMES_FOUNDATIONS.map((item) => (
              <article key={item.num} className="py-5 sm:px-5 first:pl-0 last:pr-0 first:pt-0 sm:first:pt-5 last:pb-0 sm:last:pb-5">
                <p className="text-2xl font-light tabular-nums text-[#c9b48a]/65 mb-4">{item.num}</p>
                <h3 className="text-sm font-semibold text-[#f0ede8]">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/45">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div id="bibliotheque" className="scroll-mt-24 mb-5">
          <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-2">La bibliothèque</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Les chapitres pour passer de l&apos;idée au travail réel.</h2>
          <p className="text-white/45 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
            Commence par comprendre le problème, puis regarde comment organiser les rôles, les informations et les outils. Les exemples servent de cartes pour réfléchir, pas de boutons qui activent une entreprise tout seuls.
          </p>
        </div>

        <Suspense fallback={<ChaptersSkeleton />}>
          <HermesChapters />
        </Suspense>
      </div>

      <ScrollProgress
        sections={[
          { id: "introduction", label: "Introduction" },
          { id: "fondations", label: "Les fondations" },
          { id: "bibliotheque", label: "La bibliothèque" },
          { id: "chapitres", label: "Les chapitres" },
        ]}
      />
      <ScrollToTop />
    </main>
  );
}
