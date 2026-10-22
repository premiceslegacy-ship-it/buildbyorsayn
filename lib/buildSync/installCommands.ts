/**
 * Source unique des commandes d'installation de BUILD Sync et des dossiers où
 * atterrissent les skills. La carte d'installation du site et les instructions
 * de l'assistant lisent ce fichier : l'adresse n'est écrite nulle part ailleurs.
 *
 * Les dossiers de destination reflètent AGENTS dans public/build-sync/build.mjs
 * (un test vérifie qu'ils restent identiques).
 */

/**
 * Adresse par défaut écrite en dur dans install.sh, install.ps1 et build.mjs (public/build-sync).
 * Ces scripts s'en servent quand BUILD_SYNC_BASE_URL n'est pas défini : si la commande affichée
 * vient d'un autre domaine, l'installation téléchargera quand même depuis celui-ci.
 * Un test garde les trois scripts alignés sur cette constante et refuse un domaine de production différent.
 */
export const BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN = "https://build-system-three.vercel.app";

export const BUILD_SYNC_FALLBACK_ORIGIN = BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN;

/** Vrai si la commande affichée (origine donnée) et le défaut des scripts visent deux hôtes différents. */
export function buildSyncHostsDiffer(displayedOrigin: string, scriptDefaultOrigin = BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN): boolean {
  return new URL(displayedOrigin).host !== new URL(scriptDefaultOrigin).host;
}

export const BUILD_SYNC_INTERVAL_LABEL = "toutes les heures";

export type BuildSyncInstallCommand = {
  id: "posix" | "windows";
  label: string;
  command: string;
};

export function buildSyncOrigin(configured: string | undefined | null): string {
  return (configured?.trim() || BUILD_SYNC_FALLBACK_ORIGIN).replace(/\/+$/, "");
}

export function buildSyncInstallCommands(origin: string): readonly [BuildSyncInstallCommand, BuildSyncInstallCommand] {
  const base = origin.replace(/\/+$/, "");
  return [
    {
      id: "posix",
      label: "macOS, Linux ou WSL",
      command: `curl -fsSL ${base}/build-sync/install.sh | sh`,
    },
    {
      id: "windows",
      label: "Windows PowerShell",
      command: `irm ${base}/build-sync/install.ps1 | iex`,
    },
  ] as const;
}

export type BuildSyncTarget = {
  id: "claude" | "codex" | "hermes";
  label: string;
  folder: string;
};

export const BUILD_SYNC_TARGETS: readonly BuildSyncTarget[] = [
  { id: "claude", label: "Claude Code", folder: "~/.claude/skills" },
  { id: "codex", label: "Codex", folder: "~/.codex/skills" },
  { id: "hermes", label: "Hermes Agent", folder: "~/.hermes/skills/build" },
];

/** Sous-commandes de `build-skills` (voir help() dans public/build-sync/build.mjs). */
export const BUILD_SYNC_CLI = {
  status: "build-skills status",
  update: "build-skills update",
  setup: "build-skills setup",
  logout: "build-skills logout",
} as const;
