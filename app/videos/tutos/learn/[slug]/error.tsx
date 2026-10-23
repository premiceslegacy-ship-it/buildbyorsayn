"use client";

import { Ui4RouteError } from "@/components/ui4/Ui4RouteError";

export default function HermesLearningError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Ui4RouteError error={error} reset={reset} title="Ce chapitre pratique ne s’affiche pas." />;
}
