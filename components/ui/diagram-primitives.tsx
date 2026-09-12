"use client";

import { useId, useState, type ReactNode } from "react";
import { Maximize2, X } from "lucide-react";

export const GOLD = "#e8d5b0";
export const GOLD_DIM = "#e8d5b0cc";
export const LINE = "#ffffff33";
export const TEXT = "#f0ede8";
export const SUBTEXT = "#c4bfb7";

/**
 * The BUILD mark as a standalone HTML element, not an SVG child of the
 * diagram's own canvas. Living in the figure's header row (its own
 * flexbox, separate from the content <svg>'s coordinate space) means it
 * can never overlap a Box or Arrow regardless of how a given diagram is
 * composed - no per-diagram collision math required.
 */
function BuildMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g transform="translate(0, 55)">
        <path fill="#e8d5b0" d="M50 25 L100 0 L150 25 L100 50 Z" />
        <path fill="#30261c" d="M50 25 L100 50 V110 L50 85 Z" />
        <path fill="#c9b48a" d="M150 25 L100 50 V110 L150 85 Z" />
      </g>
      <g transform="translate(10, 80)">
        <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z" />
        <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z" />
        <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z" />
      </g>
      <g transform="translate(55, 57)">
        <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z" />
        <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z" />
        <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z" />
      </g>
      <g transform="translate(100, 34)">
        <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z" />
        <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z" />
        <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z" />
      </g>
    </svg>
  );
}

/**
 * A framed diagram: title + optional short explainer above the canvas, the
 * SVG itself, then an optional caption below reading like a one-line "how
 * to read this" note. A fullscreen button opens the same content in a
 * centered overlay at a larger scale - the reading column (max-w-3xl) is
 * too narrow for anything with more than a handful of nodes.
 */
export function Frame({
  title,
  explainer,
  caption,
  children,
  viewBox = "0 0 720 260",
}: {
  title: string;
  /** One short sentence under the title, giving context before the shapes. */
  explainer?: string;
  /** One short note under the canvas, e.g. what an arrow or a color means. */
  caption?: ReactNode;
  children: ReactNode;
  viewBox?: string;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  const svg = (
    <svg viewBox={viewBox} className="relative w-full h-auto" role="img" aria-label={title}>
      {children}
    </svg>
  );

  return (
    <figure className="relative my-8 rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.015] p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-px rounded-[inherit] border border-white/[0.04]" />

      <div className="relative mb-1 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <BuildMark className="h-3.5 w-3.5 shrink-0 opacity-40" />
          <figcaption className="text-[12px] text-white/50 font-medium">{title}</figcaption>
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Agrandir le schéma en plein écran"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-white/45 hover:text-[#e8d5b0] hover:border-[#e8d5b0]/30 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">Plein écran</span>
        </button>
      </div>

      {explainer && (
        <p className="relative mb-4 text-[13px] leading-relaxed text-white/55 max-w-xl">{explainer}</p>
      )}

      {svg}

      {caption && (
        <div className="relative mt-4 pt-3 border-t border-white/[0.06] text-[12px] leading-relaxed text-white/45">
          {caption}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div
            className="relative w-full max-w-5xl max-h-full overflow-auto rounded-xl border border-white/10 bg-[#151517] p-5 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <BuildMark className="h-4 w-4 shrink-0 opacity-50" />
                <p className="text-sm text-white/55 font-medium">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Fermer"
                className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] p-1.5 text-white/50 hover:text-[#e8d5b0] hover:border-[#e8d5b0]/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {explainer && <p className="mb-5 text-sm leading-relaxed text-white/60 max-w-2xl">{explainer}</p>}
            {svg}
            {caption && (
              <div className="mt-5 pt-4 border-t border-white/[0.08] text-[13px] leading-relaxed text-white/50">
                {caption}
              </div>
            )}
          </div>
        </div>
      )}
    </figure>
  );
}

/** Splits a label into lines that fit `maxCharsPerLine`, breaking on spaces. */
function wrapLabel(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent,
  tone = "default",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
  /** "default" | "muted" - a softer fill for secondary/grouping boxes. */
  tone?: "default" | "muted";
}) {
  const gradId = useId().replace(/:/g, "");
  // ~6.2px average glyph width at fontSize 12.5, with generous padding -
  // real SVG text has no wrap, so lines are computed up front here.
  const maxChars = Math.max(8, Math.floor((w - 16) / 6.4));
  const labelLines = wrapLabel(label, maxChars);
  const subMaxChars = Math.max(10, Math.floor((w - 16) / 5.4));
  const subLines = sub ? wrapLabel(sub, subMaxChars) : [];

  const labelLineHeight = 15;
  const subLineHeight = 12;
  const blockHeight = labelLines.length * labelLineHeight + (subLines.length ? subLines.length * subLineHeight + 5 : 0);
  const startY = y + h / 2 - blockHeight / 2 + labelLineHeight * 0.75;

  return (
    <g>
      <defs>
        <linearGradient id={`box-fill-${gradId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent ? "#e8d5b02e" : tone === "muted" ? "#ffffff08" : "#ffffff12"} />
          <stop offset="1" stopColor={accent ? "#e8d5b010" : tone === "muted" ? "#ffffff03" : "#ffffff06"} />
        </linearGradient>
        <filter id={`box-shadow-${gradId}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={`url(#box-fill-${gradId})`}
        stroke={accent ? GOLD : LINE}
        strokeWidth={1.25}
        filter={`url(#box-shadow-${gradId})`}
      />
      {/* inset liner: a second, fainter border a hair inside the first */}
      <rect x={x + 1.5} y={y + 1.5} width={w - 3} height={h - 3} rx={8.5} fill="none" stroke="#ffffff14" strokeWidth={1} />
      {labelLines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={startY + i * labelLineHeight}
          textAnchor="middle"
          fontSize="12.5"
          fontWeight={600}
          fill={TEXT}
        >
          {line}
        </text>
      ))}
      {subLines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={startY + labelLines.length * labelLineHeight + 5 + i * subLineHeight}
          textAnchor="middle"
          fontSize="10"
          fill={SUBTEXT}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  dashed,
  reverse,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  /** Puts the arrowhead at the start instead of the end (e.g. "feeds from"). */
  reverse?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <marker id={`arrow-${id}`} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0.7 L7,3.5 L0,6.3 Z" fill={GOLD_DIM} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={GOLD_DIM}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={dashed ? "3 4" : undefined}
        markerStart={reverse ? `url(#arrow-${id})` : undefined}
        markerEnd={reverse ? undefined : `url(#arrow-${id})`}
      />
    </g>
  );
}

