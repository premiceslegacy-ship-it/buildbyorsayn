import type { ReactNode } from "react";
import { SectionReveal } from "@/components/ui/section-reveal";

export function FoundationChapter({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SectionReveal className={`border-t border-white/10 pt-8 md:pt-10 ${className}`}>
      {eyebrow ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]/65">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mb-5 text-xl font-semibold tracking-tight text-[#f0ede8] md:text-2xl">
        {title}
      </h3>
      <div className="space-y-4 text-sm leading-[1.75] text-white/65 md:text-[15px]">
        {children}
      </div>
    </SectionReveal>
  );
}
