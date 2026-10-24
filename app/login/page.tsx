import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import { LoginForm } from "@/components/LoginForm";
import { PHASES } from "@/lib/siteWebAccompagnement";
import { sanitizeInternalRedirect } from "@/lib/safeRedirect";
import "@/app/ui3.css";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ mode?: string | string[] }> }): Promise<Metadata> {
  const { mode } = await searchParams;
  return { title: mode === "signup" ? "Créer ton compte | BUILD" : "Connexion | BUILD" };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ mode?: string | string[]; next?: string | string[]; phase?: string | string[] }> }) {
  const { mode, next, phase } = await searchParams;
  const safeBase = sanitizeInternalRedirect(next);
  const phaseValue = typeof phase === "string" ? phase : null;
  const safePhase = PHASES.some((item) => item.id === phaseValue) ? phaseValue : null;
  const redirectTo = safePhase && safeBase.startsWith("/accompagnement/espace") ? `${safeBase.split("#")[0]}#${safePhase}` : safeBase;

  return (
    <DaRoot>
      <main className="ui3-auth">
        <Link className="ui3-auth-logo" href="/" aria-label="BUILD, accueil"><Image src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} priority /></Link>
        <section className="ui3-auth-card" aria-label={mode === "signup" ? "Créer un compte" : "Se connecter"}><LoginForm initialMode={mode === "signup" ? "signup" : "login"} redirectTo={redirectTo} /></section>
      </main>
    </DaRoot>
  );
}
