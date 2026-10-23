"use client";

import { DaRoot } from "@/components/da/DaRoot";
import { RouteState } from "@/components/ui5/RouteState";

export default function ErrorPage({ error }: { error: Error & { digest?: string }; retry: () => void }) {
  void error;
  return <DaRoot className="da-app"><RouteState code="Erreur" title="BUILD ne répond pas." message="Rien n’a été modifié. Tu peux revenir à ton point de départ." /></DaRoot>;
}
