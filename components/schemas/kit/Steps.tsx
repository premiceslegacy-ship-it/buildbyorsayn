import { KitFrame } from "./KitFrame";
import { ToolMark } from "./ToolMark";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type StepItem = {
  label: string;
  detail: string;
  tools?: readonly string[];
};

export type StepsProps = KitBaseProps & {
  items: readonly StepItem[];
  accentIndex: number;
};

export function Steps({ items, accentIndex, ...frame }: StepsProps) {
  return <KitFrame {...frame} kind="steps">
    <ol className={`${styles.steps} ${items.length > 4 ? styles.stepsDense : ""}`} style={{ "--kit-count": items.length } as React.CSSProperties}>
      {items.map((item, index) => <li className={index === accentIndex ? styles.isAccent : undefined} key={`${item.label}-${index}`}>
        <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
        <strong>{item.label}</strong>
        <p>{item.detail}</p>
        {item.tools?.length ? <div className={styles.stepTools}>{item.tools.map((tool) => <ToolMark key={tool} name={tool} size={28} />)}</div> : null}
      </li>)}
    </ol>
  </KitFrame>;
}
