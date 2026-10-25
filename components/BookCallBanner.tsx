"use client";

import { useSyncExternalStore } from "react";
import { BookCallLink } from "@/components/BookCallLink";
import { DaIcon } from "@/components/da/DaIcon";

const STORAGE_KEY = "build-book-call-banner-hidden-until";
const HIDDEN_FOR_MS = 30 * 24 * 60 * 60 * 1000;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function isHidden() {
  const hiddenUntil = Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
  return Number.isFinite(hiddenUntil) && hiddenUntil > Date.now();
}

/** Bandeau discret de réservation, proposé uniquement aux comptes payants. */
export function BookCallBanner({ tier }: { tier: string | null }) {
  const eligible = tier === "beginner" || tier === "full";
  const hidden = useSyncExternalStore(subscribe, isHidden, () => true);

  if (!eligible || hidden) return null;

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() + HIDDEN_FOR_MS));
    listeners.forEach((listener) => listener());
  };

  return (
    <aside className="book-call-banner" aria-label="Réserver un appel">
      <div className="book-call-banner__copy">
        <span className="book-call-banner__icon" aria-hidden="true"><DaIcon name="phone" /></span>
        <p><strong>Besoin d&apos;en parler&nbsp;?</strong> Tu peux échanger avec Samuel sur ton projet.</p>
      </div>
      <BookCallLink className="btn btn--g book-call-banner__cta" />
      <button className="book-call-banner__close" type="button" onClick={dismiss} aria-label="Masquer ce bandeau">
        <DaIcon name="x" />
      </button>
    </aside>
  );
}
