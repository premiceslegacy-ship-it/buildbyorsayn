"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createMcpSupabaseAdmin } from "@/lib/mcp/supabaseAdmin";
import { generateOpaqueToken, hashToken } from "@/lib/mcp/oauth";
import {
  logMcpEvent,
  resolveMcpRequestId,
  type McpOperationalOutcome,
} from "@/lib/mcp/observability";

function readRequestHandle(formData: FormData): string | null {
  if (formData.getAll("request").length !== 1) return null;
  const value = String(formData.get("request") ?? "");
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
}

type ApprovalResult = {
  status: "approved" | "invalid_request";
  client_id: string | null;
  redirect_uri: string | null;
  state: string | null;
};

type DenialResult = {
  status: "denied" | "invalid_request";
  redirect_uri: string | null;
  state: string | null;
};

function startConsentLog() {
  const startedAt = performance.now();
  const requestId = resolveMcpRequestId(null);
  return (outcome: McpOperationalOutcome, status: number) => {
    logMcpEvent({
      event: "mcp.oauth.consent",
      requestId,
      outcome,
      status,
      durationMs: performance.now() - startedAt,
    });
  };
}

export async function approveMcpConsent(formData: FormData) {
  const finish = startConsentLog();
  const requestHandle = readRequestHandle(formData);
  if (!requestHandle) {
    finish("invalid", 400);
    redirect("/mcp/consent?error=invalid_request");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    finish("denied", 401);
    redirect("/login");
  }

  const code = generateOpaqueToken();
  const admin = createMcpSupabaseAdmin();
  const { data, error } = (await admin
    .rpc("approve_mcp_authorization_request", {
      p_request_hash: hashToken(requestHandle),
      p_user_id: user.id,
      p_code_hash: hashToken(code),
    })
    .maybeSingle()) as { data: ApprovalResult | null; error: unknown };

  if (error) {
    finish("failed", 503);
    redirect("/mcp/consent?error=server_error");
  }
  if (!data || data.status !== "approved" || !data.redirect_uri) {
    finish("invalid", 400);
    redirect("/mcp/consent?error=invalid_request");
  }

  const callback = new URL(data.redirect_uri);
  callback.searchParams.set("code", code);
  if (data.state) callback.searchParams.set("state", data.state);
  finish("allowed", 302);
  redirect(callback.toString());
}

export async function denyMcpConsent(formData: FormData) {
  const finish = startConsentLog();
  const requestHandle = readRequestHandle(formData);
  if (!requestHandle) {
    finish("invalid", 400);
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    finish("denied", 401);
    redirect("/login");
  }

  const admin = createMcpSupabaseAdmin();
  const { data, error } = (await admin
    .rpc("deny_mcp_authorization_request", {
      p_request_hash: hashToken(requestHandle),
      p_user_id: user.id,
    })
    .maybeSingle()) as { data: DenialResult | null; error: unknown };

  if (error || !data || data.status !== "denied" || !data.redirect_uri) {
    finish(error ? "failed" : "invalid", error ? 503 : 400);
    redirect("/dashboard");
  }

  const callback = new URL(data.redirect_uri);
  callback.searchParams.set("error", "access_denied");
  if (data.state) callback.searchParams.set("state", data.state);
  finish("denied", 302);
  redirect(callback.toString());
}
