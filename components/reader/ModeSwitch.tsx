"use client";

import { useRef } from "react";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import type { ReaderMode } from "./readerModel";
import styles from "./reader.module.css";

export function ModeSwitch({ mode, onChange }: { mode: ReaderMode; onChange: (mode: ReaderMode) => void }) {
  const root = useRef<HTMLDivElement>(null);

  const select = (next: ReaderMode) => {
    if (next === mode) return;
    void playAppSound("select");
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
        select(mode === "video" ? "texte" : "video");
      }}
    >
      <span className={styles.modePill} aria-hidden="true" />
      <button type="button" role="radio" aria-checked={mode === "video"} data-sfx="none" onClick={() => select("video")}>Vidéo</button>
      <button type="button" role="radio" aria-checked={mode === "texte"} data-sfx="none" onClick={() => select("texte")}>Texte</button>
    </div>
  );
}
