import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export const DEFAULT_MCP_SUPABASE_TIMEOUT_MS = 15_000;

type McpSupabaseAdminOptions = {
  fetch?: typeof fetch;
  timeoutMs?: number;
  signal?: AbortSignal;
};

/**
 * Server-role Supabase client for MCP OAuth and knowledge-base tables.
 * These tables have no client-side RLS policies at all (see the
 * 20260904151355 and 20260904151436 migrations) - the service role key is
 * the only legitimate way to read or write them.
 */
export function createMcpSupabaseAdmin(options: McpSupabaseAdminOptions = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const timeoutMs = options.timeoutMs ?? DEFAULT_MCP_SUPABASE_TIMEOUT_MS;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service role credentials are not configured.");
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("Supabase request timeout must be a positive finite number.");
  }

  const fetchImpl = options.fetch ?? fetch;
  return createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
        const timeoutSignal = AbortSignal.timeout(timeoutMs);
        const signals = [options.signal, callerSignal, timeoutSignal].filter(
          (signal): signal is AbortSignal => Boolean(signal)
        );
        const signal = signals.length === 1 ? signals[0] : AbortSignal.any(signals);
        return fetchImpl(input, { ...init, cache: "no-store", signal });
      },
    },
  });
}
