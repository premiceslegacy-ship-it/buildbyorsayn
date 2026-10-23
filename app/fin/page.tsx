import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { PurchaseConfirmation } from "@/components/ui5/PurchaseConfirmation";
import { purchaseState } from "@/components/ui5/purchaseModel";
import { navIdentity } from "@/lib/auth/navIdentity.server";
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
  const identity = await navIdentity(user);
  return <DaRoot className="da-app purchase-page"><NavBar {...identity} /><PurchaseConfirmation state={state} /></DaRoot>;
}
