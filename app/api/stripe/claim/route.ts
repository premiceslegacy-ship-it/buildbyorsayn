import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { claimVerifiedStripePurchases } from "@/lib/stripeClaim";
import { normalizeCustomerEmail } from "@/lib/stripeEntitlements";

export const dynamic = "force-dynamic";

/**
 * A Payment Link can carry a customer-entered email but cannot prove control of
 * an existing account. Authenticated users with a verified matching email claim
 * all pending purchases for that address through this endpoint.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.id || !user.email_confirmed_at) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const email = normalizeCustomerEmail(user.email);
  if (!email) return NextResponse.json({ error: "verified_email_required" }, { status: 400 });

  const admin = createAdminSupabase({ signal: request.signal });
  const result = await claimVerifiedStripePurchases(admin, { userId: user.id, email });
  if (result.decision === "denied") {
    return NextResponse.json({ error: "temporarily_unavailable" }, { status: 429 });
  }
  if (result.decision !== "allowed") {
    return NextResponse.json({ error: "temporarily_unavailable" }, { status: 503 });
  }
  return NextResponse.json(
    { claimed: result.claimed },
    { headers: { "Cache-Control": "no-store" } },
  );
}
