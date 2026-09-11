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
  interactive,
}: IllustratedCardProps & { interactive: boolean }) {
  return (
    <div
      className={cn(
        "group relative flex aspect-square flex-col overflow-hidden border border-[#c9b48a]/25 bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-3 transition-colors duration-200",
        interactive && "cursor-pointer hover:border-[#c9b48a]/45",
        className
      )}
    >
      {/* Inset liseré: a second thin border set back from the card edge for a "windowed" double-border look. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[5px] border border-[#c9b48a]/10" />

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

      <div className="relative min-h-0 flex-1 overflow-hidden border border-white/[0.08] bg-white/[0.02]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            aria-hidden={imageAlt ? undefined : true}
            className={cn(
              "h-full w-full object-cover",
              locked && "opacity-50 grayscale"
            )}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-full w-full opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(#e8d5b0 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          />
        )}
      </div>

      <div className="relative z-10 shrink-0 pt-3 pb-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-[#f0ede8]">{title}</p>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">{description}</p>
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
