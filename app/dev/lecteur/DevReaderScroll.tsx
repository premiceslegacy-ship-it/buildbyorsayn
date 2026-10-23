"use client";

import { useEffect } from "react";

export function DevReaderScroll({ top }: { top: number }) {
  useEffect(() => {
    const first = window.requestAnimationFrame(() => {
      const second = window.requestAnimationFrame(() => window.scrollTo({ top, behavior: "instant" }));
      return () => window.cancelAnimationFrame(second);
    });
    return () => window.cancelAnimationFrame(first);
  }, [top]);

  return null;
}
