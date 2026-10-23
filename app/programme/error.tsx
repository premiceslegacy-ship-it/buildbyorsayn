"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function ProgrammeError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Le programme ne répond pas." detail="Rien n’a bougé dans ta progression. Réessaie." />;
}
