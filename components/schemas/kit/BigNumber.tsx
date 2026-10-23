import { ArrowRight } from "lucide-react";
import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type BigNumberProps = KitBaseProps & {
  before: { value: string; label: string };
  after: { value: string; label: string };
  sentence: string;
};

export function BigNumber({ before, after, sentence, ...frame }: BigNumberProps) {
  return <KitFrame {...frame} kind="big-number">
    <div className={styles.bigNumber}>
      <section><span>Avant</span><strong>{before.value}</strong><p>{before.label}</p></section>
      <ArrowRight aria-hidden="true" />
      <section className={styles.isAccent}><span>Après</span><strong>{after.value}</strong><p>{after.label}</p></section>
      <p className={styles.bigSentence}>{sentence}</p>
    </div>
  </KitFrame>;
}

