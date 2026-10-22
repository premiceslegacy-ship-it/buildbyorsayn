/**
 * Inventaire des hôtes écrits en dur dans le dépôt.
 *
 *   npm run domain:check            échoue (code 1) si un hôte n'est pas dans HOST_ALLOWLIST
 *   npm run domain:check -- --list  affiche aussi chaque hôte avec ses fichiers et lignes
 *
 * Pourquoi : le jour où le site change de domaine (voir DOMAIN-MIGRATION.md), il faut savoir
 * exactement quels fichiers citent l'ancien. Tout nouvel hôte doit donc être déclaré ici, avec sa raison.
 *
 * Sont lus : le code, les scripts, public/build-sync, la configuration, .env.example et les .md à la racine.
 * Sont ignorés : node_modules, .next, docs, tests, e2e, private, product, references, sauvegardes et fichiers générés.
 * Les hôtes réservés à la documentation (example.*, *.invalid, *.test, *.localhost, localhost, adresses IP) sont ignorés.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type HostKind =
  /** Domaine de BUILD : à changer le jour J. Doit être cité dans DOMAIN-MIGRATION.md. */
  | "own"
  /** Service tiers contacté par le code ou lien éditorial : ne bouge pas avec notre domaine. */
  | "third-party"
  /** Valeur d'exemple à remplacer par l'opérateur (fichier .env.example). */
  | "placeholder";

export type AllowedHost = {
  /** Hôte exact, ou « *.exemple.com » pour le domaine et tous ses sous-domaines. */
  host: string;
  kind: HostKind;
  /** Pourquoi cet hôte est écrit en dur, en une phrase. */
  why: string;
};

