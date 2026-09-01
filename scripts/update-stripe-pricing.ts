import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const NEW_FULL_PRICE_EUR = 267;
const NEW_UPGRADE_PRICE_EUR = 170;

const FULL_PRODUCT_ID = "prod_U7HWWznAsa9w84"; // BUILD (le coffre)
const UPGRADE_PRODUCT_ID = "prod_UFyD51NiZlQyUG"; // BUILD UPGRADE

const FULL_PAYMENT_LINK_ID = "plink_1TiKNmJwMU6o9YwIOQCeAeo8";
const UPGRADE_PAYMENT_LINK_ID = "plink_1TiKL1JwMU6o9YwIGw7ucEAf";

const OLD_FULL_PRICE_ID = "price_1TiKMDJwMU6o9YwIyOe43dkD"; // 497€
const OLD_UPGRADE_PRICE_ID = "price_1TiKJOJwMU6o9YwIAFHp38MV"; // 400€

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

async function repointPaymentLink(paymentLinkId: string, newPriceId: string) {
  // Stripe's API does not allow swapping the price of an existing line item
  // on a payment link (PaymentLinkUpdateParams.LineItem only accepts
  // quantity/adjustable_quantity, never a new price). The only way to change
  // the price behind a payment link is to create a new one and retire the old.
  const link = await stripe.paymentLinks.retrieve(paymentLinkId);
  const created = await stripe.paymentLinks.create({
    line_items: [{ price: newPriceId, quantity: 1 }],
    after_completion: link.after_completion,
  });
  await stripe.paymentLinks.update(paymentLinkId, { active: false });
  return { url: created.url, newId: created.id, oldUrl: link.url };
}

async function main() {
  console.log(APPLY ? "MODE: APPLY (mutations will run)" : "MODE: DRY RUN (no mutations)");
  console.log();

  console.log(`1. New Fondations->COFFRE full price: ${eur(NEW_FULL_PRICE_EUR * 100)} on product ${FULL_PRODUCT_ID}`);
  console.log(`2. New upgrade price: ${eur(NEW_UPGRADE_PRICE_EUR * 100)} on product ${UPGRADE_PRODUCT_ID}`);
  console.log();

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
  console.log("3. Payment links: Stripe does not allow changing the price behind an");
  console.log("   existing payment link, so this creates NEW links and deactivates the old");
  console.log("   ones. The buy.stripe.com URLs WILL change - update the hardcoded URLs in");
  console.log("   the codebase and STRIPE_UPGRADE_CHECKOUT_LINK with the new ones printed below.");
  let newFullLinkUrl = "<dry-run: not created>";
  let newUpgradeLinkUrl = "<dry-run: not created>";
  if (APPLY) {
    const fullResult = await repointPaymentLink(FULL_PAYMENT_LINK_ID, newFullPriceId);
    newFullLinkUrl = fullResult.url;
    console.log(`  full: new link ${fullResult.url} (old ${fullResult.oldUrl} deactivated)`);

    const upgradeResult = await repointPaymentLink(UPGRADE_PAYMENT_LINK_ID, newUpgradePriceId);
    newUpgradeLinkUrl = upgradeResult.url;
    console.log(`  upgrade: new link ${upgradeResult.url} (old ${upgradeResult.oldUrl} deactivated)`);
  } else {
    console.log(`  would create new links for products behind ${FULL_PAYMENT_LINK_ID} and ${UPGRADE_PAYMENT_LINK_ID}, then deactivate those two.`);
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
    console.log(`  STRIPE_FULL_PRICE_ID=${newFullPriceId}`);
    console.log(`  STRIPE_UPGRADE_PRICE_ID=${newUpgradePriceId}`);
    console.log(`  STRIPE_UPGRADE_CHECKOUT_LINK=${newUpgradeLinkUrl}`);
    console.log(`  lib/pricing.ts STRIPE_FULL_CHECKOUT_LINK=${newFullLinkUrl}`);
    console.log();
    console.log("Do this BEFORE announcing the new price anywhere - until the env vars are");
    console.log("updated, the webhook will not recognize the new price IDs and will fail-open");
    console.log('a paying customer to tier="beginner". The old payment link URLs now 404.');
  } else {
    console.log("Dry run complete. Re-run with --apply to execute these changes for real.");
  }
}

main().catch((err) => {
  console.error("ERROR", err);
  process.exit(1);
});
