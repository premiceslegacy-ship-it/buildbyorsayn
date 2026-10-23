"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function DoctrineError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="La doctrine ne s’affiche pas." detail="Réessaie, ou retourne au programme." backHref="/programme" />;
}
