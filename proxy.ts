import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
    ACCOMPANIMENT_ACCESS_STATUSES,
    SITE_WEB_ACCOMPANIMENT_SLUG,
} from "@/lib/accompanimentAccess";
import { normalizeProfileTier } from "@/lib/mcpAccess";

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

export async function proxy(request: NextRequest) {
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

    const pathname = request.nextUrl.pathname;

    if (!user) {
        const requiresLoginRedirect =
            pathname.startsWith("/accompagnement/espace") || pathname === "/mcp/consent";
        const destination = requiresLoginRedirect
            ? `/login?next=${encodeURIComponent(pathname + request.nextUrl.search)}`
            : "/";
        const redirectUrl = new URL(destination, request.url);
        return createRedirectWithCookies(redirectUrl, supabaseResponse, SECURITY_HEADERS);
    }

    const requiresAccompaniment = pathname.startsWith("/accompagnement/espace");
    if (requiresAccompaniment) {
        const today = new Date().toISOString().slice(0, 10);
        const { data: assignment, error: assignmentError } = await supabase
            .from("accompaniment_assignments")
            .select("status, starts_on, ends_on")
            .eq("user_id", user.id)
            .eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG)
            .in("status", ACCOMPANIMENT_ACCESS_STATUSES)
            .lte("starts_on", today)
            .or(`ends_on.is.null,ends_on.gte.${today}`)
            .limit(1)
            .maybeSingle();

        const hasAccess = Boolean(
            !assignmentError &&
                assignment &&
                ACCOMPANIMENT_ACCESS_STATUSES.includes(assignment.status) &&
                assignment.starts_on <= today &&
                (!assignment.ends_on || assignment.ends_on >= today)
        );

        if (!hasAccess) {
            const accessUrl = new URL("/accompagnement?access=restricted", request.url);
            return createRedirectWithCookies(accessUrl, supabaseResponse, SECURITY_HEADERS);
        }
    }

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
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("tier")
            .eq("id", user.id)
            .maybeSingle();

        const tier = profileError || !profile ? null : normalizeProfileTier(profile.tier);

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
    matcher: ["/dashboard/:path*", "/blocs/:path*", "/sources", "/skills", "/fin", "/intro", "/admin/:path*", "/beginner", "/protocole", "/accompagnement/espace/:path*", "/mcp/consent"],
};
