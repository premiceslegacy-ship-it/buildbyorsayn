"use client";

import { DaRoot } from "@/components/da/DaRoot";
import { RouteState } from "@/components/ui5/RouteState";

export default function GlobalError({ error }: { error: Error & { digest?: string }; retry: () => void }) {
  void error;
  return <html lang="fr"><head><title>Erreur | BUILD</title></head><body style={{ margin: 0, background: "#050806" }}><DaRoot className="da-app"><RouteState code="Erreur" title="BUILD s’est arrêté." message="Rien n’a été modifié. Reviens à ton espace pour continuer." /></DaRoot></body></html>;
}
