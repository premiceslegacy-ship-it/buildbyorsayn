"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AccountIcon } from "@/components/account/AccountIcon";
import { createClient } from "@/lib/supabase/client";
import { sanitizeInternalRedirect } from "@/lib/safeRedirect";
import { playAppSound } from "@/lib/ui/sound";

type Mode = "login" | "signup";
type Errors = { email: string; password: string; auth: string };
const EMPTY_ERRORS: Errors = { email: "", password: "", auth: "" };

function signupPasswordError(password: string) {
  if (password.length < 8) return "Utilise au moins 8 caractères.";
  if (!/[A-Z]/.test(password)) return "Ajoute au moins une majuscule.";
  if (!/[a-z]/.test(password)) return "Ajoute au moins une minuscule.";
  if (!/[0-9]/.test(password)) return "Ajoute au moins un chiffre.";
  return "";
}

export function LoginForm({ initialMode = "login", redirectTo = "/dashboard" }: { initialMode?: Mode; redirectTo?: string }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [errors, setErrors] = useState<Errors>(EMPTY_ERRORS);
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSignup = mode === "signup";

  const reportError = (next: Errors) => {
    setErrors(next);
    void playAppSound("error");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = { ...EMPTY_ERRORS };
    if (!email) next.email = "Écris ton adresse e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Cette adresse e-mail n’a pas l’air correcte.";
    if (!password) next.password = "Écris ton mot de passe.";
    else if (isSignup) next.password = signupPasswordError(password);
    if (next.email || next.password) return reportError(next);

    setErrors(EMPTY_ERRORS);
    setInfo("");
    setIsLoading(true);
    const supabase = createClient();

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          const auth = error.message.includes("already registered") || error.message.includes("user_already_exists")
            ? "Un compte existe déjà avec cet e-mail. Connecte-toi."
            : error.message.includes("disabled") || error.message.includes("not allowed")
              ? "Les inscriptions sont désactivées. Contacte l’administrateur."
              : error.message.includes("rate limit") || error.message.includes("too many")
                ? "Trop de tentatives. Réessaie dans quelques minutes."
                : "La création du compte a échoué. Réessaie.";
          setIsLoading(false);
          return reportError({ ...EMPTY_ERRORS, auth });
        }
        if (!data.session) {
          setIsLoading(false);
          setInfo("Compte créé. Regarde ta boîte mail pour confirmer ton adresse avant de te connecter.");
          void playAppSound("confirm");
          return;
        }
      } else {
        await supabase.auth.signOut({ scope: "local" });
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const auth = error.message.includes("Email not confirmed")
            ? "Ton adresse e-mail n’est pas encore confirmée. Regarde ta boîte mail."
            : error.message.includes("rate limit") || error.message.includes("too many")
              ? "Trop de tentatives. Réessaie dans quelques minutes."
              : "E-mail ou mot de passe incorrect.";
          setIsLoading(false);
          return reportError({ ...EMPTY_ERRORS, auth });
        }
      }
      void playAppSound("confirm");
      window.location.href = sanitizeInternalRedirect(redirectTo);
    } catch {
      setIsLoading(false);
      reportError({ ...EMPTY_ERRORS, auth: "Erreur réseau. Vérifie ta connexion et réessaie." });
    }
  }

  function switchMode() {
    setMode(isSignup ? "login" : "signup");
    setErrors(EMPTY_ERRORS);
    setInfo("");
    void playAppSound("select");
  }

  return (
    <>
      <h1>{isSignup ? "Crée ton compte." : "Connecte-toi à BUILD."}</h1>
      {errors.auth ? <p className="ui3-auth-alert ui3-auth-alert-error" role="alert">{errors.auth}</p> : null}
      {info ? <p className="ui3-auth-alert ui3-auth-alert-success" role="status">{info}</p> : null}
      <form className="ui3-auth-form" onSubmit={handleSubmit} noValidate>
        <label className="ui3-field" data-invalid={Boolean(errors.email)}>
          <span>E-mail</span>
          <input name="email" type="email" autoComplete="username" inputMode="email" placeholder="toi@exemple.com" aria-invalid={Boolean(errors.email)} />
          {errors.email ? <span className="ui3-field-error"><AccountIcon name="mail" />{errors.email}</span> : null}
        </label>
        <label className="ui3-field" data-invalid={Boolean(errors.password)}>
          <span className="ui3-field-head"><span>Mot de passe</span>{!isSignup ? <Link href="/forgot-password">Mot de passe oublié ?</Link> : null}</span>
          <input name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} aria-invalid={Boolean(errors.password)} />
          {isSignup ? <span className="ui3-password-rules">8 caractères, une majuscule, une minuscule et un chiffre.</span> : null}
          {errors.password ? <span className="ui3-field-error"><AccountIcon name="key" />{errors.password}</span> : null}
        </label>
        <div className="ui3-auth-actions"><button className="btn btn--p" type="submit" disabled={isLoading}>{isLoading ? (isSignup ? "Création" : "Connexion") : (isSignup ? "Créer mon compte" : "Se connecter")}</button></div>
      </form>
      <p className="ui3-auth-switch">{isSignup ? "Tu as déjà un compte ?" : "Tu n’as pas encore de compte ?"}<button type="button" onClick={switchMode}>{isSignup ? "Se connecter" : "Créer un compte"}</button></p>
    </>
  );
}
