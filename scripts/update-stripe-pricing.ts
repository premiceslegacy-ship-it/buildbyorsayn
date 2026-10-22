import Stripe from "stripe";
import { CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const NEW_FULL_PRICE_EUR = 267;
const NEW_UPGRADE_PRICE_EUR = 170;

const FULL_PRODUCT_ID = "prod_U7HWWznAsa9w84"; // BUILD (le coffre)
const UPGRADE_PRODUCT_ID = "prod_UFyD51NiZlQyUG"; // BUILD UPGRADE

const FULL_PAYMENT_LINK_ID = "plink_1TiKNmJwMU6o9YwIOQCeAeo8";
const UPGRADE_PAYMENT_LINK_ID = "plink_1TiKL1JwMU6o9YwIGw7ucEAf";

const OLD_FULL_PRICE_ID = "price_1TiKMDJwMU6o9YwIyOe43dkD"; // 497€
const OLD_UPGRADE_PRICE_ID = "price_1TiKJOJwMU6o9YwIAFHp38MV"; // 400€

const BEGINNER_PAYMENT_LINK_URL = process.env.STRIPE_BEGINNER_CHECKOUT_LINK;

// Stale/orphan payment links found in a read-only audit of the live Stripe
// account. Each sells one of the two products above at an old, no-longer-valid
// amount. They stay reachable (someone may have the URL bookmarked) but must
// stop accepting new payments once the new pricing goes live.
const OBSOLETE_PAYMENT_LINKS = [
  { id: "plink_1TFfeGJwMU6o9YwItwYmondn", label: "BUILD @ 100€ (bug: linked from /blocs/[id], now fixed to point at the real full link)" },
  { id: "plink_1T932WJwMU6o9YwImuPajBvN", label: "BUILD @ 67€" },
  { id: "plink_1THSSPJwMU6o9YwIw0sVVA7u", label: "BUILD FOUNDATIONS @ 30€" },
  { id: "plink_1THSQ0JwMU6o9YwIP8NP7rzn", label: "BUILD UPGRADE @ 70€" },
];

const APPLY = process.argv.includes("--apply");

function eur(cents: number) {
  return `${(cents / 100).toFixed(2)}€`;
}

async function paidSessionsCount(paymentLinkId: string, days = 90) {
  const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
  let count = 0;
  for await (const session of stripe.checkout.sessions.list({
    payment_link: paymentLinkId,
    created: { gte: since },
    limit: 100,
  })) {
    if (session.payment_status === "paid") count += 1;
  }
  return count;
}

async function createPrice(productId: string, amountEur: number) {
  return stripe.prices.create({
    product: productId,
    unit_amount: amountEur * 100,
    currency: "eur",
  });
}

async function findActivePaymentLinkByUrl(url: string) {
  for await (const link of stripe.paymentLinks.list({ active: true, limit: 100 })) {
    if (link.url === url) {
      return stripe.paymentLinks.retrieve(link.id, { expand: ["line_items"] });
    }
  }
  throw new Error(`No active Stripe Payment Link matches STRIPE_BEGINNER_CHECKOUT_LINK.`);
}

function existingLineItems(link: Stripe.PaymentLink) {
  const items = link.line_items?.data.map((item) => ({
    price: typeof item.price === "string" ? item.price : item.price.id,
    quantity: item.quantity ?? 1,
  }));
  if (!items?.length) throw new Error(`Payment Link ${link.id} has no reusable line items.`);
  return items;
}

async function replacePaymentLink(
  link: Stripe.PaymentLink,
  lineItems: Stripe.PaymentLinkCreateParams.LineItem[],
) {
  // Stripe does not allow replacing an existing link's prices or retrofitting
  // terms acceptance. Create its compliant replacement before retiring it.
  const created = await stripe.paymentLinks.create({
    line_items: lineItems,
    after_completion: link.after_completion,
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT },
    },
  });
  await stripe.paymentLinks.update(link.id, { active: false });
  return { url: created.url, newId: created.id, oldUrl: link.url };
}

async function repointPaymentLink(paymentLinkId: string, newPriceId: string) {
  const link = await stripe.paymentLinks.retrieve(paymentLinkId);
  return replacePaymentLink(link, [{ price: newPriceId, quantity: 1 }]);
}

