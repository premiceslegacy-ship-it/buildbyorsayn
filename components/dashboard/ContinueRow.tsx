"use client";

import Image from "next/image";
import { isRemoteImage } from "@/lib/media/imageSource";
import Link from "next/link";
import { useRef } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import type { ContinueItem } from "@/lib/dashboard/today";
import { playAppSound } from "@/lib/ui/sound";
import styles from "./ContinueRow.module.css";

/**
 * Reprendre rail of Aujourd'hui: chapters in progress and the next ones, each opening at the exact spot.
 * The line under the title says the mode ("lu à 40 %", "encore 6 min"); only the next chapter gets a label on the picture.
 */
export function ContinueRow({ items }: { items: ContinueItem[] }) {
  const list = useRef<HTMLUListElement>(null);
  const move = (direction: number) => {
    list.current?.scrollBy({ left: direction * list.current.clientWidth * 0.8, behavior: "smooth" });
    void playAppSound("click");
  };
  return (
    <section className="row" id="reprendre" aria-labelledby="reprendre-title">
      <div className="row__h">
        <div className="row__ht">
          <h2 className="t-h2" id="reprendre-title">Reprendre</h2>
          <p className="row__d">Tes chapitres en cours, du plus récent au plus ancien.</p>
        </div>
      </div>
      <div className="row__v">
        <button className="row__a row__a--l" type="button" aria-label="Précédent" data-sfx="none" onClick={() => move(-1)}><DaIcon name="chevronLeft" /></button>
        <ul ref={list} className="row__l">
          {items.map((item) => {
            const percent = item.progress === null ? null : Math.max(3, Math.round(item.progress * 100));
            return (
              <li key={item.id}>
                <Link className="card" href={item.href} data-continue={item.kind} data-mode={item.mode}>
                  <span className="card__in">
                    <span className="card__img">
                      <Image src={item.image} alt="" fill sizes="(max-width: 734px) 47vw, (max-width: 1068px) 30vw, 19vw" unoptimized={isRemoteImage(item.image)} />
                      {item.kind === "suivre" ? <span className={styles.chip}><DaIcon name="arrow" />À suivre</span> : null}
                      {item.kind === "reprendre" && percent !== null ? <span className="pbar" role="img" aria-label={`Avancement : ${percent} %`}><i style={{ width: `${percent}%` }} /></span> : null}
                    </span>
                    <span className="card__cap">
                      <span className="card__txt">
                        <span className={styles.course}>{item.courseLabel}</span>
                        <span className={`card__t ${styles.title}`}>{item.title}</span>
                        <span className="card__m">{item.meta}</span>
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <button className="row__a row__a--r" type="button" aria-label="Suivant" data-sfx="none" onClick={() => move(1)}><DaIcon name="chevron" /></button>
      </div>
    </section>
  );
}
