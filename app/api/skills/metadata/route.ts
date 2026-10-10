import { NextResponse } from "next/server";
import { getCurrentSkillsPublication } from "@/lib/skills/currentPublication";

export const dynamic = "force-dynamic";

export async function GET(request?: Request) {
  let manifest = null;
  try {
    manifest = await getCurrentSkillsPublication(request?.signal);
  } catch {
    return NextResponse.json(
      { error: "Skills publication metadata is unavailable." },
      { status: 503 }
    );
  }

  if (!manifest) {
    return NextResponse.json(
      { error: "Skills publication metadata is invalid." },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      publishedAt: manifest.publishedAt,
      releaseId: manifest.releaseId,
      artifacts: manifest.artifacts.map(({ fileName, sha256 }) => ({
        fileName,
        sha256,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
