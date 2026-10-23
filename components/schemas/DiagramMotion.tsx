"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { APP_SPRINGS, motionAllowed } from "@/lib/ui/motion";
import styles from "./schema.module.css";

const STEP_MS = 60;
const DRAW_MS = 420;

export function DiagramMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host || !motionAllowed() || !("IntersectionObserver" in window)) return;
    const visibleSvg = Array.from(host.querySelectorAll<SVGSVGElement>("svg[data-schema-layout]"))
      .find((svg) => window.getComputedStyle(svg).display !== "none");
    if (!visibleSvg) return;

    host.classList.add(styles.prepared);
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const animations: Animation[] = [];

      visibleSvg.querySelectorAll<SVGGElement>("[data-schema-node]").forEach((element) => {
        const step = Math.min(Number(element.dataset.schemaStep ?? 0), 12);
        animations.push(element.animate(
          [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
          { duration: APP_SPRINGS.doux.duration, easing: APP_SPRINGS.doux.easing, delay: step * STEP_MS, fill: "both" },
        ));
      });

      visibleSvg.querySelectorAll<SVGGElement>("[data-schema-edge]").forEach((element) => {
        const step = Math.min(Number(element.dataset.schemaStep ?? 0), 12);
        const delay = step * STEP_MS + 80;
        const line = element.querySelector<SVGPathElement>("[data-schema-line]");
        const head = element.querySelector<SVGPathElement>("[data-schema-head]");
        if (line) {
          animations.push(line.animate(
            element.dataset.schemaDashed === "true"
              ? [{ opacity: 0 }, { opacity: 1 }]
              : [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
            { duration: DRAW_MS, easing: "cubic-bezier(.3,.9,.3,1)", delay, fill: "both" },
          ));
        }
        if (head) animations.push(head.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: 120, delay: delay + DRAW_MS - 60, fill: "both" },
        ));
      });

      host.classList.remove(styles.prepared);
      animations.forEach((animation) => void animation.finished.then(() => animation.cancel(), () => undefined));
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    observer.observe(visibleSvg);
    return () => observer.disconnect();
  }, []);

  return <div ref={root}>{children}</div>;
}
