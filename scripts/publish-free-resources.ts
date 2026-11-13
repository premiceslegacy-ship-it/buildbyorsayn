/**
 * Dépose les deux ressources gratuites dans le dépôt privé `free-resources`.
 *
 *   npm run resources:publish            dépose les fichiers (ÉCRITURE : demande l'accord de Samuel avant)
 *   npm run resources:publish -- --check lit seulement : liste ce qui est déjà en ligne, ne modifie rien
 *
 * Les fichiers viennent de FREE_RESOURCES_DIR (par défaut : « 05 - Ressources gratuites/_zips » dans le dossier ORSAYN_AI_ROOT).
 * Le dépôt doit rester privé : le script refuse de continuer s'il est public. Chaque fichier est relu après envoi et comparé octet par octet.
 */
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { FREE_RESOURCES, FREE_RESOURCE_BUCKET } from "../lib/freeResources";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

const checkOnly = process.argv.includes("--check");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.");

const root = process.env.ORSAYN_AI_ROOT;
const sourceDir = process.env.FREE_RESOURCES_DIR ?? (root ? path.join(root, "Contenu et réseaux", "05 - Ressources gratuites", "_zips") : "");
if (!sourceDir) throw new Error("Indique FREE_RESOURCES_DIR ou ORSAYN_AI_ROOT.");

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const sha256 = (body: Buffer) => createHash("sha256").update(body).digest("hex");

async function ensurePrivateBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  const existing = buckets.find((bucket) => bucket.name === FREE_RESOURCE_BUCKET);
  if (existing?.public) throw new Error(`Le dépôt ${FREE_RESOURCE_BUCKET} doit rester privé.`);
  if (!existing) {
    if (checkOnly) { console.log(`Le dépôt ${FREE_RESOURCE_BUCKET} n'existe pas encore.`); return false; }
    const { error: createError } = await supabase.storage.createBucket(FREE_RESOURCE_BUCKET, { public: false });
    if (createError) throw createError;
  }
  return true;
}

async function main() {
  if (!(await ensurePrivateBucket())) return;
  for (const resource of FREE_RESOURCES) {
    const remote = await supabase.storage.from(FREE_RESOURCE_BUCKET).download(resource.fileName);
    const remoteBody = remote.data ? Buffer.from(await remote.data.arrayBuffer()) : null;
    if (checkOnly) {
      console.log(`${resource.fileName} : ${remoteBody ? `en ligne (${remoteBody.length} octets, sha256 ${sha256(remoteBody).slice(0, 12)})` : "absent"}`);
      continue;
    }
    const body = await readFile(path.join(sourceDir, resource.fileName));
    const { error } = await supabase.storage.from(FREE_RESOURCE_BUCKET).upload(resource.fileName, body, { contentType: "application/zip", upsert: true });
    if (error) throw error;
    const back = await supabase.storage.from(FREE_RESOURCE_BUCKET).download(resource.fileName);
    if (back.error || !back.data) throw back.error ?? new Error(`Relecture impossible : ${resource.fileName}`);
    if (!Buffer.from(await back.data.arrayBuffer()).equals(body)) throw new Error(`Relecture différente : ${resource.fileName}`);
    console.log(`Envoyé : ${resource.fileName} (${body.length} octets, relecture vérifiée)`);
  }
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
