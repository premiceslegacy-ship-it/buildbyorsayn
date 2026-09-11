"use client";

import type { ReactNode } from "react";

export function HermesChapterCard({
  title,
  summary,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  summary?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = `hermes-panel-${title.replace(/\W+/g, "-")}`;

  return (
    <article
      className={`min-w-0 rounded-xl border bg-white/[0.02] transition-colors ${
        isOpen
          ? "col-span-full border-[#e8d5b0]/25 bg-white/[0.035]"
          : "border-white/[0.08] hover:border-white/[0.14]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full cursor-pointer list-none flex items-start justify-between gap-3 px-4 sm:px-5 py-4 text-left"
      >
        <span className="min-w-0">
          <span className="block text-sm sm:text-[15px] font-semibold text-[#f0ede8]">{title}</span>
          {summary && <span className="mt-1 block text-xs text-white/45 leading-relaxed">{summary}</span>}
        </span>
        <span
          className={`mt-0.5 shrink-0 text-[#e8d5b0]/60 text-xl leading-none transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <div id={panelId} hidden={!isOpen} className="px-4 sm:px-5 pb-6">
        <div className="border-t border-white/[0.08] pt-5 max-w-4xl">{children}</div>
      </div>
    </article>
  );
}
