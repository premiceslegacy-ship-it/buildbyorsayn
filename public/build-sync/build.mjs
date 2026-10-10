#!/usr/bin/env node

import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import {
  access,
  chmod,
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const CLIENT_ID = "build-sync-cli";
const SCOPE = "skills:read";
const DEFAULT_BASE_URL = "https://build-system-three.vercel.app";
const MAX_ARTIFACT_BYTES = 50 * 1024 * 1024;
const MAX_ARCHIVE_ENTRIES = 5_000;
const CUSTOM_FILE = "CUSTOM.md";
const MARKER_FILE = ".build-sync.json";
const CUSTOM_BLOCK = `

<!-- BUILD-SYNC:CUSTOMIZATION:BEGIN -->
## Personnalisation locale BUILD

Avant d'appliquer ce skill, lis \`${CUSTOM_FILE}\` dans ce dossier s'il existe et applique ses règles comme des préférences utilisateur. BUILD Sync ne remplace jamais ce fichier lors des mises à jour.
<!-- BUILD-SYNC:CUSTOMIZATION:END -->
`;
const CUSTOM_TEMPLATE = `# Mes adaptations

Ajoute ici tes règles métier, préférences, contraintes et exemples personnels.
BUILD Sync conserve ce fichier quand la version officielle est mise à jour.
`;

const AGENTS = {
  codex: {
    label: "Codex",
    command: "codex",
    root: (home) => path.join(home, ".codex", "skills"),
  },
  claude: {
    label: "Claude Code",
    command: "claude",
    root: (home) => path.join(home, ".claude", "skills"),
  },
  hermes: {
    label: "Hermes Agent",
    command: "hermes",
    root: (home) => path.join(home, ".hermes", "skills", "build"),
  },
};

function output(message, quiet = false) {
  if (!quiet) process.stdout.write(`${message}\n`);
}

function terminalText(value) {
  return String(value).replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").trim().slice(0, 120);
}

function fail(message) {
  const error = new Error(message);
  error.name = "BuildSyncError";
  throw error;
}

function normalizeBaseUrl(value) {
  const url = new URL(value || DEFAULT_BASE_URL);
  if (url.username || url.password || url.search || url.hash) fail("Adresse BUILD invalide.");
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname))) {
    fail("BUILD Sync exige HTTPS, sauf en développement local.");
  }
  return url.origin;
}

function homePaths() {
  const userHome = os.homedir();
  const root = path.resolve(process.env.BUILD_SYNC_HOME || path.join(userHome, ".build-sync"));
  return {
    userHome,
    root,
    config: path.join(root, "config.json"),
    credentials: path.join(root, "credentials.json"),
    backups: path.join(root, "backups"),
    rollbacks: path.join(root, "rollbacks"),
  };
}

