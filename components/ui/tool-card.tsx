import { cn } from "@/lib/utils";

export type ToolCardProps = {
  name: string;
  /** No longer rendered - kept optional so existing call sites don't need to strip it immediately. */
  description?: string;
  logoSrc?: string;
  /** Shown instead of an <img> when no clean official mark exists (see public/brand-logos/README.md). */
  fallbackInitial?: string;
  href?: string;
  className?: string;
};

/**
 * A bare logo + name pair, no card, no border, no background - used
 * wherever a section names an external tool/product and the logo should
 * read as just the logo, not as content boxed inside a tile.
 */
export function ToolCard({ name, logoSrc, fallbackInitial, href, className }: ToolCardProps) {
  const content = (
    <div className={cn("group flex items-center gap-3 py-1", className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center text-white/70">
        {logoSrc ? (
          <img src={logoSrc} alt="" aria-hidden="true" className="h-7 w-7 object-contain" loading="lazy" decoding="async" draggable={false} />
        ) : (
          <span className="text-xs font-bold text-[#e8d5b0]">{fallbackInitial ?? name.charAt(0)}</span>
        )}
      </div>
      <p className={cn("truncate text-sm font-semibold tracking-tight text-[#f0ede8]", href && "group-hover:text-[#e8d5b0] transition-colors")}>{name}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className="block" aria-label={name}>
        {content}
      </a>
    );
  }

  return content;
}
