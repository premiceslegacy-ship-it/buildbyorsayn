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

/** Étapes dans l'ordre : une pastille numérotée sur un rail, puis la carte. Le rail ne passe jamais sur le texte. */
export function Steps({ items, accentIndex, legend, ...frame }: StepsProps) {
  const accent = items[accentIndex];
  return <KitFrame
    {...frame}
    kind="steps"
    legend={legend}
    keys={accent ? [{ swatch: "accent", label: "En vert : l'étape sur laquelle ce passage insiste" }] : undefined}
  >
    <ol className={styles.track} data-count={items.length}>
      {items.map((item, index) => <li className={index === accentIndex ? styles.isAccent : undefined} key={`${item.label}-${index}`}>
        <span className={styles.trackDot}>{index + 1}</span>
        <div className={styles.trackCard}>
          <strong>{item.label}</strong>
          {item.detail ? <p>{item.detail}</p> : null}
          {item.tools?.length ? <div className={styles.trackTools}>{item.tools.map((tool) => <ToolMark key={tool} name={tool} size={28} />)}</div> : null}
        </div>
      </li>)}
    </ol>
  </KitFrame>;
}
