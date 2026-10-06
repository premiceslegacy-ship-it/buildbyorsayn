"use client";

import type { CSSProperties } from "react";
import { Slow } from "@lucasmarkes/hairline/react";

type ConveyorLogo = {
  src: string;
  offset: number;
};

const LOGOS: ConveyorLogo[] = [
  { src: "/brand-logos/chatgpt.svg", offset: 0 },
  { src: "/brand-logos/claude-code.svg", offset: 2.65 },
  { src: "/brand-logos/vercel.svg", offset: 5.3 },
  { src: "/brand-logos/supabase.svg", offset: 7.95 },
  { src: "/brand-logos/stripe.svg", offset: 10.6 },
  { src: "/brand-logos/cloudflare.svg", offset: 13.25 },
];

const HAIRLINE_TOKENS = {
  "--hairline-plate": "#0d0c0b",
  "--hairline-hi": "#e8d5b0",
  "--hairline-edge": "#a8946e",
  "--hairline-mid": "#665d4c",
  "--hairline-lo": "#292622",
  "--hairline-stroke": "0.85",
} as CSSProperties;

/**
 * Lucas Marques' Hairline, @lucasmarkes/hairline@0.3.0, MIT.
 * Figure: Slow. Its conveyor makes the idea concrete: tools move through
 * BUILD, while the framework remains stable and reusable.
 */
export function BuildMethodHairline() {
  return (
    <figure
      aria-labelledby="build-method-hairline-caption"
      className="relative isolate mx-auto max-w-5xl overflow-hidden border-y border-white/[0.08] bg-[#0d0c0b] px-2 py-5 sm:px-5 sm:py-7"
    >
      <div className="relative h-[238px] overflow-hidden sm:h-[310px]">
        <Slow
          aria-hidden="true"
          intensity={0.34}
          theme="dark"
          className="pointer-events-auto absolute inset-0 h-full w-full"
          style={HAIRLINE_TOKENS}
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[51%] h-14 -translate-y-1/2 overflow-hidden sm:h-16">
          {LOGOS.map(({ src, offset }) => (
            <div
              key={src}
              className="build-conveyor-logo absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[3px] border border-[#e8d5b0]/45 bg-[#151310] p-1.5 shadow-[0_3px_0_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-11 sm:w-11 sm:p-2"
              style={{ "--logo-delay": `-${offset}s` } as CSSProperties}
            >
              <img src={src} alt="" className="h-full w-full object-contain" draggable={false} />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center sm:bottom-5">
          <span className="inline-flex border-y border-[#c9b48a]/25 bg-[#0d0c0b]/80 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[#e8d5b0] backdrop-blur-sm sm:text-[10px]">
            BUILD LA MÉTHODE
          </span>
        </div>
      </div>

      <figcaption id="build-method-hairline-caption" className="sr-only">
        Les outils passent sur un même convoyeur. BUILD apporte le cadre réutilisable pour les transformer en projets montrables, vendables et livrables.
      </figcaption>

      <style>{`
        .build-conveyor-logo {
          left: 34%;
          animation: build-conveyor-logo 15.9s linear infinite;
          animation-delay: var(--logo-delay);
          will-change: transform, left;
        }

        @keyframes build-conveyor-logo {
          from { left: 34%; transform: translateY(calc(-50% - 22px)); }
          to { left: 66%; transform: translateY(calc(-50% + 52px)); }
        }

        @media (max-width: 639px), (prefers-reduced-motion: reduce) {
          .build-conveyor-logo {
            animation: none;
            transform: translateY(-50%);
          }

          .build-conveyor-logo:nth-child(1) { left: 9%; }
          .build-conveyor-logo:nth-child(2) { left: 25%; }
          .build-conveyor-logo:nth-child(3) { left: 41%; }
          .build-conveyor-logo:nth-child(4) { left: 57%; }
          .build-conveyor-logo:nth-child(5) { left: 73%; }
          .build-conveyor-logo:nth-child(6) { left: 89%; }
        }
      `}</style>
    </figure>
  );
}
