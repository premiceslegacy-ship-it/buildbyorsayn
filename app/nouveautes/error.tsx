"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function NouveautesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Les nouveautés ne répondent pas." detail="Réessaie, ou retourne à Aujourd’hui pour continuer." object="livraison" />;
}
