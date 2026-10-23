"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function IntroError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="L’introduction ne s’affiche pas." detail="Réessaie, ou retourne au programme." backHref="/programme" />;
}
