import { DaRoot } from "@/components/da/DaRoot";
import { PurchaseConfirmation } from "@/components/ui5/PurchaseConfirmation";
import { purchaseState } from "@/components/ui5/purchaseModel";
import { normalizeProfileTier, type McpTier } from "@/lib/mcpAccess";
import { createClient } from "@/lib/supabase/server";
import "./fin.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Confirmation de ton accès | BUILD" };

export default async function FinPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  let tier: McpTier | null = null;
  let unverified = Boolean(userError);
  if (user?.id && !userError) {
    const { data: profile, error } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
    unverified = Boolean(error);
    tier = normalizeProfileTier(profile?.tier ?? null);
  }
  const state = purchaseState({ tier, authenticated: Boolean(user), unverified });
  return <DaRoot className="da-app purchase-page"><PurchaseConfirmation state={state} /></DaRoot>;
}
