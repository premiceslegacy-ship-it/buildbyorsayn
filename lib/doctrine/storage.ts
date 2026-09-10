// Privileged runtime reader. Import only from server components or operator scripts.
import { DOCTRINE_BUCKET, DOCTRINE_MANIFEST_PATH, doctrineArtifactPath, parseDoctrineManifest, verifyDoctrineFiles } from "./publication";
import { DOCTRINE_MANIFEST_MAX_BYTES, DOCTRINE_TOTAL_MAX_BYTES, DOCTRINE_READ_TIMEOUT_MS, readBoundedResponse, withinDoctrineReadDeadline } from "./readbounded";

export async function readPublishedDoctrine() {
  if (typeof window !== "undefined") throw new Error("Server runtime required");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Doctrine storage unavailable");
  const budget = { remainingBytes: DOCTRINE_TOTAL_MAX_BYTES, deadline: performance.now() + DOCTRINE_READ_TIMEOUT_MS };
  const controller = new AbortController();
  try {
    // Direct Storage GET avoids the SDK's fully accumulated Blob (and retry layer).
    const download = async (path: string, maxBytes: number) => {
      const response = await withinDoctrineReadDeadline(() => fetch(
        `${url.replace(/\/$/, "")}/storage/v1/${path}`, {
          method: "GET", headers: { apikey: key, Authorization: `Bearer ${key}` },
          cache: "no-store", redirect: "error", signal: controller.signal,
        }).then(response => {
          // Also dispose a late response from a transport that ignored abort.
          if (controller.signal.aborted) { void response.body?.cancel().catch(() => undefined); throw new Error("Published doctrine unavailable"); }
          return response;
        }), budget);
      return readBoundedResponse(response, maxBytes, budget);
    };
    const decode = (bytes: Uint8Array) => JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    const bucket = decode(await download(`bucket/${DOCTRINE_BUCKET}`, DOCTRINE_MANIFEST_MAX_BYTES));
    if (!bucket || bucket.public !== false) throw new Error("Private doctrine bucket required");
    const manifest = parseDoctrineManifest(decode(await download(`object/${DOCTRINE_BUCKET}/${DOCTRINE_MANIFEST_PATH}`, DOCTRINE_MANIFEST_MAX_BYTES)));
    // Fail before artifact requests; budget includes bucket metadata and manifest.
    if (manifest.artifacts.reduce((sum, artifact) => sum + artifact.bytes, 0) > budget.remainingBytes) throw new Error("Published doctrine unavailable");
    const limits = new Map(manifest.artifacts.map(artifact => [doctrineArtifactPath(manifest, artifact.path), artifact.bytes]));
    const files = await verifyDoctrineFiles(manifest, path => download(`object/${DOCTRINE_BUCKET}/${path}`, limits.get(path)!));
    if (performance.now() >= budget.deadline) throw new Error("Published doctrine unavailable");
    return files;
  } catch { throw new Error("Published doctrine unavailable"); }
  finally { controller.abort(); }
}
