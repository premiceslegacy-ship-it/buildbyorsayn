"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function ForgotPasswordError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} chrome={false} title="La récupération ne répond pas." detail="Réessaie sans perdre ce que tu as saisi." object="offre" />;
}
