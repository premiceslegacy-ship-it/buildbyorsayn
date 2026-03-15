"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Renseigne ton nouveau mot de passe.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Le mot de passe doit contenir au moins une majuscule.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Le mot de passe doit contenir au moins une minuscule.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Le mot de passe doit contenir au moins un chiffre.");
      return;
    }
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Une erreur est survenue. Le code est peut-être expiré, recommence depuis le début.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
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
                Nouveau mot de passe
              </h1>
              <p className="text-[13px] text-white/40 leading-relaxed">
                Choisis un mot de passe sécurisé (8 caractères minimum).
              </p>
            </div>

            <form className="flex flex-col space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="password"
                  className="text-[13px] text-[#f0ede8]/60 uppercase tracking-[0.06em] font-medium"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {isLoading ? "Enregistrement…" : "Enregistrer le nouveau mot de passe"}
              </LiquidButton>
            </form>
          </div>
        </LiquidCard>
      </div>
    </main>
  );
}
