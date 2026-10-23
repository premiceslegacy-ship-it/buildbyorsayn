import { KitFrame } from "./KitFrame";
import { ToolMark } from "./ToolMark";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type CycleStep = {
  label: string;
  detail?: string;
  tool?: string;
};

export type CycleProps = KitBaseProps & {
  steps: readonly CycleStep[];
  entryIndex: number;
  centerLabel?: string;
};

const positions = [
  { left: "50%", top: "3%" },
  { left: "88%", top: "42%" },
  { left: "72%", top: "84%" },
  { left: "28%", top: "84%" },
  { left: "12%", top: "42%" },
] as const;

export function Cycle({ steps, entryIndex, centerLabel = "Recommencer mieux", ...frame }: CycleProps) {
  const offset = steps.length === 3 ? [0, 1, 4] : steps.length === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4];
  return <KitFrame {...frame} kind="cycle">
    <div className={styles.cycleWide}>
      <svg viewBox="0 0 520 330" aria-hidden="true"><path d="M260 42 C405 42 466 124 432 228 C392 346 125 352 82 224 C48 122 119 42 260 42" /><path className={styles.cycleArrow} d="M83 225 l-2 -22 l20 9" /></svg>
      <strong className={styles.cycleCenter}>{centerLabel}</strong>
      {steps.map((step, index) => {
        const position = positions[offset[index]];
        return <div className={`${styles.cycleStep} ${index === entryIndex ? styles.isAccent : ""}`} style={position} key={`${step.label}-${index}`}>
          {step.tool ? <ToolMark name={step.tool} size={28} /> : <span>{index + 1}</span>}
          <div><strong>{step.label}</strong>{step.detail ? <small>{step.detail}</small> : null}</div>
        </div>;
      })}
    </div>
    <ol className={styles.cycleCompact}>{steps.map((step, index) => <li className={index === entryIndex ? styles.isAccent : undefined} key={`${step.label}-${index}`}>
      <span>{index + 1}</span><div><strong>{step.label}</strong>{step.detail ? <p>{step.detail}</p> : null}</div>
    </li>)}</ol>
  </KitFrame>;
}

