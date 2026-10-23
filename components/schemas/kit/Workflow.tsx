import { ArrowRight, Check, Hand } from "lucide-react";
import { KitFrame, type KitKey } from "./KitFrame";
import { ToolMark } from "./ToolMark";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type WorkflowStep = {
  actor: number;
  label: string;
  transfer?: string;
  tool?: string;
  humanValidation?: boolean;
};

export type WorkflowProps = KitBaseProps & {
  actors: readonly string[];
  steps: readonly WorkflowStep[];
  accentIndex: number;
};

/** Un relais : chaque carte dit qui agit, avec quel outil, et ce qu'elle reçoit de la carte d'avant. */
export function Workflow({ actors, steps, accentIndex, ...frame }: WorkflowProps) {
  const keys: KitKey[] = [];
  if (steps.some((step) => step.transfer)) keys.push({ swatch: "arrow", label: "Ce qui passe d'une carte à la suivante" });
  if (steps.some((step) => step.humanValidation)) keys.push({ swatch: "human", label: "Un humain valide avant la suite" });
  if (steps[accentIndex]) keys.push({ swatch: "accent", label: "En vert : le passage qui compte ici" });
  const showActors = actors.length > 1;

  return <KitFrame {...frame} kind="workflow" keys={keys}>
    <ol className={styles.track} data-count={steps.length} data-variant="relay">
      {steps.map((step, index) => <li className={index === accentIndex ? styles.isAccent : undefined} key={`${step.label}-${index}`}>
        <span className={styles.trackDot}>{index + 1}</span>
        <div className={styles.trackCard}>
          {showActors || step.tool ? <div className={styles.trackWho}>
            {step.tool ? <ToolMark name={step.tool} size={32} /> : null}
            {showActors ? <span>{actors[step.actor]}</span> : null}
          </div> : null}
          {step.transfer ? <span className={styles.trackTransfer}><ArrowRight aria-hidden="true" />{step.transfer}</span> : null}
          <strong>{step.label}</strong>
          {step.humanValidation ? <span className={styles.humanCheck} aria-label="Validation humaine"><Hand /><Check /></span> : null}
        </div>
      </li>)}
    </ol>
  </KitFrame>;
}
