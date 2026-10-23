import { KitFrame } from "./KitFrame";
import { ToolMark } from "./ToolMark";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type ToolMapItem = {
  name: string;
  description: string;
};

export type ToolMapGroup = {
  role: string;
  tools: readonly ToolMapItem[];
};

export type ToolMapProps = KitBaseProps & {
  groups: readonly ToolMapGroup[];
  accentGroup: number;
};

export function ToolMap({ groups, accentGroup, ...frame }: ToolMapProps) {
  return <KitFrame {...frame} kind="tool-map" keys={groups[accentGroup] ? [{ swatch: "accent", label: "En vert : le rôle dont parle ce passage" }] : undefined}>
    <div className={styles.toolMap}>{groups.map((group, groupIndex) => <section className={groupIndex === accentGroup ? styles.isAccent : undefined} key={group.role}>
      <h4>{group.role}</h4>
      <ul>{group.tools.map((tool) => <li key={tool.name}><ToolMark name={tool.name} size={40} /><div><strong>{tool.name}</strong><p>{tool.description}</p></div></li>)}</ul>
    </section>)}</div>
  </KitFrame>;
}

