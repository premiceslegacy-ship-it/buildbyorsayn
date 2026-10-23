"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Aujourd’hui ne répond pas." detail="Ta progression est intacte. Réessaie dans un instant." />;
}
