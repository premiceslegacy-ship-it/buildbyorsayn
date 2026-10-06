"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { slow } from "@lucasmarkes/hairline";

const LOGOS = [
  { src: "/brand-logos/codex.svg", accent: "#7a9dff" },
  { src: "/brand-logos/claude-code.svg", accent: "#d97757" },
  { src: "/brand-logos/vercel.svg", accent: "#f0ede8", filter: "invert(1)" },
  { src: "/brand-logos/supabase.svg", accent: "#3ecf8e" },
  { src: "/brand-logos/stripe.svg", accent: "#635bff" },
  { src: "/brand-logos/cloudflare.svg", accent: "#f38020" },
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
const DECAL_INSET = 0.18;
const TOP_FACE_DEPTH = 0.2115;
const MIN_DECORATED_CRATE_WIDTH = 18;

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
  const top = `${originX} ${originY}`;
  const right = `${originX + halfWidth * inner} ${originY + topDepth * inner}`;
  const bottom = `${originX} ${originY + topDepth * inner * 2}`;
  const left = `${originX - halfWidth * inner} ${originY + topDepth * inner}`;
  const inlayPath = `M${top}L${right}L${bottom}L${left}Z`;
  const shadowPath = `M${originX} ${originY + 1.1}L${originX + halfWidth * inner} ${originY + topDepth * inner + 1.1}L${originX} ${originY + topDepth * inner * 2 + 1.1}L${originX - halfWidth * inner} ${originY + topDepth * inner + 1.1}Z`;
  const firstDot = crate.querySelector(":scope > ellipse");
  let shadow = crate.querySelector(":scope > path[data-build-tool-shadow]") as SVGPathElement | null;
  let inlay = crate.querySelector(":scope > path[data-build-tool-inlay]") as SVGPathElement | null;
  let depth = crate.querySelector(":scope > image[data-build-tool-depth]") as SVGImageElement | null;
  let image = crate.querySelector(":scope > image[data-build-tool-decal]") as SVGImageElement | null;

  crate.querySelectorAll(":scope > ellipse").forEach((dot) => dot.setAttribute("visibility", "hidden"));

  if (!shadow) {
    shadow = document.createElementNS(SVG_NS, "path");
    shadow.setAttribute("data-build-tool-shadow", "true");
    shadow.setAttribute("aria-hidden", "true");
    shadow.style.pointerEvents = "none";
    crate.insertBefore(shadow, firstDot);
  }

  if (!inlay) {
    inlay = document.createElementNS(SVG_NS, "path");
    inlay.setAttribute("data-build-tool-inlay", "true");
    inlay.setAttribute("aria-hidden", "true");
    inlay.style.pointerEvents = "none";
    crate.insertBefore(inlay, firstDot);
  }

  if (!depth) {
    depth = document.createElementNS(SVG_NS, "image");
    depth.setAttribute("data-build-tool-depth", "true");
    depth.setAttribute("width", String(DECAL_SIZE));
    depth.setAttribute("height", String(DECAL_SIZE));
    depth.setAttribute("preserveAspectRatio", "xMidYMid meet");
    depth.setAttribute("aria-hidden", "true");
    depth.style.pointerEvents = "none";
    crate.insertBefore(depth, firstDot);
  }

  if (!image) {
    image = document.createElementNS(SVG_NS, "image");
    image.setAttribute("data-build-tool-decal", "true");
    image.setAttribute("width", String(DECAL_SIZE));
    image.setAttribute("height", String(DECAL_SIZE));
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    image.setAttribute("aria-hidden", "true");
    image.style.pointerEvents = "none";
    crate.insertBefore(image, firstDot);
  }

  const isLargeEnoughForMark = bounds.width >= MIN_DECORATED_CRATE_WIDTH;
  const decorationVisibility = isLargeEnoughForMark ? "visible" : "hidden";
  shadow.setAttribute("visibility", decorationVisibility);
  inlay.setAttribute("visibility", decorationVisibility);
  depth.setAttribute("visibility", decorationVisibility);
  image.setAttribute("visibility", decorationVisibility);

  shadow.setAttribute("d", shadowPath);
  shadow.setAttribute("fill", "#020202");
  shadow.setAttribute("fill-opacity", "0.92");
  inlay.setAttribute("d", inlayPath);
  inlay.setAttribute("fill", logo.accent);
  inlay.setAttribute("fill-opacity", "0.16");
  inlay.setAttribute("stroke", logo.accent);
  inlay.setAttribute("stroke-opacity", "0.7");
  inlay.setAttribute("stroke-width", "0.62");
  inlay.setAttribute("vector-effect", "non-scaling-stroke");

  depth.setAttribute("href", logo.src);
  depth.style.filter = "brightness(0) opacity(0.76)";
  depth.setAttribute(
    "transform",
    `matrix(${xScale} ${yScale} ${-xScale} ${yScale} ${originX} ${originY + 1.05})`,
  );
  image.setAttribute("href", logo.src);
  image.style.filter = `${"filter" in logo ? logo.filter : ""} drop-shadow(0 0.45px 0 ${logo.accent})`;
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

function preloadToolMarks() {
  return Promise.all(
    LOGOS.map(
      ({ src }) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        }),
    ),
  );
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

    let figure: ReturnType<typeof slow> | undefined;
    let frame = 0;
    let cancelled = false;

    const animate = () => {
      syncDecals(host, decalByCrate.current, nextLogo);
      frame = window.requestAnimationFrame(animate);
    };

    void preloadToolMarks().then(() => {
      if (cancelled) return;

      decalByCrate.current = new WeakMap<SVGGElement, ToolLogo>();
      nextLogo.current = 0;
      figure = slow(host, { intensity: 0.2, theme: "dark" });
      syncDecals(host, decalByCrate.current, nextLogo);
      frame = window.requestAnimationFrame(animate);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      figure?.destroy();
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
