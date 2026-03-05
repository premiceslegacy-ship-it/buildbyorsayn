import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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
        return NextResponse.redirect(loginUrl);
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
            return NextResponse.redirect(new URL("/checkout", request.url));
        }
    }

    // IMPORTANT : toujours retourner supabaseResponse pour propager les cookies
    return supabaseResponse;
}

export const config = {
    matcher: ["/dashboard/:path*", "/blocs/:path*", "/sources", "/fin", "/intro", "/admin/:path*"],
};
