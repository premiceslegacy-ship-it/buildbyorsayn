"use client";

import { useId, type ReactNode } from "react";

export const GOLD = "#e8d5b0";
export const GOLD_DIM = "#e8d5b0aa";
export const LINE = "#ffffff26";
export const TEXT = "#f0ede8";
export const SUBTEXT = "#d9d5cf";

/**
 * The BUILD mark, traced once per Frame instance via a <symbol> + <use> pair
 * so it costs nothing to repeat and never collides with another Frame's ids.
 */
function BuildMark({ id, x, y, size }: { id: string; x: number; y: number; size: number }) {
  return (
    <>
      <defs>
        <symbol id={id} viewBox="0 0 200 200">
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
        </symbol>
      </defs>
      <use href={`#${id}`} x={x} y={y} width={size} height={size} opacity={0.4} />
    </>
  );
}

export function Frame({
  title,
  children,
  viewBox = "0 0 640 220",
}: {
  title: string;
  children: ReactNode;
  viewBox?: string;
}) {
  const markId = useId().replace(/:/g, "");
  return (
    <figure className="relative my-6 rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.015] p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-px rounded-[inherit] border border-white/[0.04]" />
      <svg viewBox={viewBox} className="relative w-full h-auto" role="img" aria-label={title}>
        <BuildMark id={`build-mark-${markId}`} x={10} y={8} size={16} />
        {children}
      </svg>
      <figcaption className="relative mt-3 text-[11px] uppercase tracking-[0.14em] text-white/35">{title}</figcaption>
    </figure>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  const gradId = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <linearGradient id={`box-fill-${gradId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent ? "#e8d5b026" : "#ffffff10"} />
          <stop offset="1" stopColor={accent ? "#e8d5b00d" : "#ffffff05"} />
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
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 5)} textAnchor="middle" fontSize="12.5" fontWeight={600} fill={TEXT}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize="10" fill={SUBTEXT}>
          {sub}
        </text>
      )}
    </g>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <marker id={`arrow-${id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0.6 L6,3 L0,5.4 Z" fill={GOLD_DIM} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={GOLD_DIM}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeDasharray={dashed ? "3 4" : undefined}
        markerEnd={`url(#arrow-${id})`}
      />
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
    <text x={x} y={y} textAnchor={anchor} fontSize="11" fill={dim ? "#d9d5cf66" : SUBTEXT}>
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
      <text x={x - reach - 6} y={mid + 3.5} textAnchor="end" fontSize="10" fill={SUBTEXT}>
        {label}
      </text>
    </g>
  );
}
