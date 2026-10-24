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
  useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);
  const notifyCompletion = useMemo(() => () => {
    onCompletedRef.current();
  }, []);
  const report = useMemo(() => {
    // The reporter stores this callback and only invokes it from `report`, never during render.
    // eslint-disable-next-line react-hooks/refs
    return createPositionReporter({
      onCompleted: notifyCompletion,
      save: async ({ positionSeconds, completed }) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { error } = await supabase.from("lesson_progress").upsert(
          { user_id: user.id, section_id: sectionId, position_seconds: positionSeconds, completed, updated_at: new Date().toISOString() },
          { onConflict: "user_id,section_id" }
        );
        if (error) throw new Error(error.message);
      },
    });
  }, [sectionId, notifyCompletion]);

  return { report };
}

