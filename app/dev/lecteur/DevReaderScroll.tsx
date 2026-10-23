"use client";

import { useEffect } from "react";

export function DevReaderScroll({ top = 0, visual }: { top?: number; visual?: string }) {
  useEffect(() => {
    const first = window.requestAnimationFrame(() => {
      const second = window.requestAnimationFrame(() => {
        const target = visual ? document.querySelector<HTMLElement>(
          `[data-reader-visual-name="${CSS.escape(visual)}"], [data-coffre-visual="${CSS.escape(visual)}"], [data-course-visual="${CSS.escape(visual)}"]`,
        ) : null;
        window.scrollTo({ top: target ? window.scrollY + target.getBoundingClientRect().top - 132 : top, behavior: "instant" });
      });
      return () => window.cancelAnimationFrame(second);
    });
    return () => window.cancelAnimationFrame(first);
  }, [top, visual]);

  return null;
}
