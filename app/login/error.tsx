"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function LoginError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} chrome={false} title="La connexion ne répond pas." detail="Tes informations sont toujours là. Réessaie." object="offre" />;
}
