"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="BUILD ne répond pas." detail="Rien n’a été modifié. Réessaie pour reprendre là où tu étais." />;
}
