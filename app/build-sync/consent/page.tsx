import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/mcp/oauth";
import { DaRoot } from "@/components/da/DaRoot";
import { BuildSyncConsentCard } from "@/components/da/BuildSyncConsentCard";
import {
  approveBuildSyncConsent,
  denyBuildSyncConsent,
} from "@/app/actions/buildSyncConsent";
import "@/app/da-mcp.css";

export const metadata = { title: "Installer BUILD Sync" };

export default async function BuildSyncConsentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requestHandle = typeof params.request === "string" ? params.request : "";
  const errorCode = typeof params.error === "string" ? params.error : "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(requestHandle)) redirect("/dashboard");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/build-sync/consent?request=${requestHandle}`)}`);
  }

  const admin = createAdminSupabase();
  const { data: authorizationRequest, error } = await admin
    .from("build_sync_authorization_requests")
    .select("redirect_uri")
    .eq("request_hash", hashToken(requestHandle))
    .eq("user_id", user.id)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error || !authorizationRequest) redirect("/dashboard");

  return (
    <DaRoot>
      <BuildSyncConsentCard
        redirectUri={authorizationRequest.redirect_uri}
        requestHandle={requestHandle}
        errorMessage={errorCode ? "La demande a expiré. Relance BUILD Sync." : null}
        approveAction={approveBuildSyncConsent}
        denyAction={denyBuildSyncConsent}
      />
    </DaRoot>
  );
}
