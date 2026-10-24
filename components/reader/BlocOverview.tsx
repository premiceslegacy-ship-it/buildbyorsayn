"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { LessonPlayer, type LessonPlayerHandle } from "@/components/lessons/LessonPlayer";
import { formatLessonDuration } from "@/components/lessons/LessonMeta";
import type { BlocVideo } from "@/lib/blocData.server";
import type { BlocSection } from "@/lib/blocCatalog";
import { animateAppElement, installAppMotionTokens, motionAllowed } from "@/lib/ui/motion";
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
  videos: BlocVideo[];
  initialVideoPosition?: number;
  initialSummaryOpen?: boolean;
  checkoutHref: string;
  checkoutLabel: string;
  checkoutPrice: string;
  previousBloc?: BlocNeighbor;
  nextBloc?: BlocNeighbor;
};

function cleanBlocTitle(title: string) {
  return title.replace(/^Bloc \d+\s*:\s*/, "").trim();
}

function formatStart(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function lockedDescription(sections: Pick<BlocSection, "title">[], totalSections: number) {
  const [first, second] = sections;
  if (first && second) return `Tu y travailles « ${first.title} », puis « ${second.title} » dans ${totalSections} chapitres concrets.`;
  if (first) return `Tu y travailles « ${first.title} » dans un parcours concret.`;
  return `Tu y avances pas à pas dans ${totalSections} chapitres concrets.`;
}

function railScroll(rail: HTMLDivElement | null, direction: number) {
  if (!rail) return;
  rail.scrollBy({ left: direction * Math.max(240, rail.clientWidth * .72), behavior: motionAllowed() ? "smooth" : "auto" });
}

function VideoRail({
  title,
  children,
  railRef,
  labelledBy,
}: {
  title: string;
  children: React.ReactNode;
  railRef: React.RefObject<HTMLDivElement | null>;
  labelledBy: string;
}) {
  return <section className={styles.videoRail} aria-labelledby={labelledBy} data-testid={labelledBy === "block-videos-title" ? "block-video-rail" : "video-chapter-rail"}>
    <div className={styles.videoRailHeading}>
      <h2 id={labelledBy}>{title}</h2>
      <div className={styles.videoRailControls} aria-label={`Faire défiler ${title.toLowerCase()}`}>
        <button type="button" aria-label="Faire défiler vers la gauche" onClick={() => railScroll(railRef.current, -1)}><ChevronLeft aria-hidden="true" /></button>
        <button type="button" aria-label="Faire défiler vers la droite" onClick={() => railScroll(railRef.current, 1)}><ChevronRight aria-hidden="true" /></button>
      </div>
    </div>
    <div ref={railRef} className={styles.videoRailScroller} tabIndex={0}>{children}</div>
  </section>;
}

export function BlocOverview({ blocId, title, displayNumber, sections, previewSections, totalSections, completedIds, videos, initialVideoPosition, initialSummaryOpen, checkoutHref, checkoutLabel, checkoutPrice, previousBloc, nextBloc }: BlocOverviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const playerRef = useRef<LessonPlayerHandle>(null);
  const chapterRailRef = useRef<HTMLDivElement>(null);
  const videoRailRef = useRef<HTMLDivElement>(null);
  const nextIndex = sections.findIndex((section) => !completedIds.includes(section.id));
  const resumeIndex = nextIndex >= 0 ? nextIndex : Math.max(0, sections.length - 1);
  const unlocked = sections.length > 0;
  const hasLockedChapters = sections.length < totalSections;
  const visibleSections = unlocked ? sections : previewSections;
  const selectedInitial = videos.find((video) => video.position === initialVideoPosition) ?? videos[0];
  const [selectedPosition, setSelectedPosition] = useState(selectedInitial?.position ?? 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(initialSummaryOpen ?? false);
  const selectedVideo = videos.find((video) => video.position === selectedPosition) ?? videos[0] ?? null;
  const selectedPlayableVideo = selectedVideo?.playbackId.trim() && selectedVideo.tokens.playback ? selectedVideo : null;
  const currentChapterIndex = selectedVideo?.chapters.reduce((current, chapter, index) => chapter.startSeconds <= currentTime ? index : current, -1) ?? -1;
  const totalVideoDuration = videos.reduce((sum, video) => sum + video.durationSeconds, 0);
  const thumbnail = `/da/mini/b${displayNumber}.jpg`;

  useEffect(() => {
    installAppMotionTokens();
    const rows = root.current?.querySelectorAll<HTMLElement>("[data-overview-row]") ?? [];
    rows.forEach((row, index) => animateAppElement(row, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], "doux", index * 55));
  }, []);

  useEffect(() => {
    setSummaryOpen(selectedVideo?.id === selectedInitial?.id ? initialSummaryOpen ?? false : false);
    setCurrentTime(0);
  }, [selectedVideo?.id, selectedInitial?.id, initialSummaryOpen]);

  const selectVideo = (position: number) => {
    setSelectedPosition(position);
    window.history.replaceState({}, "", `${window.location.pathname}?video=${position}`);
  };
  const selectChapter = (startSeconds: number) => {
    setCurrentTime(startSeconds);
    playerRef.current?.seekAndPlay(startSeconds);
  };
  const animateAction = (element: HTMLElement, sound: "open" | "select") => {
    void playAppSound(sound);
    animateAppElement(element, [{ transform: "scale(.97)" }, { transform: "scale(1)" }], "vif");
  };

  return <div ref={root} className={`${styles.page} ${styles.overviewPage}`}>
    <main className={styles.overviewMain}>
      <div className={styles.overviewStage} data-testid="bloc-overview-media">
        {selectedPlayableVideo ? <LessonPlayer
          ref={playerRef}
          directVideo={{ id: selectedPlayableVideo.id, playbackId: selectedPlayableVideo.playbackId, tokens: selectedPlayableVideo.tokens }}
          progressId={selectedPlayableVideo.id}
          title={selectedPlayableVideo.title}
          onCompleted={() => undefined}
          onTimeUpdate={(time) => setCurrentTime(time)}
        /> : <>
          <Image src={selectedVideo?.thumbnail || thumbnail} alt="" fill priority sizes="(min-width: 1200px) 1184px, 100vw" />
          <div className={styles.overviewStageShade} />
          {selectedVideo ? null : unlocked ? <div className={styles.overviewUpcoming}><h2>La vidéo arrive bientôt. Le texte est déjà là.</h2><Link className="btn btn--p" href={`/blocs/${blocId}/lire?chapter=${encodeURIComponent(sections[resumeIndex]?.id ?? "")}`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "open")}>Lire le texte</Link></div> : <div className={styles.overviewLocked}><p>Cette vidéo est dans LE COFFRE.</p></div>}
        </>}
      </div>

      <header className={styles.overviewIntro}>
        <h1><span className="mot">{cleanBlocTitle(title)}</span></h1>
        <p className={styles.overviewMeta}>Bloc {displayNumber}{videos.length > 0 ? `, ${videos.length} vidéo${videos.length > 1 ? "s" : ""}${totalVideoDuration > 0 ? `, ${formatLessonDuration(totalVideoDuration)}` : ""}` : ""}, {totalSections} chapitre{totalSections > 1 ? "s" : ""} à lire</p>
      </header>

      {selectedVideo ? <section className={styles.videoDetails} aria-labelledby="selected-video-title">
        <div className={styles.videoDetailsHeader}>
          <div>
            <h2 id="selected-video-title">{selectedVideo.title}</h2>
            <p className={styles.overviewMeta}>{videos.length > 1 ? `Vidéo ${selectedVideo.position} sur ${videos.length}, ` : ""}{formatLessonDuration(selectedVideo.durationSeconds)}</p>
          </div>
        </div>
        <p className={`${styles.videoSummary} ${summaryOpen ? styles.videoSummaryOpen : ""}`}>{selectedVideo.summary}</p>
        {selectedVideo.summary.length > 180 ? <button type="button" className={styles.textButton} onClick={() => setSummaryOpen((open) => !open)}>{summaryOpen ? "Moins" : "Plus"}</button> : null}
      </section> : null}

      {selectedVideo && selectedVideo.chapters.length > 0 ? <VideoRail title="Dans cette vidéo" labelledBy="video-chapters-title" railRef={chapterRailRef}>
        {selectedVideo.chapters.map((chapter, index) => <button key={`${selectedVideo.id}-${chapter.startSeconds}`} type="button" className={`${styles.videoChapterCard} ${index === currentChapterIndex ? styles.videoChapterCurrent : ""}`} aria-current={index === currentChapterIndex ? "true" : undefined} onClick={() => selectChapter(chapter.startSeconds)}>
          <span className={styles.videoChapterArtwork}><Image src={chapter.thumbnailUrl || selectedVideo.thumbnail || thumbnail} alt="" fill unoptimized loading="lazy" sizes="(min-width: 900px) 240px, 80vw" /><span className={styles.videoTime}>{formatStart(chapter.startSeconds)}</span>{index === currentChapterIndex ? <span className={styles.equalizer} aria-hidden="true"><i /><i /><i /></span> : null}</span>
          <strong>{chapter.title}</strong>
        </button>)}
      </VideoRail> : null}

      {videos.length > 1 ? <VideoRail title="Les vidéos du bloc" labelledBy="block-videos-title" railRef={videoRailRef}>
        {videos.map((video) => <button key={video.id} type="button" className={`${styles.blockVideoCard} ${video.id === selectedVideo?.id ? styles.blockVideoCurrent : ""}`} aria-current={video.id === selectedVideo?.id ? "true" : undefined} onClick={() => selectVideo(video.position)}>
          <span className={styles.blockVideoArtwork}><Image src={video.thumbnail || thumbnail} alt="" fill unoptimized loading="lazy" sizes="(min-width: 900px) 240px, 80vw" /><span className={styles.videoTime}>{formatLessonDuration(video.durationSeconds)}</span></span>
          <span className={styles.blockVideoCopy}><small>Vidéo {video.position}</small><strong>{video.title}</strong></span>
        </button>)}
      </VideoRail> : null}

      <section className={styles.overviewChapters} aria-labelledby="bloc-chapters-title">
        <div className={styles.chapterHeading}><h2 id="bloc-chapters-title">À lire</h2><span>{totalSections} chapitre{totalSections > 1 ? "s" : ""}</span></div>
        <ol className={styles.chapterList}>
          {visibleSections.map((section, index) => {
            const delivered = sections[index];
            const done = delivered ? completedIds.includes(delivered.id) : false;
            const currentChapter = unlocked && index === resumeIndex;
            const description = delivered ? chapterSummary(delivered.content) : "Disponible avec LE COFFRE.";
            const row = <><span className={styles.chapterNumber}>{index + 1}</span><span className={styles.chapterCopy}><b>{section.title}</b><span>{description}</span></span><span className={styles.chapterMeta}>{unlocked ? "Texte disponible" : "Réservé"}</span><span className={styles.chapterMark}>{done ? <><Check aria-hidden="true" /><span className="sr">Lu</span></> : currentChapter ? <><span className={styles.equalizer} aria-hidden="true"><i /><i /><i /></span><span className="sr">En cours</span></> : null}</span></>;
            return <li key={section.id} data-overview-row>{unlocked && delivered ? <Link className={styles.chapterRow} href={`/blocs/${blocId}/lire?chapter=${encodeURIComponent(delivered.id)}`} aria-current={currentChapter ? "page" : undefined} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "open")}>{row}</Link> : <div className={styles.chapterRow}>{row}</div>}</li>;
          })}
        </ol>
      </section>

      {hasLockedChapters ? <section className={styles.paywall} aria-label="Accès réservé"><div className={styles.paywallCopy}><h2>Ce bloc fait partie de {checkoutLabel}.</h2><p>{lockedDescription(previewSections, totalSections)}</p></div><div className={styles.paywallAction}><span className={styles.paywallPrice}>{checkoutPrice}</span><a className="btn btn--p" href={checkoutHref}>Voir l’offre</a></div></section> : null}

      {unlocked && (previousBloc || nextBloc) ? <nav className={styles.overviewNeighbors} aria-label="Blocs voisins">
        {previousBloc ? <Link href={`/blocs/${previousBloc.id}`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "select")}><Image src={`/da/mini/b${previousBloc.displayNumber}.jpg`} alt="" width={320} height={180} /><span><small>Bloc précédent</small><strong>{cleanBlocTitle(previousBloc.title)}</strong><em>Bloc {previousBloc.displayNumber}</em></span></Link> : null}
        {nextBloc ? <Link href={`/blocs/${nextBloc.id}`} data-sfx="none" onClick={(event) => animateAction(event.currentTarget, "select")}><Image src={`/da/mini/b${nextBloc.displayNumber}.jpg`} alt="" width={320} height={180} /><span><small>Bloc suivant</small><strong>{cleanBlocTitle(nextBloc.title)}</strong><em>Bloc {nextBloc.displayNumber}</em></span></Link> : null}
      </nav> : null}

      {unlocked ? <label className={styles.notes}><span>Notes</span><textarea rows={4} placeholder="Écris ce que tu veux retenir." /></label> : null}
    </main>
    <footer className={styles.overviewFooter}><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
  </div>;
}
