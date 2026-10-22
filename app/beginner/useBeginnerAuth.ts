"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizeProfileTier } from "@/lib/mcpAccess";

/** Shared client-side auth/tier fetch for the Fondations grid and its detail pages. */
export function useBeginnerAuth() {
  const router = useRouter();
  const [tier, setTier] = useState<string | null>(null);
  const [displayEmail, setDisplayEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setDisplayEmail(user.email ?? "");
      setIsAdmin(user.app_metadata?.role === "admin");
      const { data: profile } = await supabase
        .from("profiles").select("tier").eq("id", user.id).single();
      setTier(normalizeProfileTier(profile?.tier ?? null));
    };
    fetchUser();
  }, [router]);

  return { tier, displayEmail, isAdmin };
}
