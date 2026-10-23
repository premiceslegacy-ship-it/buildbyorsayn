import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type LadderRung = {
  label: string;
  detail: string;
};

export type LadderProps = KitBaseProps & {
  rungs: readonly LadderRung[];
  accentIndex: number;
  lowLabel?: string;
  highLabel?: string;
};

export function Ladder({ rungs, accentIndex, lowLabel = "Faible", highLabel = "Fort", ...frame }: LadderProps) {
  return <KitFrame {...frame} kind="ladder">
    <div className={styles.ladder}>
      <span className={styles.ladderLow}>{lowLabel}</span>
      <span className={styles.ladderHigh}>{highLabel}</span>
      <ol>{rungs.map((rung, index) => <li className={index === accentIndex ? styles.isAccent : undefined} style={{ "--kit-rung": index } as React.CSSProperties} key={rung.label}>
        <span>{index + 1}</span><div><strong>{rung.label}</strong><p>{rung.detail}</p></div>
      </li>)}</ol>
    </div>
  </KitFrame>;
}

