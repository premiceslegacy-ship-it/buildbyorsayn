"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCommunityLink(): Promise<string | null> {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("has_paid")
        .eq("id", user.id)
        .single();

    if (!profile || profile.has_paid !== true) return null;

    return process.env.COMMUNITY_LINK ?? null;
}
