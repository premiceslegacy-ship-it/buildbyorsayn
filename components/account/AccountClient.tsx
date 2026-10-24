"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { playAppSound } from "@/lib/ui/sound";
import { ToolLogo } from "@/components/ToolLogo";
import { AccountIcon } from "./AccountIcon";
import { UpgradeCard } from "./UpgradeCard";
import { accountIncludedItems, accountTierLabel } from "./accountPresentation";
import styles from "./AccountClient.module.css";

type Section = "profile" | "email" | "password" | "subscription" | "connections" | "devices";
type Notice = { tone: "success" | "error"; text: string } | null;

const SECTION_IDS: Section[] = ["profile", "email", "password", "subscription", "connections", "devices"];

function passwordError(password: string) {
  if (password.length < 8) return "Utilise au moins 8 caractères.";
  if (!/[A-Z]/.test(password)) return "Ajoute au moins une majuscule.";
  if (!/[a-z]/.test(password)) return "Ajoute au moins une minuscule.";
  if (!/[0-9]/.test(password)) return "Ajoute au moins un chiffre.";
  return "";
}

export function AccountClient({
  initialName,
  email,
  tier,
  connectionStatus,
}: {
  initialName: string;
  email: string;
  tier: string | null;
  connectionStatus: "connected" | "disconnected" | "unknown";
}) {
  const [section, setSection] = useState<Section | null>(null);
  const [name, setName] = useState(initialName);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [confirmEverywhere, setConfirmEverywhere] = useState(false);

  useEffect(() => {
    const readHash = () => {
      const candidate = window.location.hash.slice(1) as Section;
      setSection(SECTION_IDS.includes(candidate) ? candidate : null);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const rows = useMemo(() => [
    { id: "profile" as const, icon: "user" as const, label: "Profil", value: name },
    { id: "email" as const, icon: "mail" as const, label: "E‑mail", value: email },
    { id: "password" as const, icon: "key" as const, label: "Mot de passe", value: "••••••••" },
    { id: "subscription" as const, icon: "card" as const, label: "Abonnement", value: accountTierLabel(tier) },
    { id: "connections" as const, icon: "plug" as const, label: "Connexions", value: connectionStatus === "connected" ? "Active" : connectionStatus === "disconnected" ? "À configurer" : "Indisponible" },
    { id: "devices" as const, icon: "devices" as const, label: "Appareils", value: "Cette session" },
  ], [connectionStatus, email, name, tier]);

  const activeSection = section ?? "profile";

  const select = (id: Section) => {
    setSection(id);
    setNotice(null);
    window.history.pushState(null, "", `#${id}`);
  };

  const finish = (next: Notice) => {
    setBusy(false);
    setNotice(next);
    void playAppSound(next?.tone === "success" ? "confirm" : "error");
  };

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return finish({ tone: "error", text: "Écris ton prénom." });
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ data: { first_name: trimmed } });
    finish(error ? { tone: "error", text: "Le prénom n’a pas pu être enregistré. Réessaie." } : { tone: "success", text: "Prénom enregistré." });
  }

  async function saveEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextEmail = String(form.get("email") ?? "").trim();
    if (!/^\S+@\S+\.\S+$/.test(nextEmail)) return finish({ tone: "error", text: "Cette adresse e‑mail n’a pas l’air correcte." });
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ email: nextEmail });
    finish(error ? { tone: "error", text: "L’adresse n’a pas pu être modifiée. Réessaie." } : { tone: "success", text: "Regarde tes e‑mails pour confirmer la nouvelle adresse." });
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    const invalid = passwordError(password);
    if (invalid) return finish({ tone: "error", text: invalid });
    if (password !== confirmation) return finish({ tone: "error", text: "Les deux mots de passe ne correspondent pas." });
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    finish(error ? { tone: "error", text: "Le mot de passe n’a pas pu être modifié. Réessaie." } : { tone: "success", text: "Mot de passe changé." });
  }

  async function signOutEverywhere() {
    if (!confirmEverywhere) {
      setConfirmEverywhere(true);
      void playAppSound("open");
      return;
    }
    setBusy(true);
    const { error } = await createClient().auth.signOut({ scope: "others" });
    setConfirmEverywhere(false);
    finish(error ? { tone: "error", text: "La déconnexion a échoué. Réessaie." } : { tone: "success", text: "Les autres sessions ont été déconnectées." });
  }

  const included = accountIncludedItems(tier);

  return (
    <main className="ui3-account">
      <header className={`ui3-account-head ${styles.head}`}><h1 className="t-1">Compte</h1><p className="t-meta">{email}</p></header>
      <div className="ui3-account-grid" data-section={section ?? ""}>
        <nav className="ui3-settings" aria-label="Réglages du compte">
          <div className="ui3-settings-group">
            {rows.slice(0, 3).map((row) => <SettingRow key={row.id} {...row} active={activeSection === row.id} onSelect={select} />)}
          </div>
          <div className="ui3-settings-group">
            {rows.slice(3, 5).map((row) => <SettingRow key={row.id} {...row} active={activeSection === row.id} onSelect={select} />)}
          </div>
          <div className="ui3-settings-group"><SettingRow {...rows[5]} active={activeSection === "devices"} onSelect={select} /></div>
          <div className="ui3-settings-group">
            <form action="/api/signout" method="post"><button className="ui3-setting ui3-setting-danger" type="submit"><span className="ui3-setting-icon"><AccountIcon name="logout" /></span><span>Se déconnecter</span></button></form>
          </div>
        </nav>

        <section className={`ui3-account-pane ${styles.pane}`} aria-live="polite">
          <button className="ui3-back" type="button" data-sfx="select" onClick={() => { setSection(null); setNotice(null); window.history.pushState(null, "", window.location.pathname); }}>Compte</button>
          {notice ? <p className={`ui3-notice ui3-notice-${notice.tone}`} role={notice.tone === "error" ? "alert" : "status"}>{notice.text}</p> : null}

          {activeSection === "profile" ? <div className="ui3-pane-section"><h2>Profil</h2><form className="ui3-form" onSubmit={saveProfile}><label>Prénom<input name="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} autoComplete="given-name" /></label><p className="ui3-hint">C’est le prénom affiché dans BUILD et dans les e‑mails que tu reçois.</p><button className="btn btn--p" disabled={busy}>{busy ? "Enregistrement" : "Enregistrer"}</button></form></div> : null}

          {activeSection === "email" ? <div className="ui3-pane-section"><h2>E‑mail</h2><p>Ton adresse actuelle : <strong>{email}</strong></p><form className="ui3-form" onSubmit={saveEmail}><label>Nouvelle adresse<input name="email" type="email" autoComplete="email" placeholder="toi@exemple.com" /></label><p className="ui3-hint">Supabase envoie les confirmations nécessaires. L’adresse ne change qu’après validation.</p><button className="btn btn--p" disabled={busy}>{busy ? "Envoi" : "Changer mon e‑mail"}</button></form></div> : null}

          {activeSection === "password" ? <div className="ui3-pane-section"><h2>Mot de passe</h2><form className="ui3-form" onSubmit={savePassword}><label>Nouveau mot de passe<input name="password" type="password" autoComplete="new-password" /></label><p className="ui3-hint">Au moins 8 caractères, une majuscule, une minuscule et un chiffre.</p><label>Écris-le encore une fois<input name="confirmation" type="password" autoComplete="new-password" /></label><button className="btn btn--p" disabled={busy}>{busy ? "Enregistrement" : "Changer le mot de passe"}</button></form><Link className="ui3-text-link" href="/forgot-password">Mot de passe oublié ?</Link></div> : null}

          {activeSection === "subscription" ? <div className="ui3-pane-section"><h2>Abonnement</h2><article className="ui3-subscription"><h3>{accountTierLabel(tier)}</h3><ul>{included.map((item) => <li key={item}><AccountIcon name="check" />{item}</li>)}</ul><Link className="btn btn--g" href="/checkout">Voir ce qui est inclus</Link></article><UpgradeCard tier={tier} /></div> : null}

          {activeSection === "connections" ? <div className="ui3-pane-section"><h2>Connexions</h2><p>Relie ton assistant à BUILD pour retrouver uniquement les contenus inclus dans ton accès.</p><div className="ui3-connection"><span className={`ui3-logo-row ${styles.logos}`} aria-label="Claude, ChatGPT, Hermes, Oh My Pi et Cursor">{["Claude", "ChatGPT", "Hermes Agent", "Oh My Pi", "Cursor"].map((tool) => <span key={tool}><ToolLogo name={tool} size={104} /></span>)}</span><strong>{connectionStatus === "connected" ? "Connexion active" : connectionStatus === "disconnected" ? "À configurer" : "Vérification indisponible"}</strong></div><Link className="btn btn--p" href="/dashboard/mcp">Gérer la connexion</Link></div> : null}

          {activeSection === "devices" ? <div className="ui3-pane-section"><h2>Appareils</h2><p>Supabase ne fournit pas la liste fiable des appareils dans ce produit. Tu peux toutefois couper toutes les autres sessions.</p><div className="ui3-device"><span className="ui3-setting-icon"><AccountIcon name="devices" /></span><span><strong>Cette session</strong><small>L’appareil que tu utilises maintenant</small></span></div><button className={confirmEverywhere ? "btn ui3-danger-button" : "btn btn--g"} type="button" disabled={busy} onClick={signOutEverywhere}>{busy ? "Déconnexion" : confirmEverywhere ? "Confirmer la déconnexion partout" : "Se déconnecter partout"}</button>{confirmEverywhere ? <button className="ui3-text-link" type="button" onClick={() => setConfirmEverywhere(false)}>Annuler</button> : null}</div> : null}
        </section>
      </div>
      <footer className="foot"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
    </main>
  );
}

function SettingRow({ id, icon, label, value, active, onSelect }: { id: Section; icon: "user" | "mail" | "key" | "card" | "plug" | "devices"; label: string; value: string; active: boolean; onSelect: (id: Section) => void }) {
  return <button type="button" className={`ui3-setting${active ? " is-active" : ""}`} onClick={() => onSelect(id)} aria-current={active ? "page" : undefined}><span className="ui3-setting-icon"><AccountIcon name={icon} /></span><span className="ui3-setting-label">{label}</span><small>{value}</small><AccountIcon name="chevron" /></button>;
}
