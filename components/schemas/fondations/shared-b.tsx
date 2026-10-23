import type { ReactNode } from "react";
import { toolLogoSrc } from "@/lib/tools/registry";
import { Label } from "../primitives";
import { Motif, Stroke, Surface } from "./shared";

const LOGOS = {
  antigravity: "Antigravity",
  build: "BUILD",
  chatgpt: "ChatGPT",
  claude: "Claude",
  "claude-code": "Claude Code",
  cloudflare: "Cloudflare",
  codex: "Codex",
  figma: "Figma",
  gemini: "Gemini",
  github: "GitHub",
  gmail: "Gmail",
  hermes: "Hermes Agent",
  openai: "OpenAI",
  openrouter: "OpenRouter",
  pinterest: "Pinterest",
  posthog: "PostHog",
  search: "Search Console",
  tailscale: "Tailscale",
  vercel: "Vercel",
} as const;

export type FoundationLogo = keyof typeof LOGOS;

export function LogoTile({ logo, x, y, size = 40, step = 0 }: {
  logo: FoundationLogo;
  x: number;
  y: number;
  size?: number;
  step?: number;
}) {
  return <g data-schema-node="true" data-schema-step={Math.min(step, 12)} aria-hidden="true">
    <image href={toolLogoSrc(LOGOS[logo]) ?? undefined} x={x} y={y} width={size} height={size} preserveAspectRatio="xMidYMid meet" />
  </g>;
}

export function BrowserFrame({ x, y, width, height, children, step = 0 }: {
  x: number;
  y: number;
  width: number;
  height: number;
  children: ReactNode;
  step?: number;
}) {
  return <Motif step={step}>
    <Surface x={x} y={y} width={width} height={height} radius={20} tone="paper" />
    <Stroke path={`M${x} ${y + 28} H${x + width}`} soft />
    <circle cx={x + 18} cy={y + 14} r="3" fill="var(--t3)" />
    <circle cx={x + 30} cy={y + 14} r="3" fill="var(--t3)" />
    <circle cx={x + 42} cy={y + 14} r="3" fill="var(--t3)" />
    {children}
  </Motif>;
}

export function PhoneFrame({ x, y, width = 92, height = 156, children, accent = false, step = 0 }: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  children?: ReactNode;
  accent?: boolean;
  step?: number;
}) {
  return <Motif step={step}>
    <rect x={x} y={y} width={width} height={height} rx={20} fill="var(--carte)" stroke={accent ? "var(--em)" : "var(--t3)"} strokeWidth={accent ? 2 : 1.5} />
    <rect x={x + width * .34} y={y + 8} width={width * .32} height="5" rx="2.5" fill="var(--trait)" />
    {children}
  </Motif>;
}

export function Check({ x, y, size = 22, accent = true }: { x: number; y: number; size?: number; accent?: boolean }) {
  return <g aria-hidden="true">
    <circle cx={x} cy={y} r={size / 2} fill={accent ? "var(--em)" : "var(--carte)"} />
    <path d={`M${x - size * .24} ${y} L${x - size * .06} ${y + size * .18} L${x + size * .28} ${y - size * .2}`} fill="none" stroke={accent ? "var(--sur-em)" : "var(--t2)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </g>;
}

export function NumberMarker({ x, y, number, accent = false }: { x: number; y: number; number: number; accent?: boolean }) {
  return <Motif step={number}>
    <circle cx={x} cy={y} r="14" fill={accent ? "var(--em)" : "var(--encre)"} />
    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fill={accent ? "var(--sur-em)" : "var(--carte)"} fontFamily="var(--font)" fontSize="12" fontWeight="700">{number}</text>
  </Motif>;
}

export function TinyCard({ x, y, width, height, label, accent = false, step = 0 }: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  accent?: boolean;
  step?: number;
}) {
  return <Motif step={step}>
    <Surface x={x} y={y} width={width} height={height} radius={Math.min(16, height / 2)} tone={accent ? "accent" : "surface"} />
    {accent
      ? <text x={x + width / 2} y={y + height / 2 + 1} textAnchor="middle" dominantBaseline="central" fill="var(--sur-em)" fontFamily="var(--font-t)" fontSize={height >= 44 ? 17 : 14} fontWeight="650">{label}</text>
      : <Label x={x + width / 2} y={y + height / 2} text={label} kind={height >= 44 ? "title" : "text"} />}
  </Motif>;
}
