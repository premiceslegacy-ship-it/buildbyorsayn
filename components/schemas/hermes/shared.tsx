import type { ReactNode } from "react";
import { toolLogoSrc } from "@/lib/tools/registry";
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
  x: number; y: number; width: number; height: number; radius?: number; tone?: Tone;
}) {
  return <rect className={fillClass[tone]} x={x} y={y} width={width} height={height} rx={radius} />;
}

export function Disc({ cx, cy, radius, tone = "paper" }: {
  cx: number; cy: number; radius: number; tone?: Tone;
}) {
  return <circle className={fillClass[tone]} cx={cx} cy={cy} r={radius} />;
}

export function Stroke({ path, accent = false, soft = false, dashed = false }: {
  path: string; accent?: boolean; soft?: boolean; dashed?: boolean;
}) {
  return <path
    className={accent ? styles.motifAccentStroke : soft ? styles.motifSoftStroke : styles.motifStroke}
    d={path}
    strokeDasharray={dashed ? "3 7" : undefined}
  />;
}

export function ToolLogo({ name, x, y, size = 40, step }: {
  name: string; x: number; y: number; size?: number; step?: number;
}) {
  const image = <image href={toolLogoSrc(name)} x={x} y={y} width={size} height={size} preserveAspectRatio="xMidYMid meet" />;
  return step === undefined ? image : <Motif step={step}>{image}</Motif>;
}

export function Document({ x, y, width = 64, height = 80, accent = false }: {
  x: number; y: number; width?: number; height?: number; accent?: boolean;
}) {
  const line = accent ? styles.motifAccentStroke : styles.motifStroke;
  return <g aria-hidden="true">
    <rect className={accent ? styles.motifAccent : styles.motifPaper} x={x} y={y} width={width} height={height} rx={12} />
    <path className={line} d={`M${x + 14} ${y + 24} H${x + width - 14} M${x + 14} ${y + 38} H${x + width - 20} M${x + 14} ${y + 52} H${x + width - 26}`} />
  </g>;
}

export function Folder({ x, y, width, height, accent = false }: {
  x: number; y: number; width: number; height: number; accent?: boolean;
}) {
  const d = `M${x} ${y + 14} Q${x} ${y} ${x + 14} ${y} H${x + width * .42} L${x + width * .52} ${y + 14} H${x + width - 14} Q${x + width} ${y + 14} ${x + width} ${y + 28} V${y + height - 14} Q${x + width} ${y + height} ${x + width - 14} ${y + height} H${x + 14} Q${x} ${y + height} ${x} ${y + height - 14} Z`;
  return <path className={accent ? styles.motifAccent : styles.motifSurface} d={d} />;
}

export function Person({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
  return <g aria-hidden="true">
    <Disc cx={x} cy={y} radius={9} tone={accent ? "accent" : "ink"} />
    <path className={accent ? styles.motifAccentStroke : styles.motifStroke} d={`M${x - 18} ${y + 34} Q${x} ${y + 13} ${x + 18} ${y + 34}`} />
  </g>;
}

export function Hand({ x, y, accent = true, onAccent = false, scale = 1 }: { x: number; y: number; accent?: boolean; onAccent?: boolean; scale?: number }) {
  return <path
    aria-hidden="true"
    className={accent ? styles.motifAccentStroke : styles.motifStroke}
    style={onAccent ? { stroke: "var(--sur-em)" } : undefined}
    d={`M${x} ${y + 22 * scale} V${y + 8 * scale} Q${x} ${y} ${x + 7 * scale} ${y} Q${x + 13 * scale} ${y} ${x + 13 * scale} ${y + 7 * scale} V${y + 14 * scale} L${x + 34 * scale} ${y + 23 * scale} Q${x + 42 * scale} ${y + 27 * scale} ${x + 38 * scale} ${y + 36 * scale} L${x + 30 * scale} ${y + 51 * scale} H${x + 7 * scale} L${x - 5 * scale} ${y + 34 * scale} Q${x - 10 * scale} ${y + 25 * scale} ${x} ${y + 22 * scale} Z`}
  />;
}

export function Bubble({ x, y, width, height, accent = false }: {
  x: number; y: number; width: number; height: number; accent?: boolean;
}) {
  const fill = accent ? styles.motifAccent : styles.motifPaper;
  return <path className={fill} d={`M${x + 18} ${y} H${x + width - 18} Q${x + width} ${y} ${x + width} ${y + 18} V${y + height - 26} Q${x + width} ${y + height - 8} ${x + width - 18} ${y + height - 8} H${x + 36} L${x + 18} ${y + height} L${x + 20} ${y + height - 8} H${x + 18} Q${x} ${y + height - 8} ${x} ${y + height - 26} V${y + 18} Q${x} ${y} ${x + 18} ${y} Z`} />;
}

export function Phone({ x, y, width = 160, height = 264, children }: {
  x: number; y: number; width?: number; height?: number; children?: ReactNode;
}) {
  return <g>
    <rect className={styles.motifPaper} x={x} y={y} width={width} height={height} rx={30} />
    <path className={styles.motifSoftStroke} d={`M${x + width * .38} ${y + 14} H${x + width * .62}`} />
    {children}
  </g>;
}

export function Terminal({ x, y, width, height, children }: {
  x: number; y: number; width: number; height: number; children?: ReactNode;
}) {
  return <g>
    <rect className={styles.motifPaper} x={x} y={y} width={width} height={height} rx={22} />
    <circle className={styles.motifInk} cx={x + 20} cy={y + 20} r={3} />
    <circle className={styles.motifInk} cx={x + 32} cy={y + 20} r={3} opacity=".55" />
    <circle className={styles.motifInk} cx={x + 44} cy={y + 20} r={3} opacity=".25" />
    <path className={styles.motifSoftStroke} d={`M${x} ${y + 40} H${x + width}`} />
    {children}
  </g>;
}
