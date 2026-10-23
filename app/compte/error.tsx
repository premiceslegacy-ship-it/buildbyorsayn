"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function AccountError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { return <RouteErrorState error={error} reset={reset} title="Ton compte ne répond pas." detail="Aucune donnée n’a été modifiée. Réessaie." object="offre" />; }
