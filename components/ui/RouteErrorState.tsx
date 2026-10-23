"use client";

import { useEffect } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import { AppChromePlaceholder } from "@/components/da/AppChromePlaceholder";
import { AppState } from "@/components/ui/AppState";

export function RouteErrorState({
  error,
  reset,
  title = "Cette page ne répond pas.",
  detail = "Rien n’a été modifié. Réessaie dans un instant.",
  backHref,
  backLabel = "Retour au programme",
  chrome = true,
  object = "bloc",
}: {
  error?: unknown;
  reset: () => void;
  title?: string;
  detail?: string;
  backHref?: string;
  backLabel?: string;
  chrome?: boolean;
  object?: "bloc" | "livraison" | "offre" | "vente";
}) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <DaRoot className={`da-app${chrome ? " has-tabbar" : ""}`}>
      {chrome ? <AppChromePlaceholder /> : null}
      <main>
        <AppState
          tone="alert"
          object={object}
          title={title}
          detail={detail}
          action={{ label: "Réessayer", onClick: reset }}
          secondary={backHref ? { href: backHref, label: backLabel } : undefined}
        />
      </main>
    </DaRoot>
  );
}
