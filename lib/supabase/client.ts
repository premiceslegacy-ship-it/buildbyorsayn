import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Création du client Supabase pour le navigateur
  // Utilise les variables d'environnement publiques de Next.js
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
