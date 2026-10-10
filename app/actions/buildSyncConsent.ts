"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { generateOpaqueToken, hashToken } from "@/lib/mcp/oauth";

function readHandle(formData: FormData): string | null {
  if (formData.getAll("request").length !== 1) return null;
  const value = String(formData.get("request") ?? "");
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
}

type ConsentResult = {
  status: "approved" | "denied" | "invalid_request";
  redirect_uri: string | null;
  state: string | null;
};

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

export async function approveBuildSyncConsent(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) redirect("/build-sync/consent?error=invalid_request");
  const user = await requireUser();
  const code = generateOpaqueToken();
  const admin = createAdminSupabase();
  const { data, error } = (await admin
    .rpc("approve_build_sync_authorization_request", {
      p_request_hash: hashToken(handle),
      p_user_id: user.id,
      p_code_hash: hashToken(code),
    })
    .maybeSingle()) as { data: ConsentResult | null; error: unknown };

  if (error || !data || data.status !== "approved" || !data.redirect_uri) {
    redirect("/build-sync/consent?error=invalid_request");
  }
  const callback = new URL(data.redirect_uri);
  callback.searchParams.set("code", code);
  if (data.state) callback.searchParams.set("state", data.state);
  redirect(callback.toString());
}

export async function denyBuildSyncConsent(formData: FormData) {
  const handle = readHandle(formData);
  if (!handle) redirect("/dashboard");
  const user = await requireUser();
  const admin = createAdminSupabase();
  const { data, error } = (await admin
    .rpc("deny_build_sync_authorization_request", {
      p_request_hash: hashToken(handle),
      p_user_id: user.id,
    })
    .maybeSingle()) as { data: ConsentResult | null; error: unknown };

  if (error || !data || data.status !== "denied" || !data.redirect_uri) {
    redirect("/dashboard");
  }
  const callback = new URL(data.redirect_uri);
  callback.searchParams.set("error", "access_denied");
  if (data.state) callback.searchParams.set("state", data.state);
  redirect(callback.toString());
}
