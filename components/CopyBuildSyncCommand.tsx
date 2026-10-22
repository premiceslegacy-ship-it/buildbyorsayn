"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyBuildSyncCommand({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label={copied ? `${label} copiée` : `Copier ${label}`}
      title={copied ? "Copiée" : "Copier"}
      onClick={() => {
        void navigator.clipboard.writeText(command);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2_000);
      }}
      className="flex size-11 shrink-0 items-center justify-center border-l border-white/10 bg-white/[0.06] text-white/55 transition hover:text-[#e8d5b0]"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}
