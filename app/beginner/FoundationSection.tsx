"use client";

import type { ReactNode } from "react";

export function FoundationSection({
  num,
  title,
  summary,
  isOpen,
  onToggle,
  children,
}: {
  num: string;
  title: string;
  summary: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = `foundation-panel-${num}`;

  return (
    <article
      className={`min-w-0 rounded-2xl border bg-white/[0.02] transition-colors ${
        isOpen ? "border-[#e8d5b0]/25 bg-white/[0.035]" : "border-white/[0.08] hover:border-white/[0.14]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full cursor-pointer list-none flex items-start justify-between gap-4 px-5 sm:px-7 py-5"
      >
        <span className="flex items-start gap-4 min-w-0 text-left">
          <span className="mt-0.5 text-xs font-semibold text-[#e8d5b0]/60 uppercase tracking-widest shrink-0">{num}</span>
          <span className="min-w-0">
            <span className="block text-base sm:text-lg font-semibold tracking-tight text-[#f0ede8]">{title}</span>
            <span className="mt-1.5 block text-sm text-white/50 leading-relaxed">{summary}</span>
          </span>
        </span>
        <span
          className={`mt-1 shrink-0 text-[#e8d5b0]/60 text-2xl leading-none transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <div id={panelId} hidden={!isOpen} className="px-5 sm:px-7 pb-8">
        <div className="border-t border-white/[0.08] pt-6">{children}</div>
      </div>
    </article>
  );
}
