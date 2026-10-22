"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

const REFRESH_INTERVAL_SECONDS = 60;

export function AdminAutoRefresh() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(REFRESH_INTERVAL_SECONDS);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      setSeconds((current) => {
        if (current <= 1) {
          router.refresh();
          return REFRESH_INTERVAL_SECONDS;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [router]);

  return (
    <button
      type="button"
      onClick={() => {
        setSeconds(REFRESH_INTERVAL_SECONDS);
        router.refresh();
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/70"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Live refresh · {seconds}s
    </button>
  );
}
