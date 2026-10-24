"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import { createClient } from "@/lib/supabase/client";
import { playAppSound } from "@/lib/ui/sound";
import "@/app/ui3.css";

type Step = "email" | "otp";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fail = (message: string) => { setError(message); setIsLoading(false); void playAppSound("error"); };

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return fail("Cette adresse e‑mail n’a pas l’air correcte.");
    setError("");
    setIsLoading(true);
    await createClient().auth.resetPasswordForEmail(email.trim());
    setIsLoading(false);
    setStep("otp");
    void playAppSound("confirm");
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.length !== 6) return fail("Saisis le code reçu par e‑mail : 6 chiffres.");
    setError("");
    setIsLoading(true);
    const { error: verifyError } = await createClient().auth.verifyOtp({ email: email.trim(), token: otp, type: "recovery" });
    if (verifyError) return fail("Code invalide ou expiré. Vérifie ton e‑mail et réessaie.");
    void playAppSound("confirm");
    router.push("/update-password");
  }

  return (
    <DaRoot>
      <main className="ui3-auth">
        <Link className="ui3-auth-logo" href="/" aria-label="BUILD, accueil"><Image src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} priority /></Link>
        <section className="ui3-auth-card" aria-labelledby="recovery-title">
          <div className="ui3-auth-progress" role="img" aria-label={step === "email" ? "Étape 1 sur 3" : "Étape 2 sur 3"}><i className="is-done" /><i className={step === "otp" ? "is-current" : ""} /><i /></div>
          {step === "email" ? <>
            <Link className="ui3-text-link" href="/login">Retour à la connexion</Link>
            <h1 id="recovery-title">Mot de passe oublié.</h1>
            <p className="ui3-auth-copy">Écris ton e‑mail. On t’envoie un code à 6 chiffres.</p>
            {error ? <p className="ui3-auth-alert ui3-auth-alert-error" role="alert">{error}</p> : null}
            <form className="ui3-auth-form" onSubmit={sendCode} noValidate>
              <label className="ui3-field" data-invalid={Boolean(error)}><span>E‑mail</span><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} autoComplete="username" inputMode="email" placeholder="toi@exemple.com" aria-invalid={Boolean(error)} /></label>
              <div className="ui3-auth-actions"><button className="btn btn--p" disabled={isLoading}>{isLoading ? "Envoi" : "Envoyer le code"}</button></div>
            </form>
          </> : <>
            <h1 id="recovery-title">Regarde ta boîte mail.</h1>
            <p className="ui3-auth-copy">Si un compte existe pour <strong>{email}</strong>, un code à 6 chiffres vient de partir.</p>
            {error ? <p className="ui3-auth-alert ui3-auth-alert-error" role="alert">{error}</p> : null}
            <form className="ui3-auth-form" onSubmit={verifyCode} noValidate>
              <label className="ui3-field ui3-code" data-invalid={Boolean(error)}><span>Code de vérification</span><input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "")); setError(""); }} placeholder="000000" aria-invalid={Boolean(error)} /></label>
              <p className="ui3-hint">Regarde aussi dans tes courriers indésirables.</p>
              <div className="ui3-auth-actions"><button className="btn btn--p" disabled={isLoading}>{isLoading ? "Vérification" : "Vérifier le code"}</button><button className="ui3-text-link" type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); void playAppSound("select"); }}>Changer l’adresse</button></div>
            </form>
          </>}
        </section>
      </main>
    </DaRoot>
  );
}
