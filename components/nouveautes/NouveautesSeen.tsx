"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { isNewVideo, markNouveautesSeen, readNouveautesSeenAt } from "@/lib/nouveautes/seen";

/**
 * Reveals the "Nouveau" marker on cards published after the member's last
 * visit, then records this visit. Renders nothing; signed-out visitors are a no-op.
 */
export function NouveautesSeen() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const seenAt = await readNouveautesSeenAt(supabase, user);
      if (cancelled) return;
      document.querySelectorAll<HTMLElement>("[data-video-card]").forEach((card) => {
        const publishedAt = card.dataset.publishedAt;
        const marker = card.querySelector<HTMLElement>("[data-new-badge]");
        if (publishedAt && marker && isNewVideo(publishedAt, seenAt)) marker.hidden = false;
      });
      await markNouveautesSeen(supabase, user.id);
    })().catch((error) => console.error("nouveautes.seen.failed", error));
    return () => { cancelled = true; };
  }, []);

  return null;
}
