import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { secureSessionCookie } from "@/lib/supabase/cookieSecurity";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, secureSessionCookie(options, Boolean(process.env.VERCEL)))
            );
          } catch {
            // Appelé depuis un Server Component. Le middleware gère le refresh.
          }
        },
      },
    }
  );
}
