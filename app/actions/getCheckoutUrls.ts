"use server";

export async function getCheckoutUrls() {
    return {
        beginner: process.env.STRIPE_BEGINNER_CHECKOUT_LINK ?? null,
        upgrade: process.env.STRIPE_UPGRADE_CHECKOUT_LINK ?? null,
        full: "https://buy.stripe.com/dRm8wQ8JMgSd7taaqc5AQ0a",
    };
}
