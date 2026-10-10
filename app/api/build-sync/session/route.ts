import { NextResponse } from "next/server";
import {
  buildSyncChallengeHeader,
  resolveBuildSyncAuth,
} from "@/lib/buildSync/auth";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const auth = await resolveBuildSyncAuth(request);
  if (!auth) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: { "WWW-Authenticate": buildSyncChallengeHeader(), "Cache-Control": "no-store" } }
    );
  }
  const admin = createAdminSupabase({ signal: request.signal });
  const { error } = await admin.rpc("revoke_build_sync_user_connections", {
    p_user_id: auth.userId,
  });
  if (error) {
    return NextResponse.json({ error: "revocation_failed" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
