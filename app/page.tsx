"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function SplashScreen() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Déclenche le fade out à 2.2 secondes
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2200);

    // Redirection après l'animation de fade out (0.5s plus tard)
    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 2700);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <main className={`relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0e0e0f] font-sans overflow-hidden ${isExiting ? 'animate-fade-out' : ''}`}>
      {/* Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay z-0" 
        style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')` }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center p-12 rounded-3xl">
        <Logo layout="vertical" animated={true} />
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-60 z-10">
        <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-accent w-1/2 animate-[pulse_2s_infinite]"></div>
        </div>
        <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">Initialisation du système</p>
      </div>
    </main>
  );
}
