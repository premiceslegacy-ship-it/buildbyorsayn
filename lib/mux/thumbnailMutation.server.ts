import "server-only";

import { createAdminSupabase } from "@/lib/supabase/admin";

type AdminSupabase = ReturnType<typeof createAdminSupabase>;

export async function replaceVideoThumbnail(
  admin: AdminSupabase,
  videoId: string,
  actorUserId: string,
  thumbnail: string,
  allowPublished = false,
): Promise<{ oldStoragePath: string | null }> {
  const { data, error } = await admin.rpc("replace_video_thumbnail", {
    p_video_id: videoId,
    p_actor_user_id: actorUserId,
    p_thumbnail: thumbnail,
    p_allow_published: allowPublished,
  });
  if (error || !Array.isArray(data) || data.length !== 1) {
    throw new Error("La miniature n'a pas pu être enregistrée.");
  }
  const oldStoragePath = typeof data[0]?.old_storage_path === "string" ? data[0].old_storage_path : null;
  return { oldStoragePath };
}
