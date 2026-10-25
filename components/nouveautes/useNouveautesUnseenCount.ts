"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { isNewsFresh, NOUVEAUTES_FRESH_DAYS } from "@/lib/nouveautes/seen";

function videoIdFromSourceKey(sourceKey: string | null): string | null {
  const match = sourceKey?.match(/^video:([^:]+):1$/);
  return match?.[1] ?? null;
}

/** Nombre d'entrées BUILD fraîches pour le membre courant. */
export function useNouveautesUnseenCount(): number | null {
  const pathname = usePathname();
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [countForUserId, setCountForUserId] = useState<string | null>(null);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId || pathname === "/nouveautes") return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const freshSince = new Date(Date.now() - NOUVEAUTES_FRESH_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const newsResult = await supabase.from("build_news")
        .select("id,published_at,source_key")
        .gte("published_at", freshSince)
        .order("published_at", { ascending: false })
        .limit(100);
      if (newsResult.error) throw new Error("nouveautes.badge.unavailable");
      const newsRows = newsResult.data ?? [];
      const newsIds = newsRows.map((row) => row.id as string);
      if (newsIds.length === 0) {
        if (!cancelled) { setCount(0); setCountForUserId(userId); }
        return;
      }
      const videoIds = newsRows.flatMap((row) => {
        const videoId = videoIdFromSourceKey(row.source_key as string | null);
        return videoId ? [videoId] : [];
      });
      const [seenResult, progressResult] = await Promise.all([
        supabase.from("build_news_seen").select("news_id").eq("user_id", userId).in("news_id", newsIds),
        videoIds.length ? supabase.from("lesson_progress").select("section_id").eq("user_id", userId).in("section_id", videoIds) : Promise.resolve({ data: [], error: null }),
      ]);
      if (seenResult.error || progressResult.error) throw new Error("nouveautes.badge.unavailable");
      const seenIds = new Set((seenResult.data ?? []).map((row) => row.news_id as string));
      const progressIds = new Set((progressResult.data ?? []).map((row) => row.section_id as string));
      const freshCount = newsRows.filter((row) => {
        const videoId = videoIdFromSourceKey(row.source_key as string | null);
        return isNewsFresh(row.published_at as string, seenIds.has(row.id as string), Boolean(videoId && progressIds.has(videoId)));
      }).length;
      if (!cancelled) {
        setCount(freshCount);
        setCountForUserId(userId);
      }
    })().catch(() => { if (!cancelled) { setCount(null); setCountForUserId(null); } });
    return () => { cancelled = true; };
  }, [userId, pathname]);

  return userId && pathname !== "/nouveautes" && countForUserId === userId ? count : null;
}
