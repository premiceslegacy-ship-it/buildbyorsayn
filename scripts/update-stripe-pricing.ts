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
import { pathToFileURL } from "node:url";
import Stripe from "stripe";
import { CHECKOUT_CONSENT_TEXT } from "../lib/legal/consent";
import { COFFRE_PRICE, FONDATIONS_PRICE, STRIPE_FULL_CHECKOUT_LINK } from "../lib/pricing";
import {
  hasRequiredPaymentLinkConsent,
  verifyConfiguredStripePrices,
  verifyPaymentLinkPrice,
} from "./stripePricingCheck";
function createStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!apiKey) throw new Error("STRIPE_SECRET_KEY is required.");
  return new Stripe(apiKey);
}
const CREATE = process.argv.includes("--create");
const RETIRE = process.argv.includes("--retire-old");

/** Ancien lien public du complément : le complément passe désormais par une Checkout Session serveur. */
const PUBLIC_UPGRADE_LINK_URL = process.env.STRIPE_UPGRADE_CHECKOUT_LINK;

type PaymentLinkClient = Pick<Stripe, "paymentLinks" | "prices">;

async function activeLinks(client: PaymentLinkClient): Promise<Stripe.PaymentLink[]> {
  const links: Stripe.PaymentLink[] = [];
  for await (const link of client.paymentLinks.list({ active: true, limit: 100 })) links.push(link);
  return links;
}

async function lineItems(client: PaymentLinkClient, linkId: string): Promise<Stripe.PaymentLinkCreateParams.LineItem[]> {
  const items: Stripe.PaymentLinkCreateParams.LineItem[] = [];
  for await (const item of client.paymentLinks.listLineItems(linkId, { limit: 100 })) {
    if (!item.price?.id) throw new Error(`Payment Link ${linkId} has a line without a Price ID.`);
    items.push({ price: item.price.id, quantity: item.quantity ?? 1 });
  }
  if (!items.length) throw new Error(`Payment Link ${linkId} has no line items.`);
  return items;
}

async function validateOfferLink(
  client: PaymentLinkClient,
  link: Stripe.PaymentLink,
  expectedPriceId: string | undefined,
  expectedAmount: number,
  label: string,
): Promise<Stripe.PaymentLinkCreateParams.LineItem[]> {
  if (!expectedPriceId?.trim()) throw new Error(`${label}: configured Price ID is required.`);
  const items = await lineItems(client, link.id);
  if (items.length !== 1) throw new Error(`${label}: Payment Link ${link.id} must contain exactly one line item.`);
  const item = items[0];
  if (item.quantity !== 1) throw new Error(`${label}: Payment Link ${link.id} must use quantity 1.`);
  if (item.price !== expectedPriceId.trim()) {
    throw new Error(`${label}: Payment Link ${link.id} must use Price ${expectedPriceId.trim()}.`);
  }
  await verifyPaymentLinkPrice(client, item.price, expectedAmount, label);
  return items;
}

/** Même prix et mêmes quantités, dans n'importe quel ordre. */
async function sameLineItems(client: PaymentLinkClient, a: string, b: string): Promise<boolean> {
  const key = (items: Stripe.PaymentLinkCreateParams.LineItem[]) =>
    items.map((item) => `${item.price}x${item.quantity}`).sort().join(",");
  return key(await lineItems(client, a)) === key(await lineItems(client, b));
}

function isCompliant(link: Stripe.PaymentLink): boolean {
  return hasRequiredPaymentLinkConsent(link);
}
type RetireOffer = {
  name: string;
  url: string;
  target: string;
  priceId: string | undefined;
  amount: number;
};

