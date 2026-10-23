"use client";

import { ArrowRight, Hand, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./kit.module.css";

type AccentStyle = CSSProperties & { "--kit-em": string };

/** Une entrée de légende : la pastille montre le codage visuel, le texte dit ce qu'il veut dire. */
export type KitKey = { swatch: "accent" | "muted" | "human" | "arrow" | "loop"; label: string };

/** Mention des maquettes de sites : le style visuel est une illustration, pas une référence de design. */
export const SITE_DESIGN_DISCLAIMER = "Maquette d'illustration : regarde la structure et les mots. Le style visuel n'est pas un modèle de design à copier.";

export function KitFrame({ title, description, ariaLabel, accent = "#22d96e", kind, legend, keys, disclaimer, children }: {
  title: string;
  description: string;
  ariaLabel: string;
  accent?: string;
  kind: string;
  /** Phrase courte qui dit comment lire le schéma. */
  legend?: string;
  /** Codage visuel propre au gabarit (vert, main, flèche…). */
  keys?: readonly KitKey[];
  /** Petite mention sous la légende (maquettes de sites). */
  disclaimer?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const style: AccentStyle = { "--kit-em": accent };
  const shownKeys = (keys ?? []).filter((key) => key.label);

  return <motion.figure
    className={styles.frame}
    data-kit-schema={kind}
    role="img"
    aria-label={ariaLabel}
    style={style}
    initial={{ opacity: 1, y: 12, scale: .985 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: .15 }}
    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 158, damping: 25, mass: 1 }}
  >
    <div className={styles.canvas}>
      <figcaption className={styles.frameHeader}>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </figcaption>
      <div className={styles.body}>{children}</div>
      {legend || shownKeys.length || disclaimer ? <footer className={styles.legend} data-schema-legend="">
        {shownKeys.map((key) => <span className={styles.legendKey} key={`${key.swatch}-${key.label}`}>
          <KeySwatch swatch={key.swatch} />{key.label}
        </span>)}
        {legend ? <p>{legend}</p> : null}
        {disclaimer ? <small className={styles.disclaimer}>{disclaimer}</small> : null}
      </footer> : null}
    </div>
  </motion.figure>;
}

function KeySwatch({ swatch }: { swatch: KitKey["swatch"] }) {
  if (swatch === "human") return <Hand aria-hidden="true" data-swatch={swatch} />;
  if (swatch === "arrow") return <ArrowRight aria-hidden="true" data-swatch={swatch} />;
  if (swatch === "loop") return <RotateCcw aria-hidden="true" data-swatch={swatch} />;
  return <i aria-hidden="true" data-swatch={swatch} />;
}
