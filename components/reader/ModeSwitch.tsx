"use client";

import { useRef } from "react";
import { animateAppElement } from "@/lib/ui/motion";
import type { ReaderMode } from "./readerModel";
import styles from "./reader.module.css";

export function ModeSwitch({ mode, onChange }: { mode: ReaderMode; onChange: (mode: ReaderMode) => void }) {
  const root = useRef<HTMLDivElement>(null);

  const select = (next: ReaderMode) => {
    if (next === mode) return;
    if (root.current) {
      animateAppElement(root.current, [
        { transform: "scale(.985)" },
        { transform: "scale(1)" },
      ], "vif");
    }
    onChange(next);
  };

  return (
    <div
      ref={root}
      className={styles.modeSwitch}
      data-mode={mode}
      role="radiogroup"
      aria-label="Mode de lecture"
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        event.stopPropagation();
        const next = mode === "video" ? "texte" : "video";
        select(next);
        window.requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>(`[data-mode-value="${next}"]`)?.focus());
      }}
    >
      <span className={styles.modePill} aria-hidden="true" />
      <button type="button" role="radio" aria-checked={mode === "video"} tabIndex={mode === "video" ? 0 : -1} data-mode-value="video" onClick={() => select("video")}>Vidéo</button>
      <button type="button" role="radio" aria-checked={mode === "texte"} tabIndex={mode === "texte" ? 0 : -1} data-mode-value="texte" onClick={() => select("texte")}>Texte</button>
    </div>
  );
}
