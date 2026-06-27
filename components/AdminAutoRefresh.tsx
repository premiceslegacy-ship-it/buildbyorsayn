"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function AdminAutoRefresh() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(15);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          router.refresh();
          return 15;
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
        setSeconds(15);
        router.refresh();
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/70"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Live refresh · {seconds}s
    </button>
  );
}
