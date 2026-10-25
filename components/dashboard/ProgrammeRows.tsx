"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { isRemoteImage } from "@/lib/media/imageSource";
import Link from "next/link";
import { useRef } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import type { ProgrammeSection } from "@/lib/programme";
import { playAppSound } from "@/lib/ui/sound";
import styles from "./ProgrammeRows.module.css";

type ProgressByCard = Record<string, number>;

function ProgrammeCardView({ card, progress, showProgress }: { card: ProgrammeSection["cards"][number]; progress?: number; showProgress: boolean }) {
  const value = progress ?? 0;
  const clampedProgress = Math.max(0, Math.min(100, value));
  return (
    <li>
      <Link className={`card ${styles.card}`} href={card.locked ? "/checkout" : card.href} data-sfx={card.locked ? "error" : undefined}>
        <span className="card__in">
          <span className={`card__img ${card.locked ? styles.lockedImage : ""}`}>
            <Image src={card.image} alt="" fill sizes="(max-width: 734px) 47vw, (max-width: 1068px) 30vw, 23vw" unoptimized={isRemoteImage(card.image)} />
            {card.locked ? <span className={styles.accessLabel}><DaIcon name="lock" />Voir l’accès</span> : null}
            {showProgress && !card.locked && clampedProgress > 0 ? <span className="pbar" aria-hidden="true"><i style={{ width: `${clampedProgress}%` }} /></span> : null}
          </span>
          <span className="card__cap"><span className="card__txt"><span className="card__t">{card.title}</span><span className="card__m">{card.meta}</span></span></span>
        </span>
      </Link>
    </li>
  );
}

function Row({ section, progressByCard }: { section: ProgrammeSection; progressByCard?: ProgressByCard }) {
  const list = useRef<HTMLUListElement>(null);
  const move = (direction: number) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    list.current?.scrollBy({ left: direction * list.current.clientWidth * 0.8, behavior });
    void playAppSound("click");
  };
  const visibleProgress = section.cards.filter((card) => !card.locked);
  return (
    <section className="row" id={section.id}>
      <div className="row__h">
        <div className="row__ht">
          <h2 className="t-h2">{section.title}</h2>
          <p className="row__d">{section.description}</p>
          {progressByCard && visibleProgress.length > 0 ? <span className={styles.rowProgress} role="img" aria-label={`Progression dans ${section.title}`} style={{ "--row-count": visibleProgress.length } as CSSProperties}>{visibleProgress.map((card) => <i key={card.id} style={{ "--segment-progress": `${Math.max(0, Math.min(100, progressByCard[card.id] ?? 0))}%` } as CSSProperties} />)}</span> : null}
        </div>
        <Link className="btn btn--l" href={section.id === "commencer" ? "/beginner" : "/programme#blocs"}>Tout voir <DaIcon name="chevron" /></Link>
      </div>
      <div className="row__v">
        <button className="row__a row__a--l" type="button" aria-label="Précédent" data-sfx="none" onClick={() => move(-1)}><DaIcon name="chevronLeft" /></button>
        <ul ref={list} className="row__l">{section.cards.map((card) => <ProgrammeCardView key={card.id} card={card} progress={progressByCard?.[card.id]} showProgress={Boolean(progressByCard)} />)}</ul>
        <button className="row__a row__a--r" type="button" aria-label="Suivant" data-sfx="none" onClick={() => move(1)}><DaIcon name="chevron" /></button>
      </div>
    </section>
  );
}

export function ProgrammeRows({ sections, progressByCard }: { sections: ProgrammeSection[]; progressByCard?: ProgressByCard }) {
  return <>{sections.map((section) => <Row key={section.id} section={section} progressByCard={progressByCard} />)}</>;
}
