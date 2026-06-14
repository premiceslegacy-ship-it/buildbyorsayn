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

  const { error } = await supabase.auth.signOut();

  const response = NextResponse.json(
    error ? { ok: false, error: error.message } : { ok: true },
    {
      status: error ? 500 : 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
