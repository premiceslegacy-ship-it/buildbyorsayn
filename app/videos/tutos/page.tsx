import Image from "next/image";
import "server-only";
import { Suspense } from "react";
import { chapterTitle } from "../../doctrine/markdown";
import { COFFRE_LABEL } from "@/lib/pricing";
import { CHAPTER_META, CURRICULUM_SECTIONS, chapterSlug } from "./chapters";
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

const FIRST_MISSION = [
  ["01", "Choisis une tâche qui revient", "Pas « améliorer mon business ». Par exemple : préparer chaque lundi les trois priorités d'un dossier."],
  ["02", "Décris le résultat attendu", "Un rapport, un brouillon ou une liste d'actions que quelqu'un peut lire et corriger."],
  ["03", "Fixe ce que l'agent ne décide pas", "Publier, envoyer, modifier le CRM, dépenser ou valider un engagement restent des décisions séparées."],
  ["04", "Prévois la vérification humaine", "La tâche est terminée seulement quand une personne sait quoi relire, quoi accepter et quelle suite donner."],
] as const;

const REAL_CASES = [
  {
    label: "CAS 01",
    title: "Un carrousel Atelier, pas juste sept images",
    body: "Le système aide à garder le brief, le texte, la direction artistique, les assets en code et le contrôle ensemble. Le rendu final reste relu avant publication.",
    limit: "Ce cas montre un mécanisme de production. Il ne prouve ni portée, ni vente, ni gain de temps chiffré.",
  },
  {
    label: "CAS 02",
    title: "Google Search Console avec Treg, puis un brouillon contrôlé",
    body: "Dans le cas Atelier, Treg lit les données first-party de Google Search Console, relie une requête à la page concernée et prépare un brouillon. Un cron borne le moment où ce travail est préparé, sans remplacer le choix humain.",
    limit: "Le cron ne publie pas, ne pousse pas et ne demande pas d'indexation sans validation humaine.",
  },
] as const;

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

  const groups = CURRICULUM_SECTIONS.map((section) => ({
    ...section,
    files: gate.files
      .filter((file) => CHAPTER_META[file.path]?.section === section.key)
      .sort((left, right) => (CHAPTER_META[left.path]?.order ?? 999) - (CHAPTER_META[right.path]?.order ?? 999)),
  })).filter((section) => section.files.length > 0);

  const unknownFiles = gate.files.filter((file) => !CHAPTER_META[file.path]);

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

          {unknownFiles.length > 0 ? (
            <section aria-label="Chapitres supplémentaires">
              <div className="mb-6 max-w-2xl">
                <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">CHAPITRES SUPPLÉMENTAIRES</p>
                <p className="text-sm text-white/50 leading-relaxed">Ces chapitres n'ont pas encore reçu de place dans le parcours. Ils restent accessibles sans être mélangés aux premières missions.</p>
              </div>
              <IllustratedCardGrid>
                {unknownFiles.map((file) => (
                  <IllustratedCard
                    key={file.path}
                    title={chapterTitle(file)}
                    href={`/videos/tutos/${chapterSlug(file.path)}`}
                  />
                ))}
              </IllustratedCardGrid>
            </section>
          ) : null}

          <section id="installer" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12">
            <div className="max-w-2xl mb-7">
              <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">PRÊT À ESSAYER</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Installe Hermes après avoir choisi le premier travail à lui confier.</h2>
              <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">L'installation donne un environnement de travail. Elle ne remplace ni la mission, ni les droits, ni la vérification qui rendent un workflow réellement utile.</p>
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
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">RÉSERVÉ À {COFFRE_LABEL.toUpperCase()}</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">Hermes Agent, pour faire avancer un vrai travail.</h1>
            <p className="text-white/60 text-base sm:text-[17px] mt-5 leading-relaxed max-w-2xl">Un agent n'est pas une personne magique dans ton ordinateur. C'est une mission, un contexte limité, une méthode, des outils autorisés et une sortie qu'une personne peut vérifier.</p>
            <p className="text-white/45 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">Ici, tu pars d'une tâche qui revient. Tu apprends ensuite à créer un bot, un skill, une mémoire utile, un workflow ou un cron sans perdre le contrôle sur ce qui compte.</p>
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

        <section id="premier-pas" className="scroll-mt-24 border-y border-white/[0.1] py-10 sm:py-12 mb-16">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">LE PREMIER PAS</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Choisis une tâche avant de choisir un outil.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Tu n'as pas besoin de créer un agent complet aujourd'hui. Commence par un travail répétitif de moins de 30 minutes qui revient chaque semaine.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.1]">
            {FIRST_MISSION.map(([num, title, body]) => (
              <article key={num} className="py-5 sm:px-5 first:pl-0 last:pr-0 first:pt-0 sm:first:pt-5 last:pb-0 sm:last:pb-5">
                <p className="text-2xl font-light tabular-nums text-[#c9b48a]/65 mb-4">{num}</p>
                <h3 className="text-sm font-semibold text-[#f0ede8]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cas-concrets" className="scroll-mt-24 mb-16">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] tracking-[0.18em] text-[#e8d5b0] font-semibold mb-3">CE QUE ÇA CHANGE EN VRAI</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Deux scènes de travail, deux limites claires.</h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 leading-relaxed">Une démonstration utile montre le mécanisme, les droits et la relecture humaine. Elle ne transforme pas un résultat isolé en promesse générale.</p>
          </div>
          <div className="grid gap-8 border-y border-white/[0.1] py-7 md:grid-cols-2 md:divide-x divide-white/[0.1]">
            {REAL_CASES.map((item, index) => (
              <article key={item.label} className={index === 0 ? "md:pr-8" : "md:pl-8"}>
                <p className="text-[10px] tracking-[0.18em] font-semibold text-[#e8d5b0]/75 mb-3">{item.label}</p>
                <h3 className="text-lg font-semibold tracking-tight text-[#f0ede8]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
                <p className="mt-5 border-t border-white/[0.1] pt-4 text-xs leading-relaxed text-white/40">{item.limit}</p>
              </article>
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
          { id: "premier-pas", label: "PREMIER PAS" },
          { id: "cas-concrets", label: "CAS CONCRETS" },
          { id: "bibliotheque", label: "PARCOURS" },
          { id: "chapitres", label: "CHAPITRES" },
          { id: "installer", label: "INSTALLER" },
        ]}
      />
      <ScrollToTop />
    </main>
  );
}
