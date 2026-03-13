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
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            secure: true,
                            sameSite: "lax",
                            httpOnly: true,
                        })
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
        const response = NextResponse.redirect(loginUrl);
        // Apply security headers to redirect responses too
        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
        return response;
    }

    // Vérifier has_paid uniquement pour les routes payantes
    const pathname = request.nextUrl.pathname;
    const requiresPayment =
        pathname === "/sources" ||
        pathname === "/fin" ||
        pathname === "/intro" ||
        pathname.startsWith("/admin");

    if (requiresPayment) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("has_paid")
            .eq("id", user.id)
            .single();

        if (!profile || profile.has_paid !== true) {
            const checkoutUrl = new URL("/checkout", request.url);
            const response = NextResponse.redirect(checkoutUrl);
            Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
            return response;
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
    matcher: ["/dashboard/:path*", "/blocs/:path*", "/sources", "/fin", "/intro", "/admin/:path*"],
};
