import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Client Supabase avec la Service Role Key (admin) pour bypasser les RLS
// et écrire dans la table profiles depuis le serveur
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/**
 * POST /api/lemon/webhook
 *
 * Reçoit les webhooks Lemon Squeezy, vérifie la signature HMAC-SHA256,
 * puis, sur l'événement `order_created`, met à jour has_paid = true
 * dans la table profiles de Supabase.
 *
 * Paramètres personnalisés attendus dans l'ordre Lemon Squeezy :
 *   - custom.user_id  → UUID Supabase de l'acheteur (priorité)
 *   - ou email du client (fallback)
 */
export async function POST(request: NextRequest) {
  // 1. Lire le corps brut pour vérifier la signature
  const rawBody = await request.text();

  // 2. Vérification de la signature HMAC-SHA256
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Webhook] LEMON_SQUEEZY_WEBHOOK_SECRET non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  const signature = request.headers.get("x-signature");
  if (!signature) {
    console.warn("[Webhook] Signature manquante");
    return NextResponse.json({ error: "Signature manquante" }, { status: 401 });
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  // Comparaison en temps constant pour éviter les timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(digest, "hex"),
    Buffer.from(signature, "hex")
  );

  if (!isValid) {
    console.warn("[Webhook] Signature invalide");
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  // 3. Parser le payload JSON
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const eventName: string = payload?.meta?.event_name ?? "";
  console.log(`[Webhook] Événement reçu : ${eventName}`);

  // 4. Traitement de l'événement order_created uniquement
  if (eventName !== "order_created") {
    return NextResponse.json({ received: true, skipped: true });
  }

  // 5. Récupérer l'identifiant de l'acheteur
  // Priorité 1 : user_id injecté en custom param dans le checkout Lemon Squeezy
  const userId: string | undefined = payload?.meta?.custom_data?.user_id;
  // Priorité 2 : email de la commande
  const customerEmail: string | undefined =
    payload?.data?.attributes?.user_email ??
    payload?.data?.attributes?.customer_email;

  if (!userId && !customerEmail) {
    console.error("[Webhook] Impossible d'identifier l'acheteur (pas de user_id ni email)");
    return NextResponse.json({ error: "Acheteur non identifiable" }, { status: 422 });
  }

  // 6. Mise à jour de has_paid dans Supabase
  const supabase = createAdminClient();

  if (userId) {
    // Mise à jour directe par UUID Supabase
    const { error } = await supabase
      .from("profiles")
      .update({ has_paid: true })
      .eq("id", userId);

    if (error) {
      console.error("[Webhook] Erreur Supabase (user_id):", error.message);
      return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
    }
    console.log(`[Webhook] has_paid=true pour user_id: ${userId}`);
  } else if (customerEmail) {
    // Fallback : lookup par email dans auth.users via la table profiles
    // On suppose que profiles.email = auth.users.email ou qu'il existe un champ email
    const { error } = await supabase
      .from("profiles")
      .update({ has_paid: true })
      .eq("email", customerEmail);

    if (error) {
      console.error("[Webhook] Erreur Supabase (email):", error.message);
      return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
    }
    console.log(`[Webhook] has_paid=true pour email: ${customerEmail}`);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
