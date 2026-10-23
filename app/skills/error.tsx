"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function SkillsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Les skills ne répondent pas." detail="Ton accès n’a pas changé. Réessaie dans un instant." object="livraison" />;
}
