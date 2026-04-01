import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function determineTier(priceId: string | null | undefined): "beginner" | "full" {
    if (!priceId) return "beginner"; // Sécurité : si priceId inconnu, on ne promeut pas au-delà de beginner
    if (priceId === process.env.STRIPE_BEGINNER_PRICE_ID) return "beginner";
    // FULL (100€) et UPGRADE (70€) donnent tous les deux l'accès complet
    if (
        priceId === process.env.STRIPE_FULL_PRICE_ID ||
        priceId === process.env.STRIPE_UPGRADE_PRICE_ID
    ) return "full";
    // Price inconnue : on ne promeut pas
    console.error(`[Webhook] Price ID inconnu reçu : ${priceId}`);
    return "beginner";
}

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook verification failed");
        return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        let userId = session.client_reference_id;
        const customerEmail = session.customer_details?.email;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Si on n'a pas de client_reference_id (paiement hors plateforme, ex: lien email)
        // On essaie de retrouver l'utilisateur via son adresse email
        if (!userId && customerEmail) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("email", customerEmail)
                .single();
            
            if (profile) {
                userId = profile.id;
            } else {
                console.error(`Paiement reçu pour ${customerEmail} mais aucun compte trouvé dans la BDD.`);
                // On pourrait créer un compte ici, ou envoyer un mail d'erreur à l'admin
            }
        }

        if (userId) {
            // Retrieve line items to identify which price was purchased
            let priceId: string | null = null;
            try {
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
                priceId = lineItems.data[0]?.price?.id ?? null;
            } catch (e) {
                console.error("Could not retrieve line items:", e);
            }

            const tier = determineTier(priceId);

            // If user is upgrading from beginner to full, always set full
            // If already full, keep full (upsert-safe)
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("tier")
                .eq("id", userId)
                .single();

            const finalTier = existingProfile?.tier === "full" ? "full" : tier;

            const { error } = await supabase
                .from("profiles")
                .update({ tier: finalTier })
                .eq("id", userId);

            if (error) {
                console.error("Profile update failed for session:", session.id);
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }

            revalidatePath("/", "layout");
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
