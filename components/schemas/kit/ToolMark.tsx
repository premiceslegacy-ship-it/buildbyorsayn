import Image from "next/image";
import { toolLogoSrc } from "@/lib/tools/registry";
import styles from "./kit.module.css";

export function ToolMark({ name, label, size = 36 }: { name: string; label?: string; size?: 28 | 32 | 36 | 40 | 44 }) {
  const src = toolLogoSrc(name);
  if (!src) return label ? <span className={styles.toolName}>{label}</span> : null;
  return <span className={styles.tool} title={label ?? name}>
    <Image aria-hidden="true" alt="" src={src} width={size} height={size} />
    {label ? <span>{label}</span> : null}
  </span>;
}

