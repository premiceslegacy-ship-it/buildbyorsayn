import "server-only";

import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getVerifiedAdmin, recordAdminAction } from "@/lib/mux/adminServer";
import { removeBuildNewsThumbnail } from "./thumbnail.server";
import { buildNewsInputSchema, buildNewsUpdateSchema, type BuildNewsInput, type BuildNewsRow, type BuildNewsUpdate } from "./model";

const buildNewsColumns = "id,title,published_at,thumbnail,bloc_label,internal_url,sentence,created_at,source_key";
const storagePathSchema = z.string().regex(/^news\/[0-9a-f-]{36}\/[0-9a-f]{12}\.(?:jpg|png|webp)$/i);

async function queueThumbnailCleanup(storagePath: string, cause: unknown) {
  const admin = createAdminSupabase();
  const { error } = await admin.from("build_news_storage_cleanup").upsert({
    storage_path: storagePath,
    status: "pending",
    last_error: cause instanceof Error ? cause.message : "La suppression de la miniature a échoué.",
    updated_at: new Date().toISOString(),
  }, { onConflict: "storage_path" });
  if (error) throw new Error("La suppression de la miniature n'a pas pu être planifiée.");
}

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

export async function listAdminBuildNews(): Promise<BuildNewsRow[]> {
  const user = await getVerifiedAdmin();
  if (!user) throw new Error("Accès refusé.");
  const { data, error } = await createAdminSupabase()
    .from("build_news")
    .select(buildNewsColumns)
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(100);
  if (error) throw new Error("Les nouveautés BUILD sont indisponibles.");
  return (data ?? []) as BuildNewsRow[];
}

export async function createBuildNews(
  input: BuildNewsInput,
  actorUserId?: string,
  thumbnailStoragePath?: string,
): Promise<BuildNewsRow> {
  const user = actorUserId ? { id: actorUserId } : await getVerifiedAdmin();
  if (!user) throw new Error("Accès refusé.");
  const parsed = buildNewsInputSchema.parse(input);
  const storagePath = thumbnailStoragePath ? storagePathSchema.parse(thumbnailStoragePath) : null;
  const admin = createAdminSupabase();
  const { data, error } = await admin.from("build_news").insert({
    title: parsed.title,
    published_at: parsed.publishedAt,
    thumbnail: parsed.thumbnail,
    thumbnail_storage_path: storagePath,
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
    if (storagePath) {
      try {
        await removeBuildNewsThumbnail(storagePath);
      } catch (storageError) {
        await queueThumbnailCleanup(storagePath, storageError);
      }
    }
    throw auditError;
  }
  return data as BuildNewsRow;
}

/** Modifie le texte d'une entrée, notamment une Nouveauté automatique. La clé de source ne change jamais. */
export async function updateBuildNews(newsId: string, input: BuildNewsUpdate): Promise<BuildNewsRow> {
  const user = await getVerifiedAdmin();
  if (!user) throw new Error("Accès refusé.");
  const id = z.string().uuid().parse(newsId);
  const parsed = buildNewsUpdateSchema.parse(input);
  const { data, error } = await createAdminSupabase().from("build_news").update({
    title: parsed.title,
    sentence: parsed.sentence,
    bloc_label: parsed.blocLabel || null,
    internal_url: parsed.internalUrl || null,
  }).eq("id", id).select(`${buildNewsColumns},source_key`).maybeSingle();
  if (error || !data) throw new Error("La nouveauté n'a pas pu être modifiée.");
  await recordAdminAction({
    actorUserId: user.id,
    action: "build_news.update",
    targetType: "build_news",
    targetId: id,
    result: "completed",
    approved: true,
    details: { hasBloc: Boolean(parsed.blocLabel), hasLink: Boolean(parsed.internalUrl) },
  });
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
    .select("id,thumbnail_storage_path")
    .maybeSingle();
  if (error) throw new Error("La nouveauté n'a pas pu être supprimée.");
  if (!data) return { deleted: false };
  const storagePath = typeof data.thumbnail_storage_path === "string"
    ? data.thumbnail_storage_path
    : null;
  if (storagePath) {
    try {
      await removeBuildNewsThumbnail(storagePath);
    } catch (storageError) {
      await queueThumbnailCleanup(storagePath, storageError);
    }
  }
  await recordAdminAction({
    actorUserId: user.id,
    action: "build_news.delete",
    targetType: "build_news",
    targetId: id,
    result: "completed",
    approved: true,
    details: { thumbnailCleanup: storagePath ? "completed_or_queued" : "none" },
  });
  return { deleted: true };
}
