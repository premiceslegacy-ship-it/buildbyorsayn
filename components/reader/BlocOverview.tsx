"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, LockKeyhole, Play } from "lucide-react";
import type { BlocSection } from "@/lib/blocCatalog";
import { animateAppElement, installAppMotionTokens } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { chapterProgressLabel, chapterSummary } from "./readerModel";
import { formatLessonDuration } from "@/components/lessons/LessonMeta";
import styles from "./reader.module.css";

type BlocOverviewProps = {
  blocId: string;
  title: string;
  displayNumber: number;
  sections: BlocSection[];
  totalSections: number;
  completedIds: readonly string[];
  checkoutHref: string;
  checkoutLabel: string;
  checkoutPrice: string;
};

function titleParts(title: string) {
  const words = title.replace(/^Bloc \d+\s*:\s*/, "").trim().split(/\s+/);
  const highlighted = words.pop() ?? "";
  return { leading: words.join(" "), highlighted };
}

export function BlocOverview({ blocId, title, displayNumber, sections, totalSections, completedIds, checkoutHref, checkoutLabel, checkoutPrice }: BlocOverviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const { leading, highlighted } = titleParts(title);
  const completedCount = sections.filter((section) => completedIds.includes(section.id)).length;
  const currentIndex = sections.findIndex((section) => !completedIds.includes(section.id));
  const resumeIndex = currentIndex >= 0 ? currentIndex : Math.max(0, sections.length - 1);
  const current = sections[resumeIndex];
  const started = completedCount > 0;
  const hasLockedChapters = sections.length < totalSections;
  const summary = useMemo(() => chapterSummary(sections[0]?.content ?? ""), [sections]);

  useEffect(() => {
    installAppMotionTokens();
    const rows = root.current?.querySelectorAll<HTMLElement>(`[data-overview-row]`) ?? [];
    rows.forEach((row, index) => animateAppElement(row, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], "doux", index * 55));
  }, []);

  const animateAction = (element: HTMLElement, sound: "open" | "select" | "confirm") => {
    void playAppSound(sound);
    animateAppElement(element, [{ transform: "scale(.97)" }, { transform: "scale(1)" }], "vif");
  };

  return <div ref={root} className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.eyebrow}>Bloc {displayNumber}{hasLockedChapters ? ", accès limité" : ""}</span>
        <h1>{leading ? `${leading} ` : ""}<span className="mot">{highlighted}</span></h1>
        {summary ? <p className={styles.heroSummary}>{summary}</p> : null}
        <div className={styles.segments} role="img" aria-label={chapterProgressLabel(completedCount, totalSections)}>
          <div className={styles.segmentTrack} style={{ "--reader-total": Math.max(1, totalSections) } as CSSProperties}>
            {Array.from({ length: totalSections }, (_, index) => <span key={index} data-state={index < completedCount ? "done" : index === completedCount ? "current" : "todo"} />)}
          </div>
          <span className={styles.segmentLabel}>{chapterProgressLabel(completedCount, totalSections)}</span>
        </div>
        {current ? <div className={styles.heroActions}>
          <Link className="btn btn--p btn--xl" href={`/blocs/${blocId}/lire?chapter=${encodeURIComponent(current.id)}&mode=${current.lesson ? "video" : "text"}`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, current.lesson ? "confirm" : "open")}><Play aria-hidden="true" />{started ? "Reprendre" : "Commencer"}</Link>
          {current.lesson ? <Link className="btn btn--g" href={`/blocs/${blocId}/lire?chapter=${encodeURIComponent(current.id)}&mode=text`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "select")}>Lire le texte</Link> : null}
        </div> : null}
      </div>
    </header>

    {sections.length > 0 ? <section className={styles.overviewChapters} aria-labelledby="bloc-chapters-title">
      <div className={styles.chapterHeading}><h2 id="bloc-chapters-title">Chapitres</h2><span>{sections.length} chapitre{sections.length > 1 ? "s" : ""}</span></div>
      <ol className={styles.chapterList}>
        {sections.map((section, index) => {
          const done = completedIds.includes(section.id);
          const currentChapter = index === currentIndex;
          const description = chapterSummary(section.content);
          return <li key={section.id} data-overview-row>
            <Link className={styles.chapterRow} href={`/blocs/${blocId}/lire?chapter=${encodeURIComponent(section.id)}&mode=${section.lesson ? "video" : "text"}`} aria-current={currentChapter ? "page" : undefined} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "select")}>
              <span className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.chapterCopy}><b>{section.title}</b>{description ? <span>{description}</span> : null}</span>
              <span className={styles.chapterMeta}>{section.lesson ? formatLessonDuration(section.lesson.durationSeconds) : null}</span>
              <span className={styles.chapterMark}>{done ? <><Check aria-hidden="true" /><span className="sr">Vu</span></> : currentChapter ? <><span className={styles.equalizer} aria-hidden="true"><i /><i /><i /></span><span className="sr">En cours</span></> : null}</span>
            </Link>
          </li>;
        })}
      </ol>
    </section> : null}

    {hasLockedChapters ? <section className={styles.paywall} aria-label="Accès réservé">
      <span className={styles.paywallIcon}><LockKeyhole aria-hidden="true" /></span>
      <div className={styles.paywallCopy}><h2>Continue avec {checkoutLabel}</h2><p>Ton accès actuel ne transmet aucun texte réservé à ce navigateur.</p></div>
      <div className={styles.paywallAction}><span className={styles.paywallPrice}>{checkoutPrice}</span><a className="btn btn--em" href={checkoutHref}>Voir l’accès</a></div>
    </section> : null}

    <footer className={styles.overviewFooter}><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
  </div>;
}
