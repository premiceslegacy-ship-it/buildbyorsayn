import Link from "next/link";
import { redirect } from "next/navigation";
import { DaRoot } from "@/components/da/DaRoot";
import "@/app/da-mcp.css";
import { createClient } from "@/lib/supabase/server";
import { resolveMcpStartDecision } from "@/lib/mcp/startDestination";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import "@/app/ui3.css";

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
    tier = normalizeProfileTier(profile?.tier ?? null);
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
    <DaRoot>
      <main className="ui3-state">
        <section className="ui3-access-card" aria-labelledby="mx-title">
          <Link href="/" aria-label="Retour à l'accueil BUILD">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/da/logo-sombre.svg" alt="BUILD" width={104} height={30} />
          </Link>
          <div>
            <p className="mx-step">Connexion de ton assistant</p>
            <h1 id="mx-title" className="t-2">Impossible de vérifier ton accès</h1>
            <p>Ton accès BUILD n&apos;a pas pu être confirmé. Réessaie dans un instant avant de choisir une offre.</p>
          </div>
          <Link href="/mcp/start" className="btn btn--p">Réessayer</Link>
        </section>
      </main>
    </DaRoot>
  );
}
