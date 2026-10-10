import { NextResponse } from "next/server";
import {
  buildSyncChallengeHeader,
  resolveBuildSyncAuth,
} from "@/lib/buildSync/auth";
import { getCurrentSkillsPublication } from "@/lib/skills/currentPublication";
import { SKILLS_CATALOG, type SkillCatalogItem } from "@/lib/skillsCatalog";
import { SKILLS_CATALOG_VERSION } from "@/lib/skills/publication";
import type { McpTier } from "@/lib/mcpAccess";

export const dynamic = "force-dynamic";

function canDownload(tier: McpTier, skill: SkillCatalogItem): boolean {
  if (skill.access === "free") return true;
  if (skill.access === "beginner") return tier === "beginner" || tier === "full";
  return tier === "full";
}

export async function GET(request: Request) {
  const auth = await resolveBuildSyncAuth(request);
  if (!auth) {
    return NextResponse.json(
      { error: "unauthorized" },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": buildSyncChallengeHeader(),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  let manifest = null;
  try {
    manifest = await getCurrentSkillsPublication(request.signal);
  } catch {
    manifest = null;
  }
  if (!manifest) {
    return NextResponse.json(
      { error: "catalog_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const artifacts = SKILLS_CATALOG
    .filter((skill) => canDownload(auth.tier, skill))
    .map((skill) => {
      const artifact = manifest.artifacts.find((item) => item.fileName === skill.fileName);
      if (!artifact) return null;
      return {
        slug: skill.slug,
        title: skill.title,
        fileName: skill.fileName,
        sha256: artifact.sha256,
        downloadUrl: `/api/build-sync/artifacts/${skill.slug}`,
      };
    })
    .filter((artifact): artifact is NonNullable<typeof artifact> => artifact !== null);

  return NextResponse.json({
    catalogVersion: SKILLS_CATALOG_VERSION,
    releaseId: manifest.releaseId,
    publishedAt: manifest.publishedAt,
    checkAfterSeconds: 86_400,
    artifacts,
  }, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
