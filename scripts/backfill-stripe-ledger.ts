import Stripe from "stripe";

import { createAdminSupabase } from "../lib/supabase/admin";

const APPLY = process.argv.includes("--apply");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

type LedgerStatus = "active" | "pending" | "refunded" | "disputed" | "revoked";
type UserMatch = { id: string; email: string | null; source: "client_reference_id" | "email" };
type BackfillRecord = {
  checkoutSessionId: string;
  paymentIntentId: string | null;
  customerEmail: string | null;
  amountTotal: number | null;
  tier: "beginner" | "full" | null;
  fallbackTier: "beginner" | null;
  paymentDetail: string;
  status: LedgerStatus | null;
  user: UserMatch | null;
  wouldInsert: {
    userId: string | null;
    tier: "beginner" | "full" | null;
    status: LedgerStatus | null;
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

type UpgradeClaim = { checkout_session_id: string; user_id: string; status: string };

async function loadGrantedUpgradeClaims(
  admin: ReturnType<typeof createAdminSupabase>,
): Promise<Map<string, UpgradeClaim>> {
  const { data, error } = await admin
    .from("stripe_upgrade_claims")
    .select("checkout_session_id,user_id,status")
    .eq("status", "granted");
  if (error) throw new Error(`Upgrade claim lookup failed: ${error.message}`);
  return new Map((data as UpgradeClaim[]).map((claim) => [claim.checkout_session_id, claim]));
}

async function resolveUser(
  authUsers: AuthUser[],
  session: Stripe.Checkout.Session,
  customerEmail: string | null,
): Promise<UserMatch | null> {
  if (!customerEmail) return null;
  const normalizedEmail = customerEmail.trim().toLowerCase();
  const reference = session.client_reference_id?.trim() ?? "";
  if (isUuid(reference)) {
    const user = authUsers.find((candidate) => candidate.id === reference);
    if (
      user?.email_confirmed_at
      && user.email?.trim().toLowerCase() === normalizedEmail
    ) {
      return { id: user.id, email: user.email ?? null, source: "client_reference_id" };
    }
  }
  const matches = authUsers.filter((candidate) =>
    candidate.email_confirmed_at
    && candidate.email?.trim().toLowerCase() === normalizedEmail
  );
  if (matches.length !== 1) return null;
  const user = matches[0];
  return { id: user.id, email: user.email ?? null, source: "email" };
}

async function inferTier(sessionId: string): Promise<{ tier: "beginner" | "full"; priceId: string } | null> {
  const items = [] as Stripe.LineItem[];
  for await (const item of stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 })) items.push(item);
  if (items.length !== 1) return null;
  const priceId = items[0].price?.id;
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_BEGINNER_PRICE_ID) return { tier: "beginner", priceId };
  if (priceId === process.env.STRIPE_FULL_PRICE_ID || priceId === process.env.STRIPE_UPGRADE_PRICE_ID) {
    return { tier: "full", priceId };
  }
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

async function collectRecords(
  authUsers: AuthUser[],
  grantedUpgradeClaims: Map<string, UpgradeClaim>,
): Promise<BackfillRecord[]> {
  const records: BackfillRecord[] = [];
  for await (const session of stripe.checkout.sessions.list({ status: "complete", limit: 100 })) {
    if (session.payment_status !== "paid") continue;
    const customerEmail = session.customer_details?.email?.trim().toLowerCase() ?? null;
    const paymentIntent = paymentIntentId(session.payment_intent);
    const inferred = await inferTier(session.id);
    const payment = await currentPaymentStatus(paymentIntent);
    const user = await resolveUser(authUsers, session, customerEmail);
    const finalStatus: LedgerStatus | null = inferred && paymentIntent
      ? payment.status === "active" && !user ? "pending" : payment.status
      : null;
    const claim = grantedUpgradeClaims.get(session.id);
    const fallbackTier = inferred?.priceId === process.env.STRIPE_UPGRADE_PRICE_ID
      && claim?.status === "granted"
      && claim.user_id === user?.id
      ? "beginner"
      : null;
    records.push({
      checkoutSessionId: session.id,
      paymentIntentId: paymentIntent,
      customerEmail,
      amountTotal: session.amount_total ?? null,
      tier: inferred?.tier ?? null,
      fallbackTier,
      paymentDetail: payment.detail,
      status: finalStatus,
      user,
      wouldInsert: {
        userId: user?.id ?? null,
        tier: inferred?.tier ?? null,
        status: finalStatus,
      },
      reason: !inferred ? "unknown_price" : !paymentIntent ? "missing_payment_intent" : user ? null : "no_verified_account_match",
    });
  }
  return records;
}

async function applyRecords(admin: ReturnType<typeof createAdminSupabase>, records: BackfillRecord[]) {
  const rows = records
    .filter((record): record is BackfillRecord & {
      tier: "beginner" | "full";
      paymentIntentId: string;
      status: LedgerStatus;
    } => Boolean(record.tier && record.paymentIntentId && record.status))
    .map((record) => ({
      checkout_session_id: record.checkoutSessionId,
      payment_intent_id: record.paymentIntentId,
      user_id: record.user?.id ?? null,
      tier: record.tier,
      status: record.status,
      amount_total: record.amountTotal,
      currency: "eur",
      customer_email: record.customerEmail,
      fallback_tier: record.fallbackTier,
      revoke_reason: record.status === "active" || record.status === "pending" ? null : "stripe_backfill",
    }));
  if (!rows.length) return;
  const { error } = await admin.rpc("backfill_stripe_purchase_ledger", { p_rows: rows });
  if (error) throw new Error(`Stripe ledger backfill failed: ${error.message}`);
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is required.");
  const admin = createAdminSupabase();
  const authUsers = await loadAuthUsers(admin);
  const grantedUpgradeClaims = await loadGrantedUpgradeClaims(admin);
  const records = await collectRecords(authUsers, grantedUpgradeClaims);
  const unmatched = records.filter((record) => !record.user);
  console.log(JSON.stringify({ mode: APPLY ? "apply" : "dry-run", records, unmatched }, null, 2));
  if (APPLY) await applyRecords(admin, records);
  else console.log("DRY-RUN only. Pass --apply to write the ledger; this script did not write Supabase.");
}

main().catch((error) => {
  console.error("ERROR", error instanceof Error ? error.message : error);
  process.exit(1);
});

