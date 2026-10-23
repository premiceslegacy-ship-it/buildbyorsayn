"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { LessonPlayer } from "@/components/lessons/LessonPlayer";
import { formatLessonDuration } from "@/components/lessons/LessonMeta";
import type { BlocSection } from "@/lib/blocCatalog";
import { animateAppElement, installAppMotionTokens } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { chapterSummary } from "./readerModel";
import styles from "./reader.module.css";

type BlocNeighbor = { id: string; title: string; displayNumber: number };

type BlocOverviewProps = {
  blocId: string;
  title: string;
  displayNumber: number;
  sections: BlocSection[];
  previewSections: Pick<BlocSection, "id" | "title">[];
  totalSections: number;
  completedIds: readonly string[];
  checkoutHref: string;
  checkoutLabel: string;
  checkoutPrice: string;
  previousBloc?: BlocNeighbor;
  nextBloc?: BlocNeighbor;
};

function cleanBlocTitle(title: string) {
  return title.replace(/^Bloc \d+\s*:\s*/, "").trim();
}

function chapterStart(sections: BlocSection[], index: number) {
  return sections.slice(0, index).reduce((sum, section) => sum + (section.lesson?.durationSeconds ?? 0), 0);
}

function formatStart(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function lockedDescription(sections: Pick<BlocSection, "title">[], totalSections: number) {
  const [first, second] = sections;
  if (first && second) return `Tu y travailles « ${first.title} », puis « ${second.title} » dans ${totalSections} chapitres concrets.`;
  if (first) return `Tu y travailles « ${first.title} » dans un parcours concret.`;
  return `Tu y avances pas à pas dans ${totalSections} chapitres concrets.`;
}

export function BlocOverview({ blocId, title, displayNumber, sections, previewSections, totalSections, completedIds, checkoutHref, checkoutLabel, checkoutPrice, previousBloc, nextBloc }: BlocOverviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const nextIndex = sections.findIndex((section) => !completedIds.includes(section.id));
  const resumeIndex = nextIndex >= 0 ? nextIndex : Math.max(0, sections.length - 1);
  const current = sections[resumeIndex];
  const unlocked = sections.length > 0;
  const hasLockedChapters = sections.length < totalSections;
  const visibleSections = unlocked ? sections : previewSections;
  const totalDuration = sections.reduce((sum, section) => sum + (section.lesson?.durationSeconds ?? 0), 0);
  const summary = current ? chapterSummary(current.content) : "Découvre le cadre, les décisions et les gestes concrets de ce bloc.";
  const thumbnail = `/da/mini/b${displayNumber}.jpg`;

  useEffect(() => {
    installAppMotionTokens();
    const rows = root.current?.querySelectorAll<HTMLElement>("[data-overview-row]") ?? [];
    rows.forEach((row, index) => animateAppElement(row, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], "doux", index * 55));
  }, []);

  const animateAction = (element: HTMLElement, sound: "open" | "select") => {
    void playAppSound(sound);
    animateAppElement(element, [{ transform: "scale(.97)" }, { transform: "scale(1)" }], "vif");
  };

  return <div ref={root} className={`${styles.page} ${styles.overviewPage}`}>
    <main className={styles.overviewMain}>
      <div className={styles.overviewStage} data-testid="bloc-overview-media">
        {current?.lesson ? <LessonPlayer sectionId={current.id} title={current.title} onCompleted={() => undefined} /> : <>
          <Image src={thumbnail} alt="" fill priority sizes="(min-width: 1200px) 1184px, 100vw" />
          <div className={styles.overviewStageShade} />
          {unlocked ? <div className={styles.overviewUpcoming}><h2>La vidéo arrive bientôt.</h2><p>Le texte est déjà là.</p><Link className="btn btn--p" href={`/blocs/${blocId}/lire?chapter=${encodeURIComponent(current.id)}&mode=text`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "open")}>Lire le texte</Link></div> : null}
        </>}
        {visibleSections.length > 1 ? <div className={styles.timelineChapters} aria-hidden="true">{visibleSections.map((section, index) => <span key={section.id} data-active={unlocked && index === resumeIndex ? "true" : undefined} style={{ flexGrow: Math.max(1, sections[index]?.lesson?.durationSeconds ?? 1) }} />)}</div> : null}
      </div>

      <header className={styles.overviewIntro}>
        <h1><span className="mot">{cleanBlocTitle(title)}</span></h1>
        <p className={styles.overviewMeta}>Bloc {displayNumber}{totalDuration > 0 ? `, ${formatLessonDuration(totalDuration)}` : ""} en {totalSections} chapitre{totalSections > 1 ? "s" : ""}</p>
        <p className={styles.overviewSummary}>{summary}</p>
      </header>

      <section className={styles.overviewChapters} aria-labelledby="bloc-chapters-title">
        <div className={styles.chapterHeading}><h2 id="bloc-chapters-title">Chapitres</h2><span>{totalSections} chapitre{totalSections > 1 ? "s" : ""}</span></div>
        <ol className={styles.chapterList}>
          {visibleSections.map((section, index) => {
            const delivered = sections[index];
            const done = delivered ? completedIds.includes(delivered.id) : false;
            const currentChapter = unlocked && index === resumeIndex;
            const description = delivered ? chapterSummary(delivered.content) : "Disponible avec LE COFFRE.";
            const row = <>
              <span className={styles.chapterNumber}>{index + 1}</span>
              <span className={styles.chapterCopy}><b>{section.title}</b><span>{description}</span></span>
              <span className={styles.chapterMeta}>{delivered?.lesson ? <><b>{formatStart(chapterStart(sections, index))}</b><small>{formatLessonDuration(delivered.lesson.durationSeconds)}</small></> : unlocked ? "Texte disponible" : "Réservé"}</span>
              <span className={styles.chapterMark}>{done ? <><Check aria-hidden="true" /><span className="sr">Vu</span></> : currentChapter ? <><span className={styles.equalizer} aria-hidden="true"><i /><i /><i /></span><span className="sr">En cours</span></> : null}</span>
            </>;
            return <li key={section.id} data-overview-row>{unlocked && delivered ? <Link className={styles.chapterRow} href={`/blocs/${blocId}/lire?chapter=${encodeURIComponent(delivered.id)}&mode=${delivered.lesson ? "video" : "text"}`} aria-current={currentChapter ? "page" : undefined} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "open")}>{row}</Link> : <div className={styles.chapterRow}>{row}</div>}</li>;
          })}
        </ol>
      </section>

      {hasLockedChapters ? <section className={styles.paywall} aria-label="Accès réservé">
        <div className={styles.paywallCopy}><h2>Ce bloc fait partie de {checkoutLabel}.</h2><p>{lockedDescription(previewSections, totalSections)}</p></div>
        <div className={styles.paywallAction}><span className={styles.paywallPrice}>{checkoutPrice}</span><a className="btn btn--p" href={checkoutHref}>Voir l’offre</a></div>
      </section> : null}

      {unlocked && (previousBloc || nextBloc) ? <nav className={styles.overviewNeighbors} aria-label="Vidéos voisines">
        {previousBloc ? <Link href={`/blocs/${previousBloc.id}`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "select")}><Image src={`/da/mini/b${previousBloc.displayNumber}.jpg`} alt="" width={320} height={180} /><span><small>Vidéo précédente</small><strong>{cleanBlocTitle(previousBloc.title)}</strong><em>Bloc {previousBloc.displayNumber}</em></span></Link> : null}
        {nextBloc ? <Link href={`/blocs/${nextBloc.id}`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "select")}><Image src={`/da/mini/b${nextBloc.displayNumber}.jpg`} alt="" width={320} height={180} /><span><small>Vidéo suivante</small><strong>{cleanBlocTitle(nextBloc.title)}</strong><em>Bloc {nextBloc.displayNumber}</em></span></Link> : null}
      </nav> : null}

      {unlocked ? <label className={styles.notes}><span>Notes</span><textarea rows={4} placeholder="Écris ce que tu veux retenir." /></label> : null}
    </main>
    <footer className={styles.overviewFooter}><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
  </div>;
}
