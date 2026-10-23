"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function McpError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { return <RouteErrorState error={error} reset={reset} title="La connexion ne répond pas." detail="Aucun réglage n’a été modifié. Réessaie." object="offre" />; }
