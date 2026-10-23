"use client";
import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";
export default function HermesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <DaRoot><main className="ui3-state"><div><h1 className="t-2">Le parcours Hermes ne répond pas</h1><p>Aucun contenu non vérifié n’est affiché.</p><button className="btn btn--p" onClick={reset}>Réessayer</button></div></main></DaRoot>; }
