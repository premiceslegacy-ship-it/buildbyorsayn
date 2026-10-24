import Stripe from "stripe";
import { verifyConfiguredStripePaymentLinks, verifyConfiguredStripePrices } from "./stripePricingCheck";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

Promise.all([
  verifyConfiguredStripePrices(stripe),
  verifyConfiguredStripePaymentLinks(stripe),
])
  .then(() => console.log("Stripe prices and Payment Links match lib/pricing.ts."))
  .catch((error) => {
    console.error("ERROR", error instanceof Error ? error.message : error);
    process.exit(1);
  });
