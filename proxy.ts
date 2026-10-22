import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
    ACCOMPANIMENT_ACCESS_STATUSES,
    SITE_WEB_ACCOMPANIMENT_SLUG,
} from "@/lib/accompanimentAccess";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { buildContentSecurityPolicy, createCspNonce } from "@/lib/csp";
import { secureSessionCookie } from "@/lib/supabase/cookieSecurity";

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
export function createRedirectWithCookies(
    url: URL,
    supabaseResponse: NextResponse,
    headers: Record<string, string>
): NextResponse {
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie);
    });
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
}

/** Chemins qui exigent une session (et parfois un palier) : l'ancien matcher du proxy, à l'identique. */
export function isGuardedPath(rawPathname: string): boolean {
    let decoded = rawPathname;
    try {
        decoded = decodeURIComponent(rawPathname);
    } catch {
        // Un chemin mal encodé reste évalué tel quel, et aussi sous sa forme brute ci-dessous.
    }
    return guardsPathname(rawPathname) || guardsPathname(decoded);
}

function guardsPathname(pathname: string): boolean {
    const under = (base: string) => pathname === base || pathname.startsWith(`${base}/`);
    return (
        under("/dashboard") ||
        under("/blocs") ||
        pathname === "/sources" ||
        pathname === "/skills" ||
        pathname === "/fin" ||
        pathname === "/intro" ||
        under("/videos/tutos") ||
        under("/admin") ||
        under("/beginner") ||
        pathname === "/protocole" ||
        under("/accompagnement/espace") ||
        pathname === "/mcp/consent" ||
        pathname === "/build-sync/consent"
    );
}

export async function proxy(request: NextRequest) {
    // Nonce par requête : Next.js le lit dans l'en-tête de requête pour signer ses scripts inline.
    const nonce = createCspNonce();
    const contentSecurityPolicy = buildContentSecurityPolicy({
        nonce,
        deployed: Boolean(process.env.VERCEL),
        development: process.env.NODE_ENV === "development",
    });
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

    if (!isGuardedPath(request.nextUrl.pathname)) {
        const publicResponse = NextResponse.next({ request: { headers: requestHeaders } });
        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            publicResponse.headers.set(key, value);
        });
        publicResponse.headers.set("Content-Security-Policy", contentSecurityPolicy);
        return publicResponse;
    }

    let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

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
                    // Les cookies rafraîchis doivent aussi être vus par la page rendue.
                    requestHeaders.set("cookie", request.headers.get("cookie") ?? "");
                    supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, secureSessionCookie(options, Boolean(process.env.VERCEL)))
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
            pathname.startsWith("/accompagnement/espace") ||
            pathname === "/mcp/consent" ||
            pathname === "/build-sync/consent";
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
        pathname === "/videos/tutos" ||
        pathname.startsWith("/videos/tutos/") ||
        pathname.startsWith("/admin");

    // Routes réservées aux membres beginner ET full (97€+)
    const requiresBeginner =
        pathname === "/beginner" ||
        pathname.startsWith("/beginner/") ||
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
    supabaseResponse.headers.set("Content-Security-Policy", contentSecurityPolicy);

    // IMPORTANT : toujours retourner supabaseResponse pour propager les cookies
    return supabaseResponse;
}

// Toutes les pages HTML passent par le proxy : il pose le nonce de la CSP (lib/csp.ts). Seuls les fichiers
// statiques sont exclus. Les routes d'API ont leur propre politique (next.config.mjs) et ne servent pas de page.
// Attention : ne jamais exclure par "contient un point" : /fin.rsc doit rester filtré.
export const config = {
    matcher: [
        "/((?!api/|_next/static|_next/image|favicon\\.ico|\\.well-known/|.*\\.(?:png|jpe?g|webp|avif|gif|svg|ico|mp4|webm|woff2?|txt|xml|pdf|webmanifest)$).*)",
    ],
};
