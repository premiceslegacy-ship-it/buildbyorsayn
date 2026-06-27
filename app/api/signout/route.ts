import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const cookiesToSet: Parameters<Parameters<typeof createServerClient>[2]["cookies"]["setAll"]>[0] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(nextCookies) {
          cookiesToSet.push(...nextCookies);
        },
      },
    }
  );

  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  });

  // Appliquer les cookies que Supabase veut écrire (tokens vidés)
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  // Vider tous les cookies Supabase en dernier pour éviter qu'un Set-Cookie
  // renvoyé par auth.signOut() ne recrée une session côté navigateur.
  request.cookies.getAll().forEach(({ name }) => {
    if (name.startsWith("sb-")) {
      response.cookies.set(name, "", {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
      });
    }
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
