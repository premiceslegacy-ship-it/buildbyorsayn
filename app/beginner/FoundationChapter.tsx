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
    <SectionReveal className={`pt-12 md:pt-16 ${className}`}>
      {eyebrow ? (
        <span className="mb-3 block text-sm font-semibold text-[var(--em)]">
          {eyebrow}
        </span>
      ) : null}
      <h3 className="mb-6 text-balance text-2xl font-semibold tracking-tight text-[var(--encre)] md:text-3xl">
        {title}
      </h3>
      <div className="flex flex-col gap-5 text-[17px] leading-[1.64] text-[var(--t2)]">
        {children}
      </div>
    </SectionReveal>
  );
}
