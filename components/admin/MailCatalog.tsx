"use client";

import { useState } from "react";
import type { EmailCatalogEntry } from "@/lib/email/catalog";
import { MailPreview } from "./MailPreview";
import "./mail.css";

const families = [
  { id: "purchases", label: "Achats", match: (entry: EmailCatalogEntry) => entry.id.startsWith("purchase-") },
  { id: "account", label: "Compte", match: (entry: EmailCatalogEntry) => entry.id.startsWith("welcome") || entry.id.startsWith("upgrade-refused") || entry.id.startsWith("auth-") },
  { id: "broadcasts", label: "Diffusions", match: (entry: EmailCatalogEntry) => entry.id.startsWith("broadcast-") },
];

const compactNames: Record<string, string> = {
  "purchase-coffre": "Achat LE COFFRE",
  "purchase-fondations": "Achat Fondations",
  "purchase-upgrade": "Complément LE COFFRE",
  welcome: "Bienvenue",
  "upgrade-refused": "Complément refusé",
  "auth-confirm-signup": "Inscription",
  "auth-invite": "Invitation",
  "auth-recovery": "Mot de passe oublié",
  "auth-email-change": "Changement d'adresse",
  "broadcast-video": "Nouvelle vidéo",
  "broadcast-update": "Mise à jour",
};

/** Tous les e-mails que BUILD envoie, rendus par le gabarit unique, avec des données fictives. */
export function MailCatalog({ entries, from }: { entries: EmailCatalogEntry[]; from: string }) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");
  const [previewOpen, setPreviewOpen] = useState(false);
  const active = entries.find((entry) => entry.id === activeId) ?? entries[0];
  if (!active) return null;

  return (
    <section className="ml-root" aria-labelledby="mail-catalog-title">
      <header className="ml-head">
        <h2 id="mail-catalog-title">E-mails automatiques</h2>
        <p>Choisis un e-mail pour vérifier son rendu.</p>
      </header>
      <div className="ml-layout">
        <div className="ml-flow">
          {families.map((family) => {
            const familyEntries = entries.filter(family.match);
            if (!familyEntries.length) return null;
            return (
              <section className="ml-catalog-family" key={family.id} aria-labelledby={`mail-family-${family.id}`}>
                <h3 id={`mail-family-${family.id}`}>{family.label}</h3>
                <ul className="ml-catalog" aria-label={family.label}>
                  {familyEntries.map((entry) => (
                    <li key={entry.id}>
                      <button type="button" className="ml-catalog-item" aria-pressed={entry.id === active.id} onClick={() => setActiveId(entry.id)}>
                        <strong>{compactNames[entry.id] ?? entry.name}</strong>
                        <small>{entry.sender === "Supabase" ? "Supabase" : "BUILD"}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {entries.some((entry) => entry.sender === "Supabase") ? <p className="ml-catalog-note">Les e-mails Supabase se règlent dans Authentication, Emails.</p> : null}
        </div>
        <button type="button" className="ml-preview-trigger" onClick={() => setPreviewOpen(true)}>Aperçu</button>
        <aside className="ml-preview" aria-label="Aperçu de l'e-mail">
          <MailPreview subject={active.subject} html={active.html} text={active.text} from={from} />
        </aside>
      </div>
      {previewOpen ? (
        <div className="ml-preview-layer" role="presentation">
          <button type="button" className="adm-dialog-scrim" aria-label="Fermer l'aperçu" onClick={() => setPreviewOpen(false)} />
          <section className="ml-preview-sheet" role="dialog" aria-modal="true" aria-labelledby="catalog-preview-title">
            <div className="ml-preview-sheet-head">
              <h2 id="catalog-preview-title">Aperçu</h2>
              <button type="button" className="ml-picker-close" onClick={() => setPreviewOpen(false)}>Fermer</button>
            </div>
            <MailPreview subject={active.subject} html={active.html} text={active.text} from={from} />
          </section>
        </div>
      ) : null}
    </section>
  );
}
