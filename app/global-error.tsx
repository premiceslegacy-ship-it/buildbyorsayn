"use client";

import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="fr"><head><title>Erreur | BUILD</title></head><body style={{ margin: 0, background: "#050806" }}><RouteErrorState error={error} reset={reset} chrome={false} title="BUILD s’est arrêté." detail="Rien n’a été modifié. Réessaie pour repartir proprement." /></body></html>;
}
