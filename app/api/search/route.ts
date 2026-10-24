import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { buildSearchCatalog, searchCatalog } from "@/lib/search/catalog";

type PublicSearchResult = {
  id: string;
  kind: "Vidéo" | "Chapitre" | "Skill";
  title: string;
  context: string;
  href: string;
  image: string;
  locked: boolean;
};

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: profile, error: profileError } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
  const tier = profileError ? null : normalizeProfileTier(profile?.tier);
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const results: PublicSearchResult[] = searchCatalog(buildSearchCatalog(tier), query).map((item) => ({
    id: item.id,
    kind: item.kind,
    title: item.title,
    context: item.context,
    href: item.href,
    image: item.image,
    locked: item.locked,
  }));
  return NextResponse.json({ results }, { headers: { "Cache-Control": "private, no-store" } });
}
