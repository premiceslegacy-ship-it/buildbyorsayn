import { NextResponse } from "next/server";
import {
  buildSyncChallengeHeader,
  resolveBuildSyncAuth,
} from "@/lib/buildSync/auth";
import { getSkillBySlug } from "@/lib/skillsCatalog";
import { getStoredSkillContent } from "@/lib/skills/storage";
import { reservePrivateDownload } from "@/lib/privateDownloadRateLimit";

export const dynamic = "force-dynamic";

function isAllowed(tier: string, access: "free" | "beginner" | "full") {
  if (access === "free") return true;
  if (access === "beginner") return tier === "beginner" || tier === "full";
  return tier === "full";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await resolveBuildSyncAuth(request);
  if (!auth) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: { "WWW-Authenticate": buildSyncChallengeHeader(), "Cache-Control": "no-store" } }
    );
  }

  const skill = getSkillBySlug((await params).slug);
  if (!skill) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!isAllowed(auth.tier, skill.access)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const downloadDecision = await reservePrivateDownload(auth.quotaPrincipal, request.signal);
  if (downloadDecision !== "allowed") {
    return NextResponse.json(
      { error: downloadDecision === "denied" ? "rate_limited" : "temporarily_unavailable" },
      {
        status: downloadDecision === "denied" ? 429 : 503,
        headers: { "Cache-Control": "no-store", "Retry-After": downloadDecision === "denied" ? "3600" : "5" },
      }
    );
  }

  const stored = await getStoredSkillContent(skill, { signal: request.signal });
  if (!stored) {
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  return new NextResponse(stored.body, {
    headers: {
      "Content-Type": stored.contentType,
      "Content-Disposition": `attachment; filename="${skill.fileName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
