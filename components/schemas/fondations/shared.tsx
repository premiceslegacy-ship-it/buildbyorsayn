import { useId, type ReactNode } from "react";
import styles from "../schema.module.css";

type Tone = "accent" | "ink" | "paper" | "surface";

const fillClass: Record<Tone, string> = {
  accent: styles.motifAccent,
  ink: styles.motifInk,
  paper: styles.motifPaper,
  surface: styles.motifSurface,
};

export function Motif({ children, step = 0 }: { children: ReactNode; step?: number }) {
  return <g data-schema-node="true" data-schema-step={Math.min(step, 12)}>{children}</g>;
}

export function Surface({ x, y, width, height, radius = 22, tone = "surface" }: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  tone?: Tone;
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `foundation-surface-${rawId}`;
  if (tone === "accent" || tone === "ink") {
    return <rect className={fillClass[tone]} x={x} y={y} width={width} height={height} rx={radius} />;
  }
  return <>
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tone === "paper" ? "#2a2f2c" : "#252a27"} />
        <stop offset="1" stopColor={tone === "paper" ? "#1f2321" : "#1b1f1d"} />
      </linearGradient>
    </defs>
    <rect className={styles.motifGradientSurface} fill={`url(#${gradientId})`} x={x} y={y} width={width} height={height} rx={radius} />
    <path className={styles.motifTopLight} d={`M${x + radius} ${y + .75} H${x + width - radius}`} />
  </>;
}

export function Disc({ cx, cy, radius, tone = "paper" }: {
  cx: number;
  cy: number;
  radius: number;
  tone?: Tone;
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `foundation-disc-${rawId}`;
  if (tone === "accent" || tone === "ink") return <circle className={fillClass[tone]} cx={cx} cy={cy} r={radius} />;
  return <>
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2f2c" />
        <stop offset="1" stopColor="#1d201f" />
      </linearGradient>
    </defs>
    <circle className={styles.motifGradientSurface} fill={`url(#${gradientId})`} cx={cx} cy={cy} r={radius} />
  </>;
}

export function Stroke({ path, accent = false, soft = false, dashed = false }: {
  path: string;
  accent?: boolean;
  soft?: boolean;
  dashed?: boolean;
}) {
  const className = accent ? styles.motifAccentStroke : soft ? styles.motifSoftStroke : styles.motifStroke;
  return <path className={className} d={path} strokeDasharray={dashed ? "3 7" : undefined} />;
}

export function Person({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
  return <g aria-hidden="true">
    <Disc cx={x} cy={y} radius={10} tone={accent ? "accent" : "ink"} />
    <path className={accent ? styles.motifAccent : styles.motifInk} d={`M${x - 18} ${y + 34} Q${x - 16} ${y + 15} ${x} ${y + 15} Q${x + 16} ${y + 15} ${x + 18} ${y + 34} Z`} />
  </g>;
}

export function Document({ x, y, width = 52, height = 64, accent = false }: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  accent?: boolean;
}) {
  const line = accent ? styles.motifAccentStroke : styles.motifStroke;
  return <g aria-hidden="true">
    <Surface x={x} y={y} width={width} height={height} radius={10} tone={accent ? "accent" : "paper"} />
    <path className={line} d={`M${x + 12} ${y + 20} H${x + width - 12} M${x + 12} ${y + 32} H${x + width - 18} M${x + 12} ${y + 44} H${x + width - 24}`} />
  </g>;
}

export function Folder({ x, y, width, height, accent = false }: {
  x: number;
  y: number;
  width: number;
  height: number;
  accent?: boolean;
}) {
  const fill = accent ? styles.motifAccent : styles.motifPaper;
  const d = `M${x} ${y + 14} Q${x} ${y} ${x + 14} ${y} H${x + width * .42} L${x + width * .52} ${y + 14} H${x + width - 14} Q${x + width} ${y + 14} ${x + width} ${y + 28} V${y + height - 14} Q${x + width} ${y + height} ${x + width - 14} ${y + height} H${x + 14} Q${x} ${y + height} ${x} ${y + height - 14} Z`;
  return <path className={fill} d={d} />;
}

export function Dots({ points, accentAt }: { points: readonly (readonly [number, number])[]; accentAt?: number }) {
  return <>{points.map(([cx, cy], index) => <circle
    className={index === accentAt ? styles.motifAccent : styles.motifInk}
    cx={cx}
    cy={cy}
    r={index === accentAt ? 5 : 3.5}
    key={`${cx}-${cy}`}
  />)}</>;
}
