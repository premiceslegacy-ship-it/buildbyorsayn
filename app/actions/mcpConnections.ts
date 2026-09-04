'use server';

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { logMcpEvent, resolveMcpRequestId } from "@/lib/mcp/observability";

export async function revokeMcpConnections(): Promise<void> {
  const startedAt = performance.now();
  const requestId = resolveMcpRequestId(null);
  const finish = (outcome: "allowed" | "denied" | "failed", status: number) => {
    logMcpEvent({
      event: "mcp.oauth.revoke",
      requestId,
      outcome,
      status,
      durationMs: performance.now() - startedAt,
    });
  };
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    finish("denied", 401);
    redirect("/login?next=%2Fdashboard%2Fmcp");
  }

  const admin = createMcpSupabaseAdmin();
  const { error } = await admin.rpc("revoke_mcp_user_connections", {
    p_user_id: user.id,
  });

  if (error) {
    finish("failed", 503);
    redirect("/dashboard/mcp?revocation=error");
  }
  finish("allowed", 302);
  redirect("/dashboard/mcp?revocation=success");
}
