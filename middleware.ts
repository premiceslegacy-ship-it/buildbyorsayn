import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Security headers applied to every middleware response
const SECURITY_HEADERS: Record<string, string> = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    "X-DNS-Prefetch-Control": "on",
    "Cross-Origin-Opener-Policy": "same-origin",
};

/**
 * Crée une réponse redirect en copiant les cookies Supabase depuis supabaseResponse.
 * Critique : quand getUser() échoue sur une session expirée, Supabase appelle setAll()
 * pour nettoyer les tokens. Si on retourne un redirect sans ces cookies, le navigateur
 * garde les vieux tokens indéfiniment → l'utilisateur est bloqué définitivement.
 */
function createRedirectWithCookies(
    url: URL,
    supabaseResponse: NextResponse,
    headers: Record<string, string>
): NextResponse {
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
            secure: true,
            sameSite: "lax",
            path: "/",
        });
    });
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT : ne pas écrire de logique entre createServerClient et getUser()
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        const loginUrl = new URL("/login", request.url);
        return createRedirectWithCookies(loginUrl, supabaseResponse, SECURITY_HEADERS);
    }

    const pathname = request.nextUrl.pathname;

    // Routes réservées aux membres full (497€)
    const requiresFull =
        pathname === "/fin" ||
        pathname === "/intro" ||
        pathname.startsWith("/admin");

    // Routes réservées aux membres beginner ET full (97€+)
    const requiresBeginner =
        pathname === "/beginner" ||
        pathname === "/sources" ||
        pathname === "/protocole";

    if (requiresFull || requiresBeginner) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("tier")
            .eq("id", user.id)
            .single();

        const tier = profile?.tier;

        if (requiresFull && tier !== "full") {
            const checkoutUrl = new URL("/checkout", request.url);
            return createRedirectWithCookies(checkoutUrl, supabaseResponse, SECURITY_HEADERS);
        }

        if (requiresBeginner && tier !== "beginner" && tier !== "full") {
            const checkoutUrl = new URL("/checkout", request.url);
            return createRedirectWithCookies(checkoutUrl, supabaseResponse, SECURITY_HEADERS);
        }
    }

    // Apply security headers to the successful response
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        supabaseResponse.headers.set(key, value);
    });

    // IMPORTANT : toujours retourner supabaseResponse pour propager les cookies
    return supabaseResponse;
}

export const config = {
    matcher: ["/dashboard/:path*", "/blocs/:path*", "/sources", "/skills", "/fin", "/intro", "/admin/:path*", "/beginner", "/protocole"],
};
