"use client";

import type { CSSProperties } from "react";
import { Branches } from "@lucasmarkes/hairline/react";

type ToolNode = {
  name: string;
  src: string;
  position: string;
};

const TOOLS: ToolNode[] = [
  { name: "ChatGPT", src: "/brand-logos/chatgpt.svg", position: "left-[5%] top-[16%] sm:left-[7%] sm:top-[18%]" },
  { name: "Claude Code", src: "/brand-logos/claude-code.svg", position: "left-[24%] top-[7%] sm:left-[25%] sm:top-[7%]" },
  { name: "Vercel", src: "/brand-logos/vercel.svg", position: "left-[95%] top-[16%] sm:left-[93%] sm:top-[18%]" },
  { name: "Supabase", src: "/brand-logos/supabase.svg", position: "left-[76%] top-[7%] sm:left-[75%] sm:top-[7%]" },
  { name: "Stripe", src: "/brand-logos/stripe.svg", position: "left-[11%] bottom-[10%] sm:left-[14%] sm:bottom-[12%]" },
  { name: "Cloudflare", src: "/brand-logos/cloudflare.svg", position: "left-[89%] bottom-[10%] sm:left-[86%] sm:bottom-[12%]" },
];

const HAIRLINE_TOKENS = {
  "--hairline-plate": "#0d0c0b",
  "--hairline-hi": "#e8d5b0",
  "--hairline-edge": "#a8946e",
  "--hairline-mid": "#665d4c",
  "--hairline-lo": "#292622",
  "--hairline-stroke": "0.85",
} as CSSProperties;

function ToolNode({ name, src, position }: ToolNode) {
  return (
    <div className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 ${position}`}>
      <div className="group flex flex-col items-center gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9b48a]/35 bg-[#11100f] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_22px_rgba(0,0,0,0.24)] sm:h-12 sm:w-12">
          <img src={src} alt="" aria-hidden="true" className="h-full w-full object-contain" loading="lazy" decoding="async" draggable={false} />
        </div>
        <span className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.13em] text-[#c4b89a]">{name}</span>
      </div>
    </div>
  );
}

/**
 * Lucas Marques' Hairline, @lucasmarkes/hairline@0.3.0, MIT.
 * Figure: Branches. It explains the reusable BUILD context that connects
 * tools without presenting the tools themselves as the method.
 */
export function BuildMethodHairline() {
  return (
    <figure
      aria-labelledby="build-method-hairline-caption"
      className="relative isolate mx-auto max-w-5xl overflow-hidden border-y border-white/[0.08] bg-[#0d0c0b] px-3 py-8 sm:px-8 sm:py-10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[18%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#c9b48a]/25 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9b48a]/10" />

      <div className="relative h-[370px] sm:h-[430px]">
        <svg aria-hidden="true" viewBox="0 0 1000 430" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          <g fill="none" stroke="#74684f" strokeLinecap="round" strokeWidth="1.1" opacity="0.68" vectorEffect="non-scaling-stroke">
            <path d="M105 104 C210 126 290 170 418 206" />
            <path d="M250 52 C330 82 370 132 438 192" />
            <path d="M895 104 C790 126 710 170 582 206" />
            <path d="M750 52 C670 82 630 132 562 192" />
            <path d="M150 364 C255 330 335 292 430 244" />
            <path d="M850 364 C745 330 665 292 570 244" />
          </g>
          <g fill="#e8d5b0">
            <circle cx="418" cy="206" r="2.3" />
            <circle cx="438" cy="192" r="2.3" />
            <circle cx="582" cy="206" r="2.3" />
            <circle cx="562" cy="192" r="2.3" />
            <circle cx="430" cy="244" r="2.3" />
            <circle cx="570" cy="244" r="2.3" />
          </g>
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 w-[min(60vw,350px)] -translate-x-1/2 -translate-y-1/2 opacity-55 sm:w-[min(44vw,410px)] sm:opacity-100">
          <Branches
            aria-hidden="true"
            intensity={0.16}
            theme="dark"
            className="pointer-events-none h-auto w-full"
            style={HAIRLINE_TOKENS}
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-max max-w-[72vw] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#c9b48a]/35 bg-[#0d0c0b]/95 px-3 py-2 text-center shadow-[0_4px_0_rgba(0,0,0,0.38),0_10px_22px_rgba(0,0,0,0.34)] sm:max-w-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e8d5b0]">BUILD</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#a99d87]">Méthode réutilisable</p>
          </div>
        </div>

        {TOOLS.map((tool) => <ToolNode key={tool.name} {...tool} />)}
      </div>

      <figcaption id="build-method-hairline-caption" className="sr-only">
        BUILD conserve les décisions utiles entre la clarification, la construction et la livraison. Les outils représentés sont interchangeables.
      </figcaption>
    </figure>
  );
}
