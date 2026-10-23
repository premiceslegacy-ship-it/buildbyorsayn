"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function BeginnerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Fondations ne répond pas." detail="Ta progression est intacte. Réessaie, ou retourne au programme." backHref="/programme" />;
}
