import { KitFrame } from "./KitFrame";
import { ToolMark } from "./ToolMark";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type FunnelStage = {
  label: string;
  value: number;
  valueLabel?: string;
  detail?: string;
};

export type FunnelProps = KitBaseProps & {
  stages: readonly FunnelStage[];
  leakIndex: number;
  leakLabel: string;
  tool?: string;
};

export function Funnel({ stages, leakIndex, leakLabel, tool, ...frame }: FunnelProps) {
  const maximum = Math.max(...stages.map((stage) => stage.value), 1);
  return <KitFrame {...frame} kind="funnel">
    <div className={styles.funnel}>
      {stages.map((stage, index) => {
        const width = Math.max(46, (stage.value / maximum) * 100);
        return <div className={styles.funnelRow} key={`${stage.label}-${stage.value}`}>
          <div className={styles.funnelStage} style={{
            width: `${width}%`,
            "--kit-funnel-compact-width": `${72 + width * .28}%`,
          } as React.CSSProperties}>
            <span><strong>{stage.label}</strong>{stage.detail ? <small>{stage.detail}</small> : null}</span>
            <b>{stage.valueLabel ?? stage.value}</b>
          </div>
          {index === leakIndex ? <div className={styles.funnelLeak}>
            <i /><i /><i /><i /><i />
            <span>{leakLabel}</span>
          </div> : null}
        </div>;
      })}
      {tool ? <div className={styles.funnelTool}><ToolMark name={tool} label={tool} size={32} /></div> : null}
    </div>
  </KitFrame>;
}
