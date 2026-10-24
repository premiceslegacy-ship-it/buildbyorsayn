import Stripe from "stripe";

import { createAdminSupabase } from "../lib/supabase/admin";

const APPLY = process.argv.includes("--apply");
const ALLOW_UNRESOLVED = process.argv.includes("--allow-unresolved");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

type LedgerStatus = "active" | "pending" | "refunded" | "disputed" | "revoked";
type UserMatch = { id: string; email: string | null; source: "client_reference_id" | "email" | "upgrade_claim" };
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
type PaidTier = "beginner" | "full";
type ProfileTier = { id: string; tier: PaidTier };
type ExistingLedgerRow = {
  user_id: string | null;
  tier: PaidTier;
  status: LedgerStatus;
  fallback_tier: PaidTier | null;
};
type ExistingLegacyMarker = { user_id: string; tier: PaidTier };

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

async function loadProfileTiers(admin: ReturnType<typeof createAdminSupabase>): Promise<ProfileTier[]> {
  const { data, error } = await admin
    .from("profiles")
    .select("id,tier")
    .in("tier", ["beginner", "full"]);
  if (error) throw new Error(`Profile tier lookup failed: ${error.message}`);
  return data as ProfileTier[];
}

async function loadExistingEntitlements(admin: ReturnType<typeof createAdminSupabase>): Promise<{
  ledger: ExistingLedgerRow[];
  legacy: ExistingLegacyMarker[];
}> {
  const [ledgerResult, legacyResult] = await Promise.all([
    admin.from("stripe_purchase_ledger").select("user_id,tier,status,fallback_tier"),
    admin.from("stripe_legacy_entitlements").select("user_id,tier"),
  ]);
  if (ledgerResult.error) throw new Error(`Stripe ledger lookup failed: ${ledgerResult.error.message}`);
  if (legacyResult.error) throw new Error(`Legacy entitlement lookup failed: ${legacyResult.error.message}`);
  return {
    ledger: ledgerResult.data as ExistingLedgerRow[],
    legacy: legacyResult.data as ExistingLegacyMarker[],
  };
}

type UpgradeClaim = { checkout_session_id: string; user_id: string; status: string };

async function loadUpgradeClaims(
  admin: ReturnType<typeof createAdminSupabase>,
): Promise<Map<string, UpgradeClaim>> {
  const { data, error } = await admin
    .from("stripe_upgrade_claims")
    .select("checkout_session_id,user_id,status");
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
  upgradeClaims: Map<string, UpgradeClaim>,
): Promise<BackfillRecord[]> {
  const records: BackfillRecord[] = [];
  for await (const session of stripe.checkout.sessions.list({ status: "complete", limit: 100 })) {
    if (session.payment_status !== "paid") continue;
    const customerEmail = session.customer_details?.email?.trim().toLowerCase() ?? null;
    const paymentIntent = paymentIntentId(session.payment_intent);
    const inferred = await inferTier(session.id);
    const payment = await currentPaymentStatus(paymentIntent);
    const claim = upgradeClaims.get(session.id);
    const isUpgrade = inferred?.priceId === process.env.STRIPE_UPGRADE_PRICE_ID;
    let user = await resolveUser(authUsers, session, customerEmail);
    let reason: string | null = !inferred
      ? "unknown_price"
      : !paymentIntent
        ? "missing_payment_intent"
        : user
          ? null
          : "no_verified_account_match";
    let fallbackTier: "beginner" | null = null;

    if (isUpgrade) {
      // A granted server claim is authoritative, including when the customer's
      // Stripe email changed after the upgrade was granted.
      if (claim?.status === "granted" && isUuid(claim.user_id)) {
        const claimedAuthUser = authUsers.find((candidate) => candidate.id === claim.user_id);
        if (claimedAuthUser) {
          user = {
            id: claim.user_id,
            email: claimedAuthUser.email ?? null,
            source: "upgrade_claim",
          };
          fallbackTier = "beginner";
          reason = paymentIntent ? null : "missing_payment_intent";
        } else {
          user = null;
          reason = "unresolved_upgrade_claim_user";
        }
      } else {
        user = null;
        reason = "unresolved_upgrade";
      }
    }

    const finalStatus: LedgerStatus | null = inferred && paymentIntent
      ? payment.status === "active" && !user ? "pending" : payment.status
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
      reason,
    });
  }
  return records;
}

