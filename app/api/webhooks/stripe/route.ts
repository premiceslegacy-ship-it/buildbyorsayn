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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

async function sendWelcomeEmail(email: string, actionLink: string) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM;

    if (!resendApiKey || !from) return false;

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from,
                to: [email],
                subject: "Bienvenue dans BUILD - active ton compte",
                html: buildWelcomeEmailHtml(actionLink),
                text: `Bienvenue dans BUILD.\n\nTon paiement est confirmé. Active ton compte et choisis ton mot de passe ici : ${actionLink}`,
            }),
        });

        if (!response.ok) {
            console.error("[Webhook] Resend welcome email failed");
            return false;
        }

        return true;
    } catch {
        console.error("[Webhook] Resend welcome email request failed");
        return false;
    }
}

function canSendWelcomeEmail() {
    return Boolean(process.env.RESEND_API_KEY && (process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM));
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
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

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

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const referenceId = session.client_reference_id?.trim() || null;
        const customerEmail = normalizeCustomerEmail(session.customer_details?.email);
        let userId: string | null = null;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // A client-controlled reference is only a hint. Bind it to the
        // customer email already stored on that profile before granting access.
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

        // If the reference is absent or cannot be bound, resolve the account
        // by the normalized Stripe customer email instead.
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
                const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://buildbyorsayn.com";
                const redirectTo = `${appUrl}/update-password`;

                if (!canSendWelcomeEmail()) {
                    const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
                        customerEmail,
                        {
                            redirectTo,
                            data: { invited_from: "stripe_checkout" },
                        }
                    );
                    if (inviteError) {
                        console.error("[Webhook] Supabase invitation failed");
                        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
                    } else if (!invited?.user?.id) {
                        console.error("[Webhook] Supabase invitation returned no user");
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
                    } else {
                        userId = inviteLink.user.id;
                        const sent = await sendWelcomeEmail(customerEmail, actionLink);

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
        }

        if (userId) {
            // Retrieve line items to identify which price was purchased.
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
                console.error("[Webhook] Stripe price ID is not allowlisted");
                return NextResponse.json({ received: true }, { status: 200 });
            }

            const persistenceError = await persistProfileTier(supabase, userId, tier, customerEmail);
            if (persistenceError) {
                console.error("[Webhook] Profile entitlement update failed");
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }

            revalidatePath("/", "layout");
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
