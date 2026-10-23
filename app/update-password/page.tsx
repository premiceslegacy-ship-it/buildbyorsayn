"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { AccountIcon } from "@/components/account/AccountIcon";
import { DaRoot } from "@/components/da/DaRoot";
import { createClient } from "@/lib/supabase/client";
import { playAppSound } from "@/lib/ui/sound";
import "@/app/ui3.css";

const rules = [
  { label: "8 caractères", valid: (value: string) => value.length >= 8 },
  { label: "Une majuscule", valid: (value: string) => /[A-Z]/.test(value) },
  { label: "Une minuscule", valid: (value: string) => /[a-z]/.test(value) },
  { label: "Un chiffre", valid: (value: string) => /[0-9]/.test(value) },
];

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const fail = (message: string) => { setError(message); setIsLoading(false); void playAppSound("error"); };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = rules.find((rule) => !rule.valid(password));
    if (missing) return fail("Ton mot de passe doit respecter toutes les règles.");
    if (password !== confirmation) return fail("Les deux mots de passe ne correspondent pas.");
    setError("");
    setIsLoading(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    if (updateError) {
      const same = updateError.message.includes("same_password") || updateError.message.includes("different from the old password");
      return fail(same ? "Ce mot de passe est identique à l’ancien. Choisis-en un autre." : "Le code est peut-être expiré. Recommence depuis le début.");
    }
    setIsLoading(false);
    setDone(true);
    void playAppSound("confirm");
  }

  return (
    <DaRoot>
      <main className="ui3-auth">
        <Link className="ui3-auth-logo" href="/" aria-label="BUILD, accueil"><Image src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} priority /></Link>
        <section className="ui3-auth-card" aria-labelledby="password-title">
          <div className="ui3-auth-progress" role="img" aria-label={done ? "Terminé" : "Étape 3 sur 3"}><i className="is-done" /><i className="is-done" /><i className="is-current" /></div>
          {done ? <div className="ui3-auth-success" role="status"><span className="ui3-auth-success-mark"><AccountIcon name="check" /></span><h1 id="password-title">Mot de passe changé.</h1><p className="ui3-auth-copy">Tu peux te connecter avec ton nouveau mot de passe.</p><Link className="btn btn--p" href="/login">Me connecter</Link></div> : <>
            <h1 id="password-title">Nouveau mot de passe.</h1>
            <p className="ui3-auth-copy">Choisis-en un que tu n’as jamais utilisé ailleurs.</p>
            {error ? <p className="ui3-auth-alert ui3-auth-alert-error" role="alert">{error}</p> : null}
            <form className="ui3-auth-form" onSubmit={handleSubmit} noValidate>
              <label className="ui3-field" data-invalid={Boolean(error)}><span>Nouveau mot de passe</span><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="new-password" aria-invalid={Boolean(error)} /></label>
              <div className="ui3-password-rules" aria-label="Règles du mot de passe">{rules.map((rule) => <span key={rule.label} className={rule.valid(password) ? "is-valid" : ""}><AccountIcon name="check" />{rule.label}</span>)}</div>
              <label className="ui3-field" data-invalid={Boolean(error)}><span>Écris-le encore une fois</span><input type="password" value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError(""); }} autoComplete="new-password" aria-invalid={Boolean(error)} /></label>
              <div className="ui3-auth-actions"><button className="btn btn--p" disabled={isLoading}>{isLoading ? "Enregistrement" : "Enregistrer le mot de passe"}</button></div>
            </form>
          </>}
        </section>
      </main>
    </DaRoot>
  );
}
