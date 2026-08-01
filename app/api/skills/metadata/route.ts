import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { parseSkillsPublicationManifest } from "@/lib/skillsMetadata";
import { SKILLS_CATALOG } from "@/lib/skillsCatalog";

export const dynamic = "force-dynamic";

const SKILLS_BUCKET = process.env.SUPABASE_SKILLS_BUCKET ?? "skills";
const MANIFEST_FILE = "manifest.json";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Skills publication metadata is unavailable." },
      { status: 503 }
    );
  }

  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  const { data, error } = await supabaseAdmin.storage
    .from(SKILLS_BUCKET)
    .download(MANIFEST_FILE);

  if (error || !data) {
    return NextResponse.json(
      { error: "Skills publication metadata is unavailable." },
      { status: 503 }
    );
  }

  let manifest: ReturnType<typeof parseSkillsPublicationManifest> = null;
  try {
    manifest = parseSkillsPublicationManifest(
      JSON.parse(Buffer.from(await data.arrayBuffer()).toString("utf8")),
      SKILLS_CATALOG.map((skill) => skill.fileName)
    );
  } catch {
    manifest = null;
  }

  if (!manifest) {
    return NextResponse.json(
      { error: "Skills publication metadata is invalid." },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { publishedAt: manifest.publishedAt },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
