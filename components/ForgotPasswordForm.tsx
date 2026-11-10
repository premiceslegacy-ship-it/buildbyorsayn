"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DaRoot } from "@/components/da/DaRoot";
import { createClient } from "@/lib/supabase/client";
import { playAppSound } from "@/lib/ui/sound";
import { authErrorMessage } from "@/lib/auth/errorMessage";
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
    try {
      const { error: sendError } = await createClient().auth.resetPasswordForEmail(email.trim());
      if (sendError) return fail(authErrorMessage(sendError, "recovery"));
      setStep("otp");
      void playAppSound("confirm");
    } catch (failure) {
      fail(authErrorMessage(failure, "recovery"));
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6,10}$/.test(otp)) return fail("Saisis le code complet reçu par e‑mail, sans oublier de chiffres.");
    setError("");
    setIsLoading(true);
    try {
      const { error: verifyError } = await createClient().auth.verifyOtp({ email: email.trim(), token: otp, type: "recovery" });
      if (verifyError) return fail(authErrorMessage(verifyError, "verify"));
      void playAppSound("confirm");
      router.push("/update-password");
    } catch (failure) {
      fail(authErrorMessage(failure, "verify"));
    } finally {
      setIsLoading(false);
    }
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
            <p className="ui3-auth-copy">Écris ton e‑mail. On t’envoie un code de vérification.</p>
            {error ? <p className="ui3-auth-alert ui3-auth-alert-error" role="alert">{error}</p> : null}
            <form className="ui3-auth-form" onSubmit={sendCode} noValidate>
              <label className="ui3-field" data-invalid={Boolean(error)}><span>E‑mail</span><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} autoComplete="username" inputMode="email" placeholder="toi@exemple.com" aria-invalid={Boolean(error)} /></label>
              <div className="ui3-auth-actions"><button className="btn btn--p" disabled={isLoading}>{isLoading ? "Envoi" : "Envoyer le code"}</button></div>
            </form>
          </> : <>
            <h1 id="recovery-title">Regarde ta boîte mail.</h1>
            <p className="ui3-auth-copy">Si un compte existe pour <strong>{email}</strong>, un code de vérification vient de partir. Recopie tous les chiffres du dernier code reçu.</p>
            {error ? <p className="ui3-auth-alert ui3-auth-alert-error" role="alert">{error}</p> : null}
            <form className="ui3-auth-form" onSubmit={verifyCode} noValidate>
              <label className="ui3-field ui3-code" data-invalid={Boolean(error)}><span>Code de vérification</span><input type="text" inputMode="numeric" pattern="[0-9]{6,10}" minLength={6} maxLength={10} autoComplete="one-time-code" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "")); setError(""); }} aria-invalid={Boolean(error)} /></label>
              <p className="ui3-hint">Regarde aussi dans tes courriers indésirables.</p>
              <div className="ui3-auth-actions"><button className="btn btn--p" disabled={isLoading}>{isLoading ? "Vérification" : "Vérifier le code"}</button><button className="ui3-text-link" type="button" data-sfx="select" onClick={() => { setStep("email"); setOtp(""); setError(""); }}>Changer l’adresse</button></div>
            </form>
          </>}
        </section>
      </main>
    </DaRoot>
  );
}