async function exists(target) {
  try {
    await access(target, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJsonSecure(file, value) {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}-${randomBytes(4).toString("hex")}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await chmod(temporary, 0o600);
  await rename(temporary, file);
}

async function acquireLocalLock(paths, name, staleMs = 15 * 60_000) {
  const lock = path.join(paths.root, `${name}.lock`);
  await mkdir(paths.root, { recursive: true, mode: 0o700 });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await mkdir(lock, { mode: 0o700 });
      await writeFile(path.join(lock, "owner.json"), JSON.stringify({ pid: process.pid, startedAt: Date.now() }), { mode: 0o600 });
      return async () => rm(lock, { recursive: true, force: true });
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      const owner = await readJson(path.join(lock, "owner.json"), {});
      if (Number(owner?.startedAt) > Date.now() - staleMs) {
        fail("Une autre synchronisation BUILD est déjà en cours.");
      }
      await rm(lock, { recursive: true, force: true });
    }
  }
  fail("Impossible de verrouiller BUILD Sync.");
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function parseArgs(argv) {
  const args = [...argv];
  if (args[0] === "skills") args.shift();
  const command = args.shift() || "help";
  const flags = {};
  for (const arg of args) {
    if (!arg.startsWith("--")) fail(`Argument inconnu : ${arg}`);
    const [key, ...rest] = arg.slice(2).split("=");
    flags[key] = rest.length ? rest.join("=") : true;
  }
  return { command, flags };
}

function commandExists(name) {
  const finder = process.platform === "win32" ? "where.exe" : "sh";
  const args = process.platform === "win32" ? [name] : ["-lc", `command -v ${name}`];
  return spawnSync(finder, args, { stdio: "ignore" }).status === 0;
}

async function detectAgents(userHome) {
  const detected = [];
  for (const [id, agent] of Object.entries(AGENTS)) {
    const root = agent.root(userHome);
    const base = id === "hermes" ? path.join(userHome, ".hermes") : path.dirname(root);
    if (await exists(base) || commandExists(agent.command)) detected.push(id);
  }
  return detected;
}

function parseAgentSelection(value, detected) {
  if (!value || value === true || value === "detected") return detected;
  if (value === "all") return Object.keys(AGENTS);
  const selected = String(value).split(",").map((item) => item.trim()).filter(Boolean);
  if (!selected.length || selected.some((id) => !(id in AGENTS))) {
    fail("Utilise --agents=codex,claude,hermes, --agents=detected ou --agents=all.");
  }
  return [...new Set(selected)];
}

function openBrowser(url) {
  const commands = process.platform === "darwin"
    ? [["open", [url]]]
    : process.platform === "win32"
      ? [["rundll32.exe", ["url.dll,FileProtocolHandler", url]]]
      : [["xdg-open", [url]], ["gio", ["open", url]]];
  for (const [command, args] of commands) {
    const result = spawnSync(command, args, { stdio: "ignore" });
    if (result.status === 0) return true;
  }
  return false;
}

function connectedBrowserPage() {
  return `<!doctype html>
<html lang="fr">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BUILD Sync connecté</title>
<style>
  :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#0e0e0f;color:#f0ede8}
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 50% 0,rgba(232,213,176,.08),transparent 38%),#0e0e0f}
  main{width:min(100%,560px);border:1px solid rgba(232,213,176,.2);border-radius:18px;padding:32px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.018));box-shadow:0 24px 70px rgba(0,0,0,.5)}
  .mark{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 20px;border-radius:16px;background:#e8d5b0;color:#0e0e0f;font-weight:900;font-size:22px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
  .eyebrow{text-align:center;color:rgba(232,213,176,.72);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
  h1{margin:8px 0 0;text-align:center;font-size:clamp(25px,6vw,34px);letter-spacing:-.035em}p{margin:12px auto 0;max-width:430px;text-align:center;color:rgba(240,237,232,.62);font-size:14px;line-height:1.65}
  ol{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:28px 0 0;padding:0;list-style:none}.step{text-align:center;min-width:0}.dot{display:grid;place-items:center;width:30px;height:30px;margin:auto;border:1px solid rgba(255,255,255,.1);border-radius:999px;color:rgba(255,255,255,.35);font-size:11px;font-weight:700}.done .dot{border-color:rgba(232,213,176,.35);background:rgba(232,213,176,.12);color:#e8d5b0}.active .dot{border-color:#e8d5b0;background:#e8d5b0;color:#0e0e0f}.label{display:block;margin-top:7px;overflow:hidden;color:rgba(255,255,255,.38);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.active .label{color:#e8d5b0}
  .note{margin-top:26px;border-top:1px solid rgba(255,255,255,.09);padding-top:18px;font-size:12px;color:rgba(255,255,255,.42)}
  @media(max-width:420px){main{padding:24px 18px}ol{gap:4px}.label{font-size:9px}}
</style>
<main>
  <div class="mark" aria-hidden="true">B</div>
  <div class="eyebrow">Connexion réussie</div>
  <h1>BUILD Sync est connecté</h1>
  <p>Tu peux revenir dans ton terminal. BUILD vérifie maintenant les versions et installe automatiquement les skills inclus dans ton accès.</p>
  <ol aria-label="Progression de l'installation">
    <li class="step done"><span class="dot">✓</span><span class="label">Commande</span></li>
    <li class="step done"><span class="dot">✓</span><span class="label">Autorisation</span></li>
    <li class="step active"><span class="dot">3</span><span class="label">Installation</span></li>
    <li class="step"><span class="dot">4</span><span class="label">Mises à jour</span></li>
  </ol>
  <p class="note">Garde le terminal ouvert jusqu'au message « BUILD Sync est prêt ».</p>
</main>
</html>`;
}

async function waitForAuthorization(baseUrl, quiet) {
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier, "ascii").digest("base64url");
  const state = randomBytes(24).toString("base64url");

  let resolveCallback;
  let rejectCallback;
  const callback = new Promise((resolve, reject) => {
    resolveCallback = resolve;
    rejectCallback = reject;
  });

  const server = createServer((request, response) => {
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      if (request.method !== "GET" || url.pathname !== "/callback") {
        response.writeHead(404).end("Not found");
        return;
      }
      if (url.searchParams.get("state") !== state) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" }).end("État de connexion invalide.");
        rejectCallback(new Error("La réponse OAuth ne correspond pas à la demande locale."));
        return;
      }
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");
      if (error || !code) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" }).end("Connexion BUILD Sync annulée.");
        rejectCallback(new Error("Connexion BUILD Sync annulée."));
        return;
      }
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(connectedBrowserPage());
      resolveCallback({ code, verifier, redirectUri });
    } catch (error) {
      rejectCallback(error);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") fail("Impossible d'ouvrir le retour local BUILD Sync.");
  const redirectUri = `http://127.0.0.1:${address.port}/callback`;
  const resource = `${baseUrl}/api/build-sync`;
  const authorize = new URL("/api/build-sync/oauth/authorize", baseUrl);
  for (const [key, value] of Object.entries({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    resource,
    scope: SCOPE,
  })) authorize.searchParams.set(key, value);

  output("Ouverture de BUILD pour autoriser la synchronisation…", quiet);
  if (!openBrowser(authorize.toString())) output(`Ouvre cette adresse :\n${authorize}`, quiet);

  const timeout = setTimeout(() => rejectCallback(new Error("La connexion a expiré après cinq minutes.")), 300_000);
  try {
    return await callback;
  } finally {
    clearTimeout(timeout);
    await new Promise((resolve) => server.close(resolve));
  }
}

