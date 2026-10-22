import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { activityRateLimitChecks, parseActivityPayload } from "@/lib/activity";
import { isJsonMediaType, readBoundedBody } from "@/lib/mcp/http";
import { resolveRateLimitDecision, trustedClientAddress } from "@/lib/mcp/security";

const MAX_ACTIVITY_BODY_BYTES = 2_048;
const LOGGED_EVENTS: Record<string, true> = {
  page_view: true,
  tab_visible: true,
  tab_hidden: true,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ tracked: false }, { status: 401 });
  }

  if (!isJsonMediaType(req.headers.get("content-type"))) {
    return NextResponse.json({ tracked: false }, { status: 415 });
  }
  const boundedBody = await readBoundedBody(req, MAX_ACTIVITY_BODY_BYTES);
  if (boundedBody.ok === false) {
    return NextResponse.json(
      { tracked: false },
      { status: boundedBody.reason === "too_large" ? 413 : 400 }
    );
  }
  let rawBody: unknown;
  try {
    rawBody = JSON.parse(boundedBody.text);
  } catch {
    return NextResponse.json({ tracked: false }, { status: 400 });
  }
  const body = parseActivityPayload(rawBody);
  if (!body) {
    return NextResponse.json({ tracked: false }, { status: 400 });
  }
  const { eventType, path, metadata } = body;

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const address = trustedClientAddress(req.headers);
  const pepper = process.env.ACTIVITY_RATE_LIMIT_PEPPER ?? "";
  if (!address || pepper.length < 16) {
    return NextResponse.json({ tracked: false }, { status: 503, headers: { "Retry-After": "5" } });
  }
  for (const check of activityRateLimitChecks(user.id, address, pepper)) {
    const { data: allowed, error: rateLimitError } = await supabaseAdmin.rpc("check_mcp_rate_limit", check);
    const rateDecision = resolveRateLimitDecision(allowed, rateLimitError);
    if (rateDecision !== "allowed") {
      return NextResponse.json(
        { tracked: false },
        {
          status: rateDecision === "denied" ? 429 : 503,
          headers: { "Retry-After": rateDecision === "denied" ? "60" : "5" },
        }
      );
    }
  }

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

  if (LOGGED_EVENTS[eventType]) {
    const { error: eventError } = await supabaseAdmin.from("member_activity_events").insert({
      user_id: user.id,
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
