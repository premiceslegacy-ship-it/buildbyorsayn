"use client";

import { useState } from "react";
import { AlertCircle, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [errors, setErrors] = useState({ email: "", password: "", auth: "" });
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let newErrors = { email: "", password: "", auth: "" };
    let hasError = false;

    if (!email) {
      newErrors.email = "L'identifiant est requis pour accéder au système.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Le format de l'identifiant est invalide.";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Le code d'accès est manquant.";
      hasError = true;
    } else if (isSignup && password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
      hasError = true;
    }

    setErrors(newErrors);
    setInfo("");
    if (hasError) return;

    setIsLoading(true);
    const supabase = createClient();

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("[signUp] Supabase error:", error.message);
        const msg =
          error.message.includes("already registered") || error.message.includes("user_already_exists")
            ? "Un compte existe déjà avec cet email. Connecte-toi."
            : error.message.includes("disabled") || error.message.includes("not allowed")
            ? "Les inscriptions sont désactivées. Contacte l'administrateur."
            : error.message.includes("rate limit") || error.message.includes("too many")
            ? "Trop de tentatives. Réessaie dans quelques minutes."
            : error.message.includes("weak") || error.message.includes("characters")
            ? "Mot de passe trop faible. Utilise au moins 8 caractères."
            : `Erreur : ${error.message}`;
        setErrors((prev) => ({ ...prev, auth: msg }));
        setIsLoading(false);
        return;
      }
      // Email confirmation required: session is null but no error
      if (!data.session) {
        setIsLoading(false);
        setInfo("Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse avant de te connecter.");
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrors((prev) => ({
          ...prev,
          auth: "Identifiants incorrects. Vérifie tes accès et réessaie.",
        }));
        setIsLoading(false);
        return;
      }
    }

    router.push("/dashboard");
  };

  const switchMode = () => {
    setMode(isSignup ? "login" : "signup");
    setErrors({ email: "", password: "", auth: "" });
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tightest text-[#f0ede8]">
          {isSignup ? "Créer ton compte" : "Accéder au système BUILD"}
        </h1>
      </div>

      <form className="flex flex-col space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="email"
              className="text-[13px] text-[#f0ede8]/60 uppercase tracking-[0.06em] font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="builder@exemple.com"
              className={`w-full bg-transparent border rounded-[10px] px-4 py-3 text-[15px] text-[#f0ede8] placeholder:text-[#f0ede8]/20 focus:outline-none transition-colors duration-200 ${errors.email
                ? "border-red-500/50 focus:border-red-500/80"
                : "border-white/10 focus:border-[#e8d5b0]/40"
                }`}
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-1 animate-fade-in">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="password"
              className="text-[13px] text-[#f0ede8]/60 uppercase tracking-[0.06em] font-medium"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={`w-full bg-transparent border rounded-[10px] px-4 py-3 text-[15px] text-[#f0ede8] placeholder:text-[#f0ede8]/20 focus:outline-none transition-colors duration-200 ${errors.password
                ? "border-red-500/50 focus:border-red-500/80"
                : "border-white/10 focus:border-[#e8d5b0]/40"
                }`}
            />
            {errors.password && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-1 animate-fade-in">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>
        </div>

        {errors.auth && (
          <div className="flex items-center gap-2 text-red-400 text-xs animate-fade-in">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errors.auth}</span>
          </div>
        )}

        {info && (
          <div className="flex items-start gap-2 text-[#e8d5b0]/80 text-xs animate-fade-in bg-[#e8d5b0]/5 border border-[#e8d5b0]/15 rounded-lg px-3 py-2.5">
            <MailCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{info}</span>
          </div>
        )}

        <LiquidButton
          type="submit"
          className="w-full"
          size="xl"
          disabled={isLoading}
        >
          {isLoading
            ? isSignup ? "Création en cours…" : "Connexion en cours…"
            : isSignup ? "Créer mon compte" : "Continuer"}
        </LiquidButton>

        <p className="text-center text-[13px] text-[#f0ede8]/40">
          {isSignup ? "Déjà un compte ?" : "Pas encore membre ?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="text-[#e8d5b0]/70 hover:text-[#e8d5b0] transition-colors duration-200 underline underline-offset-2 cursor-pointer"
          >
            {isSignup ? "Se connecter" : "Créer un compte"}
          </button>
        </p>
      </form>
    </>
  );
}