async function requestTokens(baseUrl, params) {
  const response = await fetch(`${baseUrl}/api/build-sync/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || typeof body.access_token !== "string" || typeof body.refresh_token !== "string") {
    fail(body.error_description || "BUILD n'a pas pu délivrer les accès de synchronisation.");
  }
  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    accessExpiresAt: Date.now() + Number(body.expires_in || 900) * 1_000,
  };
}

async function login(baseUrl, paths, quiet) {
  const grant = await waitForAuthorization(baseUrl, quiet);
  const credentials = await requestTokens(baseUrl, {
    grant_type: "authorization_code",
    code: grant.code,
    redirect_uri: grant.redirectUri,
    client_id: CLIENT_ID,
    code_verifier: grant.verifier,
    resource: `${baseUrl}/api/build-sync`,
  });
  await writeJsonSecure(paths.credentials, { baseUrl, ...credentials });
  return credentials;
}

async function getAccessToken(config, paths, quiet) {
  let credentials = await readJson(paths.credentials);
  if (!credentials || credentials.baseUrl !== config.baseUrl || typeof credentials.refreshToken !== "string") {
    credentials = await login(config.baseUrl, paths, quiet);
  }
  if (typeof credentials.accessToken === "string" && Number(credentials.accessExpiresAt) > Date.now() + 60_000) {
    return credentials.accessToken;
  }

  const release = await acquireLocalLock(paths, "token", 2 * 60_000);
  try {
    credentials = await readJson(paths.credentials);
    if (typeof credentials?.accessToken === "string" && Number(credentials.accessExpiresAt) > Date.now() + 60_000) {
      return credentials.accessToken;
    }
    const refreshed = await requestTokens(config.baseUrl, {
      grant_type: "refresh_token",
      refresh_token: credentials.refreshToken,
      client_id: CLIENT_ID,
      resource: `${config.baseUrl}/api/build-sync`,
    });
    await writeJsonSecure(paths.credentials, { baseUrl: config.baseUrl, ...refreshed });
    return refreshed.accessToken;
  } catch (error) {
    if (quiet) throw error;
    output("La connexion BUILD Sync doit être renouvelée.");
    const renewed = await login(config.baseUrl, paths, quiet);
    return renewed.accessToken;
  } finally {
    await release();
  }
}

async function authorizedFetch(config, paths, input, init = {}, quiet = false) {
  const accessToken = await getAccessToken(config, paths, quiet);
  return fetch(new URL(input, config.baseUrl), {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${accessToken}` },
  });
}

