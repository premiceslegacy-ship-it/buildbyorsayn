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
    referenceMatchesProfile,
    type PaidTier,
} from "@/lib/stripeEntitlements";
import {
    hasAcceptedStripeTerms,
    isPaidCheckoutSession,
    secureUpgradeUserId,
} from "@/lib/stripeCheckout";
import { buildUpgradeRefusalEmail, createConfirmedRefund, paymentIntentId, refuseUpgradePurchase } from "@/lib/stripeUpgradeRefusal";
import { processPaidUpgrade, type UpgradeClaimResult } from "@/lib/stripeUpgradeProcessing";
import { sendResendMessage, stripeEmailIdempotencyKey } from "@/lib/resendTransport";
import { optionalSiteOrigin, requireSiteOrigin } from "@/lib/siteOrigin";
import { getLegalEntity } from "@/lib/legal/entity";
import { buildPurchaseConfirmation } from "@/lib/legal/consent";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { readBoundedBody } from "@/lib/mcp/http";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const MAX_STRIPE_WEBHOOK_BODY_BYTES = 512 * 1024;

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function buildWelcomeEmailHtml(actionLink: string) {
    const safeLink = escapeHtml(actionLink);

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue dans BUILD</title>
</head>
<body style="margin:0;padding:0;background-color:#0e0e0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0e0e0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:12px;vertical-align:middle;">
                    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(0,55)">
                        <path fill="#e8d5b0" d="M50 25 L100 0 L150 25 L100 50 Z"/>
                        <path fill="#30261c" d="M50 25 L100 50 V110 L50 85 Z"/>
                        <path fill="#c9b48a" d="M150 25 L100 50 V110 L150 85 Z"/>
                      </g>
                      <g transform="translate(10,80)">
                        <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"/>
                        <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"/>
                        <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"/>
                      </g>
                      <g transform="translate(55,57)">
                        <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"/>
                        <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"/>
                        <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"/>
                      </g>
                      <g transform="translate(100,34)">
                        <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"/>
                        <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"/>
                        <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"/>
                      </g>
                    </svg>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:22px;font-weight:800;letter-spacing:4px;color:#f0ede8;text-transform:uppercase;">BUILD</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(232,213,176,0.3),transparent);"></td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#c9b48a;">BUILD BY ORSAYN</p>
              <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;line-height:1.2;color:#f0ede8;">
                Bienvenue dans<br/>
                <span style="color:#c9b48a;">ton espace BUILD.</span>
              </h1>
              <p style="margin:0 0 12px;font-size:15px;line-height:1.75;color:#8a8070;">
                Ton paiement est confirmé. Il ne reste qu'une étape pour activer ton compte et accéder à ton espace membre.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.75;color:#8a8070;">
                Clique sur le bouton ci-dessous, choisis ton mot de passe, puis tu seras redirigé vers BUILD.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td>
                    <a href="${safeLink}" style="display:inline-block;background:#c9b48a;color:#0e0e0f;text-decoration:none;font-size:14px;font-weight:800;border-radius:12px;padding:15px 20px;">
                      Activer mon compte
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-size:12px;line-height:1.6;color:rgba(240,237,232,0.25);">
                Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :<br/>
                <span style="color:rgba(201,180,138,0.55);word-break:break-all;">${safeLink}</span>
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="height:1px;background:rgba(255,255,255,0.06);"></td>
                </tr>
              </table>
              <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(240,237,232,0.2);">
                Si tu n'es pas à l'origine de cet achat, tu peux ignorer cet email.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:11px;color:rgba(240,237,232,0.18);line-height:1.6;">BUILD by Orsayn</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendWelcomeEmail(email: string, actionLink: string, checkoutSessionId: string) {
    return sendResendMessage({
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM,
        to: email,
        subject: "Bienvenue dans BUILD - active ton compte",
        html: buildWelcomeEmailHtml(actionLink),
        text: `Bienvenue dans BUILD.\n\nTon paiement est confirmé. Active ton compte et choisis ton mot de passe ici : ${actionLink}`,
        idempotencyKey: stripeEmailIdempotencyKey("welcome", checkoutSessionId),
    });
}

async function sendUpgradeRefusalEmail(email: string, checkoutSessionId: string) {
    const { subject, text, html } = buildUpgradeRefusalEmail(optionalSiteOrigin());
    return sendResendMessage({
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM,
        to: email,
        subject,
        html,
        text,
        idempotencyKey: stripeEmailIdempotencyKey("upgrade-refused", checkoutSessionId),
    });
}

/**
 * Confirmation d'achat sur support durable (contrat, prix, accès immédiat, renonciation au droit de rétractation).
 * Ne fait jamais échouer le webhook : un client qui a payé ne doit pas recevoir une erreur parce que l'e-mail n'est pas parti.
 */
