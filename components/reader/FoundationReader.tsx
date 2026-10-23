"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Copy, Play } from "lucide-react";
import { animateAppElement, installAppMotionTokens } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { ModeSwitch } from "./ModeSwitch";
import { READER_MODE_STORAGE_KEY, readingProgress, resolveReaderMode, type ReaderMode } from "./readerModel";
import styles from "./reader.module.css";

type FoundationChapterLink = {
  id: string;
  num: string;
  label: string;
  summary: string;
  href: string;
};

export function FoundationReader({
  title,
  summary,
  chapterNumber,
  currentId,
  chapters,
  previous,
  next,
  initialMode = null,
  children,
}: {
  title: string;
  summary: string;
  chapterNumber: string;
  currentId: string;
  chapters: FoundationChapterLink[];
  previous?: { href: string; label: string };
  next?: { href: string; label: string } | null;
  initialMode?: ReaderMode | null;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<ReaderMode>(initialMode ?? "video");
  const [size, setSize] = useState<"small" | "normal" | "large">("normal");
  const [progress, setProgress] = useState(0);
  const [copyLabel, setCopyLabel] = useState("Envoyer à mon IA");
  const article = useRef<HTMLElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    installAppMotionTokens();
    const url = new URL(window.location.href);
    const nextMode = resolveReaderMode(url.searchParams.get("mode"), window.localStorage.getItem(READER_MODE_STORAGE_KEY));
    const frame = window.requestAnimationFrame(() => setMode(nextMode));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(READER_MODE_STORAGE_KEY, mode);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    if (mode === "texte") window.requestAnimationFrame(() => article.current?.focus({ preventScroll: true }));
  }, [mode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || mode !== "texte") return;
      event.preventDefault();
      setMode("video");
      window.requestAnimationFrame(() => toolbar.current?.querySelector<HTMLButtonElement>('button[role="radio"]')?.focus());
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode]);

  useEffect(() => {
    if (mode !== "texte") return;
    const update = () => setProgress(readingProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [mode]);

  const changeMode = (nextMode: ReaderMode) => setMode(nextMode);
  const cycleSize = () => setSize((value) => value === "small" ? "normal" : value === "normal" ? "large" : "small");

  const copyText = async () => {
    const text = article.current?.innerText.trim() ?? "";
    try {
      await navigator.clipboard.writeText(`# ${title}\n\n${text}`);
      setCopyLabel("Copié");
      void playAppSound("confirm");
      if (copyButton.current) animateAppElement(copyButton.current, [{ transform: "scale(.94)" }, { transform: "scale(1)" }], "rebond");
      window.setTimeout(() => setCopyLabel("Envoyer à mon IA"), 1800);
    } catch {
      setCopyLabel("Réessayer");
      void playAppSound("error");
      if (copyButton.current) animateAppElement(copyButton.current, [{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], "vif");
      window.setTimeout(() => setCopyLabel("Envoyer à mon IA"), 1800);
    }
  };

  return <main className={styles.reader}>
    <div className={styles.toolbar} ref={toolbar}>
      <div className={styles.toolbarSide}><Link className={styles.iconButton} href="/beginner" aria-label="Retour à Fondations"><ArrowLeft aria-hidden="true" /></Link><span className={styles.toolbarTitle}><span>Fondations, chapitre {chapterNumber}</span><b>{title}</b></span></div>
      <ModeSwitch mode={mode} onChange={changeMode} />
      <div className={styles.toolbarSide}>{mode === "texte" ? <><button className={styles.iconButton} type="button" aria-label="Changer la taille du texte" onClick={cycleSize}><span aria-hidden="true">Aa</span></button><button ref={copyButton} className={styles.toolButton} type="button" data-sfx="none" onClick={() => void copyText()}><Copy aria-hidden="true" /><span>{copyLabel}</span></button></> : <>{previous ? <Link className={styles.iconButton} href={previous.href} aria-label="Chapitre précédent"><ArrowLeft aria-hidden="true" /></Link> : <span className={styles.iconButton} aria-disabled="true"><ArrowLeft aria-hidden="true" /></span>}{next ? <Link className={styles.iconButton} href={next.href} aria-label="Chapitre suivant"><ArrowRight aria-hidden="true" /></Link> : <span className={styles.iconButton} aria-disabled="true"><ArrowRight aria-hidden="true" /></span>}</>}</div>
      {mode === "texte" ? <span className={styles.readingBar} aria-hidden="true"><i style={{ "--reader-progress": progress } as CSSProperties} /></span> : null}
    </div>

    {mode === "video" ? <div className={styles.videoLayout}><div className={styles.stage}><div className={styles.coming}><div className={styles.comingInner}><span className={styles.comingIcon}><Play aria-hidden="true" /></span><h1>Vidéo à venir</h1><p>Le texte complet de ce chapitre est déjà disponible.</p><button className="btn btn--p" type="button" data-sfx="none" onClick={() => { void playAppSound("open"); setMode("texte"); }}>Lire le texte</button></div></div></div><div className={styles.chapterHeading}><h2>Les chapitres</h2><span>{chapters.length} chapitres</span></div><ol className={styles.chapterList}>{chapters.map((chapter) => <li key={chapter.id}><Link className={styles.chapterRow} href={chapter.href} aria-current={chapter.id === currentId ? "page" : undefined}><span className={styles.chapterNumber}>{chapter.num}</span><span className={styles.chapterCopy}><b>{chapter.label}</b><span>{chapter.summary}</span></span><span className={styles.chapterMark}>{chapter.id === currentId ? <span className="sr">Chapitre actuel</span> : null}</span></Link></li>)}</ol></div> : <div className={styles.textLayout}>
      <ol className={styles.rail} aria-label="Chapitres"><li className={styles.railLabel} aria-hidden="true">Chapitres</li>{chapters.map((chapter) => <li key={chapter.id}><Link className={styles.chapterRow} href={`${chapter.href}?mode=texte`} aria-current={chapter.id === currentId ? "page" : undefined}><span className={styles.chapterNumber}>{chapter.num}</span><span className={styles.chapterCopy}><b>{chapter.label}</b></span><span className={styles.chapterMark} /></Link></li>)}</ol>
      <article ref={article} className={styles.article} data-size={size} data-focus-ring="none" tabIndex={-1} aria-label={`Lecture de ${title}`}><header className={styles.articleHeader}><span>Chapitre {chapterNumber}</span><h1>{title}</h1><p>{summary}</p></header><div className={styles.prose}>{children}</div>{next ? <footer className={styles.articleEnd}><Link className={styles.nextCard} href={`${next.href}?mode=texte`}><small>Chapitre suivant</small><strong>{next.label}</strong></Link></footer> : null}</article>
    </div>}
  </main>;
}