export const HOST_ALLOWLIST: readonly AllowedHost[] = [
  // Notre domaine -------------------------------------------------------------------------------
  { host: "build-system-three.vercel.app", kind: "own", why: "Adresse par défaut des scripts d'installation BUILD Sync, qui ne peuvent pas lire l'environnement (BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN), et valeur de repli de la commande affichée." },
  { host: "orsayn.fr", kind: "own", why: "Adresse de contact (build@orsayn.fr) affichée dans le pied de page, les pages légales et envoyée aux membres. Domaine de messagerie, distinct de l'hôte du site." },

  // Services tiers contactés par le code --------------------------------------------------------
  { host: "*.stripe.com", kind: "third-party", why: "Paiement (Stripe.js, API, liens de paiement)." },
  { host: "*.supabase.co", kind: "third-party", why: "Base de données et authentification (le sous-domaine est celui du projet Supabase, pas le nôtre)." },
  { host: "*.mux.com", kind: "third-party", why: "Lecture vidéo Mux (HLS, restrictions de lecture par domaine)." },
  { host: "*.litix.io", kind: "third-party", why: "Mesure de lecture Mux." },
  { host: "*.googleapis.com", kind: "third-party", why: "API Google (embeddings, YouTube Data, polices)." },
  { host: "fonts.gstatic.com", kind: "third-party", why: "Polices Google, autorisées par la politique de sécurité du contenu." },
  { host: "*.youtube.com", kind: "third-party", why: "Lecteur et flux YouTube (abonnement WebSub, vignettes)." },
  { host: "*.youtube-nocookie.com", kind: "third-party", why: "Lecteur YouTube sans cookie." },
  { host: "*.ytimg.com", kind: "third-party", why: "Vignettes YouTube." },
  { host: "pubsubhubbub.appspot.com", kind: "third-party", why: "Hub WebSub de YouTube : reçoit l'adresse de rappel de notre site." },
  { host: "claude.ai", kind: "third-party", why: "Client MCP : adresse de retour OAuth et origine CORS autorisée." },
  { host: "chatgpt.com", kind: "third-party", why: "Client MCP : adresses de retour OAuth et origine CORS autorisée." },
  { host: "platform.openai.com", kind: "third-party", why: "Documentation de la connexion ChatGPT." },
  { host: "*.openai.com", kind: "third-party", why: "Documentation et marque OpenAI." },
  { host: "nodejs.org", kind: "third-party", why: "Lien d'installation de Node.js dans les scripts BUILD Sync." },
  { host: "omp.sh", kind: "third-party", why: "Lien d'installation officiel du client Oh My Pi dans le guide de connexion MCP." },
  { host: "*.w3.org", kind: "third-party", why: "Espace de noms XML des fichiers SVG." },
  { host: "nextjs.org", kind: "third-party", why: "Documentation Next.js citée dans la configuration." },
  { host: "ui.shadcn.com", kind: "third-party", why: "Schéma de components.json." },
  { host: "*.google.com", kind: "third-party", why: "Liens d'aide et outils Google cités dans les contenus." },
  { host: "*.withgoogle.com", kind: "third-party", why: "Outil Google cité dans les contenus." },
  { host: "*.indexnow.org", kind: "third-party", why: "Documentation de référencement citée dans les contenus." },
  { host: "*.cnil.fr", kind: "third-party", why: "Référence légale citée dans la politique de confidentialité." },
  { host: "*.amazon.fr", kind: "third-party", why: "Exemple éditorial." },
  { host: "*.apple.com", kind: "third-party", why: "Référence de design citée dans les contenus." },
  { host: "*.atelier-btp.fr", kind: "third-party", why: "Site d'exemple cité dans les contenus de formation." },

  // Exemples et références -----------------------------------------------------------------------
  { host: "your-domain.com", kind: "placeholder", why: "Valeur d'exemple dans .env.example." },
  { host: "*.resend.com", kind: "third-party", why: "Envoi des e-mails (API Resend, documentation)." },
  { host: "*.github.com", kind: "third-party", why: "Dépôts et documentation cités." },
  { host: "*.githubusercontent.com", kind: "third-party", why: "Fichiers bruts de dépôts publics cités dans les README de provenance des logos." },
  { host: "*.supabase.com", kind: "third-party", why: "Documentation Supabase." },
  { host: "vercel.com", kind: "third-party", why: "Documentation Vercel." },
  { host: "*.wikimedia.org", kind: "third-party", why: "Provenance des images dans les README des assets." },
  { host: "cdn.simpleicons.org", kind: "third-party", why: "Provenance des logos dans public/brand-logos/README.md." },
  { host: "unpkg.com", kind: "third-party", why: "Provenance des logos dans public/brand-logos/README.md." },
  { host: "cdn.jsdelivr.net", kind: "third-party", why: "Provenance des logos dans public/brand-logos/README.md." },
  { host: "*.gstatic.com", kind: "third-party", why: "Polices et logos Google (politique de sécurité du contenu, README de provenance)." },

  // Liens éditoriaux : outils et références cités dans les contenus de formation ----------------
  { host: "21st.dev", kind: "third-party", why: "Lien éditorial." },
  { host: "bolt.new", kind: "third-party", why: "Lien éditorial." },
  { host: "figma.com", kind: "third-party", why: "Lien éditorial." },
  { host: "mobbin.com", kind: "third-party", why: "Lien éditorial." },
  { host: "dribbble.com", kind: "third-party", why: "Lien éditorial." },
  { host: "higgsfield.ai", kind: "third-party", why: "Lien éditorial." },
  { host: "opencode.ai", kind: "third-party", why: "Lien éditorial." },
  { host: "fal.ai", kind: "third-party", why: "Lien éditorial." },
  { host: "antigravity.ai", kind: "third-party", why: "Lien éditorial." },
  { host: "*.cursor.com", kind: "third-party", why: "Lien éditorial." },
  { host: "openrouter.ai", kind: "third-party", why: "Lien éditorial." },
  { host: "treg.to", kind: "third-party", why: "Lien éditorial." },
  { host: "*.rareui.com", kind: "third-party", why: "Lien éditorial." },
  { host: "mintlify.com", kind: "third-party", why: "Lien éditorial." },
  { host: "refero.design", kind: "third-party", why: "Lien éditorial." },
  { host: "*.pinterest.com", kind: "third-party", why: "Lien éditorial." },
  { host: "*.perplexity.ai", kind: "third-party", why: "Lien éditorial." },
  { host: "rapidapi.com", kind: "third-party", why: "Lien éditorial." },
  { host: "efferd.com", kind: "third-party", why: "Lien éditorial." },
  { host: "minimal.gallery", kind: "third-party", why: "Lien éditorial." },
  { host: "firecrawl.dev", kind: "third-party", why: "Lien éditorial." },
  { host: "owasp.org", kind: "third-party", why: "Lien éditorial." },
  { host: "*.nousresearch.com", kind: "third-party", why: "Lien éditorial (Hermes Agent)." },
  { host: "linear.app", kind: "third-party", why: "Lien éditorial." },
  { host: "cal.com", kind: "third-party", why: "Lien éditorial." },
  { host: "notion.so", kind: "third-party", why: "Lien éditorial." },
  { host: "youtu.be", kind: "third-party", why: "Lien éditorial." },
  { host: "posthog.com", kind: "third-party", why: "Lien éditorial." },
  { host: "sentry.io", kind: "third-party", why: "Lien éditorial." },
];

