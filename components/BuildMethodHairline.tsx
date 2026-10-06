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
] as const;

type ToolLogo = (typeof LOGOS)[number];

const HAIRLINE_TOKENS = {
  "--hairline-plate": "#0d0c0b",
  "--hairline-hi": "#e8d5b0",
  "--hairline-edge": "#a8946e",
  "--hairline-mid": "#665d4c",
  "--hairline-lo": "#292622",
  "--hairline-stroke": "0.85",
} as CSSProperties;

const SVG_NS = "http://www.w3.org/2000/svg";
const DECAL_SIZE = 100;
const DECAL_INSET = 0.235;
const TOP_FACE_DEPTH = 0.2115;

function crateGroups(svg: SVGSVGElement) {
  return [...svg.querySelectorAll("g")]
    .filter((group): group is SVGGElement => group instanceof SVGGElement)
    .filter((group) => group.querySelectorAll(":scope > ellipse").length === 9)
    .slice(0, LOGOS.length);
}

function placeDecal(crate: SVGGElement, logo: ToolLogo) {
  const cube = crate.querySelector(":scope > path.sil") as SVGPathElement | null;
  if (!cube) return;

  const bounds = cube.getBBox();
  const halfWidth = bounds.width / 2;
  const topDepth = bounds.height * TOP_FACE_DEPTH;
  const inner = 1 - DECAL_INSET * 2;
  const topX = bounds.x + halfWidth;
  const topY = bounds.y;
  const originX = topX;
  const originY = topY + topDepth * DECAL_INSET * 2;
  const xScale = (halfWidth * inner) / DECAL_SIZE;
  const yScale = (topDepth * inner) / DECAL_SIZE;
  let image = crate.querySelector(":scope > image[data-build-tool-decal]") as SVGImageElement | null;

  if (!image) {
    image = document.createElementNS(SVG_NS, "image");
    image.setAttribute("data-build-tool-decal", "true");
    image.setAttribute("width", String(DECAL_SIZE));
    image.setAttribute("height", String(DECAL_SIZE));
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    image.setAttribute("aria-hidden", "true");
    image.style.pointerEvents = "none";
    const firstDot = crate.querySelector(":scope > ellipse");
    crate.insertBefore(image, firstDot);
  }

  image.setAttribute("href", logo.src);
  image.style.filter = "filter" in logo ? logo.filter : "";
  image.setAttribute(
    "transform",
    `matrix(${xScale} ${yScale} ${-xScale} ${yScale} ${originX} ${originY})`,
  );
}

function syncDecals(
  host: HTMLDivElement,
  decals: WeakMap<SVGGElement, ToolLogo>,
  nextLogo: { current: number },
) {
  const svg = host.querySelector("svg");
  if (!svg) return;

  crateGroups(svg).forEach((crate) => {
    let logo = decals.get(crate);
    if (!logo) {
      logo = LOGOS[nextLogo.current % LOGOS.length];
      decals.set(crate, logo);
      nextLogo.current += 1;
    }
    placeDecal(crate, logo);
  });
}

/**
 * Lucas Marques' Hairline, @lucasmarkes/hairline@0.3.0, MIT.
 * Figure: Slow. Tool logos are mapped inside the native 3D crate top faces
 * on every frame, so the decals stay aligned while the conveyor runs.
 */
export function BuildMethodHairline() {
  const hostRef = useRef<HTMLDivElement>(null);
  const decalByCrate = useRef(new WeakMap<SVGGElement, ToolLogo>());
  const nextLogo = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const figure = slow(host, { intensity: 0.2, theme: "dark" });
    let frame = 0;
    const animate = () => {
      syncDecals(host, decalByCrate.current, nextLogo);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
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
        Des logos d&apos;outils sont estampés sur les blocs d&apos;un convoyeur en mouvement. Le mouvement se stabilise lorsque la préférence de réduction du mouvement est active. BUILD apporte le cadre réutilisable pour transformer les outils en projets montrables, vendables et livrables.
      </figcaption>
    </figure>
  );
}
