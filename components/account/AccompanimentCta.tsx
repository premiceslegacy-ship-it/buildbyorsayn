"use client";

import { useRef, useState, type MouseEvent } from "react";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";

export function AccompanimentCta({ href }: { href: string }) {
  const anchor = useRef<HTMLAnchorElement>(null);
  const [label, setLabel] = useState("Réserver mon appel");
  const [busy, setBusy] = useState(false);

  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (busy) {
      event.preventDefault();
      return;
    }
    setBusy(true);
    setLabel("Ouverture");
    const animation = anchor.current
      ? animateAppElement(anchor.current, [{ transform: "scale(.97)" }, { transform: "scale(1)" }], "vif")
      : null;
    const restore = () => {
      setLabel("Réserver mon appel");
      setBusy(false);
    };
    if (animation) void animation.finished.then(restore, restore);
    else restore();
    void playAppSound("confirm");
  }

  return <a ref={anchor} className="btn btn--p" href={href} target="_blank" rel="noopener noreferrer" data-sfx="none" aria-disabled={busy} onClick={open}>{label}</a>;
}
