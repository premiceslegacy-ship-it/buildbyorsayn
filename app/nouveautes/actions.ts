"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const newsIdSchema = z.string().uuid();

/** Marque une entrée ouverte par le membre courant. Répéter l'appel est sûr. */
export async function markBuildNewsSeen(newsId: string): Promise<{ ok: boolean }> {
  const parsed = newsIdSchema.safeParse(newsId);
  if (!parsed.success) return { ok: false };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const { error } = await supabase.from("build_news_seen").upsert({
    user_id: user.id,
    news_id: parsed.data,
    seen_at: new Date().toISOString(),
  }, { onConflict: "user_id,news_id", ignoreDuplicates: true });
  return { ok: !error };
}
