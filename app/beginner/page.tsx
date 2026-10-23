import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import styles from "@/components/reader/reader.module.css";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { programmeForTier } from "@/lib/programme";
import { ANGLE_MORT, SECTIONS } from "./sections.data";

export const dynamic = "force-dynamic";

function ChapterLink({ num, label, summary, href, meta }: { num: string; label: string; summary?: string; href: string; meta?: string }) {
  return <li><Link className={styles.chapterRow} href={href} id={href.startsWith("/beginner/") ? href.split("/").at(-1) : undefined}>
    <span className={styles.chapterNumber}>{num}</span>
    <span className={styles.chapterCopy}><b>{label}</b>{summary ? <span>{summary}</span> : null}</span>
    <span className={styles.chapterMeta}>{meta ?? "À lire"}</span>
    <span className={styles.chapterMark}><span className="sr">Ouvrir</span></span>
  </Link></li>;
}

export default async function BeginnerPage() {
  const identity = await requirePageAccess("beginner", "/beginner");
  const foundationCards = programmeForTier(identity.tier)[0].cards;
  const firstGroup = SECTIONS.slice(0, 5);
  const secondGroup = SECTIONS.slice(5);
  const totalChapters = SECTIONS.length + 2;

  return <DaRoot className="da-app has-tabbar">
    <div className={styles.foundationPage}>
      <NavBar activeLink="beginner" {...identity} />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Fondations</span>
          <h1>Construis sur une base <span className="mot">solide</span></h1>
          <p className={styles.heroSummary}>Tu peux lire chaque chapitre dès maintenant. Les vidéos apparaîtront ici lorsqu'elles seront publiées.</p>
          <div className={styles.heroActions}><Link className="btn btn--p btn--xl" href={`/beginner/${SECTIONS[0].id}?mode=texte`}>Commencer</Link><Link className="btn btn--l" href="#chapitres">Lire les chapitres</Link></div>
          <div className={styles.segments} role="img" aria-label={`${totalChapters} chapitres disponibles`}><div className={styles.segmentTrack} style={{ "--reader-total": totalChapters } as CSSProperties}>{Array.from({ length: totalChapters }, (_, index) => <span key={index} />)}</div><span className={styles.segmentLabel}>{totalChapters} chapitres disponibles</span></div>
        </div>
      </header>

      <section className={styles.videoGrid} aria-label="Les trois vidéos">
        {foundationCards.map((card, index) => {
          const href = index === 0 ? `/beginner/${firstGroup[0].id}` : index === 1 ? `/beginner/${secondGroup[0].id}` : card.href;
          return <Link className={styles.videoCard} href={href} key={card.id}>
            <span className={styles.videoImage}><Image src={card.image} alt="" fill sizes="(max-width: 734px) calc(100vw - 40px), 31vw" priority={index === 0} /></span>
            <span><h2>{card.title}</h2><p>{card.meta}, vidéo à venir</p></span>
          </Link>;
        })}
      </section>

      <section className={styles.foundationChapters} id="chapitres" aria-labelledby="foundation-chapters-title">
        <header className={styles.foundationIntro}><h2 id="foundation-chapters-title">Les chapitres</h2><p>Tu lis le texte, tu regardes la vidéo lorsqu'elle est disponible, ou tu fais les deux.</p></header>
        <section className={styles.foundationGroup} aria-labelledby="foundation-group-one"><div className={styles.foundationGroupHeader}><h3 id="foundation-group-one">{foundationCards[0].title}</h3><span>{foundationCards[0].meta}</span></div><ol>{firstGroup.map((chapter) => <ChapterLink key={chapter.id} {...chapter} href={`/beginner/${chapter.id}`} />)}</ol></section>
        <section className={styles.foundationGroup} aria-labelledby="foundation-group-two"><div className={styles.foundationGroupHeader}><h3 id="foundation-group-two">{foundationCards[1].title}</h3><span>{foundationCards[1].meta}</span></div><ol>{secondGroup.map((chapter) => <ChapterLink key={chapter.id} {...chapter} href={`/beginner/${chapter.id}`} />)}</ol></section>
        <section className={styles.foundationGroup} aria-labelledby="foundation-group-three"><div className={styles.foundationGroupHeader}><h3 id="foundation-group-three">{foundationCards[2].title}</h3><span>{foundationCards[2].meta}</span></div><ol><ChapterLink num="11" label={foundationCards[2].title} href={foundationCards[2].href} meta={foundationCards[2].meta} /><ChapterLink num={ANGLE_MORT.num} label={ANGLE_MORT.label} summary={ANGLE_MORT.summary} href={`/beginner/${ANGLE_MORT.id}`} /></ol></section>
      </section>
    </div>
  </DaRoot>;
}
