"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function setUserTier(userId: string, tier: string | null) {
    const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
        .from("profiles")
        .update({ tier: tier })
        .eq("id", userId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin");
}
