import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { programmeForTier } from "@/lib/programme";
import { createClient } from "@/lib/supabase/server";
import { ANGLE_MORT, SECTIONS } from "./sections.data";
import styles from "./beginner.module.css";

export const dynamic = "force-dynamic";

function ChapterLink({ num, label, summary, href, state }: { num?: string; label: string; summary?: string; href: string; state: "done" | "current" | "todo" | "link" }) {
  return <li><Link className={styles.chapterRow} href={href} id={href.startsWith("/beginner/") ? href.split("/").at(-1) : undefined}>
    <span className={styles.chapterNumber}>{num ?? ""}</span>
    <span className={styles.chapterCopy}><b className={styles.chapterTitle}>{label}</b>{summary ? <span>{summary}</span> : null}</span>
    <span className={styles.chapterMeta} data-state={state}>{state === "done" ? "Lu" : state === "current" ? "En cours" : state === "link" ? "Ouvrir" : "À lire"}</span>
    <span className={styles.chapterMark}><span className="sr">Ouvrir</span></span>
  </Link></li>;
}

export default async function BeginnerPage() {
  const identity = await requirePageAccess("beginner", "/beginner");
  const supabase = await createClient();
  const { data: progressRows } = await supabase.from("lesson_progress").select("section_id,completed,updated_at").eq("user_id", identity.user.id).order("updated_at", { ascending: false });
  const completedIds = new Set((progressRows ?? []).filter((row) => row.completed).map((row) => row.section_id));
  const currentId = (progressRows ?? []).find((row) => !row.completed)?.section_id;
  const foundationCards = programmeForTier(identity.tier)[0].cards;
  const firstGroup = SECTIONS.slice(0, 5);
  const secondGroup = SECTIONS.slice(5);
  const totalChapters = SECTIONS.length + 1;
  const chapterState = (id: string) => completedIds.has(id) ? "done" as const : currentId === id ? "current" as const : "todo" as const;

  return <DaRoot className="da-app has-tabbar">
    <div className={styles.page}>
      <NavBar activeLink="beginner" {...identity} />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Fondations</h1>
          <p className={styles.heroSummary}>Une base claire pour comprendre, construire et vendre avec l’IA.</p>
          <div className={styles.heroActions}><Link className="btn btn--p btn--xl" href={`/beginner/${SECTIONS[0].id}?mode=texte`}>Commencer</Link><Link className="btn btn--l" href="#chapitres">Lire les chapitres</Link></div>
          <div className={styles.segments} role="img" aria-label={`${completedIds.size} chapitres lus sur ${totalChapters}`}><div className={styles.segmentTrack} style={{ "--reader-total": totalChapters } as CSSProperties}>{[...SECTIONS, ANGLE_MORT].map((chapter) => <span key={chapter.id} data-state={chapterState(chapter.id)} />)}</div><span className={styles.segmentLabel}>{completedIds.size} sur {totalChapters} chapitres lus</span></div>
        </div>
      </header>

      <section className={styles.videoGrid} aria-label="Les trois vidéos">
        {foundationCards.map((card, index) => {
          const href = index === 0 ? `/beginner/${firstGroup[0].id}` : index === 1 ? `/beginner/${secondGroup[0].id}` : card.href;
          return <Link className={styles.videoCard} href={href} key={card.id}>
            <span className={styles.videoImage}><Image src={card.image} alt="" fill sizes="(max-width: 734px) calc(100vw - 40px), 31vw" priority={index === 0} /></span>
            <span><h2>{card.title}</h2><p>{card.meta}</p></span>
          </Link>;
        })}
      </section>

      <section className={styles.chapters} id="chapitres" aria-labelledby="foundation-chapters-title">
        <header className={styles.intro}><h2 id="foundation-chapters-title">Les chapitres</h2><p>Lis à ton rythme. Ta progression reste enregistrée pour que tu reprennes au bon endroit.</p></header>
        <section className={styles.group} aria-labelledby="foundation-group-one"><div className={styles.groupHeader}><h3 id="foundation-group-one">Fondations 1</h3><span>Chapitres 01 à 05</span></div><ol>{firstGroup.map((chapter) => <ChapterLink key={chapter.id} {...chapter} href={`/beginner/${chapter.id}`} state={chapterState(chapter.id)} />)}</ol></section>
        <section className={styles.group} aria-labelledby="foundation-group-two"><div className={styles.groupHeader}><h3 id="foundation-group-two">Fondations 2</h3><span>Chapitres 06 à 10</span></div><ol>{secondGroup.map((chapter) => <ChapterLink key={chapter.id} {...chapter} href={`/beginner/${chapter.id}`} state={chapterState(chapter.id)} />)}</ol></section>
        <section className={styles.group} aria-labelledby="foundation-group-three"><div className={styles.groupHeader}><h3 id="foundation-group-three">La distillation</h3><span>Protocole puis chapitre 11</span></div><ol><ChapterLink label={foundationCards[2].title} summary="Le protocole en trois phases pour transformer ce que tu absorbes en travail utile." href={foundationCards[2].href} state="link" /><ChapterLink num={ANGLE_MORT.num} label={ANGLE_MORT.label} summary={ANGLE_MORT.summary} href={`/beginner/${ANGLE_MORT.id}`} state={chapterState(ANGLE_MORT.id)} /></ol></section>
      </section>
    </div>
  </DaRoot>;
}
