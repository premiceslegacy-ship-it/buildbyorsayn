import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
    determineStripeTier,
    escapeIlikePattern,
    emailsMatch,
    isUuid,
    normalizeCustomerEmail,
    type PaidTier,
} from "@/lib/stripeEntitlements";
import {
    hasAcceptedStripeTerms,
    isPaidCheckoutSession,
    secureUpgradeUserId,
} from "@/lib/stripeCheckout";
import { createConfirmedRefund, paymentIntentId, refuseUpgradePurchase } from "@/lib/stripeUpgradeRefusal";
import { processPaidUpgrade, type UpgradeClaimResult } from "@/lib/stripeUpgradeProcessing";
import { sendResendMessage, stripeEmailIdempotencyKey } from "@/lib/resendTransport";
import { optionalSiteOrigin, requireSiteOrigin } from "@/lib/siteOrigin";
import { getEmailContext } from "@/lib/email/context";
import { buildPurchaseConfirmationEmail, buildUpgradeRefusalEmail, buildWelcomeEmail } from "@/lib/email/templates";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { readBoundedBody } from "@/lib/mcp/http";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const MAX_STRIPE_WEBHOOK_BODY_BYTES = 512 * 1024;

async function sendWelcomeEmail(email: string, actionLink: string, checkoutSessionId: string) {
    const { subject, html, text } = buildWelcomeEmail(getEmailContext(), actionLink);
    return sendResendMessage({
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject,
        html,
        text,
        idempotencyKey: stripeEmailIdempotencyKey("welcome", checkoutSessionId),
    });
}

async function sendUpgradeRefusalEmail(email: string, checkoutSessionId: string) {
    const { subject, text, html } = buildUpgradeRefusalEmail(getEmailContext());
    return sendResendMessage({
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject,
        html,
        text,
        idempotencyKey: stripeEmailIdempotencyKey("upgrade-refused", checkoutSessionId),
    });
}

/**
 * Confirmation d'achat sur support durable. L'absence de configuration reste
 * non bloquante, mais une erreur de transport doit être rejouée par Stripe.
 */
async function sendPurchaseConfirmationEmail(
    email: string,
    offerName: string,
    amountCents: number | null,
    createdSeconds: number,
    checkoutSessionId: string,
): Promise<"sent" | "not_configured" | "failed"> {
    try {
        const baseUrl = optionalSiteOrigin();
        if (!baseUrl || !amountCents || amountCents <= 0 || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
            console.error("[Webhook] Purchase confirmation skipped (missing configuration or amount)");
            return "not_configured";
        }
        const { subject, text, html } = buildPurchaseConfirmationEmail(getEmailContext(baseUrl), {
            offerName,
            amountCents,
            purchasedAt: new Date(createdSeconds * 1000),
        });
        return await sendResendMessage({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.RESEND_FROM_EMAIL,
            to: email,
            subject,
            html,
            text,
            idempotencyKey: stripeEmailIdempotencyKey("purchase-confirmation", checkoutSessionId),
        }) ? "sent" : "failed";
    } catch {
        console.error("[Webhook] Purchase confirmation failed");
        return "failed";
    }
}

