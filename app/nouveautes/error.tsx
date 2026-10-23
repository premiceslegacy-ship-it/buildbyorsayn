"use client";

import { DaRoot } from "@/components/da/DaRoot";

export default function NouveautesError({ reset }: { reset: () => void }) {
  return <DaRoot className="da-app"><main className="page-state"><div className="page-state__in"><h1 className="t-1">Les nouveautés ne s'affichent pas.</h1><p>Réessaie dans un instant.</p><button className="btn btn--p" type="button" onClick={reset}>Réessayer</button></div></main></DaRoot>;
}
