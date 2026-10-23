"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TEXT_COMPLETED_POSITION, TEXT_MIN_POSITION, textPositionFromRatio, textRatioFromPosition } from "@/lib/lessons/textPosition";

const SAVE_INTERVAL_MS = 4_000;
const RESTORE_LIMIT_MS = 2_500;
const RESTORE_SETTLED_MS = 400;
const INTERACTIONS = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
const INTENTS = ["wheel", "touchmove", "pointerdown", "keydown"] as const;
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
/** A touch keeps scrolling for a moment after the finger lifts. */
const INTENT_WINDOW_MS = 2_500;

/**
 * Remembers how far the reader went in one text chapter (`key` from textPositionKey) and brings
 * them back there when the chapter opens again, until it is read to the end.
 * The chapter's article carries `data-reading-key={key}`: scrolls measured once it has left the
 * page (the next page is already shown while this effect is cleaned up) are ignored.
 * Saves are throttled, flushed when the page is hidden or the chapter changes, and never
 * rewrite a chapter already read.
 */
export function useTextPosition(key: string | null) {
  useEffect(() => {
    if (!key) return;
    const supabase = createClient();
    let disposed = false;
    let userId: string | null = null;
    let stored: { position: number; completed: boolean } | null = null;
    let loaded = false;
    let latest = -1;
    let lastSentAt = 0;
    let timer: number | undefined;
    let restoring = false;
    let frame = 0;

    const persist = () => {
      window.clearTimeout(timer);
      timer = undefined;
      if (!loaded || !userId || latest < 0 || stored?.completed) return;
      if (!stored && latest < TEXT_MIN_POSITION) return;
      const completed = latest >= TEXT_COMPLETED_POSITION;
      if (stored && stored.position === latest && !completed) return;
      stored = { position: latest, completed };
      lastSentAt = Date.now();
      void supabase.from("lesson_progress").upsert(
        { user_id: userId, section_id: key, position_seconds: latest, completed, updated_at: new Date().toISOString() },
        { onConflict: "user_id,section_id" },
      ).then(({ error }) => {
        if (error) console.error("Erreur lors de l'enregistrement de la lecture:", error.message);
      });
    };

    // Measured on the chapter's own article, not the whole page: while Next swaps pages, the next
    // page can already sit in the document beside this one and change its height.
    const article = () => {
      const element = document.querySelector<HTMLElement>(`[data-reading-key="${key}"]`);
      const rect = element?.getBoundingClientRect();
      return rect && rect.height > window.innerHeight ? { top: rect.top, span: rect.height - window.innerHeight } : null;
    };

    // Only scrolls the reader asked for count. Leaving the page shortens it and the browser
    // clamps the scroll, which would otherwise be saved as a step back.
    let movedAt = 0;
    const onIntent = (event: Event) => {
      if (event instanceof KeyboardEvent && !SCROLL_KEYS.has(event.key)) return;
      if (event.type === "pointerdown" && (event.target as Element | null)?.closest?.("a, button")) return;
      movedAt = Date.now();
    };

    const onScroll = () => {
      const box = restoring || Date.now() - movedAt > INTENT_WINDOW_MS ? null : article();
      if (!box) return;
      latest = textPositionFromRatio(-box.top / box.span);
      if (latest >= TEXT_COMPLETED_POSITION) return persist();
      if (timer !== undefined) return;
      timer = window.setTimeout(persist, Math.max(0, SAVE_INTERVAL_MS - (Date.now() - lastSentAt)));
    };

    const stopRestoring = () => {
      if (!restoring) return;
      restoring = false;
      window.cancelAnimationFrame(frame);
      INTERACTIONS.forEach((name) => window.removeEventListener(name, stopRestoring));
    };

    // The text, its diagrams and images can still grow after the first paint: keep the target
    // ratio until the article height settles, and give control back as soon as the reader moves.
    const restore = (ratio: number) => {
      restoring = true;
      INTERACTIONS.forEach((name) => window.addEventListener(name, stopRestoring, { passive: true }));
      const startedAt = performance.now();
      let span = -1;
      let settledSince = startedAt;
      const step = (now: number) => {
        if (!restoring) return;
        const box = article();
        if (box) {
          if (box.span !== span) {
            span = box.span;
            settledSince = now;
          }
          const offset = box.top + Math.round(ratio * box.span);
          if (Math.abs(offset) > 1) window.scrollTo({ top: window.scrollY + offset, behavior: "instant" });
          if (now - settledSince > RESTORE_SETTLED_MS && Math.abs(offset) <= 1) return stopRestoring();
        }
        if (now - startedAt > RESTORE_LIMIT_MS) return stopRestoring();
        frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    };

    const onHidden = () => {
      if (document.visibilityState === "hidden") persist();
    };

    void (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (disposed || !session) return;
      userId = session.user.id;
      const { data, error } = await supabase.from("lesson_progress").select("position_seconds,completed").eq("user_id", userId).eq("section_id", key).maybeSingle();
      if (disposed || error) return;
      loaded = true;
      if (data) stored = { position: data.position_seconds, completed: data.completed };
      if (data && !data.completed && data.position_seconds >= TEXT_MIN_POSITION && window.scrollY < 40) restore(textRatioFromPosition(data.position_seconds));
    })();

    window.addEventListener("scroll", onScroll, { passive: true });
    INTENTS.forEach((name) => window.addEventListener(name, onIntent, { passive: true, capture: true }));
    window.addEventListener("pagehide", persist);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      disposed = true;
      stopRestoring();
      window.removeEventListener("scroll", onScroll);
      INTENTS.forEach((name) => window.removeEventListener(name, onIntent, { capture: true }));
      window.removeEventListener("pagehide", persist);
      document.removeEventListener("visibilitychange", onHidden);
      // `latest` was measured on this chapter's article only, so it stays right even if the next page is already shown.
      persist();
    };
  }, [key]);
}