/**
 * An orthogonal (right-angle) connector, the way Miro/flowchart tools route
 * lines between boxes that aren't horizontally or vertically aligned -
 * down from the source, across, then down into the target. Reads far more
 * clearly than a diagonal line when connecting a grid of boxes.
 */
export function ElbowArrow({
  x1,
  y1,
  x2,
  y2,
  bendAt = 0.5,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Fraction of the vertical distance where the horizontal bend happens. */
  bendAt?: number;
}) {
  const id = useId().replace(/:/g, "");
  const midY = y1 + (y2 - y1) * bendAt;
  const d = `M${x1} ${y1} L${x1} ${midY} L${x2} ${midY} L${x2} ${y2}`;
  return (
    <g>
      <defs>
        <marker id={`elbow-arrow-${id}`} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0.7 L7,3.5 L0,6.3 Z" fill={GOLD_DIM} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={GOLD_DIM} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" markerEnd={`url(#elbow-arrow-${id})`} />
    </g>
  );
}

/**
 * A plain branch connector for containment/tree relationships (a folder
 * holding children, a category holding items) where an arrowhead would
 * wrongly imply flow or causation. Just a line from parent edge to child.
 */
export function BranchLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={1.5} strokeLinecap="round" />;
}

/**
 * A curved return/loop arrow whose label rides along its own path (like the
 * "the design thesis is the / answered question" callout in the reference
 * sketch) instead of sitting at a fixed coordinate that drifts out of sync
 * if the geometry changes.
 */
export function LoopArrow({
  path,
  label,
}: {
  /** SVG path data for the curve, e.g. "M600 40 C630 40 630 180 600 180". */
  path: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <path id={`loop-path-${id}`} d={path} />
        <marker id={`loop-arrow-${id}`} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0.7 L7,3.5 L0,6.3 Z" fill={GOLD_DIM} />
        </marker>
      </defs>
      <use href={`#loop-path-${id}`} stroke={GOLD_DIM} strokeWidth={1.5} fill="none" markerEnd={`url(#loop-arrow-${id})`} />
      {label && (
        <text fontSize="10" fill={SUBTEXT}>
          <textPath href={`#loop-path-${id}`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      )}
    </g>
  );
}

export function Label({
  x,
  y,
  text,
  anchor = "middle",
  dim,
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
  dim?: boolean;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="11.5" fill={dim ? "#c4bfb766" : SUBTEXT}>
      {text}
    </text>
  );
}

export function Bracket({
  x,
  y1,
  y2,
  label,
  reach = 10,
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  reach?: number;
}) {
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <path
        d={`M${x + reach} ${y1} Q${x} ${y1} ${x} ${(y1 + mid) / 2} Q${x} ${mid} ${x - reach} ${mid} Q${x} ${mid} ${x} ${(mid + y2) / 2} Q${x} ${y2} ${x + reach} ${y2}`}
        fill="none"
        stroke={LINE}
        strokeWidth={1.25}
      />
      <text x={x - reach - 6} y={mid + 3.5} textAnchor="end" fontSize="10.5" fill={SUBTEXT}>
        {label}
      </text>
    </g>
  );
}

/** A small numbered/lettered badge for step markers, sitting at a box corner. */
export function StepBadge({ x, y, n }: { x: number; y: number; n: number | string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill="#0e0e0f" stroke={GOLD} strokeWidth={1.25} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight={700} fill={GOLD}>
        {n}
      </text>
    </g>
  );
}

/** A soft rounded region behind a group of boxes, with a small header label - the Miro "frame around a cluster" pattern. */
export function GroupBackdrop({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#ffffff05" stroke="#ffffff14" strokeWidth={1} strokeDasharray="4 5" />
      {label && (
        <text x={x + 14} y={y + 20} fontSize="10.5" fontWeight={600} letterSpacing="0.06em" fill="#c4bfb799">
          {label.toUpperCase()}
        </text>
      )}
    </g>
  );
}
