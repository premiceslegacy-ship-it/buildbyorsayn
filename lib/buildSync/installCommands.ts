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

/**
 * Origine affichée dans la commande d'installation. Une valeur qui n'est pas une origine http(s) nue
 * (espaces, identifiants, chemin, requête, schéma exotique) retombe sur l'adresse par défaut : on ne la recopie jamais dans un shell.
 */
export function buildSyncOrigin(configured: string | undefined | null): string {
  const candidate = configured?.trim();
  if (!candidate) return BUILD_SYNC_FALLBACK_ORIGIN;
  try {
    const url = new URL(candidate);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname.replace(/\/+$/, "") !== ""
    ) {
      return BUILD_SYNC_FALLBACK_ORIGIN;
    }
    return url.origin;
  } catch {
    return BUILD_SYNC_FALLBACK_ORIGIN;
  }
}

/** Adresse composée uniquement de caractères sans effet pour un shell : affichée telle quelle, sans guillemets. */
const SHELL_NEUTRAL_URL = /^https?:\/\/[A-Za-z0-9.-]+(:\d{1,5})?(\/[A-Za-z0-9._~\/-]*)?$/;

/** sh : guillemets simples, l'apostrophe devient '\''. */
export function quotePosixArgument(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** PowerShell : guillemets simples, et toute apostrophe (y compris les apostrophes typographiques que PowerShell traite comme telles) est doublée. */
export function quotePowerShellArgument(value: string): string {
  return `'${value.replace(/['\u2018\u2019\u201A\u201B]/g, (quote) => quote + quote)}'`;
}

export function buildSyncInstallCommands(origin: string): readonly [BuildSyncInstallCommand, BuildSyncInstallCommand] {
  const base = origin.replace(/\/+$/, "");
  const shUrl = `${base}/build-sync/install.sh`;
  const shChecksumUrl = `${shUrl}.sha256`;
  const psUrl = `${base}/build-sync/install.ps1`;
  const psChecksumUrl = `${psUrl}.sha256`;
  const shTarget = `"${"${TMPDIR:-/tmp}"}/bsi.$$"`;
  const shUrlArg = SHELL_NEUTRAL_URL.test(shUrl) ? shUrl : quotePosixArgument(shUrl);
  const shChecksumUrlArg = SHELL_NEUTRAL_URL.test(shChecksumUrl) ? shChecksumUrl : quotePosixArgument(shChecksumUrl);
  const shCommand = `t=${shTarget};c="$t.sha256";curl -fsSL --proto-redir "=https" ${shUrlArg} -o "$t"&&curl -fsSL --proto-redir "=https" ${shChecksumUrlArg} -o "$c"&&e=$(awk 'NF{print $1;exit}' "$c")&&a=$(if command -v sha256sum>/dev/null 2>&1;then sha256sum "$t";else shasum -a 256 "$t";fi|awk '{print $1}')&&test "$e" = "$a"&&sh "$t";s=$?;rm -f "$t" "$c";exit "$s"`;
  const psCommand = [
    `$t="$env:TEMP\\bsi-$PID.ps1";$c="$t.sha256"`,
    `irm ${SHELL_NEUTRAL_URL.test(psUrl) ? psUrl : quotePowerShellArgument(psUrl)} -OutFile $t`,
    `irm ${SHELL_NEUTRAL_URL.test(psChecksumUrl) ? psChecksumUrl : quotePowerShellArgument(psChecksumUrl)} -OutFile $c`,
    `$e=((gc -Raw $c)-split "\\s+")[0]`,
    `$a=(Get-FileHash $t -Algorithm SHA256).Hash`,
    `if($a -ne $e){ri -fo $t,$c;throw 'Checksum invalide'}`,
    `& powershell -nop -ep Bypass -f $t`,
    `$s=$LASTEXITCODE;ri -fo $t,$c;exit $s`,
  ].join("; ");
  return [
    {
      id: "posix",
      label: "macOS, Linux ou WSL",
      command: shCommand,
    },
    {
      id: "windows",
      label: "Windows PowerShell",
      command: psCommand,
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
