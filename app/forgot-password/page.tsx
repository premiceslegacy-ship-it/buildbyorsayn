"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { createClient } from "@/lib/supabase/client";

type Step = "email" | "otp";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Renseigne ton adresse email.");
      return;
    }
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email);

    // Ne jamais confirmer si le compte existe (sécurité)
    setIsLoading(false);
    setStep("otp");
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Saisis le code à 6 chiffres reçu par email.");
      return;
    }
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    if (verifyError) {
      setError("Code invalide ou expiré. Vérifie ton email et réessaie.");
      setIsLoading(false);
      return;
    }

    router.push("/update-password");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0e0e0f]">
      <div className="absolute top-8 left-8 z-20">
        <Logo layout="horizontal" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.08),transparent_70%)] blur-[40px] pointer-events-none opacity-50" />

      <div className="relative z-10 w-full max-w-[400px]">
        <LiquidCard className="w-full p-8">
          <div className="flex flex-col space-y-8 relative z-10">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight text-[#f0ede8]">
                Mot de passe oublié
              </h1>
              <p className="text-[13px] text-white/40 leading-relaxed">
                {step === "email"
                  ? "Saisis ton email pour recevoir un code de vérification."
                  : `Un code à 6 chiffres a été envoyé à ${email}.`}
              </p>
            </div>

            {step === "email" ? (
              <form className="flex flex-col space-y-6" onSubmit={handleEmailSubmit} noValidate>
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[13px] text-[#f0ede8]/60 uppercase tracking-[0.06em] font-medium"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="builder@exemple.com"
                    className={`w-full bg-transparent border rounded-[10px] px-4 py-3 text-[15px] text-[#f0ede8] placeholder:text-[#f0ede8]/20 focus:outline-none transition-colors duration-200 ${
                      error
                        ? "border-red-500/50 focus:border-red-500/80"
                        : "border-white/10 focus:border-[#e8d5b0]/40"
                    }`}
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <LiquidButton type="submit" className="w-full" size="xl" disabled={isLoading}>
                  {isLoading ? "Envoi en cours…" : "Envoyer le code"}
                </LiquidButton>
              </form>
            ) : (
              <form className="flex flex-col space-y-6" onSubmit={handleOtpSubmit} noValidate>
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-[13px] text-[#f0ede8]/60 uppercase tracking-[0.06em] font-medium"
                  >
                    Code de vérification
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className={`w-full bg-transparent border rounded-[10px] px-4 py-3 text-[20px] text-[#f0ede8] placeholder:text-[#f0ede8]/20 focus:outline-none transition-colors duration-200 tracking-[0.4em] text-center font-mono ${
                      error
                        ? "border-red-500/50 focus:border-red-500/80"
                        : "border-white/10 focus:border-[#e8d5b0]/40"
                    }`}
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <LiquidButton type="submit" className="w-full" size="xl" disabled={isLoading}>
                  {isLoading ? "Vérification…" : "Vérifier le code"}
                </LiquidButton>

                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                  className="text-center text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200"
                >
                  Renvoyer le code
                </button>
              </form>
            )}

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </LiquidCard>
      </div>
    </main>
  );
}
