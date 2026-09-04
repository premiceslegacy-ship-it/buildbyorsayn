export type BoundedBodyResult =
  | { ok: true; text: string }
  | { ok: false; reason: "invalid_length" | "too_large" | "invalid_utf8" };

export function isJsonMediaType(contentType: string | null): boolean {
  return (contentType ?? "").split(";", 1)[0].trim().toLowerCase() === "application/json";
}

export function requestOriginAllowed(
  origin: string | null,
  allowedOrigins: ReadonlySet<string>
): boolean {
  if (origin === null) return true;
  if (origin === "null") return false;

  try {
    const parsed = new URL(origin);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      parsed.origin === origin &&
      allowedOrigins.has(parsed.origin)
    );
  } catch {
    return false;
  }
}

function oauthCorsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

export function applyOAuthCors(
  response: Response,
  origin: string | null,
  allowedOrigins: ReadonlySet<string>
): Response {
  if (origin !== null && requestOriginAllowed(origin, allowedOrigins)) {
    for (const [name, value] of Object.entries(oauthCorsHeaders(origin))) {
      response.headers.set(name, value);
    }
  }
  return response;
}

export function oauthPreflightResponse(
  origin: string | null,
  allowedOrigins: ReadonlySet<string>
): Response {
  if (origin === null || !requestOriginAllowed(origin, allowedOrigins)) {
    return new Response(null, {
      status: 403,
      headers: { "Cache-Control": "no-store", Vary: "Origin" },
    });
  }
  return new Response(null, { status: 204, headers: oauthCorsHeaders(origin) });
}

export async function readBoundedBody(
  request: Request,
  maxBytes: number
): Promise<BoundedBodyResult> {
  const declaredRaw = request.headers.get("content-length");
  if (declaredRaw !== null) {
    if (!/^\d+$/.test(declaredRaw)) return { ok: false, reason: "invalid_length" };
    const declared = Number(declaredRaw);
    if (!Number.isSafeInteger(declared)) return { ok: false, reason: "invalid_length" };
    if (declared > maxBytes) return { ok: false, reason: "too_large" };
  }

  if (!request.body) return { ok: true, text: "" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "invalid_utf8" };
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return {
      ok: true,
      text: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    };
  } catch {
    return { ok: false, reason: "invalid_utf8" };
  }
}