export async function retireOldLinks(
  client: PaymentLinkClient,
  links: Stripe.PaymentLink[],
  configured: RetireOffer[],
  upgradeUrl: string,
): Promise<void> {
  if (!upgradeUrl.trim()) throw new Error("STRIPE_UPGRADE_CHECKOUT_LINK is required with --retire-old.");

  const replacements: Array<{ old: Stripe.PaymentLink; replacement: Stripe.PaymentLink }> = [];
  for (const entry of configured) {
    const newLinks = links.filter((link) => link.url === entry.url);
    if (newLinks.length !== 1) {
      throw new Error(`${entry.name}: expected exactly one active replacement link; found ${newLinks.length}.`);
    }
    const replacement = newLinks[0];
    if (!isCompliant(replacement)) {
      throw new Error(`${entry.name}: replacement ${replacement.id} is not compliant.`);
    }
    const oldId = replacement.metadata?.replaces?.trim();
    if (!oldId) {
      throw new Error(`${entry.name}: replacement ${replacement.id} must declare metadata.replaces.`);
    }
    const oldLinks = links.filter((link) => link.id === oldId);
    if (oldLinks.length !== 1) {
      throw new Error(`${entry.name}: metadata.replaces must identify exactly one active old link; found ${oldLinks.length}.`);
    }
    const old = oldLinks[0];
    if (old.id === replacement.id || !(await sameLineItems(client, old.id, replacement.id))) {
      throw new Error(`${entry.name}: replacement ${replacement.id} does not sell the same lines as ${old.id}.`);
    }
    await validateOfferLink(client, replacement, entry.priceId, entry.amount, entry.name);
    replacements.push({ old, replacement });
  }

  const replacementIds = new Set(replacements.map(({ replacement }) => replacement.id));
  if (replacementIds.size !== configured.length) {
    throw new Error("Each configured offer must have a distinct active replacement link.");
  }
  const upgradeLinks = links.filter((link) => link.url === upgradeUrl);
  if (upgradeLinks.length !== 1) {
    throw new Error(`STRIPE_UPGRADE_CHECKOUT_LINK must identify exactly one active old upgrade link; found ${upgradeLinks.length}.`);
  }
  const oldLinks = [...replacements.map(({ old }) => old), upgradeLinks[0]];
  const oldIds = new Set(oldLinks.map((link) => link.id));
  if (oldIds.size !== oldLinks.length) {
    throw new Error("The configured replacements and upgrade link must identify three distinct old links.");
  }

  for (const old of oldLinks) {
    await client.paymentLinks.update(old.id, { active: false });
    console.log(`désactivé ${old.id} ${old.url}`);
  }

  const activeAfter = await activeLinks(client);
  for (const replacementId of replacementIds) {
    const replacement = activeAfter.find((link) => link.id === replacementId);
    if (!replacement || !isCompliant(replacement)) {
      throw new Error(`Replacement link ${replacementId} is not active and compliant after retirement.`);
    }
  }
  const stillActiveOld = activeAfter.filter((link) => oldIds.has(link.id));
  if (stillActiveOld.length !== 0) {
    throw new Error(`Expected three old links to be inactive; ${stillActiveOld.length} remain active.`);
  }
}

async function main() {
  const stripe = createStripeClient();
  const beginnerUrl = process.env.STRIPE_BEGINNER_CHECKOUT_LINK;
  if (!beginnerUrl) throw new Error("STRIPE_BEGINNER_CHECKOUT_LINK is required.");
  if (RETIRE && !PUBLIC_UPGRADE_LINK_URL) {
    throw new Error("STRIPE_UPGRADE_CHECKOUT_LINK is required with --retire-old.");
  }
  await verifyConfiguredStripePrices(stripe);
  const links = await activeLinks(stripe);
  const configured: RetireOffer[] = [
    { name: "Fondations", url: beginnerUrl, target: "STRIPE_BEGINNER_CHECKOUT_LINK (Vercel)", priceId: process.env.STRIPE_BEGINNER_PRICE_ID, amount: FONDATIONS_PRICE * 100 },
    { name: "LE COFFRE", url: STRIPE_FULL_CHECKOUT_LINK, target: "STRIPE_FULL_CHECKOUT_LINK (lib/pricing.ts)", priceId: process.env.STRIPE_FULL_PRICE_ID, amount: COFFRE_PRICE * 100 },
  ];

  for (const entry of configured) {
    const matchingLinks = links.filter((candidate) => candidate.url === entry.url);
    if (matchingLinks.length !== 1) {
      throw new Error(`${entry.name}: expected exactly one active configured Payment Link; found ${matchingLinks.length}.`);
    }
    const link = matchingLinks[0];
    const existingItems = await validateOfferLink(stripe, link, entry.priceId, entry.amount, entry.name);
    console.log(`${entry.name}: ${link.id} conditions=${isCompliant(link) ? "oui" : "non"}`);
    if (RETIRE && !isCompliant(link)) {
      throw new Error(`${entry.name}: --retire-old requires its configured replacement to be compliant and active.`);
    }
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
    await retireOldLinks(stripe, links, configured, PUBLIC_UPGRADE_LINK_URL!);
  }

  if (!CREATE && !RETIRE) console.log("Lecture seule. --create puis --retire-old pour agir.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error("ERROR", error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
