"use client";

import { useEffect, useRef } from "react";

/** Boucle muette d'un plan : ne se lance pas si la personne a demandé moins d'animation, l'image fixe reste alors visible. */
export function LoopVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = false;
    }
    if (reduced) return;
    const play = () => { void video.play().catch(() => undefined); };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) play(); else video.pause();
    }, { threshold: 0.25 });
    if (observer) observer.observe(video); else play();
    return () => observer?.disconnect();
  }, []);

  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />;
}
