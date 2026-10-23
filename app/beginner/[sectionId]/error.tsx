"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function BeginnerChapterError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Le chapitre ne s’ouvre pas." detail="Ta progression est intacte. Réessaie, ou retourne à Fondations." backHref="/beginner" backLabel="Retour à Fondations" />;
}
