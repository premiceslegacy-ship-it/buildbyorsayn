"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./kit.module.css";

type AccentStyle = CSSProperties & { "--kit-em": string };

export function KitFrame({ title, description, ariaLabel, accent = "#22d96e", kind, children }: {
  title: string;
  description: string;
  ariaLabel: string;
  accent?: string;
  kind: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const style: AccentStyle = { "--kit-em": accent };

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
    </div>
  </motion.figure>;
}