async function fetchCatalog(config, paths, quiet) {
  const response = await authorizedFetch(config, paths, "/api/build-sync/catalog", {}, quiet);
  const body = await response.json().catch(() => null);
  if (!response.ok || !body || !Array.isArray(body.artifacts)) {
    fail(body?.error === "unauthorized" ? "Connexion BUILD Sync refusée." : "Catalogue BUILD indisponible.");
  }
  return body;
}

async function downloadArtifact(config, paths, artifact, quiet) {
  const response = await authorizedFetch(config, paths, artifact.downloadUrl, {}, quiet);
  if (!response.ok) fail(`Téléchargement impossible : ${artifact.title}.`);
  const declared = Number(response.headers.get("content-length") || 0);
  if (declared > MAX_ARTIFACT_BYTES) fail(`Archive trop volumineuse : ${artifact.title}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_ARTIFACT_BYTES) fail(`Archive trop volumineuse : ${artifact.title}.`);
  if (sha256(bytes) !== artifact.sha256) fail(`Empreinte invalide : ${artifact.title}.`);
  return bytes;
}

function normalizeArchivePath(raw) {
  if (!raw || raw.includes("\0") || raw.includes("\\")) fail("Archive BUILD invalide.");
  if (raw.split("/").some((segment) => segment === "..")) fail("Archive BUILD invalide.");
  const normalized = path.posix.normalize(raw);
  if (normalized.startsWith("/") || normalized === ".." || normalized.startsWith("../")) {
    fail("Archive BUILD invalide.");
  }
  return normalized.replace(/^\.\//, "");
}

export function readStoredZip(bytes) {
  const files = new Map();
  let offset = 0;
  let entries = 0;
  let total = 0;
  while (offset + 4 <= bytes.length) {
    const signature = bytes.readUInt32LE(offset);
    if (signature === 0x02014b50 || signature === 0x06054b50) break;
    if (signature !== 0x04034b50 || offset + 30 > bytes.length) fail("Archive ZIP BUILD invalide.");
    const flags = bytes.readUInt16LE(offset + 6);
    const method = bytes.readUInt16LE(offset + 8);
    const compressedSize = bytes.readUInt32LE(offset + 18);
    const uncompressedSize = bytes.readUInt32LE(offset + 22);
    const nameLength = bytes.readUInt16LE(offset + 26);
    const extraLength = bytes.readUInt16LE(offset + 28);
    if ((flags & 0x08) !== 0 || method !== 0 || compressedSize !== uncompressedSize) {
      fail("Cette archive BUILD utilise un format ZIP non pris en charge.");
    }
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > bytes.length) fail("Archive ZIP BUILD tronquée.");
    const name = normalizeArchivePath(bytes.subarray(nameStart, nameStart + nameLength).toString("utf8"));
    offset = dataEnd;
    entries += 1;
    total += uncompressedSize;
    if (entries > MAX_ARCHIVE_ENTRIES || total > MAX_ARTIFACT_BYTES) fail("Archive BUILD hors limites.");
    if (!name.endsWith("/")) {
      if (files.has(name)) fail("Archive BUILD contenant un doublon.");
      files.set(name, Buffer.from(bytes.subarray(dataStart, dataEnd)));
    }
  }
  if (!files.size) fail("Archive BUILD vide.");
  return files;
}

function stripCommonRoot(files) {
  const names = [...files.keys()];
  const first = names[0].split("/")[0];
  if (!first || !names.every((name) => name.startsWith(`${first}/`))) return files;
  return new Map(names.map((name) => [name.slice(first.length + 1), files.get(name)]));
}

export function artifactUnits(artifact, bytes) {
  if (artifact.fileName.endsWith(".md")) {
    return new Map([[artifact.slug, new Map([["SKILL.md", bytes]])]]);
  }
  const files = stripCommonRoot(readStoredZip(bytes));
  if (files.has("SKILL.md")) return new Map([[artifact.slug, files]]);

  const roots = [...files.keys()]
    .filter((name) => name.endsWith("/SKILL.md"))
    .map((name) => name.slice(0, -"/SKILL.md".length));
  if (!roots.length) fail(`${artifact.title} ne contient aucun SKILL.md.`);
  if (new Set(roots).size !== roots.length) fail(`${artifact.title} contient des skills ambigus.`);

  const units = new Map();
  for (const root of roots) {
    if (roots.some((other) => other !== root && root.startsWith(`${other}/`))) {
      fail(`${artifact.title} contient des skills imbriqués non pris en charge.`);
    }
    const name = path.posix.basename(root);
    const unitFiles = new Map();
    for (const [file, content] of files) {
      if (file.startsWith(`${root}/`)) unitFiles.set(file.slice(root.length + 1), content);
    }
    units.set(name, unitFiles);
  }
  return units;
}

function injectCustomization(skillBytes) {
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(skillBytes);
  } catch {
    fail("SKILL.md n'est pas un fichier UTF-8 valide.");
  }
  return Buffer.from(`${text.replace(/\s+$/u, "")}${CUSTOM_BLOCK}\n`, "utf8");
}

async function writeUnit(stage, files, marker) {
  for (const [relative, raw] of files) {
    const safe = normalizeArchivePath(relative);
    const destination = path.resolve(stage, safe);
    if (!destination.startsWith(`${path.resolve(stage)}${path.sep}`)) fail("Chemin de skill invalide.");
    await mkdir(path.dirname(destination), { recursive: true });
    const bytes = safe === "SKILL.md" ? injectCustomization(raw) : raw;
    await writeFile(destination, bytes, { mode: 0o600 });
    marker.managedFiles[safe] = sha256(bytes);
  }
}

async function currentManagedChanges(target, marker) {
  if (!marker || !marker.managedFiles || typeof marker.managedFiles !== "object") return ["installation non gérée"];
  const changed = [];
  for (const [relative, expected] of Object.entries(marker.managedFiles)) {
    const file = path.join(target, relative);
    try {
      if (sha256(await readFile(file)) !== expected) changed.push(relative);
    } catch {
      changed.push(relative);
    }
  }
  const expected = new Set(Object.keys(marker.managedFiles));
  async function walk(directory, prefix = "") {
    const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (relative === CUSTOM_FILE || relative === MARKER_FILE) continue;
      if (entry.isSymbolicLink()) {
        changed.push(relative);
      } else if (entry.isDirectory()) {
        await walk(path.join(directory, entry.name), relative);
      } else if (entry.isFile() && !expected.has(relative)) {
        changed.push(relative);
      }
    }
  }
  await walk(target);
  return changed;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export async function installUnit({ agentId, root, unitName, files, artifact, releaseId, paths }) {
  await mkdir(root, { recursive: true, mode: 0o700 });
  const target = path.join(root, unitName);
  const priorMarker = await readJson(path.join(target, MARKER_FILE));
  const changes = await currentManagedChanges(target, priorMarker);
  if (priorMarker?.artifactSha256 === artifact.sha256 && changes.length === 0) {
    return { status: "current", unitName };
  }

  let custom = null;
  if (await exists(path.join(target, CUSTOM_FILE))) custom = await readFile(path.join(target, CUSTOM_FILE));
  let backupPath = null;
  if (await exists(target) && changes.length > 0) {
    backupPath = path.join(paths.backups, agentId, unitName, timestamp());
    await mkdir(path.dirname(backupPath), { recursive: true, mode: 0o700 });
    await cp(target, backupPath, { recursive: true, errorOnExist: true });
  }

  const stage = path.join(root, `.build-sync-stage-${unitName}-${process.pid}-${randomBytes(4).toString("hex")}`);
  const rollback = path.join(paths.rollbacks, agentId, unitName, timestamp());
  const marker = {
    schemaVersion: 1,
    managedBy: "BUILD Sync",
    releaseId,
    artifactSlug: artifact.slug,
    artifactSha256: artifact.sha256,
    installedAt: new Date().toISOString(),
    managedFiles: {},
  };
  await mkdir(stage, { recursive: true, mode: 0o700 });
  try {
    await writeUnit(stage, files, marker);
    await writeFile(path.join(stage, CUSTOM_FILE), custom || CUSTOM_TEMPLATE, { mode: 0o600 });
    await writeFile(path.join(stage, MARKER_FILE), `${JSON.stringify(marker, null, 2)}\n`, { mode: 0o600 });
    if (await exists(target)) {
      await mkdir(path.dirname(rollback), { recursive: true, mode: 0o700 });
      await rename(target, rollback);
    }
    await rename(stage, target);
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    if (!(await exists(target)) && await exists(rollback)) await rename(rollback, target);
    throw error;
  }
  return { status: priorMarker ? "updated" : "installed", unitName, backupPath, changes };
}

async function syncSkills(config, paths, quiet = false) {
  const releaseLock = await acquireLocalLock(paths, "sync");
  try {
    const catalog = await fetchCatalog(config, paths, quiet);
    const summary = { installed: 0, updated: 0, current: 0, backups: [] };
    output(`→ Vérification de ${catalog.artifacts.length} skill(s) BUILD…`, quiet);
    for (const [artifactIndex, artifact] of catalog.artifacts.entries()) {
      output(`  ${String(artifactIndex + 1).padStart(2, "0")}/${String(catalog.artifacts.length).padStart(2, "0")}  ${terminalText(artifact.title)}`, quiet);
      let units = null;
      for (const agentId of config.agents) {
        const root = AGENTS[agentId].root(paths.userHome);
        if (!units) {
          const bytes = await downloadArtifact(config, paths, artifact, quiet);
          units = artifactUnits(artifact, bytes);
        }
        for (const [unitName, files] of units) {
          const result = await installUnit({ agentId, root, unitName, files, artifact, releaseId: catalog.releaseId, paths });
          summary[result.status] += 1;
          if (result.backupPath) summary.backups.push(result.backupPath);
        }
      }
    }
    const nextConfig = { ...config, lastCheckedAt: new Date().toISOString(), lastReleaseId: catalog.releaseId };
    await writeJsonSecure(paths.config, nextConfig);
    output(`✓ BUILD Sync : ${summary.installed} installé(s), ${summary.updated} mis à jour, ${summary.current} déjà à jour.`, quiet);
    if (summary.backups.length) {
      output(`  Sauvegarde créée : ${paths.backups}`, quiet);
    }
    return summary;
  } finally {
    await releaseLock();
  }
}

function xmlEscape(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
}

function systemdQuote(value) {
  return `"${String(value).replace(/([\\"])/g, "\\$1")}"`;
}

