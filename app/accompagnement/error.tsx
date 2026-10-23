"use client";
import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";
export default function AccompagnementError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <DaRoot><main className="ui3-state"><div><h1 className="t-2">L’accompagnement ne répond pas</h1><p>Ton accès n’a pas été modifié.</p><button className="btn btn--p" onClick={reset}>Réessayer</button></div></main></DaRoot>; }
