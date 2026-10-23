import { BUILD_SYNC_INTERVAL_LABEL, buildSyncInstallCommands, buildSyncOrigin } from "@/lib/buildSync/installCommands";
import { CopyBuildSyncCommand } from "@/components/CopyBuildSyncCommand";

const commands = buildSyncInstallCommands(buildSyncOrigin(process.env.NEXT_PUBLIC_APP_URL));

export function SkillsSyncCard() {
  return <section id="build-sync" className="ui3-access-card skills-sync" aria-labelledby="build-sync-title"><div><h2 id="build-sync-title" className="t-2">Garde tes skills à jour</h2><p className="t-lede">Installe BUILD Sync une fois. Il garde les skills de ton niveau à jour et sauvegarde ta copie précédente.</p></div><div className="ui3-auth-form">{commands.map(({ label, command }) => <div className="ui3-prompt" key={label}><p><strong>{label}</strong><br /><code>{command}</code></p><CopyBuildSyncCommand label={label} command={command} /></div>)}</div><p className="t-meta">Vérification {BUILD_SYNC_INTERVAL_LABEL}. Tes adaptations placées dans CUSTOM.md ne sont pas remplacées.</p></section>;
}
