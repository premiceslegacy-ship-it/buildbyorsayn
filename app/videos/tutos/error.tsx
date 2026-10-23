"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function HermesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { return <RouteErrorState error={error} reset={reset} title="Le parcours Hermes ne répond pas." detail="Aucun contenu incertain n’est affiché. Réessaie." />; }
