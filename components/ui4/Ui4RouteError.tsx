"use client";

import { useEffect } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import styles from "./ui4.module.css";

export function Ui4RouteError({
  error,
  reset,
  title = "Cette page ne s’affiche pas.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DaRoot className="da-app">
      <main className={styles.state}>
        <div className={styles.stateCard}>
          <h1 className="t-2">{title}</h1>
          <p>Réessaie dans un instant. Si le problème continue, retourne au programme.</p>
          <button className="btn btn--p" type="button" onClick={reset}>Réessayer</button>
        </div>
      </main>
    </DaRoot>
  );
}
