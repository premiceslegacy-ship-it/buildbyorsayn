"use client";

import { useState } from "react";
import type { EmailCatalogEntry } from "@/lib/email/catalog";
import { MailPreview } from "./MailPreview";
import "./mail.css";

/** Tous les e-mails que BUILD envoie, rendus par le gabarit unique, avec des données fictives. */
export function MailCatalog({ entries, from }: { entries: EmailCatalogEntry[]; from: string }) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");
  const active = entries.find((entry) => entry.id === activeId) ?? entries[0];
  if (!active) return null;

  return (
    <section className="ml-root" aria-labelledby="mail-catalog-title">
      <header className="ml-head">
        <h2 id="mail-catalog-title">Les e-mails de BUILD</h2>
        <p>Chaque e-mail est généré par le même gabarit que celui qui part vraiment. Les noms, montants et liens de l'aperçu sont fictifs et rien n'est envoyé.</p>
      </header>
      <div className="ml-layout">
        <div className="ml-flow">
          <ul className="ml-catalog" aria-label="E-mails">
            {entries.map((entry) => (
              <li key={entry.id}>
                <button type="button" className="ml-catalog-item" aria-pressed={entry.id === active.id} onClick={() => setActiveId(entry.id)}>
                  <strong>{entry.name}</strong>
                  <span>{entry.trigger}</span>
                  <small>{entry.sender === "Supabase" ? "Envoyé par Supabase" : "Envoyé par BUILD"}</small>
                </button>
              </li>
            ))}
          </ul>
          {entries.some((entry) => entry.sender === "Supabase") ? (
            <p className="ml-note">Les e-mails envoyés par Supabase se règlent dans Supabase, Authentication, Emails. Le gabarit à y coller est dans supabase/email-templates.</p>
          ) : null}
        </div>
        <aside className="ml-preview" aria-label="Aperçu de l'e-mail">
          <MailPreview subject={active.subject} html={active.html} text={active.text} from={from} />
        </aside>
      </div>
    </section>
  );
}
