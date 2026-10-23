"use client";
import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";
export default function AccountError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <DaRoot><main className="ui3-state"><div><h1 className="t-2">Ton compte ne répond pas</h1><p>Aucune donnée n’a été modifiée.</p><button className="btn btn--p" onClick={reset}>Réessayer</button></div></main></DaRoot>; }
