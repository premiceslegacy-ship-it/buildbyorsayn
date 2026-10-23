import { useId, type ReactNode } from "react";
import { DiagramMotion } from "./DiagramMotion";
import styles from "./schema.module.css";

type Point = readonly [number, number];
type TextAnchor = "start" | "middle" | "end";

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function wrapDiagramText(text: string, maxChars: number): string[] {
  if (text.includes("|")) return text.split("|");
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > maxChars) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  return lines;
}

function DiagramSvg({ id, title, description, layout, width, height, children }: {
  id: string;
  title: string;
  description: string;
  layout: "wide" | "compact";
  width: 680 | 328;
  height: number;
  children: ReactNode;
}) {
  const titleId = `${id}-${layout}-title`;
  const descriptionId = `${id}-${layout}-description`;
  return <svg
    className={`${styles.svg} ${layout === "wide" ? styles.wide : styles.compact}`}
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
    data-schema-layout={layout}
    focusable="false"
  >
    <title id={titleId}>{title}</title>
    <desc id={descriptionId}>{description}</desc>
    {children}
  </svg>;
}

export function Diagram({ id, title, says, caption, description, wide, compact, wideHeight, compactHeight }: {
  id: string;
  title: string;
  says: string;
  caption?: ReactNode;
  description: string;
  wide: ReactNode;
  compact: ReactNode;
  wideHeight: number;
  compactHeight: number;
}) {
  const reactId = safeId(useId());
  const baseId = `schema-${safeId(id)}-${reactId}`;
  const headingId = `${baseId}-heading`;
  return <DiagramMotion>
    <figure className={styles.figure} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h3 className={styles.title} id={headingId}>{title}</h3>
        <p className={styles.says}>{says}</p>
      </header>
      <div className={styles.drawing}>
        <DiagramSvg id={baseId} title={title} description={description} layout="wide" width={680} height={wideHeight}>{wide}</DiagramSvg>
        <DiagramSvg id={baseId} title={title} description={description} layout="compact" width={328} height={compactHeight}>{compact}</DiagramSvg>
        {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      </div>
    </figure>
  </DiagramMotion>;
}

export function Node({ x, y, w, h, label, sub, num, accent = false, tone = "default", align = "center", labelKind = "title", inline = false, step = 0 }: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  num?: string;
  accent?: boolean;
  tone?: "default" | "muted" | "hollow";
  align?: "center" | "start";
  labelKind?: "title" | "small";
  inline?: boolean;
  step?: number;
}) {
  const pad = align === "start" ? 24 : 16;
  const anchor: TextAnchor = align === "start" ? "start" : "middle";
  const tx = align === "start" ? x + pad : x + w / 2;
  const labelLines = wrapDiagramText(label, Math.max(6, Math.floor((w - pad * 2) / (labelKind === "title" ? 9.6 : 7.1))));
  const subLines = sub ? wrapDiagramText(sub, Math.max(8, Math.floor((w - pad * 2) / 7.1))) : [];
  const inlineLabel = inline && num ? `${num}  ${label}` : label;
  const renderedLabels = inline ? wrapDiagramText(inlineLabel, Math.max(6, Math.floor((w - pad * 2) / 9.6))) : labelLines;
  const textHeight = renderedLabels.length * 24 + subLines.length * 20 + (subLines.length ? 8 : 0) + (num && !inline ? 20 : 0);
  let cursor = y + (h - textHeight) / 2 + 10;
  const radius = h >= 96 ? 28 : h >= 56 ? 22 : 10;
  const classes = [styles.node, accent ? styles.nodeAccent : "", tone === "muted" ? styles.nodeMuted : "", tone === "hollow" ? styles.nodeHollow : ""].filter(Boolean).join(" ");
  const numberY = cursor;
  if (num && !inline) cursor += 20;
  return <g className={classes} data-schema-node="true" data-schema-step={Math.min(step, 12)}>
    <rect className={styles.nodeRect} x={x} y={y} width={w} height={h} rx={radius} />
    {num && !inline ? <text className={styles.nodeNum} x={tx} y={numberY} textAnchor={anchor}>{num}</text> : null}
    {renderedLabels.map((line, index) => <text key={`${line}-${index}`} className={labelKind === "title" ? styles.nodeTitle : styles.nodeSmall} x={tx} y={cursor + index * 24} textAnchor={anchor}>{line}</text>)}
    {subLines.length ? subLines.map((line, index) => <text key={`${line}-${index}`} className={styles.nodeSub} x={tx} y={cursor + renderedLabels.length * 24 + 8 + index * 20} textAnchor={anchor}>{line}</text>) : null}
  </g>;
}

