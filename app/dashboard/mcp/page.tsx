import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, FONDATIONS_LABEL, STRIPE_FULL_CHECKOUT_LINK } from "@/lib/pricing";
import { NavBar } from "@/components/NavBar";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { revokeMcpConnections } from "@/app/actions/mcpConnections";

export const metadata = {
  title: "Connexion aux assistants : BUILD by Orsayn",
};

const TIER_LABEL: Record<string, string> = {
  free: "Public",
  preview: "Démo gratuite",
  beginner: FONDATIONS_LABEL,
  full: COFFRE_LABEL,
};

export default async function McpDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ revocation?: string }>;
}) {
  const { revocation } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=%2Fdashboard%2Fmcp");

  const connectorLaunched = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";

  if (!connectorLaunched) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
        <NavBar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#c9b48a]">
            Validation finale en cours
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
            La connexion aux assistants n&apos;est pas encore ouverte
          </h1>
          <p className="text-[#f0ede8]/70">
            Nous terminons les essais réels dans Claude et ChatGPT avant de rendre cette connexion
            disponible. Aucun réglage n&apos;est nécessaire pour le moment.
          </p>
        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const tier = normalizeProfileTier(profile?.tier ?? null);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://buildbyorsayn.com";
  const mcpUrl = `${appUrl}/api/mcp`;

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#c9b48a]">
          Connexion en quelques minutes
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
          Retrouve BUILD dans Claude ou ChatGPT
        </h1>
        <p className="text-[#f0ede8]/70 mb-8">
          Continue à utiliser ton assistant comme d&apos;habitude. BUILD lui apporte le contexte,
          les méthodes, les contenus et les skills inclus dans ton offre.
        </p>

        <LiquidCard className="p-6 mb-8">
          <p className="text-sm text-[#f0ede8]/70 mb-1">Ton accès BUILD</p>
          <p className="text-lg text-[#c9b48a] mb-3">{TIER_LABEL[tier]}</p>
          {tier !== "full" ? (
            <a
              href={STRIPE_FULL_CHECKOUT_LINK}
              className="text-sm underline text-[#c9b48a] hover:text-[#c9b48a]/80"
            >
              Débloquer {COFFRE_LABEL} pour retrouver tout BUILD dans ton assistant
            </a>
          ) : null}
        </LiquidCard>

        <LiquidCard className="p-6 mb-8">
          <p className="text-sm text-[#f0ede8]/70 mb-1">Lien à copier dans ton assistant</p>
          <code className="block text-sm text-[#c9b48a] break-all bg-black/30 rounded px-3 py-2">
            {mcpUrl}
          </code>
        </LiquidCard>

        <LiquidCard className="p-6 mb-8">
          <h2 className="text-lg font-medium mb-2">Gérer mes connexions</h2>
          <p className="text-sm text-[#f0ede8]/70 mb-4">
            Tu peux couper les accès à tout moment. Claude et ChatGPT devront alors se reconnecter
            avant de pouvoir consulter BUILD.
          </p>
          {revocation === "success" ? (
            <p className="text-sm text-emerald-300 mb-4">Toutes les connexions ont été coupées.</p>
          ) : null}
          {revocation === "error" ? (
            <p className="text-sm text-red-300 mb-4">La déconnexion a échoué. Réessaie.</p>
          ) : null}
          <form action={revokeMcpConnections}>
            <button
              type="submit"
              className="rounded-md border border-red-300/40 px-4 py-2 text-sm text-red-200 hover:bg-red-300/10 active:translate-y-px"
            >
              Couper toutes les connexions
            </button>
          </form>
        </LiquidCard>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Dans Claude</h2>
            <ol className="list-decimal list-inside text-sm text-[#f0ede8]/70 space-y-1">
              <li>Ouvre Claude, puis Paramètres et Connecteurs.</li>
              <li>Choisis « Ajouter un connecteur personnalisé ».</li>
              <li>Colle le lien ci-dessus et valide.</li>
              <li>Connecte-toi à BUILD, puis autorise l&apos;accès.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Dans ChatGPT</h2>
            <ol className="list-decimal list-inside text-sm text-[#f0ede8]/70 space-y-1">
              <li>Active le mode développeur dans les paramètres de ChatGPT.</li>
              <li>Ajoute un connecteur personnalisé avec le lien ci-dessus.</li>
              <li>Connecte-toi à BUILD, puis autorise l&apos;accès.</li>
            </ol>
            <p className="mt-3 text-xs leading-5 text-[#f0ede8]/45">
              Selon ton compte, Claude ou ChatGPT peut demander un forfait web payant compatible ou
              l&apos;autorisation de l&apos;administrateur de ton espace.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#f0ede8]/40 mt-10">
          Le connecteur respecte ton palier d&apos;acces : ce que tu vois dans{" "}
          <Link href="/dashboard" className="underline">
            ton tableau de bord
          </Link>{" "}
          est ce que ton assistant peut interroger.
        </p>
      </div>
    </main>
  );
}
