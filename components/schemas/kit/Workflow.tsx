import { Check, Hand } from "lucide-react";
import { KitFrame } from "./KitFrame";
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

export function Workflow({ actors, steps, accentIndex, ...frame }: WorkflowProps) {
  const gridStyle = {
    "--kit-actors": actors.length,
    "--kit-workflow-steps": steps.length,
  } as React.CSSProperties;
  return <KitFrame {...frame} kind="workflow">
    <div className={styles.workflow} style={gridStyle}>
      {actors.map((actor, index) => <span className={styles.workflowActor} style={{ gridRow: index + 1 }} key={actor}>{actor}</span>)}
      {actors.map((actor, index) => <span aria-hidden="true" className={styles.workflowLane} style={{ gridRow: index + 1 }} key={`lane-${actor}`} />)}
      {steps.map((step, index) => <div
        className={`${styles.workflowStep} ${index === accentIndex ? styles.isAccent : ""}`}
        style={{ gridColumn: index + 2, gridRow: step.actor + 1 }}
        key={`${step.label}-${index}`}
      >
        <span className={styles.workflowActorCompact}>{actors[step.actor]}</span>
        {step.transfer ? <span className={styles.workflowTransfer}>{step.transfer}</span> : null}
        {step.tool ? <ToolMark name={step.tool} size={32} /> : null}
        <strong>{step.label}</strong>
        {step.humanValidation ? <span className={styles.humanCheck} aria-label="Validation humaine"><Hand /><Check /></span> : null}
      </div>)}
    </div>
  </KitFrame>;
}

