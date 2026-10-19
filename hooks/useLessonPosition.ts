"use client";

import { useEffect, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { createPositionReporter } from "@/lib/lessons/positionReporter";

/**
 * Persists the viewer's position in a lesson (throttled) and fires
 * `onCompleted` once per mount when 90% of the video has been watched.
 */
export function useLessonPosition(sectionId: string, onCompleted: () => void) {
  const onCompletedRef = useRef(onCompleted);
  const userIdRef = useRef<string | null>(null);
  useEffect(() => { onCompletedRef.current = onCompleted; }, [onCompleted]);

  // A new reporter per lesson: throttle, completion and in-flight state never leak across sections.
  const report = useMemo(() => {
    return createPositionReporter({
      onCompleted: () => onCompletedRef.current(),
      save: async ({ positionSeconds, completed }) => {
        const supabase = createClient();
        if (!userIdRef.current) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          userIdRef.current = user.id;
        }
        const { error } = await supabase.from("lesson_progress").upsert(
          { user_id: userIdRef.current, section_id: sectionId, position_seconds: positionSeconds, completed, updated_at: new Date().toISOString() },
          { onConflict: "user_id,section_id" }
        );
        if (error) throw new Error(error.message);
      },
    });
  }, [sectionId]);

  return { report };
}