async function installScheduler(paths, quiet) {
  const script = fileURLToPath(import.meta.url);
  if (process.platform === "darwin") {
    const launchAgents = path.join(paths.userHome, "Library", "LaunchAgents");
    const plist = path.join(launchAgents, "com.buildbyorsayn.skills-sync.plist");
    const logDir = path.join(paths.root, "logs");
    await mkdir(launchAgents, { recursive: true });
    await mkdir(logDir, { recursive: true, mode: 0o700 });
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>com.buildbyorsayn.skills-sync</string>
<key>ProgramArguments</key><array><string>${xmlEscape(process.execPath)}</string><string>${xmlEscape(script)}</string><string>skills</string><string>update</string><string>--quiet</string></array>
<key>RunAtLoad</key><true/><key>StartInterval</key><integer>21600</integer>
<key>StandardOutPath</key><string>${xmlEscape(path.join(logDir, "sync.log"))}</string>
<key>StandardErrorPath</key><string>${xmlEscape(path.join(logDir, "sync-error.log"))}</string>
</dict></plist>\n`;
    await writeFile(plist, body, { mode: 0o600 });
    spawnSync("launchctl", ["bootout", `gui/${process.getuid?.() || 0}`, plist], { stdio: "ignore" });
    const loaded = spawnSync("launchctl", ["bootstrap", `gui/${process.getuid?.() || 0}`, plist], { stdio: "ignore" });
    if (loaded.status !== 0) output("La tâche automatique sera chargée à la prochaine connexion macOS.", quiet);
    return true;
  }
  if (process.platform === "linux" && commandExists("systemctl")) {
    const unitDir = path.join(paths.userHome, ".config", "systemd", "user");
    await mkdir(unitDir, { recursive: true, mode: 0o700 });
    await writeFile(path.join(unitDir, "build-skills-sync.service"), `[Unit]\nDescription=Synchronise les skills BUILD\n\n[Service]\nType=oneshot\nExecStart=${systemdQuote(process.execPath)} ${systemdQuote(script)} skills update --quiet\n`, { mode: 0o600 });
    await writeFile(path.join(unitDir, "build-skills-sync.timer"), `[Unit]\nDescription=Vérifie les skills BUILD\n\n[Timer]\nOnBootSec=2min\nOnUnitActiveSec=6h\nPersistent=true\n\n[Install]\nWantedBy=timers.target\n`, { mode: 0o600 });
    spawnSync("systemctl", ["--user", "daemon-reload"], { stdio: "ignore" });
    const enabled = spawnSync("systemctl", ["--user", "enable", "--now", "build-skills-sync.timer"], { stdio: "ignore" });
    return enabled.status === 0;
  }
  if (process.platform === "win32") {
    const command = `"${process.execPath}" "${script}" skills update --quiet`;
    const created = spawnSync("schtasks.exe", ["/Create", "/F", "/SC", "HOURLY", "/MO", "6", "/TN", "BUILD Skills Sync", "/TR", command], { stdio: "ignore" });
    return created.status === 0;
  }
  return false;
}

async function setup(flags) {
  const paths = homePaths();
  const baseUrl = normalizeBaseUrl(typeof flags["base-url"] === "string" ? flags["base-url"] : DEFAULT_BASE_URL);
  output("\nBUILD Sync — installation guidée\n");
  output("[1/4] Détection des assistants");
  const detected = await detectAgents(paths.userHome);
  const agents = parseAgentSelection(flags.agents, detected);
  if (!agents.length) fail("Aucun agent détecté. Relance avec --agents=codex,claude,hermes ou --agents=all.");
  const config = { schemaVersion: 1, baseUrl, agents, createdAt: new Date().toISOString() };
  await writeJsonSecure(paths.config, config);
  output(`✓ Agents détectés : ${agents.map((id) => AGENTS[id].label).join(", ")}.`);
  output("\n[2/4] Connexion au compte BUILD");
  await login(baseUrl, paths, false);
  output("✓ Compte BUILD autorisé.");
  output("\n[3/4] Installation des skills");
  await syncSkills(config, paths, false);
  output("\n[4/4] Mises à jour automatiques");
  const scheduled = flags["no-schedule"] ? false : await installScheduler(paths, false);
  output(scheduled
    ? "Mises à jour automatiques activées toutes les six heures."
    : "Synchronisation installée. Lance `build-skills update` pour vérifier les mises à jour.");
  output("\n✓ BUILD Sync est prêt. Tu peux fermer ce terminal.\n");
}

async function loadConfig(paths) {
  const config = await readJson(paths.config);
  if (!config || !Array.isArray(config.agents) || !config.agents.length) {
    fail("BUILD Sync n'est pas configuré. Lance `build-skills setup`.");
  }
  config.baseUrl = normalizeBaseUrl(config.baseUrl);
  config.agents = config.agents.filter((id) => id in AGENTS);
  if (!config.agents.length) fail("Aucun agent BUILD Sync valide n'est configuré.");
  return config;
}

async function status() {
  const paths = homePaths();
  const config = await loadConfig(paths);
  const catalog = await fetchCatalog(config, paths, false);
  let current = 0;
  let outdated = 0;
  for (const artifact of catalog.artifacts) {
    for (const agentId of config.agents) {
      const root = AGENTS[agentId].root(paths.userHome);
      const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
      const installations = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => ({
        target: path.join(root, entry.name),
        marker: await readJson(path.join(root, entry.name, MARKER_FILE)),
      })));
      const matching = installations.filter(({ marker }) => marker?.artifactSlug === artifact.slug);
      if (!matching.length) {
        outdated += 1;
        continue;
      }
      for (const installation of matching) {
        const changes = await currentManagedChanges(installation.target, installation.marker);
        if (installation.marker.artifactSha256 === artifact.sha256 && changes.length === 0) current += 1;
        else outdated += 1;
      }
    }
  }
  output(outdated === 0
    ? `✓ Tous les skills BUILD sont à jour (${current} installation(s), release ${catalog.releaseId}).`
    : `${outdated} installation(s) doivent être mises à jour. Lance \`build-skills update\`.`);
}

