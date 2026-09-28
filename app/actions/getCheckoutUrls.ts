"use server";

import { sanitizeStripeCheckoutUrl, STRIPE_FULL_CHECKOUT_LINK } from "@/lib/pricing";

export async function getCheckoutUrls() {
    return {
        beginner: sanitizeStripeCheckoutUrl(process.env.STRIPE_BEGINNER_CHECKOUT_LINK),
        upgrade: sanitizeStripeCheckoutUrl(process.env.STRIPE_UPGRADE_CHECKOUT_LINK),
        full: sanitizeStripeCheckoutUrl(STRIPE_FULL_CHECKOUT_LINK),
    };
}
