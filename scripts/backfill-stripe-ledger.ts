import Stripe from "stripe";

import { createAdminSupabase } from "../lib/supabase/admin";

const APPLY = process.argv.includes("--apply");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

type LedgerStatus = "active" | "pending" | "refunded" | "disputed";
type UserMatch = { id: string; email: string | null; source: "client_reference_id" | "email" };
type BackfillRecord = {
  checkoutSessionId: string;
  paymentIntentId: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  tier: "beginner" | "full" | null;
  paymentDetail: string;
  status: LedgerStatus | null;
  user: UserMatch | null;
  wouldInsert: {
    userId: string | null;
    tier: "beginner" | "full" | null;
    status: "active" | "pending" | null;
  };
  reason: string | null;
};

type AuthUser = { id: string; email?: string; email_confirmed_at?: string | null };

function isUuid(value: string | null | undefined): boolean {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

function paymentIntentId(value: Stripe.Checkout.Session["payment_intent"]): string | null {
  return typeof value === "string" ? value : value?.id ?? null;
}

async function loadAuthUsers(admin: ReturnType<typeof createAdminSupabase>): Promise<AuthUser[]> {
  const users: AuthUser[] = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Auth users lookup failed: ${error.message}`);
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

async function resolveUser(
  authUsers: AuthUser[],
  session: Stripe.Checkout.Session,
  customerEmail: string | null,
): Promise<UserMatch | null> {
  const reference = session.client_reference_id?.trim() ?? "";
  if (isUuid(reference)) {
    const user = authUsers.find((candidate) => candidate.id === reference);
    if (user) return { id: user.id, email: user.email ?? null, source: "client_reference_id" };
  }
  if (!customerEmail) return null;
  const matches = authUsers.filter((candidate) => candidate.email?.trim().toLowerCase() === customerEmail);
  if (matches.length !== 1) return null;
  const user = matches[0];
  if (!user.email_confirmed_at) return null;
  return { id: user.id, email: user.email ?? null, source: "email" };
}

async function inferTier(sessionId: string): Promise<"beginner" | "full" | null> {
  const items = [] as Stripe.LineItem[];
  for await (const item of stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 })) items.push(item);
  if (items.length !== 1) return null;
  const priceId = items[0].price?.id;
  if (priceId === process.env.STRIPE_BEGINNER_PRICE_ID) return "beginner";
  if (priceId === process.env.STRIPE_FULL_PRICE_ID || priceId === process.env.STRIPE_UPGRADE_PRICE_ID) return "full";
  return null;
}

async function currentPaymentStatus(paymentIntent: string | null): Promise<{ status: LedgerStatus; detail: string }> {
  if (!paymentIntent) return { status: "pending", detail: "missing_payment_intent" };
  const charges = await stripe.charges.list({ payment_intent: paymentIntent, limit: 100 });
  const fullyRefunded = charges.data.some((charge) =>
    charge.refunded || (charge.amount > 0 && charge.amount_refunded >= charge.amount),
  );
  if (fullyRefunded) return { status: "refunded", detail: "fully_refunded" };
  const disputes = await stripe.disputes.list({ payment_intent: paymentIntent, limit: 100 });
  const openDispute = disputes.data.find((dispute) => dispute.status !== "won");
  if (openDispute) return { status: "disputed", detail: `dispute_${openDispute.status}` };
  return { status: "active", detail: disputes.data.length > 0 ? "dispute_won" : "paid" };
}

async function collectRecords(authUsers: AuthUser[]): Promise<BackfillRecord[]> {
  const records: BackfillRecord[] = [];
  for await (const session of stripe.checkout.sessions.list({ status: "complete", limit: 100 })) {
    if (session.payment_status !== "paid") continue;
    const customerEmail = session.customer_details?.email?.trim().toLowerCase() ?? null;
    const paymentIntent = paymentIntentId(session.payment_intent);
    const tier = await inferTier(session.id);
    const payment = await currentPaymentStatus(paymentIntent);
    const user = await resolveUser(authUsers, session, customerEmail);
    const wouldInsertStatus = tier && paymentIntent ? (user ? "active" : "pending") : null;
    records.push({
      checkoutSessionId: session.id,
      paymentIntentId: paymentIntent,
      customerEmail,
      amountTotal: session.amount_total ?? null,
      tier,
      paymentDetail: payment.detail,
      status: payment.status,
      user,
      wouldInsert: {
        userId: user?.id ?? null,
        tier,
        status: wouldInsertStatus,
      },
      reason: !tier ? "unknown_price" : !paymentIntent ? "missing_payment_intent" : user ? null : "no_verified_account_match",
    });
  }
  return records;
}

async function applyRecords(admin: ReturnType<typeof createAdminSupabase>, records: BackfillRecord[]) {
  for (const record of records) {
    if (!record.tier || !record.paymentIntentId || !record.status) continue;
    const initialStatus = record.user ? "active" : "pending";
    const { error } = await admin.rpc("record_stripe_purchase", {
      p_checkout_session_id: record.checkoutSessionId,
      p_payment_intent_id: record.paymentIntentId,
      p_user_id: record.user?.id ?? null,
      p_tier: record.tier,
      p_status: initialStatus,
      p_amount_total: record.amountTotal,
      p_currency: "eur",
      p_customer_email: record.customerEmail,
    });
    if (error) throw new Error(`Ledger insert failed for ${record.checkoutSessionId}: ${error.message}`);
    if (record.status === "refunded" || record.status === "disputed") {
      const { error: revokeError } = await admin.rpc("revoke_stripe_purchase", {
        p_payment_intent_id: record.paymentIntentId,
        p_status: record.status,
        p_reason: "stripe_backfill",
      });
      if (revokeError) throw new Error(`Ledger status failed for ${record.checkoutSessionId}: ${revokeError.message}`);
    }
  }
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is required.");
  const admin = createAdminSupabase();
  const authUsers = await loadAuthUsers(admin);
  const records = await collectRecords(authUsers);
  const unmatched = records.filter((record) => !record.user);
  console.log(JSON.stringify({ mode: APPLY ? "apply" : "dry-run", records, unmatched }, null, 2));
  if (APPLY) await applyRecords(admin, records);
  else console.log("DRY-RUN only. Pass --apply to write the ledger; this script did not write Supabase.");
}

main().catch((error) => {
  console.error("ERROR", error instanceof Error ? error.message : error);
  process.exit(1);
});

