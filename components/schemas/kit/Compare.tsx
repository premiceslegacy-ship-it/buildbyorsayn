import { Check, X } from "lucide-react";
import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type CompareRow = {
  before: string;
  after: string;
};

export type CompareProps = KitBaseProps & {
  beforeTitle: string;
  afterTitle: string;
  rows: readonly CompareRow[];
};

function CompareColumn({ title, rows, tone }: { title: string; rows: readonly string[]; tone: "before" | "after" }) {
  const Icon = tone === "after" ? Check : X;
  return <section className={`${styles.compareColumn} ${tone === "after" ? styles.compareAfter : styles.compareBefore}`}>
    <h4>{title}</h4>
    <ul>{rows.map((row, index) => <li key={`${row}-${index}`}><Icon aria-hidden="true" /><span>{row}</span></li>)}</ul>
  </section>;
}

export function Compare({ beforeTitle, afterTitle, rows, ...frame }: CompareProps) {
  return <KitFrame {...frame} kind="compare">
    <div className={styles.compare}>
      <CompareColumn title={beforeTitle} rows={rows.map((row) => row.before)} tone="before" />
      <CompareColumn title={afterTitle} rows={rows.map((row) => row.after)} tone="after" />
    </div>
  </KitFrame>;
}

