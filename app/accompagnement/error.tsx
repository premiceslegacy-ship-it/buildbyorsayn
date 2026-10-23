"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function AccompagnementError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { return <RouteErrorState error={error} reset={reset} title="L’accompagnement ne répond pas." detail="Ton accès n’a pas changé. Réessaie dans un instant." object="offre" />; }
