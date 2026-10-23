"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function SourcesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Les sources ne s’affichent pas." detail="Réessaie, ou retourne au programme." backHref="/programme" />;
}
