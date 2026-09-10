"use server";

import { createClient } from "@/lib/supabase/server";
import { resolveMcpProfileTier } from "@/lib/mcpAccess";
import type { BlocVideo } from "@/lib/blocCatalog";

export async function getBlocVideoLibrary(): Promise<{
  foundations: BlocVideo[];
  blocs: { id: string; titre: string; videos: BlocVideo[] }[];
}> {
  const empty = { foundations: [], blocs: [] };
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return empty;
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("tier").eq("id", user.id).maybeSingle();
  const tier = resolveMcpProfileTier(profile, profileError);
  if (tier !== "beginner" && tier !== "full") return empty;
  const foundations = [
    { title: "Le Protocole Zéro", youtubeId: "tcFGu_zNsPE", description: "De zéro compétence à antifragile numérique. La méthode en trois phases pour construire du capital organique avec l'IA." },
    { title: "Le marché web en 2026 : positionnement, design systems et premiers clients", youtubeId: "RCGFyJbGfM4", description: "L'état du marché en clair : pourquoi le WordPress/Webflow est mort et comment prendre position aux deux extrêmes. Webcoding (Next.js + Vercel), design systems pour forcer l'IA à sortir du générique, et la stratégie pour décrocher les premiers clients." },
  ];
  if (tier !== "full") return { foundations, blocs: [] };
  const { BLOCS_DATA } = await import("@/lib/mockData");
  return { foundations, blocs: BLOCS_DATA.filter(bloc => bloc.id !== "1" && bloc.videos.length > 0)
    .map(({ id, titre, videos }) => ({ id, titre, videos })) };
}