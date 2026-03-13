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

    // Input validation: reject empty, too-long, or non-string inputs
    if (!code || typeof code !== "string" || code.length > 100) {
        return { error: "Code invalide. Vérifie et réessaie." };
    }

    // Constant-time comparison to prevent timing attacks
    const expectedCode = process.env.BETA_ACCESS_CODE ?? "";
    if (
        code.length !== expectedCode.length ||
        !timingSafeEqual(code, expectedCode)
    ) {
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

/**
 * Constant-time string comparison to prevent timing attacks.
 * Both strings must be the same length (check before calling).
 */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
