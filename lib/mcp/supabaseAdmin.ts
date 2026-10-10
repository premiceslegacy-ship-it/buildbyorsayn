import {
  createAdminSupabase,
  DEFAULT_ADMIN_SUPABASE_TIMEOUT_MS,
  type AdminSupabaseOptions,
} from "@/lib/supabase/admin";

export const DEFAULT_MCP_SUPABASE_TIMEOUT_MS = DEFAULT_ADMIN_SUPABASE_TIMEOUT_MS;

/**
 * Server-role Supabase client for MCP OAuth and knowledge-base tables.
 * These tables have no client-side RLS policies at all (see the
 * 20260904151355 and 20260904151436 migrations) - the service role key is
 * the only legitimate way to read or write them.
 */
export function createMcpSupabaseAdmin(options: AdminSupabaseOptions = {}) {
  return createAdminSupabase(options);
}
