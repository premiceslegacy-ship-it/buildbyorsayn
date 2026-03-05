import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
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

    // 2. Vérifier has_paid uniquement pour les routes vraiment payantes
    // /dashboard et /blocs/:path* sont accessibles à tous les utilisateurs connectés
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

    return response;
}

export const config = {
    matcher: ["/dashboard/:path*", "/blocs/:path*", "/sources", "/fin", "/intro", "/admin/:path*"],
};
