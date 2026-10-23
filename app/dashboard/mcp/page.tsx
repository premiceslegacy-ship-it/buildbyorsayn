import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMcpConnectionStatus, revokeMcpConnections } from "@/app/actions/mcpConnections";
import { DaRoot } from "@/components/da/DaRoot";
import { McpSetupGuide } from "@/components/McpSetupGuide";
import { NavBar } from "@/components/NavBar";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { getMcpResourceUrl } from "@/lib/mcp/config";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";
import "@/app/ui3.css";

export const metadata = { title: "Connexion aux assistants | BUILD", robots: { index: false, follow: false } };

const clients = [
  ["claude", "Claude"],
  ["openai", "ChatGPT"],
  ["hermes", "Hermes"],
  ["omp", "Oh My Pi"],
  ["cursor", "Cursor"],
] as const;

function ClientLogos() {
  return <div className="ui3-tool-logos" aria-label={clients.map((client) => client[1]).join(", ")}>{clients.map(([file, label]) => <span key={file}><Image src={`/da/logos/${file}.svg`} alt={label} width={28} height={28} /></span>)}</div>;
}

function Shell({ children, identity }: { children: React.ReactNode; identity: NonNullable<Awaited<ReturnType<typeof navIdentity>>> }) {
  return <DaRoot className="da-app has-tabbar"><NavBar tier={identity.tier} isAdmin={identity.isAdmin} displayName={identity.displayName} displayEmail={identity.displayEmail} initials={identity.initials} /><main className="ui3-state"><div className="ui3-access-card">{children}</div></main></DaRoot>;
}

export default async function McpDashboardPage({ searchParams }: { searchParams: Promise<{ revocation?: string }> }) {
  const { revocation } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fdashboard%2Fmcp");
  const identity = await navIdentity(user);
  if (!identity) redirect("/login?next=%2Fdashboard%2Fmcp");

  const connectorLaunched = process.env.NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED === "true";
  const connectorVisible = connectorLaunched || process.env.NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE === "true";
  if (!connectorVisible) return <Shell identity={identity}><ClientLogos /><div><h1 className="t-2">La connexion aux assistants n’est pas encore ouverte</h1><p>Les essais réels sont encore en cours. Aucun réglage n’est nécessaire.</p></div><Link className="btn btn--p" href="/dashboard">Revenir à mon espace</Link></Shell>;

  const { data: profile, error: profileError } = await supabase.from("profiles").select("tier").eq("id", user.id).single();
  const tier = normalizeProfileTier(profile?.tier ?? null);
  if (profileError || tier === null) return <Shell identity={identity}><ClientLogos /><div><h1 className="t-2">Impossible de vérifier ton accès BUILD</h1><p>Réessaie dans un instant. Aucun lien de connexion n’est affiché tant que ton accès reste indéterminé.</p></div><Link className="btn btn--p" href="/dashboard/mcp">Réessayer</Link></Shell>;
  if (tier !== "beginner" && tier !== "full") return <Shell identity={identity}><ClientLogos /><div><p className="pastille"><b />Inclus dans les offres BUILD</p><h1 className="t-2">Connecte BUILD à ton assistant</h1><p>Fondations donne accès à l’essentiel. LE\u00a0COFFRE ouvre toute la méthode.</p></div><Link className="btn btn--p" href="/checkout?from=mcp">Choisir mon accès</Link></Shell>;

  const connectionStatus = await getMcpConnectionStatus();
  const connected = connectionStatus === "connected";
  const disconnected = connectionStatus === "disconnected";
  const unknown = connectionStatus === "unknown";
  const tierLabel = tier === "full" ? COFFRE_LABEL : FONDATIONS_LABEL;

  return <DaRoot className="da-app has-tabbar"><NavBar tier={identity.tier} isAdmin={identity.isAdmin} displayName={identity.displayName} displayEmail={identity.displayEmail} initials={identity.initials} /><main className="ui3-page"><header className="ui3-page-head"><div><ClientLogos /><p className="pastille"><b />{connectorLaunched ? "Connexion disponible" : "Connexion bêta"}</p><h1 className="t-1">Connecte BUILD à ton assistant</h1><p className="t-lede">Pose une question, retrouve le bon contenu et reprends ta progression au bon endroit.</p></div></header><div className="ui3-page-body"><section className="ui3-section ui3-access-card"><dl className="ui3-access-row"><div><dt>Ton accès</dt><dd>{tierLabel}</dd></div><div><dt>État</dt><dd className={connected ? "ui3-status-ok" : undefined}>{connected ? "Connexion active" : disconnected ? "À configurer" : "Vérification indisponible"}</dd></div></dl>
    {unknown ? <div><h2 className="t-3">Impossible de vérifier la connexion</h2><p className="t-meta">Actualise cette page dans un instant. BUILD ne te demande pas de recommencer tant que le statut reste indéterminé.</p></div> : null}
    {disconnected ? <div><h2 className="t-3">Une seule adresse</h2><p className="t-meta">Utilise cette même adresse dans l’assistant de ton choix. Choisis ensuite son guide.</p><McpSetupGuide mcpUrl={getMcpResourceUrl()} /></div> : null}
    {connected ? <div><h2 className="t-3">BUILD est prêt dans ton assistant</h2><p className="t-meta">Les réponses restent limitées aux contenus de ton offre.</p></div> : null}
    {revocation === "success" ? <p className="ui3-notice ui3-notice-success" role="status">Toutes les connexions ont été coupées.</p> : null}
    {revocation === "error" ? <p className="ui3-notice ui3-notice-error" role="alert">La déconnexion a échoué. Réessaie.</p> : null}
    <div className="ui3-section-head"><Link className="ui3-text-link" href="/compte#connections">Retour au compte</Link>{connected ? <form action={revokeMcpConnections}><button className="btn ui3-danger-button" type="submit">Couper toutes les connexions</button></form> : null}</div>
  </section></div></main></DaRoot>;
}