async function logout() {
  const paths = homePaths();
  const config = await readJson(paths.config);
  if (config?.baseUrl && await exists(paths.credentials)) {
    await authorizedFetch(config, paths, "/api/build-sync/session", { method: "DELETE" }, false).catch(() => null);
  }
  if (await exists(paths.credentials)) await rm(paths.credentials, { force: true });
  output("Toutes les connexions BUILD Sync ont été révoquées. Les skills installés restent en place.");
}

function help() {
  output(`BUILD Sync

Usage :
  build-skills setup [--agents=detected|all|codex,claude,hermes]
  build-skills update [--quiet]
  build-skills status
  build-skills logout

Les versions officielles sont mises à jour automatiquement. Écris tes adaptations
dans CUSTOM.md : ce fichier n'est jamais remplacé.`);
}

export async function main(argv = process.argv.slice(2)) {
  const { command, flags } = parseArgs(argv);
  if (command === "setup" || command === "install") return setup(flags);
  if (command === "update") {
    const paths = homePaths();
    return syncSkills(await loadConfig(paths), paths, Boolean(flags.quiet));
  }
  if (command === "status") return status();
  if (command === "logout") return logout();
  if (command === "help" || flags.help) return help();
  fail(`Commande inconnue : ${command}`);
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  main().catch((error) => {
    if (process.argv.includes("--quiet")) process.exitCode = 1;
    else {
      process.stderr.write(`\n✗ BUILD Sync : ${error?.message || "erreur inconnue"}\n`);
      process.exitCode = 1;
    }
  });
}
