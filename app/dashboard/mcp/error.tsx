"use client";
import { DaRoot } from "@/components/da/DaRoot";
import "@/app/ui3.css";
export default function McpError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <DaRoot><main className="ui3-state"><div><h1 className="t-2">La connexion ne répond pas</h1><p>Aucun réglage n’a été modifié.</p><button className="btn btn--p" onClick={reset}>Réessayer</button></div></main></DaRoot>; }
