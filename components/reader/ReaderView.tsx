"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Copy, List, RotateCcw, X } from "lucide-react";
import { LessonPlayer } from "@/components/lessons/LessonPlayer";
import { LessonMeta, formatLessonDuration } from "@/components/lessons/LessonMeta";
import type { BlocSection } from "@/lib/blocCatalog";
import { animateAppElement, installAppMotionTokens } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { ModeSwitch } from "./ModeSwitch";
import { ReaderEmpty } from "./ReaderState";
import { ReaderProse } from "./ReaderProse";
import {
  READER_MODE_STORAGE_KEY,
  chapterIndexForKey,
  chapterSummary,
  estimateReadingMinutes,
  hasChapterNavigation,
  readerModeQuery,
  readingProgress,
  remainingReadingLabel,
  resolveChapterIndex,
  resolveReaderMode,
  serializeReaderMarkdown,
  type ReaderMode,
} from "./readerModel";
import styles from "./reader.module.css";

export type ReaderChapter = {
  id: string;
  title: string;
  summary?: string;
  content?: ReactNode;
  markdown?: string;
  diagram?: ReactNode;
  video?: ReactNode;
  durationLabel?: string;
  number?: string;
  href?: string;
  hideArticleHeader?: boolean;
  lesson?: BlocSection["lesson"];
  skillFiles?: BlocSection["skillFiles"];
  afterContent?: ReactNode;
};

type ReaderViewProps = {
  title: string;
  backLabel: string;
  backHref: string;
  sections: ReaderChapter[];
  totalSections?: number;
  completedIds?: readonly string[];
  initialMode?: ReaderMode | null;
  initialChapter?: string | null;
  toolbarTitle?: string;
  showUpcomingVideo?: boolean;
  syncAddress?: boolean;
  copyMarkdown?: string;
  markdownLocalPaths?: readonly string[];
  markdownBaseHref?: string;
  onToggleChapter?: (sectionId: string) => void | Promise<void>;
  onValidateBloc?: () => void | Promise<void>;
  nextBloc?: { href: string; label: string };
  finishTitle?: string;
  finishDetail?: string;
  finishActionLabel?: string;
  thumbnailSrc?: string;
  videoIntroductionMarkdown?: string;
};

type ReaderSize = "small" | "normal" | "large";
const READER_OUTLINE_STORAGE_KEY = "btv-reader-outline";

function chapterMarkdown(section: ReaderChapter): string | null {
  if (typeof section.markdown === "string") return section.markdown;
  return typeof section.content === "string" ? section.content : null;
}

function summaryFromSection(section: ReaderChapter) {
  return section.summary ?? chapterSummary(chapterMarkdown(section) ?? "");
}

function chapterReadingTime(section: ReaderChapter): string {
  const minutes = estimateReadingMinutes(chapterMarkdown(section) ?? section.summary ?? section.title);
  return minutes > 0 ? `${minutes} min de lecture` : "Lecture courte";
}

function inferredThumbnail(href: string | undefined, fallback: string | undefined): string | undefined {
  const blocId = href?.match(/^\/blocs\/(\d+)/)?.[1];
  return blocId ? `/da/mini/b${blocId}.jpg` : fallback;
}

