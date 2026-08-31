import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const TRACKED_EVENTS = new Set(["page_view", "heartbeat", "tab_visible", "tab_hidden"]);
const LOGGED_EVENTS = new Set(["page_view", "tab_visible", "tab_hidden"]);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ tracked: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const eventType = typeof body?.eventType === "string" ? body.eventType : "heartbeat";
  const path = typeof body?.path === "string" && body.path.startsWith("/") ? body.path.slice(0, 250) : "/";
  const metadata = typeof body?.metadata === "object" && body.metadata !== null ? body.metadata : {};

  if (!TRACKED_EVENTS.has(eventType)) {
    return NextResponse.json({ tracked: false }, { status: 400 });
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();
  const email = user.email ?? null;

  const { error: presenceError } = await supabaseAdmin.from("member_presence").upsert(
    {
      user_id: user.id,
      email,
      current_path: path,
      last_event: eventType,
      last_seen_at: now,
      user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    },
    { onConflict: "user_id" }
  );

  if (presenceError) {
    console.error("[activity] presence upsert failed:", presenceError.message);
    return NextResponse.json({ tracked: false, setupRequired: true }, { status: 200 });
  }

  if (LOGGED_EVENTS.has(eventType)) {
    const { error: eventError } = await supabaseAdmin.from("member_activity_events").insert({
      user_id: user.id,
      email,
      event_type: eventType,
      path,
      metadata,
      created_at: now,
    });

    if (eventError) {
      console.error("[activity] event insert failed:", eventError.message);
    }
  }

  return NextResponse.json({ tracked: true });
}
