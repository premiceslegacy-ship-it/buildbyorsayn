import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // On ne protège que les routes du dashboard (et sous-routes)
    if (!pathname.startsWith("/dashboard")) {
        return NextResponse.next();
    }

    // Créer une réponse mutable pour que @supabase/ssr puisse rafraîchir les cookies
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options } as any);
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value, ...options } as any);
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: "", ...options } as any);
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value: "", ...options } as any);
                },
            },
        }
    );

    // 1. Vérifier la session (authentification)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // Non connecté → page de login
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Vérifier has_paid dans la table profiles
    const { data: profile } = await supabase
        .from("profiles")
        .select("has_paid")
        .eq("id", user.id)
        .single();

    if (!profile || profile.has_paid !== true) {
        // Pas payé → page checkout
        const checkoutUrl = new URL("/checkout", request.url);
        return NextResponse.redirect(checkoutUrl);
    }

    return response;
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
