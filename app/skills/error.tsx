"use client";

import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";

export default function SkillsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <DaRoot><main className="ui3-state"><div><h1 className="t-2">Les skills ne répondent pas</h1><p>Ton accès n’a pas été modifié. Réessaie dans un instant.</p><button className="btn btn--p" type="button" onClick={reset}>Réessayer</button></div></main></DaRoot>;
}
