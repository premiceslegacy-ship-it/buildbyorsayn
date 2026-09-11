"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCheckoutUrls } from "@/app/actions/getCheckoutUrls";

/** Shared client-side auth/tier fetch for the Fondations grid and its detail pages. */
export function useBeginnerAuth() {
  const router = useRouter();
  const [tier, setTier] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string>("#");
  const [displayEmail, setDisplayEmail] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setDisplayEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles").select("tier").eq("id", user.id).single();
      setTier(profile?.tier ?? null);
      const urls = await getCheckoutUrls();
      const base = urls.upgrade ?? "#";
      setUpgradeUrl(base !== "#" ? `${base}?client_reference_id=${user.id}` : base);
    };
    fetchUser();
  }, [router]);

  return { tier, upgradeUrl, displayEmail };
}
