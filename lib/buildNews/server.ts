import "server-only";

import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getVerifiedAdmin, recordAdminAction } from "@/lib/mux/adminServer";
import { buildNewsInputSchema, type BuildNewsInput, type BuildNewsRow } from "./model";

const buildNewsColumns = "id,title,published_at,thumbnail,bloc_label,internal_url,sentence,created_at";

export async function listBuildNews(): Promise<BuildNewsRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("build_news")
    .select(buildNewsColumns)
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(100);
  if (error) throw new Error("Les nouveautés BUILD sont indisponibles.");
  return (data ?? []) as BuildNewsRow[];
}

export async function createBuildNews(input: BuildNewsInput): Promise<BuildNewsRow> {
  const user = await getVerifiedAdmin();
  if (!user) throw new Error("Accès refusé.");
  const parsed = buildNewsInputSchema.parse(input);
  const admin = createAdminSupabase();
  const { data, error } = await admin.from("build_news").insert({
    title: parsed.title,
    published_at: parsed.publishedAt,
    thumbnail: parsed.thumbnail,
    bloc_label: parsed.blocLabel || null,
    internal_url: parsed.internalUrl || null,
    sentence: parsed.sentence,
    created_by: user.id,
  }).select(buildNewsColumns).single();
  if (error || !data) throw new Error("La nouveauté n'a pas pu être ajoutée.");

  try {
    await recordAdminAction({
      actorUserId: user.id,
      action: "build_news.create",
      targetType: "build_news",
      targetId: data.id,
      result: "completed",
      approved: true,
      details: { hasBloc: Boolean(parsed.blocLabel), hasLink: Boolean(parsed.internalUrl) },
    });
  } catch (auditError) {
    await admin.from("build_news").delete().eq("id", data.id);
    throw auditError;
  }
  return data as BuildNewsRow;
}

export async function deleteBuildNews(newsId: string): Promise<{ deleted: boolean }> {
  const user = await getVerifiedAdmin();
  if (!user) throw new Error("Accès refusé.");
  const id = z.string().uuid().parse(newsId);
  const admin = createAdminSupabase();
  const { data, error } = await admin.from("build_news")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) throw new Error("La nouveauté n'a pas pu être supprimée.");
  if (!data) return { deleted: false };
  await recordAdminAction({
    actorUserId: user.id,
    action: "build_news.delete",
    targetType: "build_news",
    targetId: id,
    result: "completed",
    approved: true,
  });
  return { deleted: true };
}
