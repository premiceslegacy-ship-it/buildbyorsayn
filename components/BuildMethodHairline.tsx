"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { slow } from "@lucasmarkes/hairline";

const LOGOS = [
  { src: "/brand-logos/chatgpt.svg" },
  { src: "/brand-logos/claude-code.svg" },
  { src: "/brand-logos/vercel.svg", filter: "invert(1)" },
  { src: "/brand-logos/supabase.svg" },
  { src: "/brand-logos/stripe.svg" },
  { src: "/brand-logos/cloudflare.svg" },
];

const HAIRLINE_TOKENS = {
  "--hairline-plate": "#0d0c0b",
  "--hairline-hi": "#e8d5b0",
  "--hairline-edge": "#a8946e",
  "--hairline-mid": "#665d4c",
  "--hairline-lo": "#292622",
  "--hairline-stroke": "0.85",
} as CSSProperties;

const SVG_NS = "http://www.w3.org/2000/svg";

function stampLogo(crate: SVGGElement, logo: (typeof LOGOS)[number], bounds: DOMRect) {
  const size = Math.min(bounds.width * 0.8, bounds.height * 0.65);
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height * 0.31;
  const image = document.createElementNS(SVG_NS, "image");

  image.setAttribute("href", logo.src);
  image.setAttribute("width", String(size));
  image.setAttribute("height", String(size));
  image.setAttribute("preserveAspectRatio", "xMidYMid meet");
  image.setAttribute("aria-hidden", "true");
  if (logo.filter) image.style.filter = logo.filter;
  image.setAttribute(
    "transform",
    `matrix(0.58 0.29 -0.58 0.29 ${centerX} ${centerY - size * 0.29})`,
  );

  crate.appendChild(image);
}

function freezeConveyor(host: HTMLDivElement) {
  const svg = host.querySelector("svg");
  if (!svg) return;

  const sourceCrates = [...svg.querySelectorAll("g")]
    .filter((group): group is SVGGElement => group instanceof SVGGElement)
    .filter((group) => group.querySelectorAll(":scope > ellipse").length === 9)
    .slice(0, LOGOS.length);
  const crateBounds = sourceCrates.map((crate) => crate.getBBox());
  const frozen = svg.cloneNode(true) as SVGSVGElement;
  const crates = [...frozen.querySelectorAll("g")]
    .filter((group): group is SVGGElement => group instanceof SVGGElement)
    .filter((group) => group.querySelectorAll(":scope > ellipse").length === 9)
    .slice(0, LOGOS.length);

  crates.forEach((crate, index) => stampLogo(crate, LOGOS[index], crateBounds[index]));
  frozen.setAttribute("aria-hidden", "true");
  frozen.setAttribute("focusable", "false");
  const style = host.querySelector("style");
  host.replaceChildren(style?.cloneNode(true) ?? document.createTextNode(""), frozen);
}

/**
 * Lucas Marques' Hairline, @lucasmarkes/hairline@0.3.0, MIT.
 * Figure: Slow. BUILD freezes one conveyor frame: tool logos are stamped into
 * the native 3D crates, so nothing floats, drifts or exceeds the conveyor.
 */
export function BuildMethodHairline() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const figure = slow(host, { intensity: 0.2, theme: "dark" });
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        freezeConveyor(host);
        figure.destroy();
        host.setAttribute("data-hairline", "slow");
        host.setAttribute("data-hairline-theme", "dark");
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      figure.destroy();
    };
  }, []);

  return (
    <figure
      aria-labelledby="build-method-hairline-caption"
      className="relative isolate mx-auto max-w-6xl overflow-hidden border-y border-white/[0.08] bg-[#0d0c0b] px-1 py-3 sm:px-3 sm:py-5"
    >
      <div
        ref={hostRef}
        aria-hidden="true"
        className="build-method-conveyor h-[330px] w-full sm:h-[470px] lg:h-[540px]"
        style={HAIRLINE_TOKENS}
      />

      <style>{`
        .build-method-conveyor > svg {
          transform: scale(1.14);
          transform-origin: center;
        }

        @media (max-width: 639px) {
          .build-method-conveyor > svg {
            transform: scale(1.04);
          }
        }
      `}</style>

      <figcaption id="build-method-hairline-caption" className="sr-only">
        Des logos d&apos;outils sont estampés sur les blocs d&apos;un convoyeur fixe. BUILD apporte le cadre réutilisable pour transformer les outils en projets montrables, vendables et livrables.
      </figcaption>
    </figure>
  );
}
