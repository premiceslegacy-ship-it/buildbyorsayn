import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, FONDATIONS_LABEL, STRIPE_FULL_CHECKOUT_LINK } from "@/lib/pricing";
import { NavBar } from "@/components/NavBar";
import { LiquidCard } from "@/components/ui/liquid-glass-card";
import { revokeMcpConnections } from "@/app/actions/mcpConnections";

export const metadata = {
  title: "Connecter Claude ou ChatGPT : BUILD by Orsayn",
};

const TIER_LABEL: Record<string, string> = {
  free: "Public",
  preview: "Demo gratuite",
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
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
          Connecter Claude ou ChatGPT a BUILD
        </h1>
        <p className="text-[#f0ede8]/70 mb-8">
          Interroge le savoir-faire BUILD by Orsayn directement depuis ton assistant IA, applique
          la methode a ton propre projet, sans copier-coller de fichiers.
        </p>

        <LiquidCard className="p-6 mb-8">
          <p className="text-sm text-[#f0ede8]/70 mb-1">Ton acces actuel</p>
          <p className="text-lg text-[#c9b48a] mb-3">{TIER_LABEL[tier]}</p>
          {tier !== "full" ? (
            <a
              href={STRIPE_FULL_CHECKOUT_LINK}
              className="text-sm underline text-[#c9b48a] hover:text-[#c9b48a]/80"
            >
              Debloquer {COFFRE_LABEL} pour l'acces complet dans ton assistant IA
            </a>
          ) : null}
        </LiquidCard>

        <LiquidCard className="p-6 mb-8">
          <p className="text-sm text-[#f0ede8]/70 mb-1">URL du connecteur</p>
          <code className="block text-sm text-[#c9b48a] break-all bg-black/30 rounded px-3 py-2">
            {mcpUrl}
          </code>
        </LiquidCard>

        <LiquidCard className="p-6 mb-8">
          <h2 className="text-lg font-medium mb-2">Gerer les connexions</h2>
          <p className="text-sm text-[#f0ede8]/70 mb-4">
            Si tu ne reconnais plus un assistant connecte, coupe tous les acces MCP. Tu pourras
            reconnecter Claude ou ChatGPT ensuite.
          </p>
          {revocation === "success" ? (
            <p className="text-sm text-emerald-300 mb-4">Tous les acces MCP ont ete revoques.</p>
          ) : null}
          {revocation === "error" ? (
            <p className="text-sm text-red-300 mb-4">La revocation a echoue. Reessaie.</p>
          ) : null}
          <form action={revokeMcpConnections}>
            <button
              type="submit"
              className="rounded-md border border-red-300/40 px-4 py-2 text-sm text-red-200 hover:bg-red-300/10 active:translate-y-px"
            >
              Deconnecter tous les assistants
            </button>
          </form>
        </LiquidCard>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Dans Claude</h2>
            <ol className="list-decimal list-inside text-sm text-[#f0ede8]/70 space-y-1">
              <li>Ouvre Claude, puis Parametres puis Connecteurs.</li>
              <li>Choisis "Ajouter un connecteur personnalise".</li>
              <li>Colle l&apos;URL ci-dessus et valide.</li>
              <li>Connecte-toi avec ton compte BUILD quand on te le demande, puis autorise l&apos;acces.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Dans ChatGPT</h2>
            <ol className="list-decimal list-inside text-sm text-[#f0ede8]/70 space-y-1">
              <li>Active le mode developpeur dans les parametres de ChatGPT (compte Plus, Pro, Business ou Enterprise requis).</li>
              <li>Ajoute un connecteur MCP personnalise avec l&apos;URL ci-dessus.</li>
              <li>Connecte-toi avec ton compte BUILD, puis autorise l&apos;acces.</li>
            </ol>
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
