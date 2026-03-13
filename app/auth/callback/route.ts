import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Allowed redirect paths after auth callback (prevents open redirect)
const ALLOWED_REDIRECT_PREFIXES = [
  "/dashboard",
  "/update-password",
  "/blocs",
  "/sources",
  "/fin",
  "/intro",
  "/admin",
  "/checkout",
];

function sanitizeRedirectPath(rawPath: string): string {
  // Default fallback
  const fallback = "/dashboard";

  // Block protocol-relative URLs (//evil.com), absolute URLs (http://), and empty strings
  if (
    !rawPath ||
    !rawPath.startsWith("/") ||
    rawPath.startsWith("//") ||
    rawPath.includes("://") ||
    rawPath.includes("\\")
  ) {
    return fallback;
  }

  // Only allow paths that match our known route prefixes
  const isAllowed = ALLOWED_REDIRECT_PREFIXES.some((prefix) =>
    rawPath.startsWith(prefix)
  );

  return isAllowed ? rawPath : fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";

  // Sanitize the redirect target to prevent open redirect attacks
  const next = sanitizeRedirectPath(rawNext);

  if (code) {
    const cookieStore = cookies();
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
                cookieStore.set(name, value, {
                  ...options,
                  secure: true,
                  sameSite: "lax",
                  httpOnly: true,
                })
              );
            } catch {}
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=lien_invalide_ou_expire`);
}
