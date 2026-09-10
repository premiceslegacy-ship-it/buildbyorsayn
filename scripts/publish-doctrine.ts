import { config as loadEnv } from "dotenv";
import { readdir, readFile, lstat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { DOCTRINE_BUCKET, DOCTRINE_MANIFEST_PATH, doctrineArtifactPath, parseDoctrineManifest, sha256, verifyDoctrineFiles, withDoctrinePublicationLock } from "../lib/doctrine/publication";
import { createDoctrinePublisherTransport } from "../lib/doctrine/publishertransport";
import { doctrineDocuments } from "../lib/knowledge/doctrineSource";
import { findKnowledgeSecretHazards } from "../lib/knowledge/safety";

loadEnv({ path: ".env.local", quiet: true });
const args = process.argv.slice(2);
if (args.some(arg => arg !== "--apply" && !arg.startsWith("--source="))) throw new Error("Unknown publisher argument");
const apply = args.includes("--apply");
const source = args.find(arg => arg.startsWith("--source="))?.slice(9) || process.env.DOCTRINE_SOURCE_DIR;
if (!source) throw new Error("Set DOCTRINE_SOURCE_DIR or --source=<private corpus directory>");

async function main() {
  const directory = resolve(source!);
  if ((await lstat(directory)).isSymbolicLink()) throw new Error("Symlink source refused");
  const names = (await readdir(directory)).filter(name => name !== ".DS_Store").sort();
  if (names.length !== 9) throw new Error("Expected exactly nine doctrine Markdown files");
  const bytesByName = new Map<string, Buffer>();
  for (const name of names) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.md$/.test(name)) throw new Error("Unexpected source entry");
    const stat = await lstat(join(directory, name));
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Regular files required");
    bytesByName.set(name, await readFile(join(directory, name)));
  }
  const manifest = parseDoctrineManifest({ schemaVersion: 1, tier: "full", releaseId: randomUUID(),
    artifacts: names.map(path => { const bytes = bytesByName.get(path)!; return { path, bytes: bytes.length, sha256: sha256(bytes) }; }),
  });
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
            !(await readFile(join(directory, name))).equals(bytesByName.get(name)!)) throw new Error("Source changed");
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
