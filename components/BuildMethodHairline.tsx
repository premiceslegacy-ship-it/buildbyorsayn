"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Slow } from "@lucasmarkes/hairline/react";

type CratePosition = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const LOGOS = [
  "/brand-logos/chatgpt.svg",
  "/brand-logos/claude-code.svg",
  "/brand-logos/vercel.svg",
  "/brand-logos/supabase.svg",
  "/brand-logos/stripe.svg",
  "/brand-logos/cloudflare.svg",
];

const HAIRLINE_TOKENS = {
  "--hairline-plate": "#0d0c0b",
  "--hairline-hi": "#e8d5b0",
  "--hairline-edge": "#a8946e",
  "--hairline-mid": "#665d4c",
  "--hairline-lo": "#292622",
  "--hairline-stroke": "0.85",
} as CSSProperties;

function getCrates(host: HTMLDivElement): CratePosition[] {
  const figureBounds = host.getBoundingClientRect();
  const svg = host.querySelector("svg");
  if (!svg) return [];

  return [...svg.querySelectorAll("g")]
    .filter((group) => group.querySelectorAll(":scope > ellipse").length === 9)
    .map((group) => {
      const bounds = group.getBoundingClientRect();
      return {
        left: bounds.left - figureBounds.left,
        top: bounds.top - figureBounds.top,
        width: bounds.width,
        height: bounds.height,
      };
    })
    .filter(({ width, height }) => width > 8 && height > 8)
    .sort((a, b) => a.left - b.left)
    .slice(0, LOGOS.length);
}

/**
 * Lucas Marques' Hairline, @lucasmarkes/hairline@0.3.0, MIT.
 * Figure: Slow. Each tool logo is placed directly on a native crate from the
 * conveyor, so the tool moves with the conveyor rather than in a separate UI.
 */
export function BuildMethodHairline() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [crates, setCrates] = useState<CratePosition[]>([]);

  useEffect(() => {
    let frame = 0;
    let mounted = true;

    const sync = () => {
      const host = hostRef.current;
      if (host) {
        const next = getCrates(host);
        if (next.length === LOGOS.length && mounted) setCrates(next);
      }
      frame = window.requestAnimationFrame(sync);
    };

    frame = window.requestAnimationFrame(sync);
    return () => {
      mounted = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <figure
      aria-labelledby="build-method-hairline-caption"
      className="relative isolate mx-auto max-w-5xl overflow-hidden border-y border-white/[0.08] bg-[#0d0c0b] px-2 py-5 sm:px-5 sm:py-7"
    >
      <div ref={hostRef} className="relative h-[238px] overflow-hidden sm:h-[310px]">
        <Slow
          aria-hidden="true"
          intensity={0.34}
          theme="dark"
          className="pointer-events-auto absolute inset-0 h-full w-full"
          style={HAIRLINE_TOKENS}
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          {crates.map((crate, index) => (
            <img
              key={`${LOGOS[index]}-${index}`}
              src={LOGOS[index]}
              alt=""
              draggable={false}
              className="absolute object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.65)]"
              style={{
                left: crate.left + crate.width * 0.21,
                top: crate.top + crate.height * 0.15,
                width: crate.width * 0.58,
                height: crate.height * 0.45,
              }}
            />
          ))}
        </div>
      </div>

      <figcaption id="build-method-hairline-caption" className="sr-only">
        Les outils défilent sur le convoyeur. BUILD apporte le cadre réutilisable pour les transformer en projets montrables, vendables et livrables.
      </figcaption>
    </figure>
  );
}
