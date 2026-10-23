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
      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-text/10 text-text-secondary transition hover:border-border-hover hover:text-accent"
    >
      {copied ? <Check data-icon="inline-start" size={16} /> : <Copy data-icon="inline-start" size={16} />}
    </button>
  );
}
