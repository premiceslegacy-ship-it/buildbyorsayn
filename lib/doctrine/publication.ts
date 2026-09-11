import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";

export const DOCTRINE_BUCKET = "skills";

type PublicationLockClient = {
  rpc: (name: string, args: { requested_lock_key: string; requested_lock_token: string }) =>
    PromiseLike<{ data: unknown; error: unknown }>;
};

export async function withDoctrinePublicationLock<T>(client: PublicationLockClient, publish: () => Promise<T>): Promise<T> {
  const args = { requested_lock_key: "doctrine", requested_lock_token: randomUUID() };
  const acquired = await client.rpc("acquire_skill_publication_lock", args);
  if (acquired.error || acquired.data !== true) throw new Error("Doctrine publication lock unavailable");
  // No finally: on failure or ambiguous network timeout, retain the lock.
  // Recovery requires stopped publishers and resolved in-flight Storage writes.
  const result = await publish();
  const released = await client.rpc("release_skill_publication_lock", args);
  if (released.error || released.data !== true) throw new Error("Doctrine publication lock release unverified");
  return result;
}
export const DOCTRINE_MANIFEST_PATH = "doctrine/v1/manifest.json";
const artifactSchema = z.object({
  path: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.md$/),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  bytes: z.number().int().positive().max(2_000_000),
}).strict();
const manifestSchema = z.object({
  schemaVersion: z.literal(1),
  releaseId: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/),
  tier: z.literal("full"),
  artifacts: z.array(artifactSchema).min(1).max(100),
}).strict().refine(value => new Set(value.artifacts.map(item => item.path)).size === value.artifacts.length,
  "Duplicate doctrine artifacts");
export type DoctrineManifest = z.infer<typeof manifestSchema>;
export type DoctrineFile = { path: string; content: string };
export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}
export function parseDoctrineManifest(value: unknown): DoctrineManifest {
  return manifestSchema.parse(value);
}
export function doctrineArtifactPath(manifest: DoctrineManifest, path: string): string {
  const valid = parseDoctrineManifest(manifest);
  if (!valid.artifacts.some(item => item.path === path)) throw new Error("Unknown doctrine artifact");
  return `doctrine/releases/${valid.releaseId}/${path}`;
}
export async function verifyDoctrineFiles(
  manifest: DoctrineManifest,
  download: (storagePath: string, artifact: DoctrineManifest["artifacts"][number]) => Promise<Uint8Array>,
): Promise<DoctrineFile[]> {
  const valid = parseDoctrineManifest(manifest);
  // Artifacts are independent (no shared mutable state between them once each
  // gets its own byte/time budget - see readPublishedDoctrine), so they can
  // download concurrently. Order in the result still follows the manifest.
  return Promise.all(valid.artifacts.map(async (artifact) => {
    const bytes = await download(doctrineArtifactPath(valid, artifact.path), artifact);
    if (bytes.byteLength !== artifact.bytes || sha256(bytes) !== artifact.sha256) {
      throw new Error("Doctrine integrity verification failed");
    }
    const content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { path: artifact.path, content };
  }));
}
