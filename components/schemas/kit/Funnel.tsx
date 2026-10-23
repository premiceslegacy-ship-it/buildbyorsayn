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
        const rowStyle = {
          "--kit-funnel-width": `${width}%`,
          "--kit-funnel-edge": `${50 + width / 2}%`,
          "--kit-funnel-compact-width": `${72 + width * .28}%`,
        } as React.CSSProperties;
        return <div className={styles.funnelRow} style={rowStyle} key={`${stage.label}-${stage.value}`}>
          <div className={styles.funnelStage}>
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
