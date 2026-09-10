import { DOCTRINE_BUCKET, DOCTRINE_MANIFEST_PATH, doctrineArtifactPath, parseDoctrineManifest, type DoctrineManifest } from "./publication";
import { DOCTRINE_MANIFEST_MAX_BYTES, DOCTRINE_TOTAL_MAX_BYTES, readBoundedResponse, withinDoctrineReadDeadline } from "./readbounded";

export const DOCTRINE_PUBLICATION_TIMEOUT_MS = 120_000;
const failed = () => new Error("Doctrine publication transport unavailable");

// Conservative reservation for both bucket metadata and manifest in the app reader.
export function preflightDoctrinePublication(manifest: DoctrineManifest): void {
  const valid = parseDoctrineManifest(manifest);
  const total = valid.artifacts.reduce((sum, artifact) => sum + artifact.bytes, 0);
  if (total + 2 * DOCTRINE_MANIFEST_MAX_BYTES > DOCTRINE_TOTAL_MAX_BYTES ||
      Buffer.byteLength(JSON.stringify(valid, null, 2) + "\n") > DOCTRINE_MANIFEST_MAX_BYTES) throw failed();
}

// One transport per publication, including bucket check, lock RPCs and write acknowledgements.
export function createDoctrinePublisherTransport(url: string, key: string, manifest: DoctrineManifest,
  options: { fetch?: typeof fetch; timeoutMs?: number } = {}) {
  const valid = parseDoctrineManifest(manifest);
  preflightDoctrinePublication(valid);
  const limits = new Map(valid.artifacts.map(artifact => [doctrineArtifactPath(valid, artifact.path), artifact.bytes]));
  limits.set(DOCTRINE_MANIFEST_PATH, DOCTRINE_MANIFEST_MAX_BYTES);
  // Three artifact passes, one manifest and N+4 bounded control responses.
  // The schema caps N at 100; app-compatible artifact bytes are capped above.
  const budget = { remainingBytes: 3 * valid.artifacts.reduce((sum, artifact) => sum + artifact.bytes, 0) + (valid.artifacts.length + 5) * DOCTRINE_MANIFEST_MAX_BYTES,
    deadline: performance.now() + Math.min(options.timeoutMs ?? DOCTRINE_PUBLICATION_TIMEOUT_MS, DOCTRINE_PUBLICATION_TIMEOUT_MS) };
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
