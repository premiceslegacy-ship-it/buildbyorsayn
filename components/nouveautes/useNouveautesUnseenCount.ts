"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { readNouveautesSeenAt } from "@/lib/nouveautes/seen";

/**
 * Number of videos published since the member last opened /nouveautes. `null`
 * means "show nothing": signed out, on /nouveautes itself, or any lookup error.
 */
export function useNouveautesUnseenCount(): number | null {
  const pathname = usePathname();
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [countForUserId, setCountForUserId] = useState<string | null>(null);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!user || pathname === "/nouveautes") return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const seenAt = await readNouveautesSeenAt(supabase, user);
      const { count: unseen, error } = await supabase.from("youtube_videos")
        .select("video_id", { count: "exact", head: true }).gt("published_at", seenAt);
      if (error) throw error;
      if (!cancelled) {
        setCount(unseen ?? 0);
        setCountForUserId(user.id);
      }
    })().catch(() => { if (!cancelled) { setCount(null); setCountForUserId(null); } });
    return () => { cancelled = true; };
    // `user` is an object that changes identity on token refresh; the id is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, pathname]);

  return userId && pathname !== "/nouveautes" && countForUserId === userId ? count : null;
}