const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".mjs", ".js", ".json", ".sh", ".ps1", ".md", ".css", ".html", ".sql", ".example"]);
const IGNORED_ANYWHERE: Record<string, true> = { node_modules: true, ".next": true, ".git": true, ".vercel": true, ".temp": true };
const IGNORED_AT_ROOT: Record<string, true> = {
  docs: true, tests: true, e2e: true, private: true, product: true, references: true,
  ".agents": true, ".claude": true, ".watcher-backups": true, "playwright-report": true, "test-results": true,
};
const IGNORED_FILES = new Set(["package-lock.json", "tsconfig.tsbuildinfo", "skills-lock.json", "DOMAIN-MIGRATION.md"]);
const FILE_EXTENSIONS_NOT_HOSTS = /\.(?:png|jpe?g|gif|webp|svg|ico|ts|tsx|js|mjs|css|json|md|html|woff2?)$/i;
const RESERVED_HOST = /(?:^|\.)(?:example\.(?:com|org|net)|exemple\.(?:com|org|net)|[a-z0-9-]+\.example|invalid|test|localhost)$|^localhost$|^(?:\d{1,3}\.){3}\d{1,3}$/i;

export type HostReference = { file: string; line: number };

export function hostsInLine(line: string): string[] {
  const hosts: string[] = [];
  for (const match of line.matchAll(/https?:\/\/([A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z]{2,24})(?![A-Za-z0-9-])/g)) hosts.push(match[1]);
  for (const match of line.matchAll(/[A-Za-z0-9._%+-]+@([A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z]{2,24})(?![A-Za-z0-9-])/g)) {
    if (!FILE_EXTENSIONS_NOT_HOSTS.test(match[1])) hosts.push(match[1]);
  }
  return hosts.map((host) => host.toLowerCase().replace(/\.+$/, "")).filter((host) => !RESERVED_HOST.test(host));
}

function* walk(directory: string, root: string): Generator<string> {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_ANYWHERE[entry.name] || (directory === root && IGNORED_AT_ROOT[entry.name])) continue;
      yield* walk(path.join(directory, entry.name), root);
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name) || /\.test\.(?:ts|tsx|mjs)$/.test(entry.name)) continue;
      if (entry.name === ".env.example" || SCANNED_EXTENSIONS.has(path.extname(entry.name))) yield path.join(directory, entry.name);
    }
  }
}

export function scanDomainReferences(root: string): Map<string, HostReference[]> {
  const references = new Map<string, HostReference[]>();
  const thisScript = path.relative(root, fileURLToPath(import.meta.url));
  for (const absolute of walk(root, root)) {
    const file = path.relative(root, absolute);
    if (file === thisScript || statSync(absolute).size > 2_000_000) continue;
    readFileSync(absolute, "utf8").split("\n").forEach((text, index) => {
      for (const host of hostsInLine(text)) {
        const list = references.get(host) ?? [];
        list.push({ file, line: index + 1 });
        references.set(host, list);
      }
    });
  }
  return references;
}

export function isAllowedHost(host: string, allowlist: readonly AllowedHost[] = HOST_ALLOWLIST): boolean {
  return allowlist.some((entry) => (entry.host.startsWith("*.")
    ? host === entry.host.slice(2) || host.endsWith(entry.host.slice(1))
    : host === entry.host));
}

export function findUnlistedHosts(
  references: Map<string, HostReference[]>,
  allowlist: readonly AllowedHost[] = HOST_ALLOWLIST,
): Map<string, HostReference[]> {
  return new Map([...references].filter(([host]) => !isAllowedHost(host, allowlist)));
}

/** Les hôtes « own » de la liste blanche : ceux que DOMAIN-MIGRATION.md doit citer. */
export function ownHosts(allowlist: readonly AllowedHost[] = HOST_ALLOWLIST): string[] {
  return allowlist.filter((entry) => entry.kind === "own").map((entry) => entry.host);
}

function main() {
  const root = process.cwd();
  const references = scanDomainReferences(root);
  const unlisted = findUnlistedHosts(references);
  const showAll = process.argv.includes("--list");

  for (const [host, where] of [...references].sort(([a], [b]) => a.localeCompare(b))) {
    const entry = HOST_ALLOWLIST.find((candidate) => isAllowedHost(host, [candidate]));
    if (showAll || entry?.kind === "own") {
      console.log(`${entry?.kind === "own" ? "[own]  " : "       "}${host}  (${where.length})`);
      if (showAll || entry?.kind === "own") for (const item of where.slice(0, showAll ? 50 : 20)) console.log(`         ${item.file}:${item.line}`);
    }
  }

  if (unlisted.size > 0) {
    console.error("\nHôtes écrits en dur qui ne sont pas dans HOST_ALLOWLIST (scripts/check-domain-references.ts) :");
    for (const [host, where] of unlisted) console.error(`  ${host}  ${where.slice(0, 3).map((item) => `${item.file}:${item.line}`).join(", ")}`);
    console.error("\nAjoute l'hôte à la liste avec sa raison, ou retire-le du code. Si c'est un domaine de BUILD, cite-le aussi dans DOMAIN-MIGRATION.md.");
    process.exit(1);
  }
  console.log(`\nOK : ${references.size} hôtes écrits en dur, tous déclarés.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
