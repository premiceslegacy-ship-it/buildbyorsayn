import { Check, X } from "lucide-react";
import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type ForkOutcome = {
  label: string;
  condition: string;
  recommended?: boolean;
  rejected?: boolean;
};

export type ForkProps = KitBaseProps & {
  situation: string;
  outcomes: readonly ForkOutcome[];
};

export function Fork({ situation, outcomes, ...frame }: ForkProps) {
  return <KitFrame {...frame} kind="fork">
    <div className={styles.fork}>
      <div className={styles.forkSituation}><span>Situation</span><strong>{situation}</strong></div>
      <div className={styles.forkBranches} style={{ "--kit-count": outcomes.length } as React.CSSProperties}>{outcomes.map((outcome) => <article className={outcome.recommended ? styles.isAccent : outcome.rejected ? styles.forkRejected : undefined} key={outcome.label}>
        <span>{outcome.recommended ? <Check aria-hidden="true" /> : outcome.rejected ? <X aria-hidden="true" /> : null}</span>
        <strong>{outcome.label}</strong><p>{outcome.condition}</p>
      </article>)}</div>
    </div>
  </KitFrame>;
}

