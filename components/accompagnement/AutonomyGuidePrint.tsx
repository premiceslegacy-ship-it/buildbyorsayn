"use client";

import Link from "next/link";
import { getThemeGuidance, TRACKS, type AccompanimentTheme } from "@/lib/siteWebAccompagnement";

type Props = {
  memberName: string | null;
  track: "debutant" | "experimente" | "agence";
  themes: AccompanimentTheme[];
  understoodThemeIds: string[];
};

export function AutonomyGuidePrint({ memberName, track, themes, understoodThemeIds }: Props) {
  const trackLabel = TRACKS.find((item) => item.id === track)?.shortLabel ?? track;

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 18mm; }
          html, body { background: #ffffff !important; }
          .guide-no-print { display: none !important; }
          .guide-shell { min-height: 0 !important; background: #ffffff !important; color: #151515 !important; }
          .guide-shell > article { padding-bottom: 0 !important; }
          .guide-muted { color: #4d4d4d !important; }
          .guide-line { border-color: #d8d8d2 !important; }
          .guide-section { break-inside: avoid; }
          a { color: inherit !important; text-decoration: none !important; }
        }
      `}</style>
      <main className="guide-shell min-h-screen bg-[#f4f3ec] text-[#151515]">
        <div className="guide-no-print mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link className="text-sm underline underline-offset-4" href="/accompagnement/espace">
            Retour à l'espace membre
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-[#151515] bg-[#151515] px-4 py-3 text-sm text-white transition hover:bg-[#353535] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#151515]"
          >
            Imprimer / enregistrer en PDF
          </button>
        </div>

        <article className="mx-auto max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-14">
          <header className="border-b-2 border-[#151515] pb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6a6a63]">BUILD · autonomie</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
              Guide d'autonomie
            </h1>
            <p className="guide-muted mt-5 max-w-2xl text-lg leading-8 text-[#4d4d4d]">
              Un repère pour continuer à décider, produire, vendre et progresser avec tes agents IA après les séances.
            </p>
            <div className="guide-muted mt-7 grid gap-3 text-sm sm:grid-cols-3">
              <p><strong className="text-[#151515]">Personne</strong><br />{memberName || "Membre BUILD"}</p>
              <p><strong className="text-[#151515]">Parcours</strong><br />{trackLabel}</p>
              <p><strong className="text-[#151515]">Progression</strong><br />{understoodThemeIds.length}/{themes.length} thèmes compris</p>
            </div>
          </header>

          <section className="guide-section border-b guide-line py-10">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6a6a63]">La méthode</p>
            <h2 className="mt-3 text-2xl font-medium">Donner le contexte avant de demander.</h2>
            <ol className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                "Décris le projet, la personne visée, l'offre et le résultat attendu.",
                "Demande une reformulation. Une mauvaise compréhension doit être corrigée avant le code.",
                "Sépare le plan et l'exécution. Une étape à la fois, avec ses risques.",
                "Demande une preuve : aperçu, test, comparaison ou mesure réelle.",
              ].map((tip, index) => (
                <li key={tip} className="flex gap-4 border-t border-[#d8d8d2] pt-4">
                  <span className="text-sm text-[#6a6a63]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm leading-6">{tip}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="guide-section border-b guide-line py-10">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6a6a63]">Tes repères</p>
            <h2 className="mt-3 text-2xl font-medium">Ce que chaque thème te permet de faire.</h2>
            <div className="mt-7 divide-y divide-[#d8d8d2] border-y border-[#d8d8d2]">
              {themes.map((theme) => {
                const guidance = getThemeGuidance(theme.id);
                const understood = understoodThemeIds.includes(theme.id);
                return (
                  <section key={theme.id} className="grid gap-4 py-6 sm:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6a6a63]">{theme.marker}</p>
                      <h3 className="mt-2 text-base font-medium">{theme.title}</h3>
                      <p className="mt-2 text-xs text-[#6a6a63]">{understood ? "Compris" : "À travailler"}</p>
                    </div>
                    <p className="text-sm leading-6"><strong>Compétence</strong><br />{guidance.competency}</p>
                    <p className="text-sm leading-6"><strong>Étape franchie</strong><br />{guidance.milestone}</p>
                  </section>
                );
              })}
            </div>
          </section>

          <section className="guide-section border-b guide-line py-10">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6a6a63]">Quand tu bloques</p>
            <p className="mt-4 max-w-2xl text-base leading-7">
              Reviens au dernier résultat vérifiable. Décris ce qui devait se passer, ce qui s'est réellement passé et la dernière modification. Demande à l'agent de chercher la cause avant de proposer une correction. Ne change pas plusieurs variables à la fois.
            </p>
          </section>

          <section className="guide-section border-b guide-line py-10">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6a6a63]">Après les premières ventes ou livraisons</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-3">
              <p className="text-sm leading-6"><strong>À 30 jours</strong><br />Observe une première réaction réelle et note ce qui mérite d&apos;être amélioré.</p>
              <p className="text-sm leading-6"><strong>À 60 jours</strong><br />Compare les demandes, les objections et les assets réellement utilisés.</p>
              <p className="text-sm leading-6"><strong>À 90 jours</strong><br />Garde ce qui fonctionne et transforme-le en méthode réutilisable.</p>
            </div>
          </section>

          <footer className="guide-muted pt-8 text-sm leading-6 text-[#6a6a63]">
            Garde ce qui est compris, vérifié, réutilisable et relié à un résultat. Une réussite isolée devient une piste, pas une règle générale.
          </footer>
        </article>
      </main>
    </>
  );
}
