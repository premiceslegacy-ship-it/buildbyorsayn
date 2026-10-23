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
    <div className="whitespace-pre-wrap font-mono text-[12.5px] leading-[1.75] text-[var(--t2)] [&_em]:text-[var(--t3)] [&_em]:not-italic [&_strong]:font-semibold [&_strong]:text-[var(--menthe)]">
      {children}
    </div>
  );

  return (
    <div className="relative my-6 overflow-hidden rounded-[var(--r-s)] border border-[var(--trait)] bg-[var(--nuit)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--trait)] bg-[var(--carte)] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="shrink-0 text-[var(--menthe)]" size={14} />
          <span className="truncate font-mono text-xs text-[var(--t3)]">{filename}</span>
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Lire en plein écran"
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--trait-f)] bg-[rgba(241,245,242,.08)] px-3 py-1 text-xs text-[var(--t2)] transition-colors hover:bg-[rgba(241,245,242,.14)] hover:text-[var(--encre)]"
        >
          <Maximize2 data-icon="inline-start" size={14} />
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
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[var(--r-m)] border border-[var(--trait)] bg-[var(--nuit)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--trait)] bg-[var(--carte)] px-5 py-3">
              <div className="flex items-center gap-2">
                <FileText className="text-[var(--menthe)]" size={16} />
                <p className="font-mono text-sm text-[var(--t2)]">{filename}</p>
              </div>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Fermer"
                className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--trait-f)] bg-[rgba(241,245,242,.08)] text-[var(--t2)] transition-colors hover:bg-[rgba(241,245,242,.14)] hover:text-[var(--encre)]"
              >
                <X data-icon="inline-start" size={16} />
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
