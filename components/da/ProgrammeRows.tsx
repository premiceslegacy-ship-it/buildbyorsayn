"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { DaIcon } from "@/components/da/DaIcon";
import type { ProgrammeSection } from "@/lib/programme";
import { playAppSound } from "@/lib/ui/sound";

function ProgrammeCardView({ card }: { card: ProgrammeSection["cards"][number] }) {
  return (
    <li>
      <Link className="card" href={card.locked ? "/checkout" : card.href} data-locked={card.locked || undefined} data-sfx={card.locked ? "error" : undefined}>
        <span className="card__in">
          <span className="card__img">
            <Image src={card.image} alt="" fill sizes="(max-width: 734px) 47vw, (max-width: 1068px) 30vw, 23vw" />
            {card.locked && <span className="card__lock" aria-label="Accès selon ton offre"><DaIcon name="lock" /></span>}
          </span>
          <span className="card__cap"><span className="card__txt"><span className="card__t">{card.title}</span><span className="card__m">{card.meta}</span></span></span>
          <span className="card__pop"><span className="pop__b"><span className="pb pb--p"><DaIcon name="play" /></span></span><span className="pop__t">{card.title}</span><span className="pop__m"><span>{card.meta}</span></span></span>
        </span>
      </Link>
    </li>
  );
}

function Row({ section }: { section: ProgrammeSection }) {
  const list = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();
  const move = (direction: number) => {
    list.current?.scrollBy({ left: direction * list.current.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
    void playAppSound("click");
  };
  return (
    <section className="row" id={section.id}>
      <div className="row__h"><div className="row__ht"><h2 className="t-h2">{section.title}</h2><p className="row__d">{section.description}</p></div></div>
      <div className="row__v">
        <button className="row__a row__a--l" type="button" aria-label="Précédent" data-sfx="none" onClick={() => move(-1)}><DaIcon name="chevronLeft" /></button>
        <ul ref={list} className="row__l">{section.cards.map((card) => <ProgrammeCardView key={card.id} card={card} />)}</ul>
        <button className="row__a row__a--r" type="button" aria-label="Suivant" data-sfx="none" onClick={() => move(1)}><DaIcon name="chevron" /></button>
      </div>
    </section>
  );
}

export function ProgrammeRows({ sections }: { sections: ProgrammeSection[] }) {
  return <>{sections.map((section) => <Row key={section.id} section={section} />)}</>;
}
