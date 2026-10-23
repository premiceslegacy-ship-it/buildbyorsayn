import { BUILD_SYNC_INTERVAL_LABEL, buildSyncInstallCommands, buildSyncOrigin } from "@/lib/buildSync/installCommands";
import { CopyBuildSyncCommand } from "@/components/CopyBuildSyncCommand";

const commands = buildSyncInstallCommands(buildSyncOrigin(process.env.NEXT_PUBLIC_APP_URL));

export function SkillsSyncCard() {
  return <section id="build-sync" className="ui3-access-card" aria-labelledby="build-sync-title"><div><p className="pastille"><b />BUILD Sync</p><h2 id="build-sync-title" className="t-2">Installe une fois. Tes skills restent à jour.</h2></div><p className="t-lede">BUILD installe les skills de ton niveau, sauvegarde l’ancienne copie et vérifie les nouvelles versions {BUILD_SYNC_INTERVAL_LABEL}.</p><div className="ui3-auth-form">{commands.map(({ label, command }) => <div className="ui3-prompt" key={label}><p><strong>{label}</strong><br /><code>{command}</code></p><CopyBuildSyncCommand label={label} command={command} /></div>)}</div><p className="t-meta">Tes adaptations placées dans CUSTOM.md ne sont pas remplacées.</p></section>;
}