function canSendWelcomeEmail() {
    return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

async function refundRejectedCheckout(
    session: Stripe.Checkout.Session,
    reason: "missing_customer_identity" | "missing_terms_consent" | "unknown_price",
    metadata: Record<string, string> = {},
) {
    const intent = paymentIntentId(session.payment_intent);
    if (!intent) {
        console.error(`[Webhook] ${reason} checkout has no refundable payment intent`);
        return { outcome: "refund_failed" as const };
    }
    return createConfirmedRefund(
        {
            createRefund: (params, options) => stripe.refunds.create(params, options),
            retrieveRefund: (refundId) => stripe.refunds.retrieve(refundId),
            log: (message) => console.error(message),
        },
        {
            request: {
                payment_intent: intent,
                reason: "requested_by_customer",
                metadata: {
                    refused_reason: reason,
                    checkout_session_id: session.id,
                    ...metadata,
                },
            },
            idempotencyKey: `${reason}-${session.id}`,
            logLabel: `${reason} checkout`,
        },
    );
}


async function recordStripePurchase(
    supabase: SupabaseClient,
    input: {
        checkoutSessionId: string;
        paymentIntentId: string | null;
        userId: string | null;
        tier: PaidTier;
        status: "pending" | "active";
        amountTotal: number | null;
        currency: string | null;
        customerEmail: string | null;
    },
): Promise<string | null> {
    const { data, error } = await supabase.rpc("record_stripe_purchase", {
        p_checkout_session_id: input.checkoutSessionId,
        p_payment_intent_id: input.paymentIntentId,
        p_user_id: input.userId,
        p_tier: input.tier,
        p_status: input.status,
        p_amount_total: input.amountTotal,
        p_currency: input.currency,
        p_customer_email: input.customerEmail,
    });
    if (error) return error.message;
    return typeof data === "string" ? null : "Invalid Stripe purchase ledger response";
}

async function recalculateStripeEntitlement(supabase: SupabaseClient, userId: string): Promise<string | null> {
    const { data, error } = await supabase.rpc("recalculate_stripe_entitlement", { p_user_id: userId });
    if (error) return error.message;
    return typeof data === "string" || data === null ? null : "Invalid Stripe entitlement response";
}

function stripePaymentIntent(value: unknown): string | null {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return value.id;
    return null;
}

async function revokeStripePurchase(
    supabase: SupabaseClient,
    paymentIntent: string,
    status: "refunded" | "disputed" | "revoked",
    reason: string,
): Promise<string | null> {
    const { data, error } = await supabase.rpc("revoke_stripe_purchase", {
        p_payment_intent_id: paymentIntent,
        p_status: status,
        p_reason: reason,
    });
    if (error) return error.message;
    if (data === "not_found") return "Stripe purchase ledger entry not found";
    return null;
}

async function recordTerminalCheckout(
    supabase: SupabaseClient,
    session: Stripe.Checkout.Session,
    reason: "missing_customer_identity" | "missing_terms_consent" | "unknown_price" | "upgrade_refused",
): Promise<string | null> {
    const { error } = await supabase.rpc("record_stripe_checkout_terminal", {
        p_checkout_session_id: session.id,
        p_payment_intent_id: stripePaymentIntent(session.payment_intent),
        p_reason: reason,
    });
    return error?.message ?? null;
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const boundedBody = await readBoundedBody(req, MAX_STRIPE_WEBHOOK_BODY_BYTES);
    if (boundedBody.ok === false) {
        const status = boundedBody.reason === "too_large" ? 413 : boundedBody.reason === "timeout" ? 408 : 400;
        return NextResponse.json({ error: "Invalid webhook body" }, { status });
    }
    const body = boundedBody.text;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch {
        console.error("Webhook verification failed");
        return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    if (
        event.type === "charge.refunded"
        || event.type === "charge.dispute.created"
        || event.type === "charge.dispute.closed"
    ) {
        const chargeOrDispute = event.data.object as Stripe.Charge | Stripe.Dispute;
        const paymentIntent = stripePaymentIntent(chargeOrDispute.payment_intent);
        if (!paymentIntent) return NextResponse.json({ received: true }, { status: 200 });

        if (event.type === "charge.refunded") {
            const charge = chargeOrDispute as Stripe.Charge;
            const fullyRefunded = charge.refunded
                || (typeof charge.amount === "number"
                    && typeof charge.amount_refunded === "number"
                    && charge.amount > 0
                    && charge.amount_refunded >= charge.amount);
            if (!fullyRefunded) return NextResponse.json({ received: true }, { status: 200 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );
        let ledgerError: string | null;
        if (event.type === "charge.dispute.closed") {
            const dispute = chargeOrDispute as Stripe.Dispute;
            const { data, error } = await supabase.rpc("resolve_stripe_dispute", {
                p_payment_intent_id: paymentIntent,
                p_lost: dispute.status === "lost",
            });
            ledgerError = error?.message ?? (data === "not_found" ? "Stripe purchase ledger entry not found" : null);
        } else {
            ledgerError = await revokeStripePurchase(
                supabase,
                paymentIntent,
                event.type === "charge.refunded" ? "refunded" : "disputed",
                event.type,
            );
        }
        if (ledgerError) {
            console.error("[Webhook] Stripe entitlement revocation failed");
            return NextResponse.json({ error: "Processing failed" }, { status: 500 });
        }
        revalidatePath("/", "layout");
        return NextResponse.json({ received: true }, { status: 200 });
    }

    if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
    ) {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!isPaidCheckoutSession(session)) {
            return NextResponse.json({ received: true }, { status: 200 });
        }
        const referenceId = session.client_reference_id?.trim() || null;
        const customerEmail = normalizeCustomerEmail(session.customer_details?.email);
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Le produit est identifié avant toute résolution ou création de compte.
        let priceId: string | null = null;
        try {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
            priceId = lineItems.data[0]?.price?.id ?? null;
        } catch {
            console.error("[Webhook] Stripe line-item lookup failed");
            return NextResponse.json({ error: "Processing failed" }, { status: 500 });
        }

        const tier = determineStripeTier(
            priceId,
            process.env.STRIPE_BEGINNER_PRICE_ID,
            process.env.STRIPE_FULL_PRICE_ID,
            process.env.STRIPE_UPGRADE_PRICE_ID,
        );
        if (!tier) {
            console.error("[Webhook] Paid checkout uses an unknown Stripe price; refunding");
            const refund = await refundRejectedCheckout(session, "unknown_price", {
                observed_price_id: priceId ?? "missing",
            });
            if (refund.outcome !== "refunded") {
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }
            const terminalError = await recordTerminalCheckout(supabase, session, "unknown_price");
            if (terminalError) return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            return NextResponse.json({ received: true }, { status: 200 });
        }

        if (!hasAcceptedStripeTerms(session)) {
            console.error("[Webhook] Paid checkout is missing required terms consent; refunding");
            const refund = await refundRejectedCheckout(session, "missing_terms_consent");
            if (refund.outcome !== "refunded") {
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }
            const terminalError = await recordTerminalCheckout(supabase, session, "missing_terms_consent");
            if (terminalError) return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const isUpgrade = priceId === process.env.STRIPE_UPGRADE_PRICE_ID;
        if (isUpgrade) {
            const upgradeUserId = secureUpgradeUserId(session);
            if (!upgradeUserId) {
                console.error("[Webhook] Upgrade checkout is not bound to an authenticated account");
                const refused = await refuseUpgradePurchase(
                    {
                        createRefund: (params, options) => stripe.refunds.create(params, options),
                        retrieveRefund: (refundId) => stripe.refunds.retrieve(refundId),
                        notifyCustomer: (email) => sendUpgradeRefusalEmail(email, session.id),
                        log: (message) => console.error(message),
                    },
                    { sessionId: session.id, paymentIntent: session.payment_intent, customerEmail },
                );
                if (refused.outcome === "refund_failed" || refused.outcome === "refund_pending") {
                    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                }
                const terminalError = await recordTerminalCheckout(supabase, session, "upgrade_refused");
                if (terminalError) return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                return NextResponse.json({ received: true }, { status: 200 });
            }

            const result = await processPaidUpgrade(
                {
                    claimUpgrade: async (userId, checkoutSessionId) => {
                        const { data, error } = await supabase.rpc("apply_stripe_upgrade", {
                            p_user_id: userId,
                            p_checkout_session_id: checkoutSessionId,
                            p_payment_intent_id: stripePaymentIntent(session.payment_intent),
                        });
                        if (error) throw new Error("Atomic upgrade RPC failed");
                        if (
                            data === "granted" ||
                            data === "duplicate" ||
                            data === "refuse" ||
                            data === "conflict"
                        ) {
                            return data as UpgradeClaimResult;
                        }
                        throw new Error("Atomic upgrade RPC returned an invalid result");
                    },
                    createRefund: (params, options) => stripe.refunds.create(params, options),
                    retrieveRefund: (refundId) => stripe.refunds.retrieve(refundId),
                    notifyCustomer: (email) => sendUpgradeRefusalEmail(email, session.id),
                    log: (message) => console.error(message),
                },
                {
                    userId: upgradeUserId,
                    sessionId: session.id,
                    paymentIntent: session.payment_intent,
                    customerEmail,
                },
            );

            if (
                result.outcome === "claim_failed" ||
                result.outcome === "refund_failed" ||
                result.outcome === "refund_pending"
            ) {
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }
            if (result.outcome === "refunded" || result.outcome === "no_payment_intent") {
                const terminalError = await recordTerminalCheckout(supabase, session, "upgrade_refused");
                if (terminalError) return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                return NextResponse.json({ received: true }, { status: 200 });
            }

            revalidatePath("/", "layout");
            if (customerEmail) {
                const confirmation = await sendPurchaseConfirmationEmail(
                    customerEmail,
                    `Passage de ${FONDATIONS_LABEL} à ${COFFRE_LABEL}`,
                    session.amount_total ?? null,
                    event.created,
                    session.id,
                );
                if (confirmation === "failed") {
                    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                }
            }
            return NextResponse.json({ received: true }, { status: 200 });
        }

        let userId: string | null = null;

        if (!customerEmail) {
            console.error("[Webhook] Initial checkout has no resolvable customer identity; refunding");
            const refund = await refundRejectedCheckout(session, "missing_customer_identity", {
                observed_client_reference: isUuid(referenceId) ? "valid_uuid_without_email" : "missing_or_invalid",
            });
            if (refund.outcome !== "refunded") {
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }
            const terminalError = await recordTerminalCheckout(supabase, session, "missing_customer_identity");
            if (terminalError) return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const { data: existingPurchase, error: existingPurchaseError } = await supabase
            .from("stripe_purchase_ledger")
            .select("status, user_id")
            .eq("checkout_session_id", session.id)
            .maybeSingle();
        if (existingPurchaseError) {
            console.error("[Webhook] Stripe purchase ledger lookup failed");
            return NextResponse.json({ error: "Processing failed" }, { status: 500 });
        }
        if (existingPurchase) {
            if (existingPurchase.user_id && ["active", "pending"].includes(existingPurchase.status)) {
                const refreshError = await recalculateStripeEntitlement(supabase, existingPurchase.user_id);
                if (refreshError) {
                    console.error("[Webhook] Stripe entitlement retry failed");
                    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                }
                revalidatePath("/", "layout");
            }
            if (["active", "pending"].includes(existingPurchase.status) && customerEmail) {
                const emailResult = await sendPurchaseConfirmationEmail(
                    customerEmail,
                    tier === "beginner" ? FONDATIONS_LABEL : COFFRE_LABEL,
                    session.amount_total ?? null,
                    event.created,
                    session.id,
                );
                if (emailResult === "failed") {
                    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                }
            }
            return NextResponse.json({ received: true }, { status: 200 });
        }
        if (referenceId) {
            if (!isUuid(referenceId)) {
                console.warn("[Webhook] Ignoring an unbound client reference");
            } else {
                const { data: referencedProfile, error: referenceError } = await supabase
                    .from("profiles")
                    .select("id, email")
                    .eq("id", referenceId)
                    .maybeSingle();

                if (referenceError) {
                    console.error("[Webhook] Reference profile lookup failed");
                    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                } else if (referencedProfile && emailsMatch(referencedProfile.email, customerEmail)) {
                    const { data: authResult, error: authError } = await supabase.auth.admin.getUserById(referencedProfile.id);
                    if (authError) {
                        console.error("[Webhook] Referenced Auth account lookup failed");
                        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                    }
                    if (authResult.user?.email_confirmed_at && emailsMatch(authResult.user.email, customerEmail)) {
                        userId = referencedProfile.id;
                    } else {
                        console.warn("[Webhook] Referenced account email is not verified; purchase remains pending");
                    }
                } else {
                    console.warn("[Webhook] Client reference did not match customer email");
                }
            }
        }

        if (!userId && customerEmail) {
            const { data: profile, error: profileLookupError } = await supabase
                .from("profiles")
                .select("id, email")
                .ilike("email", escapeIlikePattern(customerEmail))
                .maybeSingle();

            if (profileLookupError) {
                console.error("[Webhook] Customer profile lookup failed");
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            } else if (profile) {
                // A matching profile alone is not proof of address control. The authenticated
                // account can claim this pending ledger row after Supabase verifies its email.
                console.warn("[Webhook] Existing account found by email; purchase remains pending");
            } else {
                let appUrl: string;
                try {
                    appUrl = requireSiteOrigin();
                } catch {
                    console.error("[Webhook] NEXT_PUBLIC_APP_URL is not configured or invalid");
                    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                }
                const redirectTo = `${appUrl}/update-password`;

                if (!canSendWelcomeEmail()) {
                    const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
                        customerEmail,
                        {
                            redirectTo,
                            data: { invited_from: "stripe_checkout" },
                        }
                    );
                    if (inviteError || !invited?.user?.id) {
                        console.error("[Webhook] Supabase invitation failed");
                        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                    }
                    userId = invited.user.id;
                } else {
                    const { data: inviteLink, error: linkError } = await supabase.auth.admin.generateLink({
                        type: "invite",
                        email: customerEmail,
                        options: {
                            redirectTo,
                            data: { invited_from: "stripe_checkout" },
                        },
                    });

                    const actionLink = inviteLink?.properties?.action_link;
                    if (linkError || !inviteLink?.user?.id || !actionLink) {
                        console.error("[Webhook] Supabase invitation link generation failed");
                        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                    }
                    userId = inviteLink.user.id;
                    const sent = await sendWelcomeEmail(customerEmail, actionLink, session.id);
                    if (!sent) {
                        const { data: fallbackInvited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
                            customerEmail,
                            {
                                redirectTo,
                                data: { invited_from: "stripe_checkout_fallback" },
                            }
                        );
                        if (inviteError || !fallbackInvited?.user?.id) {
                            console.error("[Webhook] Fallback Supabase invitation failed");
                            return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                        }
                    }
                }
            }
        }
        const ledgerError = await recordStripePurchase(supabase, {
            checkoutSessionId: session.id,
            paymentIntentId: stripePaymentIntent(session.payment_intent),
            userId,
            tier,
            status: userId ? "active" : "pending",
            amountTotal: session.amount_total ?? null,
            currency: session.currency ?? null,
            customerEmail,
        });
        if (ledgerError) {
            console.error("[Webhook] Stripe purchase ledger update failed");
            return NextResponse.json({ error: "Processing failed" }, { status: 500 });
        }

        if (userId) revalidatePath("/", "layout");
        if (customerEmail) {
            const offerName = tier === "beginner" ? FONDATIONS_LABEL : COFFRE_LABEL;
            const confirmation = await sendPurchaseConfirmationEmail(
                customerEmail,
                offerName,
                session.amount_total ?? null,
                event.created,
                session.id,
            );
            if (confirmation === "failed") {
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
