"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function HermesLearningError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Le chapitre ne s’ouvre pas." detail="Réessaie, ou retourne à Hermes Agent." backHref="/videos/tutos" backLabel="Retour à Hermes Agent" />;
}
