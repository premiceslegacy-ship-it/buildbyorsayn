"use client";

import { useState, type ReactNode } from "react";
import { Maximize2, X, FileText } from "lucide-react";

/**
 * Shows a real excerpt of a project .md file (e.g. DESIGN-SYSTEM.md) as a
 * monospace document, scrollable in place and expandable to a fullscreen
 * reading overlay - so a reference like Mintlify's design system doc is
 * shown as an actual artifact to scroll through, not just described.
 */
export function MarkdownFilePreview({
  filename,
  children,
}: {
  filename: string;
  children: ReactNode;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  const body = (
    <div className="font-mono text-[12.5px] leading-[1.75] text-white/70 whitespace-pre-wrap [&_strong]:text-[#e8d5b0] [&_strong]:font-semibold [&_em]:text-white/50 [&_em]:not-italic">
      {children}
    </div>
  );

  return (
    <div className="relative my-6 rounded-lg border border-white/[0.08] bg-[#0a0a0b] overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-3.5 h-3.5 text-[#e8d5b0]/60 shrink-0" />
          <span className="truncate text-xs font-mono text-white/50">{filename}</span>
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Lire en plein écran"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-white/45 hover:text-[#e8d5b0] hover:border-[#e8d5b0]/30 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">Plein écran</span>
        </button>
      </div>
      <div className="max-h-[260px] overflow-y-auto px-4 py-4">
        {body}
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={filename}
        >
          <div
            className="relative flex flex-col w-full max-w-3xl max-h-full rounded-xl border border-white/10 bg-[#0a0a0b] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.03] px-5 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#e8d5b0]/70" />
                <p className="text-sm font-mono text-white/60">{filename}</p>
              </div>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Fermer"
                className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] p-1.5 text-white/50 hover:text-[#e8d5b0] hover:border-[#e8d5b0]/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              {body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
