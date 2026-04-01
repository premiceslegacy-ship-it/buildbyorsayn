"use server";

const STRIPE_FULL_URL = "https://buy.stripe.com/aFa28saRUgSdaFm69W5AQ02";

export async function getCheckoutUrls() {
    return {
        beginner: process.env.STRIPE_BEGINNER_CHECKOUT_LINK ?? null,
        upgrade: process.env.STRIPE_UPGRADE_CHECKOUT_LINK ?? null,
        full: STRIPE_FULL_URL,
    };
}
