"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function UpdatePasswordError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} chrome={false} title="La réinitialisation ne répond pas." detail="Réessaie sans perdre ce que tu as saisi." object="offre" />;
}
