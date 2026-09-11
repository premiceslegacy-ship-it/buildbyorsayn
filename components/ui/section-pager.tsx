import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionPagerItem = {
  href: string;
  label: string;
};

/**
 * Centered previous/next navigation between sibling sections (Fondations,
 * Hermes Agent chapters, Blocs). Arrows sit outside the label so long
 * titles never push the arrow off-center or wrap the button to two lines.
 */
export function SectionPager({
  prev,
  next,
  nextDisabledLabel,
}: {
  prev?: SectionPagerItem;
  next?: SectionPagerItem;
  /** Shown, disabled, in place of `next` when there is no next item. */
  nextDisabledLabel?: string;
}) {
  if (!prev && !next && !nextDisabledLabel) return null;

  return (
    <nav
      aria-label="Navigation entre sections"
      className="flex items-stretch gap-3"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex min-w-0 flex-1 items-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors hover:border-[#c9b48a]/40 hover:bg-white/[0.04] sm:flex-initial"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-white/40 transition-colors group-hover:text-[#e8d5b0]" />
          <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-white/60 group-hover:text-white/90 sm:max-w-[220px]">
            {prev.label}
          </span>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex min-w-0 flex-1 items-center justify-end gap-3 border border-[#c9b48a]/25 bg-[#e8d5b0]/[0.04] px-4 py-3 transition-colors hover:border-[#c9b48a]/50 hover:bg-[#e8d5b0]/[0.08] sm:flex-initial"
        >
          <span className="min-w-0 flex-1 truncate text-right text-sm font-medium text-[#e8d5b0] sm:max-w-[220px]">
            {next.label}
          </span>
          <ArrowRight className="w-4 h-4 shrink-0 text-[#e8d5b0] transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : nextDisabledLabel ? (
        <div
          className={cn(
            "flex flex-1 items-center justify-end gap-3 border border-white/5 bg-white/[0.015] px-4 py-3 text-white/25 sm:flex-initial"
          )}
        >
          <span className="truncate text-sm font-medium">{nextDisabledLabel}</span>
        </div>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
