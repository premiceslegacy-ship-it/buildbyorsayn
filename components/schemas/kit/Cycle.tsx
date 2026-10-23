import { RotateCcw } from "lucide-react";
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

/** Une boucle : les étapes dans l'ordre, puis un retour au début qui passe sous les cartes, jamais à travers. */
export function Cycle({ steps, entryIndex, centerLabel = "On recommence, en mieux", ...frame }: CycleProps) {
  return <KitFrame
    {...frame}
    kind="cycle"
    keys={[
      ...(steps[entryIndex] ? [{ swatch: "accent" as const, label: "En vert : par où tu entres dans la boucle" }] : []),
      { swatch: "loop", label: "La dernière étape renvoie à la première" },
    ]}
  >
    <div className={styles.cycle} data-count={steps.length}>
      <ol className={styles.track} data-count={steps.length}>
        {steps.map((step, index) => <li className={index === entryIndex ? styles.isAccent : undefined} key={`${step.label}-${index}`}>
          <span className={styles.trackDot}>{index + 1}</span>
          <div className={styles.trackCard}>
            {step.tool ? <div className={styles.trackWho}><ToolMark name={step.tool} size={32} /></div> : null}
            <strong>{step.label}</strong>
            {step.detail ? <p>{step.detail}</p> : null}
          </div>
        </li>)}
      </ol>
      <div className={styles.cycleReturn}><RotateCcw aria-hidden="true" /><span>{centerLabel}</span></div>
    </div>
  </KitFrame>;
}
