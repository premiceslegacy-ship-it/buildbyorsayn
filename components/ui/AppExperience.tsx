"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { finishPressFeedback, pulsePressFeedback, startPressFeedback, type PressSound } from "@/lib/ui/feedback";
import { animateEntryCascade, MOTION_SPRINGS } from "@/lib/ui/motion";
import { ToastViewport } from "@/components/ui/ToastViewport";
import styles from "./AppExperience.module.css";

let popNavigation = false;
const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], [role="option"], summary, [data-pressable]';

function pressTarget(event: Event) {
  const target = (event.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
  if (!target || target.dataset.press === "none" || target.matches(":disabled") || target.getAttribute("aria-disabled") === "true") return null;
  return target;
}

function soundFor(target: HTMLElement): PressSound {
  const explicit = target.dataset.sfx;
  if (explicit === "none") return "none";
  if (explicit === "click" || explicit === "select" || explicit === "open" || explicit === "confirm" || explicit === "error") return explicit;
  return target.closest('[role="tablist"], .tabs, .seg') ? "select" : "click";
}

function useFallbackPressFeedback() {
  useEffect(() => {
    const active = new Set<HTMLElement>();
    const pointerDown = (event: PointerEvent) => {
      if (document.querySelector(".nav-shell")) return;
      const target = pressTarget(event);
      if (!target) return;
      active.add(target);
      // Les pages publiques gardent le son coupé. Les écrans sans barre conservent le retour visuel.
      startPressFeedback(target, "none");
    };
    const release = () => {
      active.forEach((target) => finishPressFeedback(target));
      active.clear();
    };
    const click = (event: MouseEvent) => {
      if (document.querySelector(".nav-shell") || event.detail !== 0) return;
      const target = pressTarget(event);
      if (target) pulsePressFeedback(target, "none");
    };
    document.addEventListener("pointerdown", pointerDown, true);
    document.addEventListener("pointerup", release, true);
    document.addEventListener("pointercancel", release, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerdown", pointerDown, true);
      document.removeEventListener("pointerup", release, true);
      document.removeEventListener("pointercancel", release, true);
      document.removeEventListener("click", click, true);
    };
  }, []);
}

export function AppExperience({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [returning] = useState(() => popNavigation);
  const content = useRef<HTMLDivElement>(null);
  useFallbackPressFeedback();

  useEffect(() => {
    popNavigation = false;
    const markPop = () => { popNavigation = true; };
    window.addEventListener("popstate", markPop);
    return () => window.removeEventListener("popstate", markPop);
  }, []);

  useLayoutEffect(() => {
    const page = content.current?.querySelector<HTMLElement>("main");
    if (!page) return;
    const playback = reduce || returning
      ? animate(page, { opacity: [0, 1] }, { duration: .12, ease: "easeOut" })
      : animate(page, { opacity: [0, 1], y: [8, 0] }, { type: "spring", stiffness: MOTION_SPRINGS.doux.stiffness, damping: MOTION_SPRINGS.doux.damping, mass: 1 });
    const entries = [...page.querySelectorAll<HTMLElement>(".row__l, .ui3-skill-grid, .ui3-hermes-list, [data-entry-cascade]")]
      .filter((list) => list.dataset.cascadePlayed !== "true")
      .flatMap((list) => {
        list.dataset.cascadePlayed = "true";
        return animateEntryCascade(list.children);
      });
    return () => {
      playback.stop();
      entries.forEach((entry) => entry.cancel());
    };
  }, [reduce, returning]);

  return (
    <>
      <div className={styles.page} ref={content}>{children}</div>
      <ToastViewport />
    </>
  );
}

export { pressTarget, soundFor };
