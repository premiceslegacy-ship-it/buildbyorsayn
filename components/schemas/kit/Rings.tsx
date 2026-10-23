import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type RingItem = {
  label: string;
  detail: string;
};

export type RingsProps = KitBaseProps & {
  core: string;
  rings: readonly RingItem[];
  accentIndex: number;
};

export function Rings({ core, rings, accentIndex, ...frame }: RingsProps) {
  const ringStep = rings.length > 1 ? Math.min(84, 252 / (rings.length - 1)) : 0;

  return <KitFrame {...frame} kind="rings">
    <div className={styles.ringsWide}>
      {rings.slice().reverse().map((ring, reverseIndex) => {
        const index = rings.length - reverseIndex - 1;
        return <div
          className={`${styles.ring} ${index === accentIndex ? styles.isAccent : ""}`}
          style={{
            "--kit-ring-depth": reverseIndex,
            "--kit-ring-size": `${350 - reverseIndex * ringStep}px`,
          } as React.CSSProperties}
          key={ring.label}
        ><span>{ring.label}</span></div>;
      })}
      <strong className={styles.ringCore}>{core}</strong>
    </div>
    <div className={styles.ringsList}>
      <strong>{core}</strong>
      <ol>{rings.map((ring, index) => <li className={index === accentIndex ? styles.isAccent : undefined} key={ring.label}><span>{index + 1}</span><div><strong>{ring.label}</strong><p>{ring.detail}</p></div></li>)}</ol>
    </div>
  </KitFrame>;
}
