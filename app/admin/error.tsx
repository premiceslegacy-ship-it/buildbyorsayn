"use client";

import { AlertCircle } from "lucide-react";
import { DaRoot } from "@/components/da/DaRoot";
import { playAppSound } from "@/lib/ui/sound";
import "./admin.css";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <DaRoot className="adm-root">
      <main className="adm-view">
        <section className="adm-empty-card" role="alert">
          <AlertCircle aria-hidden="true" />
          <h1 className="t-2">L'administration ne répond pas</h1>
          <p>Aucune donnée ni aucun accès n'a été modifié. Tu peux relancer le chargement.</p>
          <button type="button" className="adm-primary-button" onClick={() => { void playAppSound("click"); reset(); }}>Réessayer</button>
        </section>
      </main>
    </DaRoot>
  );
}
