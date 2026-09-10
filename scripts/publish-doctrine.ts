import { config as loadEnv } from "dotenv";
import { readdir, lstat, open } from "node:fs/promises";
import { resolve, join } from "node:path";
import { constants } from "node:fs";
import { DOCTRINE_TOTAL_MAX_BYTES, DOCTRINE_MANIFEST_MAX_BYTES } from "../lib/doctrine/readbounded";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { DOCTRINE_BUCKET, DOCTRINE_MANIFEST_PATH, doctrineArtifactPath, parseDoctrineManifest, sha256, verifyDoctrineFiles, withDoctrinePublicationLock } from "../lib/doctrine/publication";
import { createDoctrinePublisherTransport, preflightDoctrinePublication } from "../lib/doctrine/publishertransport";
import { doctrineInventory } from "../lib/doctrine/inventory";
import { doctrineDocuments } from "../lib/knowledge/doctrineSource";
import { findKnowledgeSecretHazards } from "../lib/knowledge/safety";

const args = process.argv.slice(2);
if (args.some(arg => arg !== "--apply" && !arg.startsWith("--source="))) throw new Error("Unknown publisher argument");
const apply = args.includes("--apply");
if (apply) loadEnv({ path: ".env.local", quiet: true });
const source = args.find(arg => arg.startsWith("--source="))?.slice(9) || process.env.DOCTRINE_SOURCE_DIR;
if (!source) throw new Error("Set DOCTRINE_SOURCE_DIR or --source=<private corpus directory>");

// Reject replacement symlinks and open replacement FIFOs without waiting for a writer.
// Validate the handle before allocating/reading; O_NONBLOCK does not deadline regular disk IO.
async function readSource(path: string, limit: number): Promise<Buffer> {
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const stat = await file.stat();
    if (!stat.isFile() || stat.size <= 0 || stat.size > limit) throw new Error("Source size invalid");
    const bytes = Buffer.alloc(stat.size);
    let offset = 0;
    while (offset < bytes.length) {
      const { bytesRead } = await file.read(bytes, offset, bytes.length - offset, offset);
      if (!bytesRead) throw new Error("Source truncated");
      offset += bytesRead;
    }
    const extra = await file.read(Buffer.alloc(1), 0, 1, offset);
    if (extra.bytesRead) throw new Error("Source grew");
    return bytes;
  } finally { await file.close(); }
}

async function main() {
  const directory = resolve(source!);
  if ((await lstat(directory)).isSymbolicLink()) throw new Error("Symlink source refused");
  const names = (await readdir(directory)).filter(name => name !== ".DS_Store").sort();
  doctrineInventory(names);
  const bytesByName = new Map<string, Buffer>();
  let remaining = DOCTRINE_TOTAL_MAX_BYTES - 2 * DOCTRINE_MANIFEST_MAX_BYTES;
  // Stat the entire inventory before allocating any content or starting network.
  for (const name of names) {
    const stat = await lstat(join(directory, name));
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size <= 0 || stat.size > 2_000_000 || stat.size > remaining) throw new Error("Source budget invalid");
    remaining -= stat.size;
  }
  remaining = DOCTRINE_TOTAL_MAX_BYTES - 2 * DOCTRINE_MANIFEST_MAX_BYTES;
  for (const name of names) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.md$/.test(name)) throw new Error("Unexpected source entry");
    const stat = await lstat(join(directory, name));
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Regular files required");
    const bytes = await readSource(join(directory, name), Math.min(2_000_000, remaining));
    bytesByName.set(name, bytes);
    remaining -= bytes.length;
  }
  const manifest = parseDoctrineManifest({ schemaVersion: 1, tier: "full", releaseId: randomUUID(),
    artifacts: names.map(path => { const bytes = bytesByName.get(path)!; return { path, bytes: bytes.length, sha256: sha256(bytes) }; }),
  });
  preflightDoctrinePublication(manifest);
  const files = await verifyDoctrineFiles(manifest, async path => bytesByName.get(path.split("/").pop()!)!);
  if (findKnowledgeSecretHazards(doctrineDocuments(files)).length) throw new Error("Possible secret in doctrine; publication refused");
  console.log(`${apply ? "APPLY" : "DRY-RUN"}: ${files.length} verified full-only doctrine files`);
  for (const artifact of manifest.artifacts) console.log(`${artifact.path} ${artifact.bytes} ${artifact.sha256}`);
  if (!apply) { console.log("No network calls or writes. Use --apply only after review."); return; }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Storage credentials missing");
  const transport = createDoctrinePublisherTransport(url, key, manifest);
  await transport.run(async () => {
    const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: transport.fetch } });
    const { data: bucket, error: bucketError } = await admin.storage.getBucket(DOCTRINE_BUCKET);
    if (bucketError || !bucket || bucket.public !== false) throw new Error("Existing private skills bucket required");
    const storage = admin.storage.from(DOCTRINE_BUCKET);
    const download = transport.download;
    await withDoctrinePublicationLock(admin, async () => {
      for (const artifact of manifest.artifacts) {
        const bytes = bytesByName.get(artifact.path)!;
        const path = doctrineArtifactPath(manifest, artifact.path);
        const { error } = await storage.upload(path, bytes, { upsert: false, contentType: "text/markdown; charset=utf-8", cacheControl: "0" });
        if (error) throw new Error("Artifact upload failed");
        const actual = await download(path);
        if (!Buffer.from(actual).equals(bytes)) throw new Error("Artifact readback mismatch");
      }
      await verifyDoctrineFiles(manifest, download);
      // Abort before advancing the pointer if the canonical source changed mid-flight.
      const currentNames = (await readdir(directory)).filter(name => name !== ".DS_Store").sort();
      if (JSON.stringify(currentNames) !== JSON.stringify(names)) throw new Error("Source inventory changed");
      for (const name of names) {
        if ((await lstat(join(directory, name))).isSymbolicLink() ||
            !(await readSource(join(directory, name), bytesByName.get(name)!.length)).equals(bytesByName.get(name)!)) throw new Error("Source changed");
      }
      const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + "\n");
      const { error } = await storage.upload(DOCTRINE_MANIFEST_PATH, manifestBytes, {
        upsert: true, contentType: "application/json", cacheControl: "0",
      });
      if (error) throw new Error("Manifest publication failed");
      const actualManifest = await download(DOCTRINE_MANIFEST_PATH);
      if (!Buffer.from(actualManifest).equals(manifestBytes)) throw new Error("Manifest readback mismatch");
      await verifyDoctrineFiles(parseDoctrineManifest(JSON.parse(Buffer.from(actualManifest).toString("utf8"))), download);
      transport.check(); // Never release after deadline or an ambiguous transport failure.
    });
  });
  console.log(`Published ${DOCTRINE_MANIFEST_PATH}; exact manifest and artifact readbacks verified.`);
}
main().catch(() => { console.error("Doctrine publication failed; pointer may require operator verification if failure followed its upload."); process.exitCode = 1; });
