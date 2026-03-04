"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type BetaCodeState = {
    error: string | null;
};

export async function redeemBetaCode(
    prevState: BetaCodeState,
    formData: FormData
): Promise<BetaCodeState> {
    const code = (formData.get("beta_code") as string)?.trim();

    if (!code || code !== process.env.BETA_ACCESS_CODE) {
        return { error: "Code invalide. Vérifie et réessaie." };
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Tu dois être connecté pour utiliser un pass bêta." };
    }

    // Client admin avec service role pour bypasser la RLS
    const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ has_paid: true })
        .eq("id", user.id);

    if (updateError) {
        return { error: "Une erreur est survenue. Réessaie dans un instant." };
    }

    redirect("/dashboard");
}