async function sendPurchaseConfirmationEmail(
    email: string,
    offerName: string,
    amountCents: number | null,
    createdSeconds: number,
    checkoutSessionId: string,
) {
    try {
        const baseUrl = optionalSiteOrigin();
        if (!baseUrl || !amountCents || amountCents <= 0) {
            console.error("[Webhook] Purchase confirmation skipped (missing configuration or amount)");
            return false;
        }
        const entity = getLegalEntity();
        const { subject, text, html } = buildPurchaseConfirmation({
            offerName,
            amountCents,
            purchasedAt: new Date(createdSeconds * 1000),
            baseUrl,
            seller: {
                fullName: entity.fullName,
                tradeName: entity.tradeName,
                siret: entity.siret,
                address: entity.address,
                contactEmail: entity.contactEmail,
                vatMention: entity.vatMention,
            },
        });
        return sendResendMessage({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM,
            to: email,
            subject,
            html,
            text,
            idempotencyKey: stripeEmailIdempotencyKey("purchase-confirmation", checkoutSessionId),
        });
    } catch {
        console.error("[Webhook] Purchase confirmation failed");
        return false;
    }
}

function canSendWelcomeEmail() {
    return Boolean(process.env.RESEND_API_KEY && (process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM));
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

async function persistProfileTier(
    supabase: SupabaseClient,
    userId: string,
    incomingTier: PaidTier,
    customerEmail: string | null,
): Promise<string | null> {
    const payload = {
        id: userId,
        tier: incomingTier,
        ...(customerEmail ? { email: customerEmail } : {}),
    };

    let updateQuery = supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId)
        // PostgREST's `neq` does not match NULL. Keep an unassigned profile
        // eligible while preserving admin access and paid-tier monotonicity.
        .or("tier.is.null,tier.neq.admin");

    if (incomingTier === "beginner") {
        updateQuery = updateQuery.or("tier.is.null,tier.neq.full");
    }

    const { data: updatedProfile, error: updateError } = await updateQuery
        .select("id")
        .maybeSingle();

    if (updateError) return updateError.message;
    if (updatedProfile) return null;

    const { error: insertError } = await supabase.from("profiles").insert(payload);
    if (!insertError) return null;
    if (insertError.code !== "23505") return insertError.message;

    // A concurrent webhook inserted the row. Retry the same monotonic update:
    // a beginner event can never overwrite a full or admin profile.
    let retryQuery = supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId)
        .or("tier.is.null,tier.neq.admin");

    if (incomingTier === "beginner") {
        retryQuery = retryQuery.or("tier.is.null,tier.neq.full");
    }

    const { error: retryError } = await retryQuery.select("id").maybeSingle();
    return retryError?.message ?? null;
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
            return NextResponse.json({ received: true }, { status: 200 });
        }

        if (!hasAcceptedStripeTerms(session)) {
            console.error("[Webhook] Paid checkout is missing required terms consent; refunding");
            const refund = await refundRejectedCheckout(session, "missing_terms_consent");
            if (refund.outcome !== "refunded") {
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }
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
                return NextResponse.json({ received: true }, { status: 200 });
            }

            const result = await processPaidUpgrade(
                {
                    claimUpgrade: async (userId, checkoutSessionId) => {
                        const { data, error } = await supabase.rpc("apply_stripe_upgrade", {
                            p_user_id: userId,
                            p_checkout_session_id: checkoutSessionId,
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
                return NextResponse.json({ received: true }, { status: 200 });
            }

            revalidatePath("/", "layout");
            if (customerEmail) {
                await sendPurchaseConfirmationEmail(
                    customerEmail,
                    `Passage de ${FONDATIONS_LABEL} à ${COFFRE_LABEL}`,
                    session.amount_total ?? null,
                    event.created,
                    session.id,
                );
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
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // Pour les achats initiaux, la référence reste un indice lié à l'e-mail du profil.
        if (referenceId) {
            if (!isUuid(referenceId) || !customerEmail) {
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
                } else if (
                    referencedProfile &&
                    referenceMatchesProfile(referenceId, customerEmail, referencedProfile.email)
                ) {
                    userId = referencedProfile.id;
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
            } else if (profile && emailsMatch(profile.email, customerEmail)) {
                userId = profile.id;
            } else if (!profile) {
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

        if (userId) {
            const persistenceError = await persistProfileTier(supabase, userId, tier, customerEmail);
            if (persistenceError) {
                console.error("[Webhook] Profile entitlement update failed");
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }

            revalidatePath("/", "layout");
            if (customerEmail) {
                const offerName = tier === "beginner" ? FONDATIONS_LABEL : COFFRE_LABEL;
                await sendPurchaseConfirmationEmail(
                    customerEmail,
                    offerName,
                    session.amount_total ?? null,
                    event.created,
                    session.id,
                );
            }
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
