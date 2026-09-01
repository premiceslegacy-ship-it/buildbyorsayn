"use server";

import { STRIPE_FULL_CHECKOUT_LINK } from "@/lib/pricing";

export async function getCheckoutUrls() {
    return {
        beginner: process.env.STRIPE_BEGINNER_CHECKOUT_LINK ?? null,
        upgrade: process.env.STRIPE_UPGRADE_CHECKOUT_LINK ?? null,
        full: STRIPE_FULL_CHECKOUT_LINK,
    };
}
