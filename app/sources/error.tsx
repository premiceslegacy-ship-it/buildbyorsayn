"use client";

import { Ui4RouteError } from "@/components/ui4/Ui4RouteError";

export default function SourcesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Ui4RouteError error={error} reset={reset} title="Les sources ne s’affichent pas." />;
}
