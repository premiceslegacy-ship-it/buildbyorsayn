import assert from "node:assert/strict";

const EXPECTED_TOOLS = ["get_skill", "list_available_content", "search_knowledge"] as const;

export function assertMcpSuccess(payload: unknown, expectedId: string | number): Record<string, unknown> {
  assert.equal(typeof payload, "object");
  assert.notEqual(payload, null);
  const message = payload as Record<string, unknown>;
  assert.equal(message.jsonrpc, "2.0");
  assert.equal(message.id, expectedId);
  assert.equal(Object.hasOwn(message, "error"), false);
  assert.equal(typeof message.result, "object");
  assert.notEqual(message.result, null);
  const result = message.result as Record<string, unknown>;
  assert.notEqual(result.isError, true);
  return result;
}

export function assertToolsList(result: unknown): string[] {
  assert.equal(typeof result, "object");
  assert.notEqual(result, null);
  const tools = (result as Record<string, unknown>).tools;
  assert.ok(Array.isArray(tools));
  const names = tools.map((tool) => {
    assert.equal(typeof tool, "object");
    assert.notEqual(tool, null);
    const name = (tool as Record<string, unknown>).name;
    assert.equal(typeof name, "string");
    return name as string;
  }).sort();
  assert.deepEqual(names, [...EXPECTED_TOOLS]);
  return names;
}

export function assertTextToolResult(result: unknown): string {
  assert.equal(typeof result, "object");
  assert.notEqual(result, null);
  const content = (result as Record<string, unknown>).content;
  assert.ok(Array.isArray(content));
  assert.ok(content.length > 0);
  const first = content[0];
  assert.equal(typeof first, "object");
  assert.notEqual(first, null);
  assert.equal((first as Record<string, unknown>).type, "text");
  const text = (first as Record<string, unknown>).text;
  assert.equal(typeof text, "string");
  assert.ok((text as string).trim().length > 0);
  return (text as string).trim();
}

export function sanitizeE2eDiagnostic(value: unknown, exactSecrets: readonly string[]): string {
  let text = value instanceof Error ? `${value.name}: ${value.message}` : String(value);
  text = text
    .replace(/([?&](?:code|state|request|code_verifier|refresh_token|access_token)=)[^&\s"']+/gi, "$1[REDACTED]")
    .replace(/(authorization\s*:\s*bearer\s+)[^\s"']+/gi, "$1[REDACTED]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]");
  for (const secret of exactSecrets) {
    if (secret) text = text.split(secret).join("[REDACTED]");
  }
  return text.replace(/[A-Za-z0-9_-]{43,}/g, "[REDACTED]");
}
