"use client";
import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function BlocError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorState error={error} reset={reset} title="Ce bloc ne s’ouvre pas." detail="Ta progression est intacte. Réessaie, ou retourne au programme." backHref="/programme" />;
}
