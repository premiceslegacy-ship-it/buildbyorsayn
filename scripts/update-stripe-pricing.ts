/**
 * Liens de paiement Stripe avec acceptation obligatoire des conditions.
 *
 * Le webhook rembourse tout paiement sans `consent.terms_of_service = accepted`.
 * Stripe ne permet pas d'ajouter cette case à un lien existant : on crée un lien conforme
 * avec les mêmes lignes, puis on retire l'ancien une fois le site déployé avec les nouvelles URL.
 *
 *   npm run stripe:pricing                     état des liens, aucune écriture
 *   npm run stripe:pricing -- --create         crée les liens conformes (les anciens restent actifs)
 *   npm run stripe:pricing -- --retire-old     désactive les anciens liens et le lien public du complément
 *
 * Ordre de mise en production : --create, mettre à jour STRIPE_BEGINNER_CHECKOUT_LINK (Vercel)
 * et STRIPE_FULL_CHECKOUT_LINK (lib/pricing.ts), déployer, puis --retire-old.
 */
import Stripe from "stripe";
import { CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";
import { COFFRE_PRICE, FONDATIONS_PRICE, STRIPE_FULL_CHECKOUT_LINK } from "../lib/pricing";
import {
  hasRequiredPaymentLinkConsent,
  verifyConfiguredStripePrices,
  verifyPaymentLinkPrice,
} from "./stripePricingCheck";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const CREATE = process.argv.includes("--create");
const RETIRE = process.argv.includes("--retire-old");

/** Ancien lien public du complément : le complément passe désormais par une Checkout Session serveur. */
const PUBLIC_UPGRADE_LINK_URL = process.env.STRIPE_UPGRADE_CHECKOUT_LINK;

async function activeLinks(): Promise<Stripe.PaymentLink[]> {
  const links: Stripe.PaymentLink[] = [];
  for await (const link of stripe.paymentLinks.list({ active: true, limit: 100 })) links.push(link);
  return links;
}

async function lineItems(linkId: string): Promise<Stripe.PaymentLinkCreateParams.LineItem[]> {
  const items: Stripe.PaymentLinkCreateParams.LineItem[] = [];
  for await (const item of stripe.paymentLinks.listLineItems(linkId, { limit: 100 })) {
    if (!item.price?.id) throw new Error(`Payment Link ${linkId} has a line without a Price ID.`);
    items.push({ price: item.price.id, quantity: item.quantity ?? 1 });
  }
  if (!items.length) throw new Error(`Payment Link ${linkId} has no line items.`);
  return items;
}

async function validateOfferLink(
  link: Stripe.PaymentLink,
  expectedPriceId: string | undefined,
  expectedAmount: number,
  label: string,
): Promise<Stripe.PaymentLinkCreateParams.LineItem[]> {
  if (!expectedPriceId?.trim()) throw new Error(`${label}: configured Price ID is required.`);
  const items = await lineItems(link.id);
  if (items.length !== 1) throw new Error(`${label}: Payment Link ${link.id} must contain exactly one line item.`);
  const item = items[0];
  if (item.quantity !== 1) throw new Error(`${label}: Payment Link ${link.id} must use quantity 1.`);
  if (item.price !== expectedPriceId.trim()) {
    throw new Error(`${label}: Payment Link ${link.id} must use Price ${expectedPriceId.trim()}.`);
  }
  await verifyPaymentLinkPrice(stripe, item.price, expectedAmount, label);
  return items;
}

/** Même prix et mêmes quantités, dans n'importe quel ordre. */
async function sameLineItems(a: string, b: string): Promise<boolean> {
  const key = (items: Stripe.PaymentLinkCreateParams.LineItem[]) =>
    items.map((item) => `${item.price}x${item.quantity}`).sort().join(",");
  return key(await lineItems(a)) === key(await lineItems(b));
}

const isCompliant = (link: Stripe.PaymentLink) => hasRequiredPaymentLinkConsent(link);

async function main() {
  const beginnerUrl = process.env.STRIPE_BEGINNER_CHECKOUT_LINK;
  if (!beginnerUrl) throw new Error("STRIPE_BEGINNER_CHECKOUT_LINK is required.");
  await verifyConfiguredStripePrices(stripe);
  const links = await activeLinks();
  const configured = [
    { name: "Fondations", url: beginnerUrl, target: "STRIPE_BEGINNER_CHECKOUT_LINK (Vercel)", priceId: process.env.STRIPE_BEGINNER_PRICE_ID, amount: FONDATIONS_PRICE * 100 },
    { name: "LE COFFRE", url: STRIPE_FULL_CHECKOUT_LINK, target: "STRIPE_FULL_CHECKOUT_LINK (lib/pricing.ts)", priceId: process.env.STRIPE_FULL_PRICE_ID, amount: COFFRE_PRICE * 100 },
  ];

  for (const entry of configured) {
    const link = links.find((candidate) => candidate.url === entry.url);
    if (!link) {
      throw new Error(`${entry.name}: configured Payment Link is absent or inactive.`);
    }
    const existingItems = await validateOfferLink(link, entry.priceId, entry.amount, entry.name);
    console.log(`${entry.name}: ${link.id} conditions=${isCompliant(link) ? "oui" : "non"}`);
    if (isCompliant(link) || !CREATE) continue;
    const created = await stripe.paymentLinks.create({
      line_items: existingItems,
      after_completion: link.after_completion,
      consent_collection: { terms_of_service: "required" },
      custom_text: { terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT } },
      metadata: { replaces: link.id },
    });
    console.log(`  créé ${created.id} ${created.url} -> à mettre dans ${entry.target}`);
  }

  if (RETIRE) {
    for (const link of links) {
      const isPublicUpgrade = Boolean(PUBLIC_UPGRADE_LINK_URL) && link.url === PUBLIC_UPGRADE_LINK_URL;
      if (!isPublicUpgrade) {
        // Un lien conforme ne se retire jamais ; un ancien lien seulement si son remplaçant conforme vend la même chose.
        if (isCompliant(link)) continue;
        const replacement = links.find((candidate) => candidate.metadata?.replaces === link.id && isCompliant(candidate));
        if (!replacement) continue;
        if (!(await sameLineItems(link.id, replacement.id))) {
          console.log(`gardé ${link.id} : son remplaçant ${replacement.id} ne vend pas les mêmes lignes`);
          continue;
        }
      }
      await stripe.paymentLinks.update(link.id, { active: false });
      console.log(`désactivé ${link.id} ${link.url}`);
    }
  }

  if (!CREATE && !RETIRE) console.log("Lecture seule. --create puis --retire-old pour agir.");
}

main().catch((error) => {
  console.error("ERROR", error instanceof Error ? error.message : error);
  process.exit(1);
});
