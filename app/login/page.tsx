import { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { LiquidCard } from "@/components/ui/liquid-glass-card";

export const metadata: Metadata = {
  title: "Connexion | BUILD",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#0e0e0f]">
      {/* Logo en haut à gauche */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
        <Logo layout="horizontal" />
      </div>

      {/* Halos ambiants de fond */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.08),transparent_70%)] blur-[40px] pointer-events-none opacity-50 max-w-[100vw]" />
      
      <div className="flex flex-col items-center space-y-8 sm:space-y-12 relative z-10 w-full max-w-[400px]">
        <LiquidCard className="w-full p-6 sm:p-8">
          <div className="flex flex-col space-y-8 relative z-10">
            <LoginForm />
          </div>
        </LiquidCard>
      </div>
    </main>
  );
}
