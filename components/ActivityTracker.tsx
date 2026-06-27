"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type ActivityTrackerProps = {
  userEmail?: string | null;
};

function postActivity(eventType: string, path: string, metadata: Record<string, unknown> = {}) {
  const payload = JSON.stringify({
    eventType,
    path,
    metadata: {
      title: typeof document !== "undefined" ? document.title : "",
      visibilityState: typeof document !== "undefined" ? document.visibilityState : "visible",
      ...metadata,
    },
  });

  fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Tracking must never disturb the member experience.
  });
}

export function ActivityTracker({ userEmail }: ActivityTrackerProps) {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!userEmail || !pathname || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    postActivity("page_view", pathname);
  }, [pathname, userEmail]);

  useEffect(() => {
    if (!userEmail || !pathname) return;

    const heartbeat = () => postActivity("heartbeat", pathname);
    const onVisibilityChange = () => {
      postActivity(document.visibilityState === "visible" ? "tab_visible" : "tab_hidden", pathname);
    };

    heartbeat();
    const interval = window.setInterval(heartbeat, 30000);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname, userEmail]);

  return null;
}
