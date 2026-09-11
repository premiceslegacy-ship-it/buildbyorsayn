// Privileged runtime reader. Import only from server components or operator scripts.
import { DOCTRINE_BUCKET, DOCTRINE_MANIFEST_PATH, doctrineArtifactPath, parseDoctrineManifest, verifyDoctrineFiles, type DoctrineFile } from "./publication";
import { DOCTRINE_MANIFEST_MAX_BYTES, DOCTRINE_TOTAL_MAX_BYTES, DOCTRINE_READ_TIMEOUT_MS, readBoundedResponse, withinDoctrineReadDeadline, type DoctrineReadBudget } from "./readbounded";

// Doctrine is republished manually (see SKILLS-PUBLICATION.md), not on every
// request - a short in-memory TTL removes the redundant re-download and
// re-hash of up to 18 files on every visit without risking stale content for
// long. The access gate (doctrineAccessStatus) is never cached: only the
// verified file contents are.
const DOCTRINE_CACHE_TTL_MS = 90_000;
let cachedFiles: { files: readonly DoctrineFile[]; expiresAt: number } | null = null;

async function readPublishedDoctrineUncached(): Promise<readonly DoctrineFile[]> {
  if (typeof window !== "undefined") throw new Error("Server runtime required");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Doctrine storage unavailable");
  // Deadline is a fixed timestamp read concurrently, never mutated - safe to
  // share across parallel artifact downloads. Byte budget, by contrast, is
  // mutated per-read and NOT thread-safe (see readBoundedResponse) - each
  // artifact download below gets its own isolated byte sub-budget instead.
  const sharedDeadline = performance.now() + DOCTRINE_READ_TIMEOUT_MS;
  const controller = new AbortController();
  try {
    const fetchBounded = async (path: string, budget: DoctrineReadBudget) => {
      const response = await withinDoctrineReadDeadline(() => fetch(
        `${url.replace(/\/$/, "")}/storage/v1/${path}`, {
          method: "GET", headers: { apikey: key, Authorization: `Bearer ${key}` },
          cache: "no-store", redirect: "error", signal: controller.signal,
        }).then(response => {
          // Also dispose a late response from a transport that ignored abort.
          if (controller.signal.aborted) { void response.body?.cancel().catch(() => undefined); throw new Error("Published doctrine unavailable"); }
          return response;
        }), budget);
      return readBoundedResponse(response, budget.remainingBytes, budget);
    };
    const decode = (bytes: Uint8Array) => JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    const bucket = decode(await fetchBounded(`bucket/${DOCTRINE_BUCKET}`, { remainingBytes: DOCTRINE_MANIFEST_MAX_BYTES, deadline: sharedDeadline }));
    if (!bucket || bucket.public !== false) throw new Error("Private doctrine bucket required");
    const manifest = parseDoctrineManifest(decode(await fetchBounded(`object/${DOCTRINE_BUCKET}/${DOCTRINE_MANIFEST_PATH}`, { remainingBytes: DOCTRINE_MANIFEST_MAX_BYTES, deadline: sharedDeadline })));
    // Fail before artifact requests; total stays bounded even though each
    // artifact now carries its own isolated sub-budget below.
    const totalArtifactBytes = manifest.artifacts.reduce((sum, artifact) => sum + artifact.bytes, 0);
    if (totalArtifactBytes > DOCTRINE_TOTAL_MAX_BYTES) throw new Error("Published doctrine unavailable");
    const files = await verifyDoctrineFiles(manifest, (path, artifact) =>
      fetchBounded(`object/${DOCTRINE_BUCKET}/${path}`, { remainingBytes: artifact.bytes, deadline: sharedDeadline })
    );
    if (performance.now() >= sharedDeadline) throw new Error("Published doctrine unavailable");
    return files;
  } catch { throw new Error("Published doctrine unavailable"); }
  finally { controller.abort(); }
}

export async function readPublishedDoctrine(): Promise<readonly DoctrineFile[]> {
  if (cachedFiles && cachedFiles.expiresAt > Date.now()) return cachedFiles.files;
  const files = await readPublishedDoctrineUncached();
  cachedFiles = { files, expiresAt: Date.now() + DOCTRINE_CACHE_TTL_MS };
  return files;
}

/** Test-only: each test simulates a distinct remote state and must not see a previous test's cached result. */
export function __resetDoctrineCacheForTests(): void {
  cachedFiles = null;
}
