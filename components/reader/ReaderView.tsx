"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Copy, Play, RotateCcw, Sparkles } from "lucide-react";
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
  readerModeQuery,
  readingProgress,
  resolveChapterIndex,
  resolveReaderMode,
  serializeReaderMarkdown,
  type ReaderMode,
} from "./readerModel";
import styles from "./reader.module.css";

type ReaderViewProps = {
  title: string;
  displayNumber: number;
  sections: BlocSection[];
  totalSections: number;
  completedIds: readonly string[];
  initialMode?: ReaderMode | null;
  initialChapter?: string | null;
  onToggleChapter: (sectionId: string) => void | Promise<void>;
  onValidateBloc: () => void | Promise<void>;
  nextBloc?: { href: string; label: string };
  backHref: string;
};

type ReaderSize = "small" | "normal" | "large";

function summaryFromContent(content: string) {
  return chapterSummary(content);
}

function updateAddress(mode: ReaderMode, sectionId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", readerModeQuery(mode));
  url.searchParams.set("chapter", sectionId);
  url.hash = sectionId;
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function ChapterRows({
  sections,
  selected,
  completedIds,
  onSelect,
  compact = false,
}: {
  sections: BlocSection[];
  selected: number;
  completedIds: readonly string[];
  onSelect: (index: number) => void;
  compact?: boolean;
}) {
  const list = useRef<HTMLOListElement>(null);
  return <ol ref={list} className={compact ? styles.rail : styles.chapterList} aria-label="Chapitres">
    {compact ? <li className={styles.railLabel} aria-hidden="true">Chapitres</li> : null}
    {sections.map((section, index) => {
      const done = completedIds.includes(section.id);
      const summary = summaryFromContent(section.content);
      return <li key={section.id}>
        <button
          className={styles.chapterRow}
          type="button"
          data-sfx="none"
          data-section-id={section.id}
          aria-current={selected === index ? "true" : undefined}
          onClick={() => onSelect(index)}
          onKeyDown={(event) => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const buttons = [...(list.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
            const target = chapterIndexForKey(event.key as "ArrowDown" | "ArrowUp" | "Home" | "End", index, buttons.length, true);
            if (target !== null) buttons[target]?.focus();
          }}
        >
          <span className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.chapterCopy}><b>{section.title}</b>{summary ? <span>{summary}</span> : null}</span>
          <span className={styles.chapterMeta}>{section.lesson ? formatLessonDuration(section.lesson.durationSeconds) : "Vidéo à venir"}</span>
          <span className={styles.chapterMark} aria-label={done ? "Lu" : undefined}>{done ? <Check aria-hidden="true" /> : null}</span>
        </button>
      </li>;
    })}
  </ol>;
}

export function ReaderView({
  title,
  displayNumber,
  sections,
  totalSections,
  completedIds,
  initialMode = null,
  initialChapter,
  onToggleChapter,
  onValidateBloc,
  nextBloc,
  backHref,
}: ReaderViewProps) {
  const router = useRouter();
  const initialIndex = resolveChapterIndex(sections.map((section) => section.id), initialChapter);
  const [selected, setSelected] = useState(Math.max(0, initialIndex));
  const [mode, setMode] = useState<ReaderMode>(initialMode ?? "video");
  const [size, setSize] = useState<ReaderSize>("normal");
  const [copyState, setCopyState] = useState<"idle" | "done" | "error">("idle");
  const [readProgress, setReadProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const article = useRef<HTMLElement>(null);
  const modeControl = useRef<HTMLDivElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);
  const current = sections[selected];
  const completedCount = sections.filter((section) => completedIds.includes(section.id)).length;
  const allDeliveredComplete = sections.length > 0 && completedCount === sections.length;
  const hasLockedChapters = sections.length < totalSections;

  const markdown = useMemo(() => serializeReaderMarkdown(title, sections), [sections, title]);

  useEffect(() => {
    installAppMotionTokens();
    const address = new URL(window.location.href);
    const nextMode = resolveReaderMode(address.searchParams.get("mode"), window.localStorage.getItem(READER_MODE_STORAGE_KEY));
    const requestedChapter = address.searchParams.get("chapter") || address.hash;
    const frame = window.requestAnimationFrame(() => {
      setMode(nextMode);
      setSelected(Math.max(0, resolveChapterIndex(sections.map((section) => section.id), requestedChapter)));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [sections]);

  useEffect(() => {
    if (!current) return;
    window.localStorage.setItem(READER_MODE_STORAGE_KEY, mode);
    updateAddress(mode, current.id);
    if (mode === "texte") {
      window.requestAnimationFrame(() => article.current?.focus({ preventScroll: true }));
    }
  }, [current, mode]);

  useEffect(() => {
    if (mode !== "texte") return;
    const update = () => setReadProgress(readingProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [mode, selected]);

  const chooseChapter = useCallback((index: number) => {
    const section = sections[index];
    if (!section) return;
    setSelected(index);
    setEnded(false);
    void playAppSound("select");
    if (root.current) animateAppElement(root.current, [{ opacity: .82 }, { opacity: 1 }], "doux");
    window.requestAnimationFrame(() => window.scrollTo({ top: mode === "texte" ? 0 : Math.max(0, (root.current?.offsetTop ?? 0) - 70), behavior: "smooth" }));
  }, [mode, sections]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "Escape") {
        event.preventDefault();
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
  }, [backHref, chooseChapter, router, sections.length, selected]);

  const setReaderMode = (next: ReaderMode) => {
    setEnded(false);
    setMode(next);
  };

  const complete = useCallback((sectionId: string) => {
    const wasDone = completedIds.includes(sectionId);
    void onToggleChapter(sectionId);
    void playAppSound(wasDone ? "select" : "confirm");
    const target = root.current?.querySelector<HTMLElement>(`[data-section-id="${sectionId}"]`);
    if (target) animateAppElement(target, [{ transform: "scale(.985)" }, { transform: "scale(1)" }], wasDone ? "vif" : "rebond");
  }, [completedIds, onToggleChapter]);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
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

  return <div ref={root} className={`${styles.page} ${styles.readerPage}`}>
    {sections.length > 0 && current ? <main className={`${styles.reader} ${styles.readerOnly}`}>
      <div className={styles.toolbar} ref={modeControl}>
        <div className={styles.toolbarSide}>
          <Link className={styles.backButton} href={backHref} aria-label={`Retour au bloc ${displayNumber}`}><ArrowLeft aria-hidden="true" /><span>Bloc {displayNumber}</span></Link>
          <span className={styles.toolbarTitle}><span>Bloc {displayNumber}</span><b>{current.title}</b></span>
        </div>
        <ModeSwitch mode={mode} onChange={setReaderMode} />
        <div className={styles.toolbarSide}>
          {mode === "texte" ? <>
            <button className={styles.iconButton} type="button" aria-label="Changer la taille du texte" onClick={cycleSize}><span aria-hidden="true">Aa</span></button>
            <button ref={copyButton} className={styles.toolButton} type="button" data-sfx="none" onClick={() => void copyAll()}><Copy aria-hidden="true" /><span>{copyState === "done" ? "Copié" : copyState === "error" ? "Réessayer" : "Envoyer à mon IA"}</span></button>
          </> : <>
            <button className={styles.iconButton} type="button" data-sfx="none" aria-label="Chapitre précédent" disabled={selected === 0} onClick={() => chooseChapter(selected - 1)}><ArrowLeft aria-hidden="true" /></button>
            <button className={styles.iconButton} type="button" data-sfx="none" aria-label="Chapitre suivant" disabled={selected === sections.length - 1} onClick={() => chooseChapter(selected + 1)}><ArrowRight aria-hidden="true" /></button>
          </>}
        </div>
        {mode === "texte" ? <span className={styles.readingBar} aria-hidden="true"><i style={{ "--reader-progress": readProgress } as CSSProperties} /></span> : null}
      </div>

      {mode === "video" ? <div className={styles.videoLayout}>
        <div className={styles.stageWrap}>
          <div className={styles.stage}>
            {current.lesson ? <LessonPlayer key={current.id} sectionId={current.id} title={current.title} onCompleted={() => { if (!completedIds.includes(current.id)) complete(current.id); }} onEnded={() => setEnded(true)} /> : <div className={styles.coming}><div className={styles.comingInner}><span className={styles.comingIcon}><Play aria-hidden="true" /></span><h2>Vidéo à venir</h2><p>Le texte complet de ce chapitre est déjà disponible.</p><button className="btn btn--g" type="button" data-sfx="none" onClick={() => { void playAppSound("open"); setReaderMode("texte"); }}>Lire le texte</button></div></div>}
          </div>
          {ended ? <div className={styles.endOverlay}><div className={styles.endCard}><small>{selected < sections.length - 1 ? "Chapitre suivant" : "Fin du bloc"}</small><strong>{sections[selected + 1]?.title ?? "Tu as terminé cette vidéo."}</strong><div className={styles.heroActions}>{selected < sections.length - 1 ? <button className="btn btn--em" type="button" data-sfx="none" onClick={() => chooseChapter(selected + 1)}>Continuer</button> : null}<button className="btn btn--g" type="button" onClick={() => setEnded(false)}><RotateCcw aria-hidden="true" />Revoir</button></div></div></div> : null}
        </div>
        {current.lesson ? <div className={styles.lessonMeta}><LessonMeta lesson={current.lesson} /></div> : null}
        <div className={styles.chapterHeading}><h2>Chapitres</h2><span>{sections.length} chapitre{sections.length > 1 ? "s" : ""}</span></div>
        <ChapterRows sections={sections} selected={selected} completedIds={completedIds} onSelect={chooseChapter} />
        <div className={styles.neighbors}>
          {selected > 0 ? <button className={styles.neighborCard} type="button" data-sfx="none" onClick={() => chooseChapter(selected - 1)}><small>Chapitre précédent</small><strong>{sections[selected - 1].title}</strong></button> : <span className={styles.neighborCard} aria-disabled="true"><small>Tu es sur le premier chapitre</small></span>}
          {selected < sections.length - 1 ? <button className={styles.neighborCard} type="button" data-sfx="none" onClick={() => chooseChapter(selected + 1)}><small>Chapitre suivant</small><strong>{sections[selected + 1].title}</strong></button> : <span className={styles.neighborCard} aria-disabled="true"><small>Tu es sur le dernier chapitre</small></span>}
        </div>
      </div> : <div className={styles.textLayout}>
        <ChapterRows sections={sections} selected={selected} completedIds={completedIds} onSelect={chooseChapter} compact />
        <article ref={article} className={styles.article} data-size={size} data-focus-ring="none" tabIndex={-1} aria-label={`Lecture du chapitre ${selected + 1}`}>
          <header className={styles.articleHeader}><span>Chapitre {selected + 1}</span><h2>{current.title}</h2></header>
          <div className={styles.prose}><ReaderProse section={current} /></div>
          <footer className={styles.articleEnd}>
            <button className={`${styles.toolButton} ${styles.completeButton}`} type="button" aria-pressed={completedIds.includes(current.id)} data-sfx="none" onClick={() => complete(current.id)}>{completedIds.includes(current.id) ? <Check aria-hidden="true" /> : null}{completedIds.includes(current.id) ? "Chapitre lu" : "Marquer comme lu"}</button>
            {sections[selected + 1] ? <button className={styles.nextCard} type="button" data-sfx="none" onClick={() => chooseChapter(selected + 1)}><small>Chapitre suivant</small><strong>{sections[selected + 1].title}</strong></button> : null}
          </footer>
        </article>
      </div>}

      {allDeliveredComplete && !hasLockedChapters ? <section className={styles.finishCard}><Sparkles aria-hidden="true" /><div><h2>Ce bloc est terminé.</h2><p>Valide ta progression pour continuer dans le programme.</p></div><button className="btn btn--em" type="button" onClick={() => void onValidateBloc()}>{nextBloc ? "Passer au bloc suivant" : "Terminer le programme"}</button></section> : null}
    </main> : totalSections === 0 ? <ReaderEmpty /> : null}

  </div>;
}
