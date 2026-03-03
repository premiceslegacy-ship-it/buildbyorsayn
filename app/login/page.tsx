import { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { LiquidCard } from "@/components/ui/liquid-glass-card";

export const metadata: Metadata = {
  title: "Connexion | BUILD",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0e0e0f]">
      {/* Logo en haut à gauche */}
      <div className="absolute top-8 left-8 z-20">
        <Logo layout="horizontal" />
      </div>

      {/* Halos ambiants de fond */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.08),transparent_70%)] blur-[40px] pointer-events-none opacity-50" />
      
      <div className="flex flex-col items-center space-y-12 relative z-10 w-full max-w-[400px]">
        <LiquidCard className="w-full p-8">
          <div className="flex flex-col space-y-8 relative z-10">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tightest text-[#f0ede8]">
                Accéder au système BUILD
              </h1>
            </div>

            <LoginForm />
          </div>
        </LiquidCard>
      </div>
    </main>
  );
}