function updateAddress(mode: ReaderMode, sectionId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", readerModeQuery(mode));
  url.searchParams.set("chapter", sectionId);
  url.hash = sectionId;
  const next = `${url.pathname}${url.search}${url.hash}`;
  // Next relie replaceState au routeur : réécrire la même adresse relance le rendu et boucle sans fin.
  if (next === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
  window.history.replaceState({}, "", next);
}

function withMode(href: string, mode: ReaderMode) {
  if (mode === "video") return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}mode=${readerModeQuery(mode)}`;
}

function ChapterRows({
  sections,
  selected,
  completedIds,
  showUpcomingVideo,
  onSelect,
  compact = false,
}: {
  sections: ReaderChapter[];
  selected: number;
  completedIds: readonly string[];
  showUpcomingVideo: boolean;
  onSelect: (index: number) => void;
  compact?: boolean;
}) {
  const list = useRef<HTMLOListElement>(null);
  const seriesHasVideo = sections.some((section) => Boolean(section.lesson || section.video));
  return <ol ref={list} className={compact ? styles.rail : styles.chapterList} aria-label="Chapitres">
    {compact ? <li className={styles.railLabel} aria-hidden="true">Chapitres</li> : null}
    {sections.map((section, index) => {
      const done = completedIds.includes(section.id);
      const summary = summaryFromSection(section);
      const contents = <>
        <span className={styles.chapterNumber}>{index + 1}</span>
        <span className={styles.chapterCopy}><b>{section.title}</b>{summary ? <span>{summary}</span> : null}</span>
        <span className={styles.chapterMeta}>{section.durationLabel ?? (section.lesson ? formatLessonDuration(section.lesson.durationSeconds) : showUpcomingVideo ? seriesHasVideo ? "Vidéo à venir" : chapterReadingTime(section) : null)}</span>
        <span className={styles.chapterMark} aria-label={done ? "Lu" : undefined}>{done ? <Check aria-hidden="true" /> : null}</span>
      </>;
      const keyHandler = (event: React.KeyboardEvent<HTMLElement>) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        const controls = [...(list.current?.querySelectorAll<HTMLElement>("a, button") ?? [])];
        const target = chapterIndexForKey(event.key as "ArrowDown" | "ArrowUp" | "Home" | "End", index, controls.length, true);
        if (target !== null) controls[target]?.focus();
      };
      return <li key={section.id}>
        <button className={styles.chapterRow} type="button" data-sfx="none" data-section-id={section.id} aria-current={selected === index ? "true" : undefined} onClick={() => onSelect(index)} onKeyDown={keyHandler}>{contents}</button>
      </li>;
    })}
  </ol>;
}

export function ReaderView({
  title,
  backLabel,
  backHref,
  sections,
  totalSections = sections.length,
  completedIds = [],
  initialMode = null,
  initialChapter,
  toolbarTitle = title,
  showUpcomingVideo = false,
  syncAddress = true,
  copyMarkdown,
  markdownLocalPaths,
  markdownBaseHref,
  onToggleChapter,
  onValidateBloc,
  nextBloc,
  finishTitle = "Ce parcours est terminé.",
  finishDetail = "Valide ta progression pour continuer dans le programme.",
  finishActionLabel,
  thumbnailSrc,
  videoIntroductionMarkdown,
}: ReaderViewProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const initialIndex = resolveChapterIndex(sections.map((section) => section.id), initialChapter);
  const hasVideoMode = showUpcomingVideo || sections.some((section) => Boolean(section.lesson || section.video));
  const [selected, setSelected] = useState(Math.max(0, initialIndex));
  const [mode, setMode] = useState<ReaderMode>(hasVideoMode ? initialMode ?? "video" : "texte");
  const [size, setSize] = useState<ReaderSize>("normal");
  const [copyState, setCopyState] = useState<"idle" | "done" | "error">("idle");
  const [readProgress, setReadProgress] = useState(0);
  const [readingMinutes, setReadingMinutes] = useState(0);
  const [ended, setEnded] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const article = useRef<HTMLElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);
  const current = sections[selected];
  const currentMarkdown = current ? chapterMarkdown(current) : null;
  const completedCount = sections.filter((section) => completedIds.includes(section.id)).length;
  const allDeliveredComplete = sections.length > 0 && completedCount === sections.length;
  const hasLockedChapters = sections.length < totalSections;
  const showChapterNavigation = hasChapterNavigation(sections.length);
  const totalDuration = sections.reduce((sum, section) => sum + (section.lesson?.durationSeconds ?? 0), 0);

  const markdown = useMemo(() => {
    if (copyMarkdown) return copyMarkdown;
    const markdownSections = sections.flatMap((section) => {
      const content = chapterMarkdown(section);
      return content ? [{ title: section.title, content }] : [];
    });
    return markdownSections.length > 0 ? serializeReaderMarkdown(title, markdownSections) : null;
  }, [copyMarkdown, sections, title]);

  // L'adresse n'est relue qu'à l'ouverture d'une liste de chapitres (montage ou autre bloc). Après cela, l'état du lecteur fait foi :
  // Next réconcilie l'URL de façon asynchrone après un replaceState, relire l'adresse à chaque rendu renvoyait au chapitre d'origine.
  const sectionIdsKey = sections.map((section) => section.id).join("\u0000");
  const openingChapter = useRef(initialChapter);
  useEffect(() => {
    installAppMotionTokens();
    const address = new URL(window.location.href);
    const nextMode = hasVideoMode ? resolveReaderMode(address.searchParams.get("mode"), window.localStorage.getItem(READER_MODE_STORAGE_KEY)) : "texte";
    const requestedChapter = address.searchParams.get("chapter") || address.hash || openingChapter.current;
    const frame = window.requestAnimationFrame(() => {
      setMode(nextMode);
      setSelected(Math.max(0, resolveChapterIndex(sectionIdsKey.split("\u0000"), requestedChapter)));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hasVideoMode, sectionIdsKey]);

  useEffect(() => {
    const stored = window.localStorage.getItem(READER_OUTLINE_STORAGE_KEY);
    const frame = window.requestAnimationFrame(() => {
      setOutlineOpen(stored === null ? window.matchMedia("(min-width: 1280px)").matches : stored === "1");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("r2-reader-open", mode === "texte");
    return () => document.documentElement.classList.remove("r2-reader-open");
  }, [mode]);

  useEffect(() => {
    if (!current) return;
    if (hasVideoMode) window.localStorage.setItem(READER_MODE_STORAGE_KEY, mode);
    if (syncAddress) updateAddress(mode, current.id);
    if (mode === "texte") window.requestAnimationFrame(() => article.current?.focus({ preventScroll: true }));
  }, [current, hasVideoMode, mode, syncAddress]);

  useEffect(() => {
    if (mode !== "texte") return;
    const update = () => setReadProgress(readingProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [mode, selected]);

  useEffect(() => {
    if (mode !== "texte" || !current) return;
    const frame = window.requestAnimationFrame(() => {
      const source = currentMarkdown ?? article.current?.innerText ?? current.summary ?? current.title;
      setReadingMinutes(estimateReadingMinutes(source));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [current, currentMarkdown, mode]);

  const chooseChapter = useCallback((index: number) => {
    const section = sections[index];
    if (!section) return;
    if (section.href && index !== selected) {
      void playAppSound("open");
      router.push(withMode(section.href, mode));
      return;
    }
    setSelected(index);
    setEnded(false);
    void playAppSound("open");
    window.requestAnimationFrame(() => window.scrollTo({ top: mode === "texte" ? 0 : Math.max(0, (root.current?.offsetTop ?? 0) - 70), behavior: "smooth" }));
  }, [mode, router, sections, selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable], [role=\"radiogroup\"]")) return;
      if (event.key === "Escape" && mode === "texte" && outlineOpen) {
        event.preventDefault();
        setOutlineOpen(false);
        window.localStorage.setItem(READER_OUTLINE_STORAGE_KEY, "0");
        void playAppSound("select");
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        void playAppSound("select");
        router.push(backHref);
        return;
      }
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const nextIndex = chapterIndexForKey(event.key as "ArrowLeft" | "ArrowRight" | "Home" | "End", selected, sections.length);
      if (nextIndex === null) return;
      event.preventDefault();
      chooseChapter(nextIndex);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [backHref, chooseChapter, mode, outlineOpen, router, sections.length, selected]);

  const setReaderMode = (next: ReaderMode) => {
    setEnded(false);
    setMode(next);
  };

  const toggleOutline = () => {
    const next = !outlineOpen;
    setOutlineOpen(next);
    window.localStorage.setItem(READER_OUTLINE_STORAGE_KEY, next ? "1" : "0");
    void playAppSound(next ? "open" : "select");
  };

  const complete = useCallback((sectionId: string) => {
    if (!onToggleChapter) return;
    const wasDone = completedIds.includes(sectionId);
    void onToggleChapter(sectionId);
    void playAppSound(wasDone ? "select" : "confirm");
    const target = root.current?.querySelector<HTMLElement>(`[data-section-id="${sectionId}"]`);
    if (target) animateAppElement(target, [{ transform: "scale(.985)" }, { transform: "scale(1)" }], wasDone ? "vif" : "rebond");
  }, [completedIds, onToggleChapter]);

  const copyAll = async () => {
    const fallback = article.current?.innerText.trim() ?? "";
    const text = markdown ?? `# ${title}\n\n${fallback}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("done");
      void playAppSound("confirm");
      if (copyButton.current) animateAppElement(copyButton.current, [{ transform: "scale(.94)" }, { transform: "scale(1)" }], "rebond");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      void playAppSound("error");
      if (copyButton.current) animateAppElement(copyButton.current, [{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], "vif");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  };

  const cycleSize = () => setSize((value) => value === "small" ? "normal" : value === "normal" ? "large" : "small");
  const nextChapter = sections[selected + 1];
  const endNextLabel = nextChapter?.title ?? nextBloc?.label;
  const endNextThumbnail = nextChapter ? thumbnailSrc : inferredThumbnail(nextBloc?.href, thumbnailSrc);

  return <div ref={root} className={`${styles.page} ${styles.readerPage}`} data-reader-mode={mode}>
    {sections.length > 0 && current ? <main className={`${styles.reader} ${styles.readerOnly}`}>
      <div className={`${styles.toolbar} ${hasVideoMode ? "" : styles.toolbarWithoutModes}`}>
        <div className={styles.toolbarSide}>
          <Link className={styles.iconButton} href={backHref} aria-label={`Fermer le lecteur et revenir à ${backLabel}`}><X aria-hidden="true" /></Link>
          {mode === "texte" ? <button className={`${styles.iconButton} ${styles.desktopOutlineButton}`} type="button" aria-label={outlineOpen ? "Fermer le sommaire" : "Ouvrir le sommaire"} aria-expanded={outlineOpen} aria-controls="reader-outline" data-sfx="none" onClick={toggleOutline}><List aria-hidden="true" /></button> : null}
          <span className={styles.toolbarTitle}><span>{mode === "texte" ? `${toolbarTitle}, ${remainingReadingLabel(readingMinutes, readProgress)}` : toolbarTitle}</span><b>{current.title}</b></span>
        </div>
        {hasVideoMode ? <ModeSwitch mode={mode} onChange={setReaderMode} /> : null}
        <div className={styles.toolbarSide}>
          {mode === "texte" ? <>
            <button className={styles.iconButton} type="button" aria-label="Changer la taille du texte" onClick={cycleSize}><span aria-hidden="true">Aa</span></button>
            <button ref={copyButton} className={styles.toolButton} type="button" data-sfx="none" onClick={() => void copyAll()}><Copy aria-hidden="true" /><span>{copyState === "done" ? "Copié" : copyState === "error" ? "Réessayer" : "Envoyer à mon IA"}</span></button>
            <button className={`${styles.iconButton} ${styles.mobileOutlineButton}`} type="button" aria-label={outlineOpen ? "Fermer le sommaire" : "Ouvrir le sommaire"} aria-expanded={outlineOpen} aria-controls="reader-outline" data-sfx="none" onClick={toggleOutline}><List aria-hidden="true" /></button>
          </> : showChapterNavigation ? <>
            {sections[selected - 1]?.href
              ? <Link className={styles.iconButton} href={withMode(sections[selected - 1].href!, mode)} data-sfx="none" aria-label="Chapitre précédent" onClick={() => void playAppSound("open")}><ArrowLeft aria-hidden="true" /></Link>
              : <button className={styles.iconButton} type="button" data-sfx="none" aria-label="Chapitre précédent" disabled={selected === 0} onClick={() => chooseChapter(selected - 1)}><ArrowLeft aria-hidden="true" /></button>}
            {sections[selected + 1]?.href
              ? <Link className={styles.iconButton} href={withMode(sections[selected + 1].href!, mode)} data-sfx="none" aria-label="Chapitre suivant" onClick={() => void playAppSound("open")}><ArrowRight aria-hidden="true" /></Link>
              : <button className={styles.iconButton} type="button" data-sfx="none" aria-label="Chapitre suivant" disabled={selected === sections.length - 1} onClick={() => chooseChapter(selected + 1)}><ArrowRight aria-hidden="true" /></button>}
          </> : null}
        </div>
        {mode === "texte" ? <span className={styles.readingBar} aria-hidden="true"><i style={{ "--reader-progress": readProgress } as CSSProperties} /></span> : null}
      </div>

      {mode === "video" ? <div className={styles.videoLayout}>
        <div className={styles.stageWrap}>
          <div className={styles.stage}>
            {current.video ? <div className={styles.customVideo}>{current.video}</div> : current.lesson ? <LessonPlayer key={current.id} sectionId={current.id} title={current.title} onCompleted={() => { if (!completedIds.includes(current.id)) complete(current.id); }} onEnded={() => setEnded(true)} /> : <div className={styles.coming}>{thumbnailSrc ? <Image className={styles.comingBackground} src={thumbnailSrc} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" /> : null}<div className={styles.comingInner}><h2>La vidéo arrive bientôt. Le texte est déjà là.</h2><button className="btn btn--p" type="button" data-sfx="none" onClick={() => { void playAppSound("open"); setReaderMode("texte"); }}>Lire le texte</button></div></div>}
          </div>
          {sections.length > 1 ? <div className={styles.timelineChapters} aria-hidden="true">{sections.map((section, index) => <span key={section.id} data-active={index === selected ? "true" : undefined} style={{ flexGrow: Math.max(1, section.lesson?.durationSeconds ?? 1) }} />)}</div> : null}
          {ended ? <div className={styles.endOverlay}><div className={styles.endCard}>
            {endNextThumbnail && endNextLabel ? <div className={styles.endArtwork}><Image src={endNextThumbnail} alt="" fill sizes="(min-width: 735px) 320px, 70vw" /></div> : null}
            <small>{nextChapter ? "Chapitre suivant" : nextBloc ? "Vidéo suivante" : "Fin du parcours"}</small>
            <strong>{endNextLabel ?? "Tu as terminé cette vidéo."}</strong>
            {nextChapter ? <p>{chapterReadingTime(nextChapter)}</p> : null}
            <div className={styles.heroActions}>{nextChapter ? <button className="btn btn--p" type="button" data-sfx="none" onClick={() => chooseChapter(selected + 1)}>Continuer</button> : nextBloc ? <Link className="btn btn--p" href={nextBloc.href}>Regarder</Link> : null}<button className="btn btn--g" type="button" onClick={() => setEnded(false)}><RotateCcw aria-hidden="true" />Revoir</button></div>
          </div></div> : null}
        </div>
        <header className={styles.videoIntro}>
          <h1>{title.replace(/^Bloc \d+\s*:\s*/, "")}</h1>
          <p className={styles.videoMeta}>{toolbarTitle}{totalDuration > 0 ? `, ${formatLessonDuration(totalDuration)}` : ""} en {sections.length} chapitre{sections.length > 1 ? "s" : ""}</p>
          {current.summary ? <p className={styles.videoSummary}>{current.summary}</p> : null}
          {videoIntroductionMarkdown ? <div className={`${styles.prose} ${styles.videoIntroduction}`}><ReaderProse section={{ content: videoIntroductionMarkdown }} /></div> : null}
        </header>
        {current.lesson ? <div className={styles.lessonMeta}><LessonMeta lesson={current.lesson} /></div> : null}
        <div className={styles.chapterHeading}><h2>Chapitres</h2><span>{sections.length} chapitre{sections.length > 1 ? "s" : ""}</span></div>
        <ChapterRows sections={sections} selected={selected} completedIds={completedIds} showUpcomingVideo={showUpcomingVideo} onSelect={chooseChapter} />
        {showChapterNavigation ? <div className={styles.neighbors}>
          {selected > 0 ? <button className={styles.neighborCard} type="button" data-sfx="none" onClick={() => chooseChapter(selected - 1)}><small>Chapitre précédent</small><strong>{sections[selected - 1].title}</strong></button> : null}
          {selected < sections.length - 1 ? <button className={styles.neighborCard} type="button" data-sfx="none" onClick={() => chooseChapter(selected + 1)}><small>Chapitre suivant</small><strong>{sections[selected + 1].title}</strong></button> : null}
        </div> : null}
        <label className={styles.notes}><span>Notes</span><textarea rows={4} placeholder="Écris ce que tu veux retenir." /></label>
      </div> : <div className={styles.textLayout} data-outline-open={outlineOpen ? "true" : "false"}>
        <AnimatePresence initial={false}>
          {outlineOpen ? <>
            <motion.button className={styles.outlineBackdrop} type="button" aria-label="Fermer le sommaire" onClick={toggleOutline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .2 }} />
            <motion.aside id="reader-outline" className={styles.outline} aria-label="Sommaire" initial={reduceMotion ? false : { opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .98 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}>
              <div className={styles.outlineHeader}><strong>Chapitres</strong><button className={styles.iconButton} type="button" aria-label="Fermer le sommaire" data-sfx="none" onClick={toggleOutline}><X aria-hidden="true" /></button></div>
              <ChapterRows sections={sections} selected={selected} completedIds={completedIds} showUpcomingVideo={showUpcomingVideo} onSelect={chooseChapter} compact />
            </motion.aside>
          </> : null}
        </AnimatePresence>
        <motion.article key={current.id} ref={article} className={styles.article} data-size={size} data-focus-ring="none" tabIndex={-1} aria-label={`Lecture de ${current.title}`} initial={reduceMotion ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}>
          <header className={`${styles.articleHeader} ${current.hideArticleHeader ? styles.articleHeaderLabelOnly : ""}`}><span>Chapitre {selected + 1}</span>{!current.hideArticleHeader ? <><h1>{current.title}</h1>{current.summary ? <p>{current.summary}</p> : null}</> : null}</header>
          <div className={styles.prose}>
            {currentMarkdown ? <ReaderProse section={{ content: currentMarkdown, skillFiles: current.skillFiles }} allowedLocalPaths={markdownLocalPaths} localBaseHref={markdownBaseHref} /> : current.content}
            {current.diagram ? <div className={styles.diagramSlot}>{current.diagram}</div> : null}
            {current.afterContent}
          </div>
          <footer className={styles.articleEnd}>
            {onToggleChapter ? <button className={`${styles.toolButton} ${styles.completeButton}`} type="button" aria-pressed={completedIds.includes(current.id)} data-sfx="none" onClick={() => complete(current.id)}>{completedIds.includes(current.id) ? <Check aria-hidden="true" /> : null}{completedIds.includes(current.id) ? "Chapitre lu" : "Marquer comme lu"}</button> : null}
            {nextChapter ? nextChapter.href
              ? <Link className={styles.nextCard} href={withMode(nextChapter.href, mode)}>
                {thumbnailSrc ? <span className={styles.nextArtwork}><Image src={thumbnailSrc} alt="" fill sizes="(min-width: 735px) 240px, 100vw" /></span> : null}
                <span className={styles.nextCopy}><small>Chapitre suivant</small><strong>{nextChapter.title}</strong><span>{chapterReadingTime(nextChapter)}</span><b>Lire</b></span>
              </Link>
              : <button className={styles.nextCard} type="button" data-sfx="none" onClick={() => chooseChapter(selected + 1)}>
                {thumbnailSrc ? <span className={styles.nextArtwork}><Image src={thumbnailSrc} alt="" fill sizes="(min-width: 735px) 240px, 100vw" /></span> : null}
                <span className={styles.nextCopy}><small>Chapitre suivant</small><strong>{nextChapter.title}</strong><span>{chapterReadingTime(nextChapter)}</span><b>Lire</b></span>
              </button> : null}
          </footer>
        </motion.article>
      </div>}

      {onValidateBloc && allDeliveredComplete && !hasLockedChapters ? <section className={styles.finishCard}><Check aria-hidden="true" /><div><h2>{finishTitle}</h2><p>{finishDetail}</p></div><button className="btn btn--p" type="button" onClick={() => void onValidateBloc()}>{finishActionLabel ?? (nextBloc ? "Passer au bloc suivant" : "Terminer le programme")}</button></section> : null}
    </main> : totalSections === 0 ? <ReaderEmpty /> : null}
  </div>;
}
