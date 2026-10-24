import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { claimVerifiedStripePurchases } from "@/lib/stripeClaim";
import { resolveCallbackRedirect } from "@/lib/auth/callbackRedirect";
import { normalizeCustomerEmail } from "@/lib/stripeEntitlements";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { secureSessionCookie } from "@/lib/supabase/cookieSecurity";
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Chemin interne uniquement : empêche la redirection ouverte après l'authentification.
  const next = resolveCallbackRedirect(searchParams.get("next"));

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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
            } catch (err) {
              console.warn("[auth/callback] setAll failed:", err);
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const email = user?.email_confirmed_at ? normalizeCustomerEmail(user.email) : null;
        if (user?.id && email) {
          const admin = createAdminSupabase({ signal: request.signal });
          await claimVerifiedStripePurchases(admin, { userId: user.id, email });
        }
      } catch {
        // Claim is best effort here; the authenticated session remains valid.
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/?auth_error=lien_invalide_ou_expire`);
}
