import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export const DEFAULT_ADMIN_SUPABASE_TIMEOUT_MS = 15_000;

export type AdminSupabaseOptions = {
  fetch?: typeof fetch;
  timeoutMs?: number;
  signal?: AbortSignal;
};

/**
 * Service-role client for server-only data access layers. The caller remains
 * responsible for authenticating and authorizing every request before using
 * this client.
 */
export function createAdminSupabase(options: AdminSupabaseOptions = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const timeoutMs = options.timeoutMs ?? DEFAULT_ADMIN_SUPABASE_TIMEOUT_MS;

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
