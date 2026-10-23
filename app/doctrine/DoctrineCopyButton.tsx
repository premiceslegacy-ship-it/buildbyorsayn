"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { playAppSound } from "@/lib/ui/sound";

export function DoctrineCopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      void playAppSound("confirm");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      void playAppSound("error");
    }
  };

  return <button className="doctrine-copy" type="button" data-sfx="none" onClick={() => void copy()}>
    {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    {copied ? "Copié" : "Envoyer à mon IA"}
  </button>;
}
