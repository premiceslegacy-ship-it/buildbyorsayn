"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AccountIcon } from "@/components/account/AccountIcon";
import { PasswordInput } from "@/components/PasswordInput";
import { DaRoot } from "@/components/da/DaRoot";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage, needsPasswordRecovery } from "@/lib/auth/errorMessage";
import { initializePasswordSession } from "@/lib/auth/passwordSession";
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
  const [sessionState, setSessionState] = useState<"loading" | "ready" | "error">("loading");
  const initialization = useRef<Promise<void> | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    // Share initialization across Strict Mode effect replays: tokens are consumed once.
    initialization.current ??= initializePasswordSession(createClient(), new URL(window.location.href), () => {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    });
    void initialization.current.then(() => {
      if (active) setSessionState("ready");
    }, (failure: unknown) => {
      if (active) {
        setError(authErrorMessage(failure, "session"));
        setSessionState("error");
      }
    });
    return () => { active = false; };
  }, []);

  const fail = (message: string) => { setError(message); setIsLoading(false); void playAppSound("error"); };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sessionState !== "ready") return;
    const missing = rules.find((rule) => !rule.valid(password));
    if (missing) return fail("Ton mot de passe doit respecter toutes les règles.");
    if (password !== confirmation) return fail("Les deux mots de passe ne correspondent pas.");
    setError("");
    setIsLoading(true);
    try {
      const { error: updateError } = await createClient().auth.updateUser({ password });
      if (updateError) {
        if (needsPasswordRecovery(updateError)) setSessionState("error");
        return fail(authErrorMessage(updateError, "password"));
      }
      setDone(true);
      void playAppSound("confirm");
    } catch (failure) {
      fail(authErrorMessage(failure, "password"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DaRoot>
      <main className="ui3-auth">
        <Link className="ui3-auth-logo" href="/" aria-label="BUILD, accueil"><Image src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} priority /></Link>
        <section className="ui3-auth-card" aria-labelledby="password-title">
          <div className="ui3-auth-progress" role="img" aria-label={done ? "Terminé" : "Étape 3 sur 3"}><i className="is-done" /><i className="is-done" /><i className="is-current" /></div>
          {done ? <div className="ui3-auth-success" role="status"><span className="ui3-auth-success-mark"><AccountIcon name="check" /></span><h1 id="password-title">Mot de passe enregistré.</h1><p className="ui3-auth-copy">Ton mot de passe est prêt. Tu peux maintenant accéder à ton espace BUILD.</p><Link className="btn btn--p" href="/dashboard">Accéder à mon espace</Link></div> : <>
            <h1 id="password-title">Nouveau mot de passe.</h1>
            <p className="ui3-auth-copy">Choisis-en un que tu n’as jamais utilisé ailleurs.</p>
            {sessionState === "loading" ? <p role="status">Vérification de ton accès…</p> : null}
            {error ? <p className="ui3-auth-alert ui3-auth-alert-error" role="alert">{error}</p> : null}
            {sessionState === "error" ? <div className="ui3-auth-actions"><Link className="btn btn--p" href="/forgot-password">Demander un nouveau code</Link><Link className="ui3-text-link" href="/login">Retour à la connexion</Link></div> :
              <form className="ui3-auth-form" onSubmit={handleSubmit} noValidate>
                <div className="ui3-field" data-invalid={Boolean(error)}><label htmlFor="activation-password">Nouveau mot de passe</label><PasswordInput id="activation-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="new-password" aria-invalid={Boolean(error)} disabled={sessionState !== "ready" || isLoading} /></div>
                <div className="ui3-password-rules" aria-label="Règles du mot de passe">{rules.map((rule) => <span key={rule.label} className={rule.valid(password) ? "is-valid" : ""}><AccountIcon name="check" />{rule.label}</span>)}</div>
                <div className="ui3-field" data-invalid={Boolean(error)}><label htmlFor="activation-confirmation">Écris-le encore une fois</label><PasswordInput id="activation-confirmation" visibilityLabel="la confirmation du mot de passe" value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError(""); }} autoComplete="new-password" aria-invalid={Boolean(error)} disabled={sessionState !== "ready" || isLoading} /></div>
                <div className="ui3-auth-actions"><button className="btn btn--p" disabled={sessionState !== "ready" || isLoading}>{isLoading ? "Enregistrement" : "Enregistrer le mot de passe"}</button></div>
              </form>}
          </>}
        </section>
      </main>
    </DaRoot>
  );
}