type LegacyPlan = {
  markerCounts: Record<PaidTier, number>;
  markerUsers: Array<{ id: string; tier: PaidTier }>;
  tierChanges: Array<{ id: string; from: PaidTier; to: PaidTier }>;
};

function tierRank(tier: PaidTier | null): number {
  return tier === "full" ? 2 : tier === "beginner" ? 1 : 0;
}

function tierFromRank(rank: number): PaidTier | null {
  return rank === 2 ? "full" : rank === 1 ? "beginner" : null;
}

function truncatedUserId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}...${id.slice(-4)}` : id;
}

function buildLegacyPlan(
  profiles: ProfileTier[],
  existingLedger: ExistingLedgerRow[],
  existingLegacy: ExistingLegacyMarker[],
  records: BackfillRecord[],
): LegacyPlan {
  const represented = new Map<string, number>();
  const add = (userId: string | null, tier: PaidTier | null) => {
    if (!userId || !tier) return;
    represented.set(userId, Math.max(represented.get(userId) ?? 0, tierRank(tier)));
  };
  for (const row of existingLedger) {
    if (row.status === "active") add(row.user_id, row.tier);
    add(row.user_id, row.fallback_tier);
  }
  for (const marker of existingLegacy) add(marker.user_id, marker.tier);
  for (const record of records) {
    if (record.user?.id && record.status === "active") add(record.user.id, record.tier);
    add(record.user?.id ?? null, record.fallbackTier);
  }

  const markerUsers: Array<{ id: string; tier: PaidTier }> = [];
  const markerCounts: Record<PaidTier, number> = { beginner: 0, full: 0 };
  const tierChanges: Array<{ id: string; from: PaidTier; to: PaidTier }> = [];
  for (const profile of profiles) {
    const currentRank = tierRank(profile.tier);
    const representedRank = represented.get(profile.id) ?? 0;
    if (currentRank > representedRank) {
      markerUsers.push({ id: truncatedUserId(profile.id), tier: profile.tier });
      markerCounts[profile.tier] += 1;
    }
    const plannedRank = Math.max(currentRank, representedRank);
    const plannedTier = tierFromRank(plannedRank);
    if (plannedTier && plannedTier !== profile.tier) {
      tierChanges.push({ id: truncatedUserId(profile.id), from: profile.tier, to: plannedTier });
    }
  }
  return { markerCounts, markerUsers, tierChanges };
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

function reportRecord(record: BackfillRecord) {
  const safeRecord: Partial<BackfillRecord> = { ...record };
  delete safeRecord.customerEmail;
  return safeRecord;
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is required.");
  const admin = createAdminSupabase();
  const [authUsers, profiles, existing] = await Promise.all([
    loadAuthUsers(admin),
    loadProfileTiers(admin),
    loadExistingEntitlements(admin),
  ]);
  const upgradeClaims = await loadUpgradeClaims(admin);
  const records = await collectRecords(authUsers, upgradeClaims);
  const reportRecords = records.map(reportRecord);
  const unmatched = records.filter((record) => !record.user).map(reportRecord);
  const unresolvedUpgrades = records
    .filter((record) => record.reason?.startsWith("unresolved_upgrade"))
    .map(reportRecord);
  const legacyPlan = buildLegacyPlan(profiles, existing.ledger, existing.legacy, records);
  console.log(JSON.stringify({
    mode: APPLY ? "apply" : "dry-run",
    records: reportRecords,
    unmatched,
    unresolvedUpgrades,
    legacy: {
      markerCounts: legacyPlan.markerCounts,
      markerUsers: legacyPlan.markerUsers,
      tierChanges: legacyPlan.tierChanges,
    },
  }, null, 2));
  if (APPLY && unresolvedUpgrades.length && !ALLOW_UNRESOLVED) {
    throw new Error(
      `${unresolvedUpgrades.length} upgrade checkout(s) have no granted server claim; pass --allow-unresolved to keep them pending.`,
    );
  }
  if (APPLY) await applyRecords(admin, records);
  else console.log("DRY-RUN only. Pass --apply to write the ledger; unresolved upgrades remain pending.");
}

main().catch((error) => {
  console.error("ERROR", error instanceof Error ? error.message : error);
  process.exit(1);
});

