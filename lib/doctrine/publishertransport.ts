import { DOCTRINE_BUCKET, DOCTRINE_MANIFEST_PATH, doctrineArtifactPath, parseDoctrineManifest, type DoctrineManifest } from "./publication";
import { DOCTRINE_MANIFEST_MAX_BYTES, readBoundedResponse, withinDoctrineReadDeadline } from "./readbounded";

export const DOCTRINE_PUBLICATION_TIMEOUT_MS = 120_000;
const failed = () => new Error("Doctrine publication transport unavailable");

// One transport per publication, including bucket check, lock RPCs and write acknowledgements.
export function createDoctrinePublisherTransport(url: string, key: string, manifest: DoctrineManifest,
  options: { fetch?: typeof fetch; timeoutMs?: number } = {}) {
  const valid = parseDoctrineManifest(manifest);
  if (valid.artifacts.length !== 9) throw failed();
  const limits = new Map(valid.artifacts.map(artifact => [doctrineArtifactPath(valid, artifact.path), artifact.bytes]));
  limits.set(DOCTRINE_MANIFEST_PATH, DOCTRINE_MANIFEST_MAX_BYTES);
  // Each of nine artifacts is read three times. Allow one manifest and 13 control
  // responses (bucket, acquire/release, nine uploads, pointer upload), each <=64KiB.
  const budget = { remainingBytes: 3 * valid.artifacts.reduce((sum, artifact) => sum + artifact.bytes, 0) + 14 * DOCTRINE_MANIFEST_MAX_BYTES,
    deadline: performance.now() + (options.timeoutMs ?? DOCTRINE_PUBLICATION_TIMEOUT_MS) };
  const controller = new AbortController();
  const transport = options.fetch ?? globalThis.fetch;
  const check = () => { if (controller.signal.aborted || performance.now() >= budget.deadline) throw failed(); };
  const receive = async (input: Parameters<typeof fetch>[0], init: RequestInit | undefined, maxBytes: number) => {
    check();
    try {
      const response = await withinDoctrineReadDeadline(() => transport(input, { ...init,
        cache: "no-store", redirect: "error", signal: controller.signal,
      }).then(response => {
        if (controller.signal.aborted || performance.now() >= budget.deadline) {
          void response.body?.cancel().catch(() => undefined); throw failed();
        }
        return response;
      }), budget);
      const bytes = await readBoundedResponse(response, maxBytes, budget);
      check();
      return { response, bytes };
    } catch { controller.abort(); throw failed(); }
  };
  return {
    // SDK only receives bounded, already-read control responses, never a live body.
    fetch: (async (input, init) => {
      const { response, bytes } = await receive(input, init, DOCTRINE_MANIFEST_MAX_BYTES);
      return new Response(Buffer.from(bytes), { status: response.status, headers: response.headers });
    }) as typeof fetch,
    download: async (path: string) => {
      const limit = limits.get(path);
      if (limit === undefined) throw failed();
      const { bytes } = await receive(`${url.replace(/\/$/, "")}/storage/v1/object/${DOCTRINE_BUCKET}/${path}`, {
        method: "GET", headers: { apikey: key, Authorization: `Bearer ${key}` },
      }, limit);
      return bytes;
    },
    check,
    async run<T>(operation: () => Promise<T>): Promise<T> {
      try { const result = await withinDoctrineReadDeadline(operation, budget); check(); return result; }
      finally { controller.abort(); }
    },
  };
}