function roundedPath(points: readonly Point[]): string {
  if (points.length < 2) return "";
  let result = `M${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1];
    const before = Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    const after = Math.hypot(next[0] - current[0], next[1] - current[1]);
    const radius = Math.min(16, before / 2, after / 2);
    const inX = current[0] - Math.sign(current[0] - previous[0]) * radius;
    const inY = current[1] - Math.sign(current[1] - previous[1]) * radius;
    const outX = current[0] + Math.sign(next[0] - current[0]) * radius;
    const outY = current[1] + Math.sign(next[1] - current[1]) * radius;
    result += ` L${inX} ${inY} Q${current[0]} ${current[1]} ${outX} ${outY}`;
  }
  const last = points.at(-1)!;
  result += ` L${last[0]} ${last[1]}`;
  return result;
}

export function Edge({ points, head = true, dashed = false, accent = false, trajectory = false, path, step = 0 }: {
  points?: readonly Point[];
  head?: boolean;
  dashed?: boolean;
  accent?: boolean;
  trajectory?: boolean;
  path?: string;
  step?: number;
}) {
  const usable = points ?? [];
  const end = usable.at(-1);
  const previous = usable.at(-2);
  let headPath = "";
  if (head && end && previous) {
    const angle = Math.atan2(end[1] - previous[1], end[0] - previous[0]);
    const length = 8;
    const first: Point = [end[0] - length * Math.cos(angle + 0.55), end[1] - length * Math.sin(angle + 0.55)];
    const second: Point = [end[0] - length * Math.cos(angle - 0.55), end[1] - length * Math.sin(angle - 0.55)];
    headPath = `M${first[0]} ${first[1]} L${end[0]} ${end[1]} L${second[0]} ${second[1]}`;
  }
  const classes = [accent ? styles.edgeAccent : "", dashed ? styles.edgeDashed : "", trajectory ? styles.edgeTrajectory : ""].filter(Boolean).join(" ");
  return <g className={classes} data-schema-edge="true" data-schema-step={Math.min(step, 12)} data-schema-dashed={dashed ? "true" : "false"}>
    <path className={styles.edgeLine} data-schema-line="true" pathLength="1" d={path ?? roundedPath(usable)} />
    {headPath ? <path className={styles.edgeHead} data-schema-head="true" d={headPath} /> : null}
  </g>;
}

export function Label({ x, y, text, anchor = "middle", kind = "text", tone, maxChars, step = 0 }: {
  x: number;
  y: number;
  text: string;
  anchor?: TextAnchor;
  kind?: "note" | "text" | "title" | "muted-title";
  tone?: "accent" | "error" | "on-accent";
  maxChars?: number;
  step?: number;
}) {
  const lines = maxChars ? wrapDiagramText(text, maxChars) : text.split("|");
  const kindClass = kind === "title" ? styles.labelTitle : kind === "muted-title" ? styles.labelMutedTitle : kind === "note" ? `${styles.labelText} ${styles.labelNote}` : styles.labelText;
  const toneClass = tone === "accent" ? styles.labelAccent : tone === "error" ? styles.labelError : tone === "on-accent" ? styles.labelOnAccent : "";
  return <g data-schema-node="true" data-schema-step={Math.min(step, 12)}>
    {lines.map((line, index) => <text key={`${line}-${index}`} className={`${kindClass} ${toneClass}`} x={x} y={y + index * (kind.includes("title") ? 24 : 20)} textAnchor={anchor}>{line}</text>)}
  </g>;
}

export function FixedLine({ path, dashed = false, accent = false }: { path: string; dashed?: boolean; accent?: boolean }) {
  return <path className={`${styles.fixedLine} ${dashed ? styles.fixedDashed : ""} ${accent ? styles.fixedAccent : ""}`} d={path} />;
}
