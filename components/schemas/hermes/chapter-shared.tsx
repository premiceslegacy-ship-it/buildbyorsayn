import type { ReactNode } from "react";
import { Label } from "../primitives";
import { Motif, Stroke, Surface, ToolLogo } from "./shared";

export function Panel({ x, y, width, height, children, accent = false, step = 0, radius = 22 }: {
  x: number;
  y: number;
  width: number;
  height: number;
  children?: ReactNode;
  accent?: boolean;
  step?: number;
  radius?: number;
}) {
  return <Motif step={step}>
    <Surface x={x} y={y} width={width} height={height} radius={radius} tone={accent ? "accent" : "paper"} />
    <Stroke path={`M${x + radius} ${y + 1} H${x + width - radius}`} soft />
    {children}
  </Motif>;
}

export function ToolPill({ name, label, x, y, width = 128, accent = false, step = 0 }: {
  name: string;
  label?: string;
  x: number;
  y: number;
  width?: number;
  accent?: boolean;
  step?: number;
}) {
  return <Panel x={x} y={y} width={width} height={56} radius={18} accent={accent} step={step}>
    <ToolLogo name={name} x={x + 10} y={y + 8} size={40} />
    <Label x={x + 58} y={y + 28} text={label ?? name} anchor="start" kind="title" maxChars={Math.max(8, Math.floor((width - 66) / 8))} tone={accent ? "on-accent" : undefined} />
  </Panel>;
}

export function NumberPin({ x, y, number, accent = false }: { x: number; y: number; number: number; accent?: boolean }) {
  return <Motif step={number}>
    <circle cx={x} cy={y} r="14" fill={accent ? "var(--em)" : "#262b28"} stroke="rgba(241,245,242,.35)" />
    <Label x={x} y={y} text={String(number)} kind="title" tone={accent ? "on-accent" : undefined} />
  </Motif>;
}

export function MiniRows({ x, y, width, rows = 3, accentAt = -1, gap = 18 }: {
  x: number;
  y: number;
  width: number;
  rows?: number;
  accentAt?: number;
  gap?: number;
}) {
  return <Motif>{Array.from({ length: rows }, (_, index) => <Stroke
    key={index}
    path={`M${x} ${y + index * gap} H${x + width * (index === rows - 1 ? .72 : 1)}`}
    accent={index === accentAt}
    soft={index !== accentAt}
  />)}</Motif>;
}

export function Check({ x, y, accent = true }: { x: number; y: number; accent?: boolean }) {
  return <Motif><Stroke path={`M${x} ${y} l8 8 l16 -20`} accent={accent} /></Motif>;
}
