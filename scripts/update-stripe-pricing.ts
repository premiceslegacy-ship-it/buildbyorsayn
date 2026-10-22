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
import { STRIPE_FULL_CHECKOUT_LINK } from "../lib/pricing";

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
  const items = await stripe.paymentLinks.listLineItems(linkId, { limit: 10 });
  if (!items.data.length) throw new Error(`Payment Link ${linkId} has no line items.`);
  return items.data.map((item) => ({ price: item.price!.id, quantity: item.quantity ?? 1 }));
}

const isCompliant = (link: Stripe.PaymentLink) => link.consent_collection?.terms_of_service === "required";

async function main() {
  const beginnerUrl = process.env.STRIPE_BEGINNER_CHECKOUT_LINK;
  if (!beginnerUrl) throw new Error("STRIPE_BEGINNER_CHECKOUT_LINK is required.");
  const links = await activeLinks();
  const configured = [
    { name: "Fondations", url: beginnerUrl, target: "STRIPE_BEGINNER_CHECKOUT_LINK (Vercel)" },
    { name: "LE COFFRE", url: STRIPE_FULL_CHECKOUT_LINK, target: "STRIPE_FULL_CHECKOUT_LINK (lib/pricing.ts)" },
  ];

  for (const entry of configured) {
    const link = links.find((candidate) => candidate.url === entry.url);
    if (!link) {
      console.log(`${entry.name}: aucun lien actif ne correspond à l'URL configurée.`);
      continue;
    }
    console.log(`${entry.name}: ${link.id} conditions=${isCompliant(link) ? "oui" : "non"}`);
    if (isCompliant(link) || !CREATE) continue;
    const created = await stripe.paymentLinks.create({
      line_items: await lineItems(link.id),
      after_completion: link.after_completion,
      consent_collection: { terms_of_service: "required" },
      custom_text: { terms_of_service_acceptance: { message: CHECKOUT_CONSENT_TEXT } },
      metadata: { replaces: link.id },
    });
    console.log(`  créé ${created.id} ${created.url} -> à mettre dans ${entry.target}`);
  }

  if (RETIRE) {
    for (const link of links) {
      const replaced = links.some((candidate) => candidate.metadata?.replaces === link.id && isCompliant(candidate));
      if (replaced || (PUBLIC_UPGRADE_LINK_URL && link.url === PUBLIC_UPGRADE_LINK_URL)) {
        await stripe.paymentLinks.update(link.id, { active: false });
        console.log(`désactivé ${link.id} ${link.url}`);
      }
    }
  }

  if (!CREATE && !RETIRE) console.log("Lecture seule. --create puis --retire-old pour agir.");
}

main().catch((error) => {
  console.error("ERROR", error instanceof Error ? error.message : error);
  process.exit(1);
});
