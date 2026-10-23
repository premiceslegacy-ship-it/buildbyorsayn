import { chmod, lstat, mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CONFIG_PATH = process.env.BUILD_ADMIN_CONFIG_PATH
  || join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "build-admin", "config.json");
const REPOSITORY_ROOT = resolve(fileURLToPath(new URL("../../", import.meta.url)));

function assertConfigOutsideRepository(path) {
  const relation = relative(REPOSITORY_ROOT, resolve(path));
  if (relation === "" || (!relation.startsWith("..") && !relation.includes(":"))) {
    throw new Error("Le fichier de connexion doit rester hors du dépôt.");
  }
}

export function normalizeOrigin(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Adresse invalide.");
  }
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]" || url.hostname === "::1";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) {
    throw new Error("HTTPS est requis, sauf en boucle locale.");
  }
  if (url.username || url.password || url.search || url.hash) throw new Error("Adresse invalide.");
  return url.origin;
}

export async function requestWithOriginPolicy(url, init = {}, options = {}) {
  const fetchImpl = options.fetch || fetch;
  const expectedOrigin = new URL(url).origin;
  let current = new URL(url);
  for (let count = 0; count <= 3; count += 1) {
    const response = await fetchImpl(current, { ...init, redirect: "manual" });
    if (response.status < 300 || response.status >= 400) return response;
    const location = response.headers.get("location");
    if (!location) throw new Error("Redirection invalide.");
    const next = new URL(location, current);
    if (next.origin !== expectedOrigin) throw new Error("Redirection vers une autre origine refusée.");
    current = next;
  }
  throw new Error("Trop de redirections.");
}

export async function saveConfig(origin, token) {
  assertConfigOutsideRepository(CONFIG_PATH);
  const normalized = normalizeOrigin(origin);
  if (!/^btv_agt_[A-Za-z0-9_-]{43}$/.test(token)) throw new Error("Jeton invalide.");
  await mkdir(dirname(CONFIG_PATH), { recursive: true, mode: 0o700 });
  const temporary = `${CONFIG_PATH}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify({ origin: normalized, token })}\n`, { mode: 0o600, flag: "wx" });
  await chmod(temporary, 0o600);
  await rename(temporary, CONFIG_PATH);
  await chmod(CONFIG_PATH, 0o600);
  return { origin: normalized };
}

export async function loadConfig() {
  assertConfigOutsideRepository(CONFIG_PATH);
  const metadata = await lstat(CONFIG_PATH).catch(() => null);
  if (!metadata?.isFile() || (metadata.mode & 0o077) !== 0) {
    throw new Error("Le fichier de connexion doit être un fichier 0600.");
  }
  let raw;
  try {
    raw = await readFile(CONFIG_PATH, "utf8");
  } catch {
    throw new Error("Lance build-admin login avant cette commande.");
  }
  const parsed = JSON.parse(raw);
  const origin = normalizeOrigin(parsed.origin);
  if (!/^btv_agt_[A-Za-z0-9_-]{43}$/.test(parsed.token)) throw new Error("Configuration invalide.");
  return { origin, token: parsed.token };
}

export async function removeConfig() {
  await unlink(CONFIG_PATH).catch((error) => {
    if (error?.code !== "ENOENT") throw error;
  });
}

export async function callTool(tool, input, options = {}) {
  const config = options.config || await loadConfig();
  const url = new URL("/api/agent/tools", config.origin);
  const response = await requestWithOriginPolicy(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
      "x-vercel-forwarded-for": "127.0.0.1",
    },
    body: JSON.stringify({ tool, input }),
  }, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.ok !== true) throw new Error(typeof body.error === "string" ? body.error : "La commande a échoué.");
  return body.result?.structuredContent || body.result;
}

const MIME_BY_EXTENSION = new Map([
  [".mp4", "video/mp4"],
  [".mov", "video/quicktime"],
  [".webm", "video/webm"],
  [".m4v", "video/x-m4v"],
]);

export async function uploadVideo(filePath, sectionId, title, options = {}) {
  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) throw new Error("Fichier vidéo introuvable.");
  const type = MIME_BY_EXTENSION.get(extname(filePath).toLowerCase());
  if (!type) throw new Error("Format vidéo refusé.");
  const prepared = await callTool("envoyer_video", {
    sectionId,
    title: title || basename(filePath, extname(filePath)),
    file: { name: basename(filePath), size: fileStat.size, type },
  }, options);
  const uploadUrl = new URL(prepared.uploadUrl);
  if (uploadUrl.protocol !== "https:") throw new Error("L'adresse Mux doit utiliser HTTPS.");
  const response = await requestWithOriginPolicy(uploadUrl, {
    method: "PUT",
    headers: { "content-type": type, "content-length": String(fileStat.size) },
    body: createReadStream(filePath),
    duplex: "half",
  }, options);
  if (!response.ok) throw new Error("L'envoi vers Mux a échoué.");
  return { videoId: prepared.videoId, status: "uploaded" };
}
