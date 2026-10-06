"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type IllustratedCardBadge = { label: string; tone?: "default" | "accent" | "success" };

const BADGE_TONE: Record<NonNullable<IllustratedCardBadge["tone"]>, string> = {
  default: "bg-white/5 border-white/10 text-white/40",
  accent: "bg-[#e8d5b0]/10 border-[#e8d5b0]/20 text-[#e8d5b0]",
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
};

export type IllustratedCardProps = {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  onClick?: () => void;
  locked?: boolean;
  badge?: IllustratedCardBadge;
  className?: string;
  footer?: React.ReactNode;
  visualTone?: "default" | "black-gallery";
};

function CardShell({
  title,
  description,
  imageSrc,
  imageAlt,
  locked,
  badge,
  className,
  footer,
  visualTone = "default",
  interactive,
}: IllustratedCardProps & { interactive: boolean }) {
  return (
    <div
      className={cn(
        visualTone === "black-gallery"
          ? "group relative flex aspect-square flex-col overflow-hidden border border-white/[0.10] bg-[#09090a] p-2.5 shadow-[0_22px_55px_rgba(0,0,0,0.22)] transition-[border-color,transform,box-shadow] duration-300"
          : "group relative flex aspect-square flex-col overflow-hidden border border-[#c9b48a]/25 bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-3 transition-colors duration-200",
        interactive && (visualTone === "black-gallery"
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#e8d5b0]/40 hover:shadow-[0_26px_70px_rgba(0,0,0,0.36)]"
          : "cursor-pointer hover:border-[#c9b48a]/45"),
        className
      )}
    >
      {/* The gallery variant uses a quieter inset so the image remains the subject. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-[5px] border",
          visualTone === "black-gallery" ? "border-white/[0.045]" : "border-[#c9b48a]/10"
        )}
      />

      {badge && (
        <span
          className={cn(
            "absolute top-4 right-4 z-20 border px-2.5 py-1 text-[11px] font-medium",
            BADGE_TONE[badge.tone ?? "default"]
          )}
        >
          {badge.label}
        </span>
      )}

      <div
        className={cn(
          "relative min-h-0 flex-1 overflow-hidden border",
          visualTone === "black-gallery" ? "border-white/[0.055] bg-[#070708]" : "border-white/[0.08] bg-white/[0.02]"
        )}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            aria-hidden={imageAlt ? undefined : true}
            className={cn(
              visualTone === "black-gallery"
                ? "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                : "h-full w-full object-cover",
              locked && "opacity-50 grayscale"
            )}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : (
          <div
            aria-hidden="true"
            className={cn("h-full w-full", visualTone === "black-gallery" ? "opacity-[0.16]" : "opacity-[0.12]")}
            style={{
              backgroundImage: visualTone === "black-gallery"
                ? "radial-gradient(#f0ede8 0.7px, transparent 0.7px)"
                : "radial-gradient(#e8d5b0 1px, transparent 1px)",
              backgroundSize: visualTone === "black-gallery" ? "13px 13px" : "10px 10px",
            }}
          />
        )}
      </div>

      <div className="relative z-10 shrink-0 pt-3 pb-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-[#f0ede8]">{title}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-white/50">{description}</p>
        )}
      </div>

      {footer}
    </div>
  );
}

export function IllustratedCard({ href, onClick, ...props }: IllustratedCardProps) {
  const interactive = Boolean(href || onClick);

  if (href) {
    return (
      <Link href={href} className="block" aria-label={props.title}>
        <CardShell {...props} interactive={interactive} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left" aria-label={props.title}>
        <CardShell {...props} interactive={interactive} />
      </button>
    );
  }

  return <CardShell {...props} interactive={false} />;
}