async function main() {
  console.log(APPLY ? "MODE: APPLY (mutations will run)" : "MODE: DRY RUN (no mutations)");
  console.log();

  console.log(`1. New Fondations->COFFRE full price: ${eur(NEW_FULL_PRICE_EUR * 100)} on product ${FULL_PRODUCT_ID}`);
  console.log(`2. New upgrade price: ${eur(NEW_UPGRADE_PRICE_EUR * 100)} on product ${UPGRADE_PRODUCT_ID}`);
  console.log();

  let beginnerLink: Stripe.PaymentLink | null = null;
  if (APPLY) {
    if (!BEGINNER_PAYMENT_LINK_URL) {
      throw new Error("STRIPE_BEGINNER_CHECKOUT_LINK is required in apply mode.");
    }
    beginnerLink = await findActivePaymentLinkByUrl(BEGINNER_PAYMENT_LINK_URL);
  }

  let newFullPriceId = "<dry-run: not created>";
  let newUpgradePriceId = "<dry-run: not created>";
  if (APPLY) {
    const newFullPrice = await createPrice(FULL_PRODUCT_ID, NEW_FULL_PRICE_EUR);
    newFullPriceId = newFullPrice.id;
    console.log(`  created price ${newFullPriceId} (${eur(newFullPrice.unit_amount!)})`);

    const newUpgradePrice = await createPrice(UPGRADE_PRODUCT_ID, NEW_UPGRADE_PRICE_EUR);
    newUpgradePriceId = newUpgradePrice.id;
    console.log(`  created price ${newUpgradePriceId} (${eur(newUpgradePrice.unit_amount!)})`);
  }

  console.log();
  console.log("3. Payment paths: replace the public Fondations and LE COFFRE links");
  console.log("   with links requiring the canonical terms, and retire the old public");
  console.log("   upgrade link. Upgrades now use authenticated server-created Checkout Sessions.");
  let newBeginnerLinkUrl = "<dry-run: not created>";
  let newFullLinkUrl = "<dry-run: not created>";
  if (APPLY) {
    const beginnerResult = await replacePaymentLink(beginnerLink!, existingLineItems(beginnerLink!));
    newBeginnerLinkUrl = beginnerResult.url;
    console.log(`  beginner: new link ${beginnerResult.url} (old ${beginnerResult.oldUrl} deactivated)`);
    const fullResult = await repointPaymentLink(FULL_PAYMENT_LINK_ID, newFullPriceId);
    newFullLinkUrl = fullResult.url;
    console.log(`  full: new link ${fullResult.url} (old ${fullResult.oldUrl} deactivated)`);
    await stripe.paymentLinks.update(UPGRADE_PAYMENT_LINK_ID, { active: false });
    console.log(`  upgrade: old public link ${UPGRADE_PAYMENT_LINK_ID} deactivated`);
  } else {
    console.log("  would replace STRIPE_BEGINNER_CHECKOUT_LINK while preserving its existing price/product.");
    console.log(`  would create a new full link behind ${FULL_PAYMENT_LINK_ID} and deactivate ${UPGRADE_PAYMENT_LINK_ID}.`);
  }

  console.log();
  console.log("4. Setting new default_price on both products...");
  if (APPLY) {
    await stripe.products.update(FULL_PRODUCT_ID, { default_price: newFullPriceId });
    await stripe.products.update(UPGRADE_PRODUCT_ID, { default_price: newUpgradePriceId });
    console.log("  done");
  } else {
    console.log(`  would set ${FULL_PRODUCT_ID}.default_price = ${newFullPriceId}`);
    console.log(`  would set ${UPGRADE_PRODUCT_ID}.default_price = ${newUpgradePriceId}`);
  }

  console.log();
  console.log("5. Archiving old prices (497€ and 400€)...");
  if (APPLY) {
    await stripe.prices.update(OLD_FULL_PRICE_ID, { active: false });
    await stripe.prices.update(OLD_UPGRADE_PRICE_ID, { active: false });
    console.log("  done");
  } else {
    console.log(`  would deactivate ${OLD_FULL_PRICE_ID} and ${OLD_UPGRADE_PRICE_ID}`);
  }

  console.log();
  console.log("6. Obsolete payment links (90-day paid session counts, then deactivation):");
  for (const link of OBSOLETE_PAYMENT_LINKS) {
    const count = await paidSessionsCount(link.id).catch((e) => {
      console.log(`  ${link.id} (${link.label}): could not count sessions (${e.message})`);
      return null;
    });
    if (count !== null) {
      console.log(`  ${link.id} (${link.label}): ${count} paid session(s) in the last 90 days`);
    }
    if (APPLY) {
      await stripe.paymentLinks.update(link.id, { active: false });
      console.log(`    -> deactivated`);
    }
  }

  console.log();
  if (APPLY) {
    console.log("DONE. Update these in the codebase AND on Vercel env vars, then redeploy:");
    console.log(`  STRIPE_BEGINNER_CHECKOUT_LINK=${newBeginnerLinkUrl}`);
    console.log(`  STRIPE_FULL_PRICE_ID=${newFullPriceId}`);
    console.log(`  STRIPE_UPGRADE_PRICE_ID=${newUpgradePriceId}`);
    console.log(`  lib/pricing.ts STRIPE_FULL_CHECKOUT_LINK=${newFullLinkUrl}`);
    console.log();
    console.log("Do this BEFORE announcing the new price anywhere. Until the price IDs");
    console.log("are updated, the webhook refuses unknown prices.");
  } else {
    console.log("Dry run complete. Re-run with --apply to execute these changes for real.");
  }
}

main().catch((err) => {
  console.error("ERROR", err);
  process.exit(1);
});
