import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getMcpConnectionStatus,
  revokeMcpConnections,
} from "@/app/actions/mcpConnections";
import { NavBar } from "@/components/NavBar";
import { getMcpResourceUrl } from "@/lib/mcp/config";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Connexion aux assistants : BUILD by Orsayn",
};

function ClientLogos() {
  return (
    <div className="flex items-center gap-4" aria-label="Claude et ChatGPT">
      <Image
        src="/brand-logos/claude.svg"
        alt="Claude"
        width={28}
        height={28}
        className="h-7 w-7"
      />
      <span className="h-4 w-px bg-white/15" aria-hidden="true" />
      <Image
        src="/brand-logos/chatgpt.svg"
        alt="ChatGPT"
        width={28}
        height={28}
        className="h-7 w-7"
      />
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <NavBar />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        {children}
      </div>
    </main>
  );
}

function AccessUnavailable() {
  return (
    <PageShell>
      <ClientLogos />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">
        Impossible de vérifier ton accès BUILD
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#f0ede8]/60">
        Réessaie dans un instant. Aucun lien de connexion n&apos;est affiché tant que ton accès reste indéterminé.
      </p>
      <Link href="/dashboard" className="mt-8 inline-flex text-sm text-[#c9b48a] underline underline-offset-4">
        Revenir au tableau de bord
      </Link>
    </PageShell>
  );
}

function OfferRequired() {
  return (
    <PageShell>
      <ClientLogos />
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#c9b48a]">Inclus dans les offres BUILD</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Connecte BUILD à ton assistant</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#f0ede8]/60">
        Fondations donne accès à l&apos;essentiel. LE COFFRE ouvre toute la méthode.
      </p>
      <Link
        href="/checkout?from=mcp"
        className="mt-8 inline-flex items-center rounded-md border border-[#e8d5b0]/60 bg-[#e8d5b0] px-4 py-2.5 text-sm font-medium text-[#17140f] shadow-[0_2px_0_#8e7a55] transition active:translate-y-px active:shadow-none"
      >
        Choisir mon accès
      </Link>
    </PageShell>
  );
}

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
  const connectorBetaVisible = process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true";
  const connectorVisible = connectorBetaVisible || connectorLaunched;

  if (!connectorVisible) {
    return (
      <PageShell>
        <h1 className="text-3xl font-semibold tracking-tight">La connexion à Claude et ChatGPT n&apos;est pas encore ouverte</h1>
        <p className="mt-3 text-sm text-[#f0ede8]/60">
          Les essais réels sont encore en cours. Aucun réglage n&apos;est nécessaire.
        </p>
      </PageShell>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();
  const tier = normalizeProfileTier(profile?.tier ?? null);

  if (profileError || tier === null) {
    return <AccessUnavailable />;
  }

  if (tier !== "beginner" && tier !== "full") {
    return <OfferRequired />;
  }

  const connectionStatus = await getMcpConnectionStatus();
  const mcpUrl = getMcpResourceUrl();
  const connected = connectionStatus === "connected";
  const disconnected = connectionStatus === "disconnected";
  const unknown = connectionStatus === "unknown";
  const tierLabel = tier === "full" ? COFFRE_LABEL : FONDATIONS_LABEL;

  return (
    <PageShell>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9b48a]">
            {connectorLaunched ? "Connexion disponible" : "Connexion bêta"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Connecte BUILD à ton assistant</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#f0ede8]/60">
            Pose une question, retrouve le bon contenu et reprends ta progression au bon endroit.
          </p>
        </div>
        <ClientLogos />
      </div>

      <section className="mt-10 border-y border-white/[0.08] py-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0ede8]/45">Ton accès</p>
            <p className="mt-2 text-sm text-[#f0ede8]">{tierLabel}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0ede8]/45">État</p>
            <p className={`mt-2 text-sm ${connected ? "text-emerald-300" : "text-[#f0ede8]/70"}`}>
              {connected ? "Connexion active" : disconnected ? "À configurer" : "Vérification indisponible"}
            </p>
          </div>
        </div>
      </section>

      {unknown ? (
        <section className="py-10">
          <h2 className="text-xl font-medium">Impossible de vérifier l&apos;état de la connexion</h2>
          <p className="mt-2 text-sm leading-6 text-[#f0ede8]/55">
            Actualise cette page dans un instant. BUILD ne te demandera pas de recommencer tant que le statut reste indéterminé.
          </p>
        </section>
      ) : null}

      {disconnected ? (
        <section className="py-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9b48a]">Une seule adresse</p>
          <code className="mt-3 block select-all break-all bg-white/[0.04] px-4 py-3 text-sm text-[#e8d5b0]">
            {mcpUrl}
          </code>
          <div className="mt-9 grid gap-8 sm:grid-cols-2 sm:divide-x sm:divide-white/[0.08]">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/brand-logos/claude.svg" alt="" width={24} height={24} className="h-6 w-6" />
                <h2 className="text-xl font-medium">Claude</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#f0ede8]/60">
                Paramètres, Connecteurs, puis Ajouter un connecteur personnalisé. Colle l&apos;adresse et autorise BUILD.
              </p>
            </div>
            <div className="sm:pl-8">
              <div className="flex items-center gap-3">
                <Image src="/brand-logos/chatgpt.svg" alt="" width={24} height={24} className="h-6 w-6" />
                <h2 className="text-xl font-medium">ChatGPT</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#f0ede8]/60">
                Active le mode développeur, ajoute un connecteur personnalisé, puis colle la même adresse.
              </p>
              <p className="mt-2 text-xs text-[#f0ede8]/40">Parcours bêta encore à confirmer sur un compte réel.</p>
            </div>
          </div>
          <p className="mt-8 text-xs leading-5 text-[#f0ede8]/40">
            Claude ou ChatGPT peut demander un forfait web payant compatible ou l&apos;autorisation de l&apos;administrateur de ton espace.
          </p>
        </section>
      ) : null}

      {connected ? (
        <section className="py-10">
          <h2 className="text-xl font-medium">BUILD est prêt dans ton assistant</h2>
          <p className="mt-2 text-sm leading-6 text-[#f0ede8]/55">
            Tu peux poser tes questions. Les réponses restent limitées aux contenus de ton offre.
          </p>
        </section>
      ) : null}

      <section className="border-t border-white/[0.08] pt-6">
        {revocation === "success" ? <p className="mb-4 text-sm text-emerald-300">Toutes les connexions ont été coupées.</p> : null}
        {revocation === "error" ? <p className="mb-4 text-sm text-red-300">La déconnexion a échoué. Réessaie.</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/dashboard" className="text-sm text-[#f0ede8]/55 underline underline-offset-4">Tableau de bord</Link>
          {connected ? (
            <form action={revokeMcpConnections}>
              <button type="submit" className="rounded-md border border-red-300/40 px-4 py-2 text-sm text-red-200 transition hover:bg-red-300/10 active:translate-y-px">
                Couper toutes les connexions
              </button>
            </form>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
