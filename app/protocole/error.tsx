"use client";

import { Ui4RouteError } from "@/components/ui4/Ui4RouteError";

export default function ProtocoleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Ui4RouteError error={error} reset={reset} title="Le protocole ne s’affiche pas." />;
}
