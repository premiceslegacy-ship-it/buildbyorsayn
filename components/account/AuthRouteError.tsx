"use client";

import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";

export function AuthRouteError({ reset, title }: { error: Error & { digest?: string }; reset: () => void; title: string }) {
  return (
    <DaRoot>
      <main className="ui3-state">
        <div>
          <h1 className="t-2">{title}</h1>
          <p>Tu peux réessayer sans perdre les informations déjà enregistrées.</p>
          <button className="btn btn--p" type="button" onClick={reset}>Réessayer</button>
        </div>
      </main>
    </DaRoot>
  );
}
