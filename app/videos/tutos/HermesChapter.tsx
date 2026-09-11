import "server-only";
import type { ReactNode } from "react";
import { DoctrineMarkdown, type DoctrineFile } from "../../doctrine/markdown";

export function HermesChapter({
  file,
  files,
  title,
  summary,
  diagram,
  defaultOpen,
}: {
  file: DoctrineFile;
  files: readonly DoctrineFile[];
  title: string;
  summary?: string;
  diagram?: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-xl border border-white/[0.08] bg-white/[0.02] open:bg-white/[0.03] transition-colors"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="cursor-pointer list-none flex items-start justify-between gap-3 px-4 sm:px-5 py-4">
        <span>
          <span className="block text-sm sm:text-[15px] font-semibold text-[#f0ede8]">{title}</span>
          {summary && <span className="mt-1 block text-xs text-white/45 leading-relaxed">{summary}</span>}
        </span>
        <span className="mt-0.5 shrink-0 text-[#e8d5b0]/60 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
      </summary>
      <div className="px-4 sm:px-5 pb-6">
        <div className="border-t border-white/[0.08] pt-5">
          <DoctrineMarkdown file={file} files={files} />
          {diagram}
        </div>
      </div>
    </details>
  );
}
