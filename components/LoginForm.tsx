"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let newErrors = { email: "", password: "" };
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
    }

    setErrors(newErrors);

    if (!hasError) {
      // Simulation de la validation de connexion (Mock-First)
      router.push('/intro');
    }
  };

  return (
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
            className={`w-full bg-transparent border rounded-[10px] px-4 py-3 text-[15px] text-[#f0ede8] placeholder:text-[#f0ede8]/20 focus:outline-none transition-colors duration-200 ${
              errors.email 
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
            className={`w-full bg-transparent border rounded-[10px] px-4 py-3 text-[15px] text-[#f0ede8] placeholder:text-[#f0ede8]/20 focus:outline-none transition-colors duration-200 ${
              errors.password 
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

      <LiquidButton
        type="submit"
        className="w-full"
        size="xl"
      >
        Continuer
      </LiquidButton>
    </form>
  );
}
