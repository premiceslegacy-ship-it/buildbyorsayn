import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { resolveMcpStartDecision } from "@/lib/mcp/startDestination";

export default async function McpStartPage() {
  const connectorVisible =
    process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true" ||
    process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let tier: string | null = null;
  let lookupFailed = false;
  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .maybeSingle();
    tier = profile?.tier ?? null;
    lookupFailed = Boolean(error);
  }

  const decision = resolveMcpStartDecision({
    connectorVisible,
    authenticated: Boolean(user),
    tier,
    lookupFailed,
  });

  if (decision.kind === "redirect") redirect(decision.destination);

  return (
    <main className="min-h-screen bg-[#0e0e0f] px-5 py-8 text-[#f0ede8] sm:px-8">
      <Link href="/" aria-label="Retour à l'accueil BUILD">
        <Logo layout="horizontal" className="h-6" />
      </Link>
      <section className="mx-auto max-w-xl py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9b48a]">
          Connexion MCP
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Impossible de vérifier ton accès
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/55">
          Ton accès BUILD n&apos;a pas pu être confirmé. Réessaie dans un instant avant de choisir une offre.
        </p>
        <Link
          href="/mcp/start"
          className="mt-7 inline-flex rounded-md border border-[#e8d5b0]/40 px-4 py-3 text-sm font-semibold text-[#e8d5b0] hover:bg-[#e8d5b0]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
        >
          Réessayer
        </Link>
      </section>
    </main>
  );
}
